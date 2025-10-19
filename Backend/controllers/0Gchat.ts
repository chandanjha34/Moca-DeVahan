// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import fetch from 'node-fetch';
// import { Broker } from '@0g/sdk'; // Replace with your actual 0G SDK import

// // Dummy blockchain fetch function
// async function getServiceHashes(tokenCounter: string): Promise<string[]> {
//   // Replace with your actual blockchain call
//   return ['hash1.json', 'hash2.json'];
// }

// // Fetch JSON from 0G Storage
// async function fetchServiceJSON(hash: string): Promise<any> {
//   const url = `https://your-0g-storage.com/${hash}`; // Replace with your 0G Storage endpoint
//   const res = await fetch(url);
//   return res.json();
// }

// // POST /vehicle-chat
// app.post('/vehicle-chat', async (req: Request, res: Response) => {
//   try {
//     const { tokenCounter, question } = req.body;

//     if (!tokenCounter || !question) {
//       return res.status(400).json({ error: 'tokenCounter and question are required' });
//     }

//     // Step 1: Get service hashes from blockchain
//     const hashes = await getServiceHashes(tokenCounter);

//     // Step 2: Fetch all JSONs from 0G Storage
//     const serviceRecords = await Promise.all(hashes.map(fetchServiceJSON));

//     // Step 3: Prepare messages for 0G Compute
//     const messages = [
//       {
//         role: 'system',
//         content: `
// You are a vehicle assistant.
// Below is the service history of this car (tokenCounter: ${tokenCounter}):

// ${JSON.stringify(serviceRecords, null, 2)}

// Answer the user's question based on this data.
//         `
//       },
//       {
//         role: 'user',
//         content: question
//       }
//     ];

//     // Step 4: Call 0G Compute
//     const broker = new Broker({ /* your wallet/private key config */ });
//     const providerAddress = '0xYourProviderAddress';
//     const model = 'gemini-1.5-flash';

//     const headers = await broker.inference.getRequestHeaders(providerAddress, JSON.stringify(messages));
//     const endpoint = 'https://node.0g.ai/inference/v1/chat/completions';

//     const response = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers
//       },
//       body: JSON.stringify({ model, messages })
//     });

//     const data = await response.json();
//     const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from 0G Compute';

//     res.json({ reply });

//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚗 Vehicle chat server running on http://localhost:${PORT}`);
// });
