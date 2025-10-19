export const connectMetaMask = async (): Promise<{ address: string; error?: string }> => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install it to continue.');
      }
  
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Return the first account address
      return { address: accounts[0] };
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      return { address: '', error: error.message || 'Failed to connect to MetaMask' };
    }
  };
  
  export const getConnectedAccounts = async (): Promise<string[]> => {
    try {
      if (!window.ethereum) return [];
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts;
    } catch (error) {
      console.error('Error getting connected accounts:', error);
      return [];
    }
  };
  
  export const listenToAccountChanges = (callback: (accounts: string[]) => void): void => {
    if (!window.ethereum) return;
    
    window.ethereum.on('accountsChanged', callback);
  };
  
  export const listenToChainChanges = (callback: (chainId: string) => void): void => {
    if (!window.ethereum) return;
    
    window.ethereum.on('chainChanged', callback);
  };