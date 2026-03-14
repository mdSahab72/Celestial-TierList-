import React, { useState } from 'react';
import { Lock, User, Key, LogIn } from 'lucide-react';

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder login logic
    alert('Admin login functionality would go here.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-md mx-auto">
      <div className="bg-[#110c1a] border border-white/10 rounded-3xl p-8 w-full shadow-2xl shadow-purple-900/20 backdrop-blur-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm text-center">
            Enter your credentials to access the panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0a0510] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0510] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {/* Eye icon would go here for toggle visibility */}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 rounded-xl text-white font-bold text-lg transition-all shadow-lg shadow-orange-500/25 mt-8"
          >
            <LogIn className="w-5 h-5" />
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
