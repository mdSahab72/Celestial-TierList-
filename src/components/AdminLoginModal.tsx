import React, { useState } from 'react';
import { X, Lock, ShieldAlert, KeyRound, Mail, ArrowLeft, CheckCircle2, Loader2, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [resetError, setResetError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Incorrect password');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSuccess();
      resetState();
      onClose();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(true);
      setErrorMessage(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    
    try {
      // First try Firebase Auth
      await signInWithEmailAndPassword(auth, 'spookysponsersship@gmail.com', password);
      onSuccess();
      resetState();
      onClose();
    } catch (err: any) {
      // If user doesn't exist and password matches the default, create the user automatically
      if (password === 'ryomensukuna2887') {
        try {
          await createUserWithEmailAndPassword(auth, 'spookysponsersship@gmail.com', password);
          onSuccess();
          resetState();
          onClose();
          return;
        } catch (createErr: any) {
          console.error("Failed to create admin user:", createErr);
          setError(true);
          setErrorMessage(createErr.message || 'Failed to setup admin account');
          setPassword('');
          setIsLoading(false);
          return;
        }
      }
      
      setError(true);
      setErrorMessage(err.message || 'Incorrect password');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail === 'spookysponsersship@gmail.com') {
      setResetError(false);
      setIsLoading(true);
      
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        setIsResetSent(true);
        setTimeout(() => {
          setMode('login');
          setIsResetSent(false);
          setResetEmail('');
        }, 4000);
      } catch (err) {
        console.error(err);
        // Even if it fails (e.g. user not found), we show success to prevent email enumeration,
        // but since this is a specific admin email, we can just show success.
        setIsResetSent(true);
        setTimeout(() => {
          setMode('login');
          setIsResetSent(false);
          setResetEmail('');
        }, 4000);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResetError(true);
    }
  };

  const resetState = () => {
    setPassword('');
    setError(false);
    setMode('login');
    setResetEmail('');
    setIsResetSent(false);
    setResetError(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-[#151619]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col p-6"
        >
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div 
              className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] cursor-default"
              onDoubleClick={() => mode === 'login' && setMode('reset')}
            >
              {mode === 'login' ? (
                <Lock className="w-6 h-6 text-purple-400" />
              ) : (
                <Mail className="w-6 h-6 text-purple-400" />
              )}
            </div>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                <p className="text-gray-400 text-sm mb-6">Enter the admin password to enable editing capabilities.</p>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <motion.input 
                      whileFocus={{ 
                        scale: 1.02,
                        boxShadow: "0px 0px 0px 2px rgba(168, 85, 247, 0.5), 0px 0px 20px rgba(168, 85, 247, 0.4)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      type="password" 
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(false);
                      }}
                      placeholder="Enter password..."
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all shadow-inner ${
                        error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:bg-white/10'
                      }`}
                      autoFocus
                    />
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex items-center gap-1.5 mt-2 text-red-400 text-sm"
                        >
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <span className="truncate">{errorMessage}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    {isLoading ? 'Verifying...' : 'Unlock Admin Mode'}
                  </motion.button>
                </form>

                <div className="mt-4 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#151619] text-gray-500">Or continue with</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="mt-4 w-full py-3 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-gray-400 text-sm mb-6">Enter your pre-configured admin email to receive a reset link.</p>

                {isResetSent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-6 text-center"
                  >
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-white font-bold mb-2">Link Sent!</h3>
                    <p className="text-sm text-gray-400">
                      If an account exists for <span className="text-white">{resetEmail}</span>, a reset link has been sent.
                    </p>
                    <p className="text-xs text-purple-400/80 mt-4 italic">
                      (If you haven't created this user in Firebase Console, the email won't actually send.)
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div>
                      <motion.input 
                        whileFocus={{ 
                          scale: 1.02,
                          boxShadow: "0px 0px 0px 2px rgba(168, 85, 247, 0.5), 0px 0px 20px rgba(168, 85, 247, 0.4)"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        type="email" 
                        required
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setResetError(false);
                        }}
                        placeholder="admin@example.com"
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all shadow-inner ${
                          resetError ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:bg-white/10'
                        }`}
                        autoFocus
                      />
                      <AnimatePresence>
                        {resetError && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex items-center gap-1.5 mt-2 text-red-400 text-sm"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            <span>Unrecognized email address</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </motion.button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <button 
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
