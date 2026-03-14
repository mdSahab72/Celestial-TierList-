import { Shield, Users, Star, Award, CheckCircle } from 'lucide-react';

export default function Staff() {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Shield className="w-12 h-12 text-blue-400" />
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          Staff Team
        </h1>
      </div>

      <p className="text-xl text-gray-400 text-center max-w-2xl mb-16">
        Meet the dedicated team behind Celestial TierList.
      </p>

      <div className="w-full mb-16">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            Total Staff: 0 | Active: 0
          </h2>
        </div>
        
        <div className="flex flex-col items-center justify-center h-64 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
          <Users className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No staff members found.</p>
        </div>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Join Our Team</h2>
        </div>
        
        <p className="text-gray-400 mb-8 text-lg">
          Interested in becoming a staff member? We're always looking for dedicated individuals!
        </p>
        
        <p className="text-gray-300 mb-6">
          Staff applications are periodically opened when we need to expand our team. Requirements vary by role, but generally include:
        </p>
        
        <ul className="space-y-4 mb-8">
          {[
            "Active participation in the community",
            "Mature and professional behavior",
            "Good communication skills",
            "Available for regular activity",
            "Knowledge of server rules and systems"
          ].map((req, idx) => (
            <li key={idx} className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              {req}
            </li>
          ))}
        </ul>
        
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 font-medium">
            Keep an eye on our Discord server for application announcements!
          </p>
        </div>
      </div>
    </div>
  );
}
