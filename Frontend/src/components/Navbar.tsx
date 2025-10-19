import React from 'react';
import { Car, Plus, Train as Transfer, History, Settings, Zap, Wallet2, Shield, User, Building2, Wrench } from 'lucide-react';
import NavLink from './Navlink';
import { useLanguage } from '../context/LanguageContext';
import type { RootState } from '../Redux/store'
import { useSelector } from 'react-redux';

interface NavbarProps {
  isAuthenticated: boolean;
  currentUser: { name: string; type: 'user' | 'dealer' | 'service'} | null;
  onSignOut: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMintModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTransferModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowResaleEstimator: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({
  isAuthenticated,
  currentUser,
  onSignOut,
  setCurrentPage,
  setShowAuthModal,
  setShowMintModal,
  setShowTransferModal,
  setShowResaleEstimator
}: NavbarProps) {
  const { t } = useLanguage();
  const user = useSelector((state: RootState) => state.user.value)
  return (
    <nav className="cyber-nav backdrop-blur-xl border-b border-cyber-accent/20 relative z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-1">
        <div className="flex items-center justify-between h-16 relative-0">
          <div className="flex items-center cursor-pointer group ml-8 " onClick={() => setCurrentPage('home')}>
            <img
              src="/assets/logo.png" // Assuming the logo import handled in App or passed down
              alt="DeVahan Logo"
              className="w-36 h-auto cursor-pointer"
              onClick={() => setCurrentPage('home')}
            />
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-6 mr-10">
              {isAuthenticated && currentUser?.type === 'user' && (
                <div onClick={() => setCurrentPage('vehicles')} className="cursor-pointer">
                  <NavLink icon={<Car />} text={t('nav.myVehicles')} />
                </div>
              )}
              {isAuthenticated && currentUser?.type === 'dealer' && (
                <div onClick={() => setShowMintModal(true)} className="cursor-pointer">
                  <NavLink icon={<Plus />} text={t('nav.mintNFT')} />
                </div>
              )}
              {isAuthenticated && currentUser?.type === 'user' && (
                <div onClick={() => setShowTransferModal(true)} className="cursor-pointer">
                  <NavLink icon={<Transfer />} text={t('nav.transfer')} />
                </div>
              )}
              {isAuthenticated && currentUser?.type === 'service' && (
                <div onClick={() => setCurrentPage('add-service')} className="cursor-pointer">
                  <NavLink icon={<Wrench />} text="Add Service" />
                </div>
              )}

              {isAuthenticated && currentUser?.type === 'user' && (
                <div onClick={() => setCurrentPage('service-records')} className="cursor-pointer">
                  <NavLink icon={<Settings />} text="Service Records" />
                </div>
              )}
              <NavLink icon={<History />} text={t('nav.history')} />
              {isAuthenticated && currentUser?.type === 'user' && (
                <div onClick={() => setShowResaleEstimator(true)} className="cursor-pointer">
                  <NavLink
                    icon={<Wallet2 className="animate-pulse" />}
                    text="Resale Estimator"
                  />
                </div>
              )}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="cyber-user-info">
                    <span className="text-cyber-accent font-medium">
                      {user}
                    </span>
                    <span className="text-cyber-muted ml-2">
                      ({currentUser?.type})
                    </span>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="cyber-btn-danger"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {t('nav.signOut')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="cyber-btn-primary"
                >
                  <Wallet2 className="w-4 h-4 mr-2" />
                  {t('nav.signIn')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
