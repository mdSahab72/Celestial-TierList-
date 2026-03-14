import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, Zap, MessageSquare, Shield, Lock, Search } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/rankings', label: 'Rankings', icon: Trophy },
    { path: '/testers', label: 'Testers', icon: Users },
    { path: '/boosters', label: 'Boosters', icon: Zap },
    { path: '/discord', label: 'Discord', icon: MessageSquare },
    { path: '/staff', label: 'Staff', icon: Shield },
    { path: '/admin', label: 'Admin', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-[#0a0510] text-white font-sans relative overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
        <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_#fff] opacity-80"></div>
        <div className="absolute top-[60%] left-[10%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff] opacity-60"></div>
        <div className="absolute top-[80%] left-[70%] w-2 h-2 bg-white rounded-full shadow-[0_0_20px_#fff] opacity-40"></div>
        <div className="absolute top-[40%] left-[40%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff] opacity-70"></div>
        <div className="absolute top-[15%] left-[60%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff] opacity-50"></div>
        <div className="absolute top-[75%] left-[30%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_#fff] opacity-90"></div>
        <div className="absolute top-[90%] left-[90%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff] opacity-30"></div>
        <div className="absolute top-[5%] left-[5%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff] opacity-80"></div>
        <div className="absolute top-[50%] left-[95%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff] opacity-60"></div>
        {/* Add more stars as needed or use a repeating background image */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0510]/80 to-[#0a0510] pointer-events-none"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0510]/80 backdrop-blur-md"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <Trophy className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight">
            Celestial <span className="text-purple-400">TierList</span>
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10"
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3, type: "spring", stiffness: 200, damping: 20 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative overflow-hidden group",
                    isActive 
                      ? "text-white shadow-lg shadow-purple-500/25" 
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        <div className="w-[120px]"></div> {/* Spacer for balance */}
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 p-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
