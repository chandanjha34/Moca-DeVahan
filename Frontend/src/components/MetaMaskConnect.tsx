import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { connectMetaMask, getConnectedAccounts } from '../utils/metamask';
import { Wallet2, Check, AlertCircle } from 'lucide-react';

type MetaMaskConnectProps = {
  onConnect: (address: string) => void;
};

const MetaMaskConnect: React.FC<MetaMaskConnectProps> = ({ onConnect }) => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const { t } = useLanguage();

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      const accounts = await getConnectedAccounts();
      if (accounts.length > 0) {
        setConnectionStatus('connected');
        setConnectedAddress(accounts[0]);
        onConnect(accounts[0]);
      }
    };

    checkConnection();
  }, [onConnect]);

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    setErrorMessage('');

    const { address, error } = await connectMetaMask();

    if (error) {
      setConnectionStatus('error');
      setErrorMessage(error);
      return;
    }

    if (address) {
      setConnectionStatus('connected');
      setConnectedAddress(address);
      onConnect(address);
    } else {
      setConnectionStatus('error');
      setErrorMessage('Failed to connect to MetaMask');
    }
  };

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const renderButton = () => {
    switch (connectionStatus) {
      case 'connecting':
        return (
          <button
            disabled
            className="w-full py-3 rounded-lg bg-gradient-to-r from-gold/50 to-gold-light/50 text-primary font-bold flex items-center justify-center"
          >
            <div className="mr-2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {t('auth.connectingWallet')}
          </button>
        );
      case 'connected':
        return (
          <button
            disabled
            className="w-full py-3 rounded-lg bg-gradient-to-r from-neon-green to-neon-blue text-primary font-bold flex items-center justify-center"
          >
            <Check className="w-4 h-4 mr-2" />
            {formatAddress(connectedAddress)}
          </button>
        );
      case 'error':
        return (
          <>
            <button
              onClick={handleConnect}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-warning to-warning-orange text-white font-bold flex items-center justify-center"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              {t('auth.walletError')}
            </button>
            {errorMessage && <p className="text-xs text-warning mt-1">{errorMessage}</p>}
          </>
        );
      default:
        return (
          <button
            onClick={handleConnect}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light text-primary font-bold hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <Wallet2 className="w-4 h-4 mr-2" />
            {t('auth.connectWallet')}
          </button>
        );
    }
  };

  return <div className="w-full">{renderButton()}</div>;
};

export default MetaMaskConnect;