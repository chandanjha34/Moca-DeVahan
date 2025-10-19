// src/components/AuthenticationModal.tsx
import React, { useState, useEffect, useContext } from 'react';
import { X, Shield, User, Building2, Wrench } from 'lucide-react';
import { NFTContext } from '../contracts/DeVahanContext';
import { useDispatch, useSelector } from 'react-redux';
import { assignAddress } from '../Redux/features/wallet';
import { assignEmail } from '../Redux/features/emails';
import { assignUser } from '../Redux/features/users';
import { loginSuccess } from '../Redux/features/auth';
import { RootState, AppDispatch } from '../Redux/store';
import { metamaskConnect } from '../contracts/walletConnect';
import { initAir, loginAir, AirUserDetails } from '../services/airkitService';

type Role = 'user' | 'dealer' | 'service';

interface AuthenticationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthenticationModal: React.FC<AuthenticationModalProps> = ({ isOpen, onClose }) => {
  const [role, setRole] = useState<Role>('user');
  const [isSignIn, setIsSignIn] = useState(true);
  const [airReady, setAirReady] = useState(false);
  const [airSession, setAirSession] = useState<{ user: AirUserDetails; token: string } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const walletAddress = useSelector((state: RootState) => state.wallet.value);
  const nftcontext = useContext(NFTContext);
  if (!nftcontext) return <p>Error loading NFT context.</p>;

  useEffect(() => {
    (async () => {
      try {
        await initAir();
        setAirReady(true);
      } catch (err) {
        console.error('AIRKit init failed', err);
      }
    })();
  }, []);

  const connectWallet = async () => {
    try {
      const wallet = await metamaskConnect();
      if (wallet) dispatch(assignAddress(wallet));
    } catch (err) {
      console.error('Wallet connect failed', err);
    }
  };

  const resolveRoleServer = async (userEmail: string): Promise<Role> => {
    try {
      console.log('Resolving role for email:', userEmail);
      const res = await fetch(`https://moca-devahan.onrender.com/auth/credentials/${userEmail}`);
      if (!res.ok) throw new Error('Failed to fetch user role');
      const data = await res.json();
      return (data.role as Role) || 'dealer';
    } catch {
      return 'dealer';
    }
  };

  const handleAirLogin = async () => {
    if (!airReady) return alert('AIRKit not initialized');
    try {
      console.log('Starting AIRKit login...');
      const { user, token } = await loginAir();
      console.log('AIRKit login success', user, token);
      // safely handle unknown user shape from AIRKit
      const anyUser = user as any;
      const uuid = (anyUser?.user?.id) || anyUser?.sub || anyUser?.id || '';
      if (!uuid) return alert('Failed to login with AIRKit');

      const resolvedRole = await resolveRoleServer(anyUser.user.email);

      setAirSession({ user, token });
      dispatch(assignEmail(anyUser?.email || ''));
      dispatch(assignUser(anyUser?.name || ''));
      dispatch(loginSuccess({
        name: anyUser?.name || '',
        email: anyUser?.email || '',
        role: resolvedRole,
        token, // string
      }));

      alert(`Welcome ${user.name || 'User'}! Logged in as ${resolvedRole}`);
      onClose();
    } catch (err) {
      console.error('AIRKit login error', err);
      alert('AIRKit login failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: Record<string, any> = {
      email: formData.get('email'),
      password: formData.get('password'),
      wallet: walletAddress || '',
    };

    if (!isSignIn) {
      payload.name = formData.get('name');
      if (role === 'dealer') payload.Dealer_ID = formData.get('Dealer_ID');
      if (role === 'service') payload.Service_ID = formData.get('Service_ID');
    }

    try {
      const baseUrl = 'https://moca-devahan.onrender.com/auth';
      const endpoint = `${baseUrl}/${role === 'user' ? 'customer' : role}/signup`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      console.log('Submitting to', endpoint, 'with payload', payload);
      const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(payload) });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        dispatch(assignEmail(data.email || ''));
        dispatch(assignUser(data.name || ''));
        alert('move to signed-in state');
        onClose();
      } else {
        alert(data.message || 'Failed');
      }
    } catch (err) {
      console.error('Form submit error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-yellow-300 p-8 rounded-2xl shadow-lg w-full max-w-md relative border border-yellow-400">
        <button onClick={onClose} className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-200">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Authentication Portal</h2>

        {!isSignIn && (
          <div className="flex justify-center space-x-4 mb-6">
            <button onClick={() => setRole('user')} className={`px-4 py-2 rounded-lg font-semibold ${role==='user'?'bg-yellow-400 text-gray-900':'bg-gray-800 text-yellow-400 border border-yellow-500'}`}><User className="w-4 h-4 mr-1 inline"/> User</button>
            <button onClick={() => setRole('dealer')} className={`px-4 py-2 rounded-lg font-semibold ${role==='dealer'?'bg-yellow-400 text-gray-900':'bg-gray-800 text-yellow-400 border border-yellow-500'}`}><Building2 className="w-4 h-4 mr-1 inline"/> Dealer</button>
            <button onClick={() => setRole('service')} className={`px-4 py-2 rounded-lg font-semibold ${role==='service'?'bg-yellow-400 text-gray-900':'bg-gray-800 text-yellow-400 border border-yellow-500'}`}><Wrench className="w-4 h-4 mr-1 inline"/> Service</button>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6">
          <button onClick={connectWallet} className="w-full px-6 py-3 rounded-xl font-semibold text-gray-800 bg-gradient-to-r from-yellow-400 to-yellow-300">
            {walletAddress ? `Wallet: ${walletAddress.slice(0, 9)}...` : 'Connect Wallet'}
          </button>
          <button onClick={handleAirLogin} className="w-full px-6 py-3 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-green-400 to-green-300">
            {airSession ? `Connected AIR` : 'Login with AIRKit'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSignIn && (
            <>
              <div><label className="block text-sm mb-1">Name</label><input type="text" name="name" className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400" required /></div>
              {role==='dealer' && <div><label className="block text-sm mb-1">Dealer ID</label><input type="text" name="Dealer_ID" className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400" required /></div>}
              {role==='service' && <div><label className="block text-sm mb-1">Service Center ID</label><input type="text" name="Service_ID" className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400" required /></div>}
            </>
          )}

          <div><label className="block text-sm mb-1">Email</label><input type="email" name="email" className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400" required /></div>
          <div><label className="block text-sm mb-1">Password</label><input type="password" name="password" className="w-full p-2 rounded bg-gray-800 text-yellow-300 border border-yellow-400" required /></div>

          <div className="flex justify-center space-x-4">
            <button type="button" onClick={() => setIsSignIn(true)} className={`px-4 py-2 rounded-lg ${isSignIn?'bg-yellow-400 text-gray-900 font-semibold':'bg-gray-800 text-yellow-400 border border-yellow-500'}`}>Sign In</button>
            <button type="button" onClick={() => setIsSignIn(false)} className={`px-4 py-2 rounded-lg ${!isSignIn?'bg-yellow-400 text-gray-900 font-semibold':'bg-gray-800 text-yellow-400 border border-yellow-500'}`}>Sign Up</button>
          </div>

          <button type="submit" className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-yellow-300 transition-colors">
            <Shield className="w-4 h-4 mr-2 inline" />
            {isSignIn ? 'Sign In' : role==='dealer'?'Register as Dealer':role==='service'?'Register Service Center':'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthenticationModal;
