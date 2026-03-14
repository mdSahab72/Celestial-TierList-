import { Trophy, Target, Users, Zap, ArrowRight, Shield, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden bg-slate-950">
      {/* Starfield Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Atmospheric Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-900/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/30 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/50 border border-indigo-500/30 backdrop-blur-md mb-8">
          <Star className="w-4 h-4 text-yellow-300" />
          <span className="text-sm font-medium text-indigo-200 tracking-wide uppercase">The Premier PvP Experience</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-500 drop-shadow-sm">
          Welcome to <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Celestial TierList
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mb-12 font-medium leading-relaxed">
          Join our Tierlist server to assess your skills, climb the ranks, and compete in a structured, competitive Minecraft PvP environment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link 
            to="/rankings" 
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Trophy className="w-5 h-5 relative z-10" />
            <span className="relative z-10">View Rankings</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/discord" 
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-full text-white font-bold text-lg hover:bg-indigo-950/50 hover:border-indigo-400/50 transition-all shadow-xl"
          >
            <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Join Discord</span>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full text-left relative z-10 mb-32">
        <div className="group p-8 md:p-10 rounded-[2.5rem] bg-slate-900/60 border border-indigo-500/20 backdrop-blur-xl hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full group-hover:bg-indigo-500/20 transition-colors duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            <Trophy className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-indigo-300 transition-colors">Competitive Rankings</h3>
          <p className="text-indigo-200 leading-relaxed text-lg">
            Track your progress and compete against the best players in various gamemodes. Climb to the top and prove your worth.
          </p>
        </div>
        
        <div className="group p-8 md:p-10 rounded-[2.5rem] bg-slate-900/60 border border-purple-500/20 backdrop-blur-xl hover:bg-slate-800/80 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
            <Target className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-purple-300 transition-colors">Skill-Based System</h3>
          <p className="text-indigo-200 leading-relaxed text-lg">
            Fair and accurate skill assessment through our comprehensive ranking system designed by top-tier players.
          </p>
        </div>
        
        <div className="group p-8 md:p-10 rounded-[2.5rem] bg-slate-900/60 border border-blue-500/20 backdrop-blur-xl hover:bg-slate-800/80 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-blue-300 transition-colors">Active Community</h3>
          <p className="text-indigo-200 leading-relaxed text-lg">
            Join thousands of players in our thriving Discord community and server. Make friends, form teams, and battle.
          </p>
        </div>
        
        <div className="group p-8 md:p-10 rounded-[2.5rem] bg-slate-900/60 border border-pink-500/20 backdrop-blur-xl hover:bg-slate-800/80 hover:border-pink-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.2)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] rounded-full group-hover:bg-pink-500/20 transition-colors duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-pink-900/50 border border-pink-500/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
            <Zap className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-pink-300 transition-colors">Boost Your Skills</h3>
          <p className="text-indigo-200 leading-relaxed text-lg">
            Support the server and gain exclusive perks through our booster program while improving your gameplay.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="relative z-10 w-full max-w-5xl bg-gradient-to-b from-indigo-950/30 to-transparent border border-indigo-500/20 rounded-[3rem] p-10 md:p-16 text-center backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        
        <div className="w-20 h-20 mx-auto bg-indigo-950/50 border border-indigo-500/30 rounded-full flex items-center justify-center mb-8 shadow-2xl">
          <Shield className="w-10 h-10 text-indigo-400" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">About Celestial TierList</h2>
        <p className="text-indigo-200 leading-relaxed text-xl max-w-4xl mx-auto font-medium">
          Celestial TierList is the premier Minecraft PvP ranking platform where players can showcase their skills across multiple gamemodes. Our dedicated team of staff members ensures a fair and competitive environment for all players. Whether you're a casual player or aspiring professional, there's a place for you here.
        </p>
      </div>
    </div>
  );
}
