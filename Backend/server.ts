// backend/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import Customer from "./models/Customer";
import authRoutes from "./routes/authRoutes";
import addServicesRoutes from "./routes/addServicesRoutes";
import connectDB from "./config/db";

import { uploadFileBuffer, uploadJSON, fetchJSON } from "./utils/zeroGStorage";

import { ethers } from "ethers";
import { createZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.json());

// ---------------------- Bootstrap (no AirService usage) ----------------------
async function bootstrap() {
  // --------------------------- Auth placeholders ---------------------------
  // Partner JWT is not generated here anymore; return 501 for now
  app.post("/auth/partner-jwt", async (_req, res) => {
    return res.status(501).json({ message: "Partner JWT is not generated on this server." });
  });

  // Signup: create user in DB (TODO) and queue issuance elsewhere (frontend or worker)
  app.post("/auth/:role/signup", async (req, res) => {
    try {
      const { role } = req.params as { role: "user" | "dealer" | "service" };
      const { email } = req.body;

      const customer = new Customer({ email, role });
      await customer.save();

      // TODO: create user in DB and trigger issuance via a worker or external service
      // For now, just echo success
      res.json({
        message: "Signup successful. Credential issuance is handled by the client or a separate service.",
        email,
        role,
        token: "signup-stub-token",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Signup failed" });
    }
  });

  // Login: verify from DB (TODO). Role comes from DB; fallback to 'user'
  app.post("/auth/:role/login", async (req, res) => {
    try {
      console.log("Login request body:", req.body);
      const { email } = req.body as { email: string; password: string };
      // TODO: verify from DB
      const user = { uuid: "demo-uuid", name: "Demo User", email };
      const resolvedRole = "dealer"; // TODO: lookup from DB

      res.json({
        name: user.name,
        email: user.email,
        role: resolvedRole,
        token: "session-stub-token",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Role resolution endpoint now DB-based (no AIR listing)
  app.get("/auth/credentials/:email", async (req, res) => {
    try {
      console.log("Credentials request params:", req.params);
      const { email } = req.params;
      const customer = await Customer.findOne({ email });
      if (!customer) {
        return res.status(404).json({ message: "User not found" });
      }
      const role = customer.role;
      res.json({ role, email });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  });

  // --------------------------- 0G Compute ---------------------------
  const RPC_URL =
    process.env.NODE_ENV === "production"
      ? "https://evmrpc.0g.ai"
      : "https://evmrpc-testnet.0g.ai";

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  let broker: any;

  (async () => {
    broker = await createZGComputeNetworkBroker(wallet);
    console.log("✅ 0G Compute Broker initialized");

    try {
      const account = await broker.ledger.getLedger();
      console.log(
        `💰 Existing account balance: ${ethers.formatEther(
          account.totalBalance
        )} OG`
      );
    } catch {
      console.log("⚙️ No account found. Creating and funding one...");
      await broker.ledger.addLedger(3);
      console.log("✅ Account created & funded with 10 OG tokens");
    }
  })();

  app.post("/api/ask0GCompute", async (req, res) => {
    try {
      const { tokenID, query, serviceRecord } = req.body;
      if (!tokenID || !query || !serviceRecord) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      const services = await broker.inference.listService();
      const selectedService =
        services.find((s: any) => s.model === "deepseek-r1-70b") ||
        services[0];
      if (!selectedService) throw new Error("No available 0G Compute services.");

      const providerAddress = selectedService.provider;
      await broker.inference.acknowledgeProviderSigner(providerAddress);

      const { endpoint, model } =
        await broker.inference.getServiceMetadata(providerAddress);

      const messages = [
        {
          role: "system",
          content:
            "You are a helpful car service assistant. Use the given vehicle service record to answer queries and provide recommendations. And give answers always in less than 4 lines",
        },
        {
          role: "user",
          content: `Vehicle TokenID: ${tokenID}\n\nService Record:\n${serviceRecord}\n\nQuestion: ${query}`,
        },
      ];

      const headers = await broker.inference.getRequestHeaders(
        providerAddress,
        JSON.stringify(messages)
      );

      const response = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ messages, model }),
      });

      const data = await response.json();
      const answer =
        data?.choices?.[0]?.message?.content || "⚠️ No valid response.";
      const chatID = data?.id;

      const isValid = await broker.inference.processResponse(
        providerAddress,
        answer,
        chatID
      );

      return res.json({
        reply: answer,
        verified: isValid,
        provider: providerAddress,
        model,
      });
    } catch (error: any) {
      console.error("❌ 0G Compute error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // --------------------------- Other routes ---------------------------
  app.use("/auth", authRoutes);
  app.use("/addService", addServicesRoutes);

  // 0G Storage
  app.post("/api/uploadFile", async (req, res) => {
    try {
      if (!req.files || !req.files.file) {
        return res
          .status(400)
          .json({ success: false, error: "No file uploaded" });
      }
      const file = req.files.file as any;
      if (!file.data || !file.name) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid file object" });
      }
      const result = await uploadFileBuffer(file.data, file.name);
      return res.json({
        success: true,
        rootHash: result.rootHash,
        txHash: result.txHash,
      });
    } catch (error: any) {
      console.error("UploadFile error:", error);
      return res
        .status(500)
        .json({ success: false, error: error.message });
    }
  });

  app.post("/api/uploadJSON", async (req, res) => {
    try {
      const jsonData = req.body;
      if (!jsonData || Object.keys(jsonData).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "No JSON data provided" });
      }
      const result = await uploadJSON(jsonData);
      return res.json({
        success: true,
        rootHash: result.rootHash,
        txHash: result.txHash,
      });
    } catch (error: any) {
      console.error("UploadJSON error:", error);
      return res
        .status(500)
        .json({ success: false, error: error.message });
    }
  });

  app.get("/api/fetchJSON/:rootHash", async (req, res) => {
    try {
      const { rootHash } = req.params;
      if (!rootHash)
        return res
          .status(400)
          .json({ success: false, error: "rootHash is required" });
      const data = await fetchJSON(rootHash);
      return res.json({ success: true, data });
    } catch (error: any) {
      console.error("FetchJSON error:", error);
      return res
        .status(500)
        .json({ success: false, error: error.message });
    }
  });

  app.post("/api/IPFS", async (req, res) => {
    try {
      const { name, description, image } = req.body;
      if (!name || !description || !image) {
        return res.json({
          success: false,
          error: "Missing required metadata fields.",
        });
      }
      const pinataJwt = process.env.PINATA_JWT;
      if (!pinataJwt) {
        return res.json({
          success: false,
          error: "Server configuration error.",
        });
      }
      const metadata = { name, description, image };
      const pinataResponse = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${pinataJwt}`,
          },
          body: JSON.stringify(metadata),
        }
      );
      if (!pinataResponse.ok) {
        throw new Error(`Pinata upload failed: ${pinataResponse.statusText}`);
      }
      const data = await pinataResponse.json();
      const ipfsHash = data.IpfsHash;
      const tokenUri = `ipfs://${ipfsHash}`;
      return res.json({ success: true, tokenUri });
    } catch (error: any) {
      return res.json({ error: error.message || "Unknown error" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap().catch((e) => {
  console.error("Fatal bootstrap error:", e);
  process.exit(1);
});
