import { MessageSquare, Users, Bell, Hash, Trophy, ShieldAlert } from 'lucide-react';

export default function Discord() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-24 h-24 bg-[#5865F2] rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-[#5865F2]/30 transform hover:scale-105 transition-transform">
          <MessageSquare className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
          Join Our Discord
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">
          Connect with the Celestial TierList community, get support, and stay updated with the latest news!
        </p>
        <a 
          href="https://discord.gg/aQPHrB47z" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] rounded-full text-white font-bold text-lg transition-colors shadow-lg shadow-[#5865F2]/25"
        >
          <MessageSquare className="w-5 h-5" />
          Join Discord Server
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <Users className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Active Community</h3>
          <p className="text-gray-400">Join thousands of players discussing strategies and forming teams.</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <Bell className="w-8 h-8 text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Server Updates</h3>
          <p className="text-gray-400">Get instant notifications about events, updates, and announcements.</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <Hash className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Dedicated Channels</h3>
          <p className="text-gray-400">Channels for each gamemode, support, and general discussion.</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <Trophy className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Tournaments & Events</h3>
          <p className="text-gray-400">Participate in regular tournaments with prizes and rankings.</p>
        </div>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Server Rules</h2>
        </div>
        <p className="text-gray-400 mb-6">Please follow these rules to maintain a positive community environment:</p>
        <ul className="space-y-4">
          {[
            "Be respectful to all members. No harassment, hate speech, or discrimination.",
            "No spam, excessive self-promotion, or advertising without permission.",
            "Keep discussions in appropriate channels. Use #support for help requests.",
            "No cheating, exploiting, or sharing exploits. Report bugs to staff.",
            "Follow Discord's Terms of Service and Community Guidelines."
          ].map((rule, idx) => (
            <li key={idx} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold border border-white/20">
                {idx + 1}
              </span>
              <span className="text-gray-300">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
