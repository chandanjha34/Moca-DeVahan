import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import Web3Modal from 'web3modal';
import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers';
import ABI from './DeVahanABI.json'; // ABI for the simple ERC721 contract
import { Contract_Address } from './contractAddress';
// Replace with your deployed address per environment
const CONTRACT_ADDRESS = Contract_Address;

interface NFTContextType {
  currentAccount: string;
  connectWallet: () => Promise<string>;
  mint: (to: string, tokenURI_: string,metadatahash:string) => Promise<string>;
  addServiceRecord: (tokenId: bigint, json: string) => Promise<string>;
  tokenURI: (tokenId: bigint) => Promise<string>;
  getServiceRecordCount: (tokenId: bigint) => Promise<bigint>;
  getServiceRecordAt: (tokenId: bigint, index: bigint) => Promise<string>;
}

export const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const NFTProvider = ({ children }: { children: ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Init Web3Modal and check wallet on mount
  useEffect(() => {
    const modal = new Web3Modal({ cacheProvider: true, providerOptions: {} });
    setWeb3Modal(modal);
    void checkIfWalletConnected();
  }, []);

  // Helper: build contract from signer
  const buildContract = (s: JsonRpcSigner) => new Contract(CONTRACT_ADDRESS, ABI.abi ?? ABI, s);

  const connectWallet = async (): Promise<string> => {
    if (!web3Modal) throw new Error('Web3Modal not initialized');
    const instance = await web3Modal.connect();

    // Ethers v6 BrowserProvider works with an injected provider instance
    const p = new BrowserProvider(instance);
    const s = await p.getSigner();
    const address = await s.getAddress();

    setProvider(p);
    setSigner(s);
    setCurrentAccount(address);
    setContract(buildContract(s));

    // Subscribe to account and chain changes from the injected provider
    // With ethers v6, rely on window.ethereum or the modal's returned provider for events
    if (typeof instance.on === 'function') {
      instance.on('accountsChanged', (accounts: string[]) => {
        setCurrentAccount(accounts?.[0] ?? '');
      });
      instance.on('chainChanged', () => {
        // Force a refresh of provider/signer/contract on network change
        // Many apps simply reload:
        // window.location.reload();
        // Or reinitialize:
        void reinitializeFrom(instance);
      });
      instance.on('disconnect', () => {
        setCurrentAccount('');
        setProvider(null);
        setSigner(null);
        setContract(null);
      });
    }

    return address;
  };

  const reinitializeFrom = async (injected: any) => {
    const p = new BrowserProvider(injected);
    const s = await p.getSigner();
    const address = await s.getAddress();
    setProvider(p);
    setSigner(s);
    setCurrentAccount(address);
    setContract(buildContract(s));
  };

  const checkIfWalletConnected = async (): Promise<boolean> => {
    // Use window.ethereum directly to query accounts without prompting
    // Then hydrate ethers provider if accounts exist
    // In ethers v6, account access can be probed via eth_accounts
    // Be sure a wallet is present
    const eth = (globalThis as any).ethereum;
    if (!eth) return false;

    const p = new BrowserProvider(eth);
    const accounts: string[] = await p.send('eth_accounts', []);
    if (accounts.length > 0) {
      const s = await p.getSigner();
      setProvider(p);
      setSigner(s);
      setCurrentAccount(accounts[0]);
      setContract(buildContract(s));
      // Subscribe to changes
      if (typeof eth.on === 'function') {
        eth.on('accountsChanged', (accs: string[]) => setCurrentAccount(accs?.[0] ?? ''));
        eth.on('chainChanged', () => void reinitializeFrom(eth));
        eth.on('disconnect', () => {
          setCurrentAccount('');
          setProvider(null);
          setSigner(null);
          setContract(null);
        });
      }
      return true;
    }
    return false;
  };

  // Contract actions
  const mint = async (to: string, tokenURI_: string, metadatahash:string): Promise<string> => {
    if (!contract) throw new Error('Wallet not connected');
    const tx = await contract.mint(to, tokenURI_,metadatahash);
    const receipt = await tx.wait();
    return receipt.hash;
  };

  const addServiceRecord = async (tokenId: bigint, json: string): Promise<string> => {
    if (!contract) throw new Error('Wallet not connected');
    const tx = await contract.addServiceRecord(tokenId, json);
    const receipt = await tx.wait();
    return receipt.hash;
  };

  const tokenURI = async (tokenId: bigint): Promise<string> => {
    if (!contract && provider) {
      const readOnly = new Contract(CONTRACT_ADDRESS, ABI.abi ?? ABI, provider);
      return readOnly.tokenURI(tokenId);
    }
    if (!contract) throw new Error('Contract not initialized');
    return contract.tokenURI(tokenId);
  };

  const getServiceRecordCount = async (tokenId: bigint): Promise<bigint> => {
    if (!contract && provider) {
      const readOnly = new Contract(CONTRACT_ADDRESS, ABI.abi ?? ABI, provider);
      return readOnly.getServiceRecordCount(tokenId);
    }
    if (!contract) throw new Error('Contract not initialized');
    return contract.getServiceRecordCount(tokenId);
  };

  const getServiceRecordAt = async (tokenId: bigint, index: bigint): Promise<string> => {
    if (!contract && provider) {
      const readOnly = new Contract(CONTRACT_ADDRESS, ABI.abi ?? ABI, provider);
      return readOnly.getServiceRecordAt(tokenId, index);
    }
    if (!contract) throw new Error('Contract not initialized');
    return contract.getServiceRecordAt(tokenId, index);
  };

  return (
    <NFTContext.Provider
      value={{
        currentAccount,
        connectWallet,
        mint,
        addServiceRecord,
        tokenURI,
        getServiceRecordCount,
        getServiceRecordAt,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (!context) throw new Error('useNFT must be used within an NFTProvider');
  return context;
};
