// backend/utils/zeroGStorage.ts
import { ZgFile, Indexer } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// Initialize 0G clients
function initClients() {
  const RPC_URL = process.env.EVM_RPC_URL || "https://evmrpc-testnet.0g.ai/";
  const INDEXER_RPC =
    process.env.INDEXER_RPC || "https://indexer-storage-testnet-turbo.0g.ai";
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
    console.log(PRIVATE_KEY);
  if (!PRIVATE_KEY) throw new Error("Missing env var: PRIVATE_KEY");

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const indexer = new Indexer(INDEXER_RPC);

  return { RPC_URL, signer, indexer };
}

interface UploadResult {
  rootHash: string;
  txHash: string;
}

/**
 * Handles SDK upload response — flexible for both tuple and object returns.
 */
function parseUploadResponse(result: any): string {
  if (!result) throw new Error("Upload returned no result");

  if (Array.isArray(result)) {
    // Tuple: [txHash, error]
    const [txHash, err] = result;
    if (err) throw new Error(`Upload error: ${err}`);
    return txHash;
  }

  if (typeof result === "object" && "txHash" in result) {
    // Object: { txHash, rootHash }
    return result.txHash;
  }

  if (typeof result === "string") return result; // sometimes returns just the hash

  throw new Error("Unexpected upload result format");
}

/**
 * Upload JSON to 0G Storage
 */
export async function uploadJSON(
  jsonData: any,
  fileName?: string
): Promise<UploadResult> {
  const { RPC_URL, signer, indexer } = initClients();

  const name = fileName || `data-${Date.now()}.json`;
  const tmpDir = path.join(process.cwd(), "tmp0g");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const tmpPath = path.join(tmpDir, name);
  fs.writeFileSync(tmpPath, JSON.stringify(jsonData, null, 2), "utf8");

  const file = await ZgFile.fromFilePath(tmpPath);

  try {
    const [tree, treeErr] = await file.merkleTree();
    if (treeErr || !tree)
      throw new Error(`Merkle tree error: ${treeErr || "Unknown"}`);

    const uploadResult = await indexer.upload(file, RPC_URL, signer);
    const txHash = parseUploadResponse(uploadResult);

    return { rootHash: tree.rootHash()!, txHash };
  } finally {
    await file.close();
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
}

/**
 * Upload any file buffer to 0G Storage
 */
export async function uploadFileBuffer(
  fileBuffer: Buffer,
  fileName: string
): Promise<UploadResult> {
  const tmpDir = path.join(process.cwd(), "tmp0g");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const tmpPath = path.join(tmpDir, fileName);
  fs.writeFileSync(tmpPath, fileBuffer);

  const { RPC_URL, signer, indexer } = initClients();
  const file = await ZgFile.fromFilePath(tmpPath);

  try {
    const [tree, treeErr] = await file.merkleTree();
    if (treeErr || !tree)
      throw new Error(`Merkle tree error: ${treeErr || "Unknown"}`);

    const uploadResult = await indexer.upload(file, RPC_URL, signer);
    const txHash = parseUploadResponse(uploadResult);

    return { rootHash: tree.rootHash()!, txHash };
  } finally {
    await file.close();
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
}

/**
 * Download file as Buffer from 0G Storage
 */
export async function downloadFileBuffer(
  rootHash: string,
  withProof = true
): Promise<Buffer> {
  const { indexer } = initClients();
  const tmpPath = path.join(process.cwd(), `tmp_download_${Date.now()}.bin`);

  const err = await indexer.download(rootHash, tmpPath, withProof);
  if (err) throw new Error(`Download failed: ${err}`);

  const buffer = fs.readFileSync(tmpPath);
  fs.unlinkSync(tmpPath);

  return buffer;
}

/**
 * Fetch JSON from 0G Storage
 */
export async function fetchJSON(rootHash: string): Promise<any> {
  const buffer = await downloadFileBuffer(rootHash);
  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch {
    return buffer;
  }
}
