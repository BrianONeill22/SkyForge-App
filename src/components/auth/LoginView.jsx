import React, { useState } from 'react';
import { useForgeAuth } from '../../context/ForgeContext';
import WuuthradBannerIcon from '../common/WuuthradBannerIcon';

export default function LoginView() {
  const { loginWithAccount, loginWithPasscode } = useForgeAuth();
  const [loginMode, setLoginMode] = useState('account');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    const res = loginWithAccount(username, password);
    if (!res.ok) {
      setError(res.error);
    } else {
      setUsername('');
      setPassword('');
      setError('');
    }
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    const res = loginWithPasscode(password);
    if (!res.ok) {
      setError(res.error);
    } else {
      setPassword('');
      setError('');
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <WuuthradBannerIcon className="w-12 h-12 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-amber-200">Skyforge Guild Gate</h2>
          <p className="text-xs text-zinc-400">
            Sign in with your personal Smith/Guild account or enter a master Forge Passcode.
          </p>
        </div>

        <div className="grid grid-cols-2 p-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setLoginMode('account');
              setError('');
            }}
            className={`py-1.5 rounded font-semibold cursor-pointer ${
              loginMode === 'account'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('passcode');
              setError('');
            }}
            className={`py-1.5 rounded font-semibold cursor-pointer ${
              loginMode === 'passcode'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Forge Passcode
          </button>
        </div>

        {loginMode === 'account' ? (
          <form onSubmit={handleAccountSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-sm text-zinc-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-sm text-zinc-100 focus:outline-none"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
            >
              Sign In to Profile
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Forge Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500/60 text-sm text-zinc-100 focus:outline-none"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
            >
              Enter the Skyforge
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
