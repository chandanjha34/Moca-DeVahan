// import express from 'express';
// import multer from 'multer';
// import { ZgFile, Indexer } from '@0glabs/0g-ts-sdk';
// import dotenv from 'dotenv';
// import { promises as fs } from 'fs'; // Import the file system module
// import path from 'path';
// import { ethers } from 'ethers';

// dotenv.config();

// const app = express();
// const upload = multer({ dest: 'uploads/' });
// const RPC_URL = process.env.RPC_URL || 'https://evmrpc-testnet.0g.ai/';
// const INDEXER_RPC = process.env.INDEXER_RPC || 'https://indexer-storage-testnet-standard.0g.ai';
// const PRIVATE_KEY = process.env.PRIVATE_KEY;

// if (!PRIVATE_KEY) {
//   throw new Error('Private key not found in environment variables');
// }

// const provider = new ethers.JsonRpcProvider(RPC_URL);
// const signer = new ethers.Wallet(PRIVATE_KEY, provider);
// const indexer = new Indexer(INDEXER_RPC);

// app.use(express.json());

// app.post('/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
//   const tempMetadataPath = path.join('uploads', `metadata-${Date.now()}.json`);

//   try {
//     // --- Step 1: Handle the original file upload (the image) ---
//     // This part is correct and remains the same
//     const imageFile = await ZgFile.fromFilePath(req.file.path);
//     const [imageTx, imageUploadErr] = await indexer.upload(imageFile, RPC_URL, signer);

//     if (imageUploadErr !== null) {
//       throw new Error(`Image upload error: ${imageUploadErr}`);
//     }
    
//     const [tree, treeErr] = await imageFile.merkleTree();
//     if (treeErr !== null) {
//       throw new Error(`Error generating Merkle tree for image: ${treeErr}`);
//     }
//     const imageRootHash = tree?.rootHash() ?? '';
//     await imageFile.close();

//     // --- Step 2: Create and upload a metadata JSON file ---
//     const { vin, make, model, year } = req.body;
//     const metadata = {
//       vin,
//       make,
//       model,
//       year: Number(year),
//       image: imageRootHash,
//     };
//     const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));

//     // --- FIX: Write buffer to a temporary file ---
//     await fs.writeFile(tempMetadataPath, metadataBuffer);

//     // --- FIX: Create ZgFile from the new file's path ---
//     const metadataZgFile = await ZgFile.fromFilePath(tempMetadataPath);

//     // Upload the metadata file
//     const [metadataTx, metadataUploadErr] = await indexer.upload(metadataZgFile, RPC_URL, signer);
//     if (metadataUploadErr !== null) {
//       throw new Error(`Metadata upload error: ${metadataUploadErr}`);
//     }

//     const [metadataTree, metadataTreeErr] = await metadataZgFile.merkleTree();
//     if (metadataTreeErr !== null) {
//         throw new Error(`Error generating Merkle tree for metadata: ${metadataTreeErr}`);
//     }
//     const metadataRootHash = metadataTree?.rootHash() ?? '';
//     await metadataZgFile.close();

//     // --- Step 3: Return the relevant hashes to the client ---
//     res.json({
//       message: "Image and metadata uploaded successfully",
//       imageRootHash: imageRootHash,
//       metadataRootHash: metadataRootHash,
//       imageTransactionHash: imageTx,
//       metadataTransactionHash: metadataTx
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
//   } finally {
//     // --- BEST PRACTICE: Clean up the temporary files ---
//     try {
//       if (req.file) await fs.unlink(req.file.path); // Delete the original uploaded image
//       await fs.unlink(tempMetadataPath); // Delete the temporary metadata file
//     } catch (cleanupError) {
//       // Log cleanup errors but don't send them to the client
//       console.error('Error during file cleanup:', cleanupError);
//     }
//   }
// });

// app.get('/download/:rootHash', async (req, res) => {
//   const { rootHash } = req.params;
//   const outputPath = `downloads/${rootHash}`;

//   try {
//     const err = await indexer.download(rootHash, outputPath, true);
    
//     if (err !== null) {
//       throw new Error(`Download error: ${err}`);
//     }

//     res.download(outputPath, (err) => {
//       if (err) {
//         console.error('Download error:', err);
//         res.status(500).json({ error: 'Failed to send file' });
//       }
//     });
//   } catch (error) {
//     console.error('Download error:', error);
//     res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
// });