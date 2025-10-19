
DeVahan is a decentralized platform that revolutionizes the automobile industry by bringing **every vehicle, its owner, and its complete service & maintenance history on-chain**. It leverages **0G Chain, Storage, Compute, and Data Availability** to ensure **transparency, trust, and true ownership**.

With DeVahan, users can interact with vehicles via **AI-powered agents**, explore service histories, verify ownership, and safely buy or sell vehicles on a trusted marketplace.

---

## **Features**

* **Vehicle AI Agent:** Personalized AI agent for each vehicle to answer questions about its history in real-time.
* **Dynamic NFTs:** Vehicles are represented as dynamic NFTs that record **ownership, service, repairs, mileage, and history**.
* **On-Chain Intelligence:** Trust Scores, predictive maintenance alerts, and real-time insights.
* **Upgradable Logic:** NFT “brains” can be upgraded without reminting.
* **Verifiable Ledger:** Service records, diagnostics, and ownership trails stored securely on 0G Storage.
* **Role-Based Access:** Dealers can mint, service centers can update, and owners can view their vehicles.
* **Trusted Marketplace:** Secure vehicle transfers and payments on-chain.
* **User-Friendly Interface:** Web2-like interface with chatbot guidance.

---

## **Live Links**

* **Contract Address:** `0xE97D24337d5c6d7Cb9385Fe35da07799E94F4fE8`
* **Live Demo:** [og-de-vahan.vercel.app](https://og-de-vahan.vercel.app/)

---

## **Getting Started**

Follow these steps to **clone and run DeVahan locally**:

### **Prerequisites**

* Node.js >= 18.x
* npm or yarn
* 0G network integration in wallet
* Git
* Metamask or other Web3 wallet

* 0G network details
Name: Galileo (Testnet)
Chain ID: 16602
Token: 0G
RPC URL: https://evmrpc-testnet.0g.ai
Explorer: https://chainscan-galileo.0g.ai/
Faucet: https://faucet.0g.ai

set this in your metamask

### **Clone the Repository**

```bash
git clone https://github.com/chandanjha34/OG-DeVahan.git
cd OG-DeVahan
```

### **Install Dependencies**

```bash
cd Frontend
npm install

cd Backend
npm install
# or
yarn install
```

### **Configure Environment Variables**

Create a `.env` file in the root folder and add:
```
PORT=3000
MONGO_URI= your_mongoDB_URI
JWT_SECRET = 1214wseda;
EVM_RPC_URL = https://evmrpc-testnet.0g.ai/
INDEXER_RPC_URL = https://indexer-storage-testnet-turbo.0g.ai
PRIVATE_KEY = your_private_key
```

### **Run the App**

```bash
cd Frontend
npm run dev
# or
yarn dev
```

Open [https://og-devahan-1.onrender.com](https://og-devahan-1.onrender.com) in your browser to access the platform.

---

## **Contributing**

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

---

## **License**

MIT License

---

