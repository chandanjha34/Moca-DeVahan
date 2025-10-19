// // src/utils/zeroGStorage.ts
// import { Indexer, ZgFile } from "@0glabs/0g-ts-sdk";
// import { ethers } from "ethers";

// function initClients() {
//   const RPC_URL = process.env.EVM_RPC_URL || "https://evmrpc-testnet.0g.ai/";
//   const INDEXER_RPC = process.env.INDEXER_RPC || "https://indexer-storage-testnet-turbo.0g.ai";
//   const privateKey = process.env.ZEROG_PRIVATE_KEY;

//   if (!privateKey) throw new Error("Missing env var: ZEROG_PRIVATE_KEY");

//   const provider = new ethers.JsonRpcProvider(RPC_URL);
//   const signer: any = new ethers.Wallet(privateKey, provider);
//   const indexer = new Indexer(INDEXER_RPC);

//   return { RPC_URL, signer, indexer };
// }

// interface UploadResult {
//   rootHash: string | null;
//   txHash: string | null;
// }

// /**
//  * Upload JSON data to 0G Storage
//  */
// export async function uploadJSON(jsonData: any, fileName?: string): Promise<UploadResult> {
//   const { RPC_URL, signer, indexer } = initClients();

//   // Optional filename
//   const name = fileName || `data-${Date.now()}.json`;

//   // Convert JSON to string and create ZgFile from buffer
//   const buffer = Buffer.from(JSON.stringify(jsonData, null, 2), "utf8");
//   const file = await ZgFile.fromBuffer(buffer, name);

//   try {
//     const [tree, treeErr] = await file.merkleTree();
//     if (treeErr || !tree) throw new Error(`Merkle tree error: ${treeErr}`);

//     const [txHash, uploadErr] = await indexer.upload(file, RPC_URL, signer);
//     if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);
//     if (!txHash) throw new Error("Upload returned null txHash");

//     return { rootHash: tree.rootHash(), txHash };
//   } finally {
//     await file.close();
//   }
// }

// /**
//  * Upload a file buffer directly
//  */
// export async function uploadFileBuffer(fileBuffer: Buffer, fileName: string): Promise<UploadResult> {
//   const { RPC_URL, signer, indexer } = initClients();
//   const file = await ZgFile.fromBuffer(fileBuffer, fileName);

//   try {
//     const [tree, treeErr] = await file.merkleTree();
//     if (treeErr || !tree) throw new Error(`Merkle tree error: ${treeErr}`);

//     const [txHash, uploadErr] = await indexer.upload(file, RPC_URL, signer);
//     if (uploadErr) throw new Error(`Upload error: ${uploadErr}`);
//     if (!txHash) throw new Error("Upload returned null txHash");

//     return { rootHash: tree.rootHash(), txHash };
//   } finally {
//     await file.close();
//   }
// }

// /**
//  * Fetch file from 0G Storage as Buffer
//  */
// export async function downloadFileBuffer(rootHash: string, withProof = true): Promise<Buffer> {
//   const { indexer } = initClients();
//   const [buffer, err] = await indexer.downloadBuffer(rootHash, withProof); // SDK method to get buffer
//   if (err) throw new Error(`Download failed: ${err}`);
//   if (!buffer) throw new Error("Download returned null");
//   return buffer;
// }

// /**
//  * Fetch JSON from 0G Storage
//  */
// export async function fetchJSON(rootHash: string): Promise<any> {
//   const buffer = await downloadFileBuffer(rootHash);
//   try {
//     return JSON.parse(buffer.toString("utf8"));
//   } catch {
//     return buffer;
//   }
// }
