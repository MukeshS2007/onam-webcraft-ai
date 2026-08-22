import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight, Sparkles, Mail, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const { switchUserRole, user } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'seller'>('customer');
  
  // Custom forms state for aesthetic completeness
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In our demo auth, we simply switch user role based on selection
    switchUserRole(selectedRole);
    if (selectedRole === 'seller') {
      navigate('/seller');
    } else {
      navigate('/');
    }
  };

  const handleQuickLogin = (role: 'customer' | 'seller') => {
    switchUserRole(role);
    if (role === 'seller') {
      navigate('/seller');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      
      <div className="bg-white border border-onam-gold/25 rounded-3xl overflow-hidden shadow-lg animate-in zoom-in-95 duration-200">
        
        {/* Banner Decorative Header */}
        <div className="bg-onam-green text-onam-cream p-6 text-center space-y-2 border-b border-onam-gold/20 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-onam-gold/5 rounded-full blur-xl pointer-events-none" />
          <span className="text-xl">🪔</span>
          <h2 className="font-serif text-2xl font-bold text-onam-cream">Welcome to Onam Bazaar</h2>
          <p className="text-xs text-onam-cream-dark/70 font-sans leading-relaxed">
            Support rural craftsmanship. Log in to explore or manage listings.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Active Status Display */}
          {user && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-950 font-sans text-center">
              Currently logged in as: <strong className="text-onam-green">{user.name}</strong> ({user.role})
            </div>
          )}

          {/* Role selector Tab switcher */}
          <div className="flex bg-onam-cream-dark rounded-xl p-1 border border-onam-gold/15">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'customer'
                  ? 'bg-onam-green text-onam-cream shadow'
                  : 'text-onam-green hover:text-onam-gold'
              }`}
            >
              <User className="w-4 h-4" />
              Customer Profile
            </button>
            <button
              onClick={() => setSelectedRole('seller')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'seller'
                  ? 'bg-onam-green text-onam-cream shadow'
                  : 'text-onam-green hover:text-onam-gold'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Seller Account
            </button>
          </div>

          {/* Auth Form Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            
            <div className="space-y-1.5">
              <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Email Address</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder={selectedRole === 'customer' ? 'anjali@example.com' : 'seller@malabarsnacks.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 pl-10 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
                />
                <Mail className="w-4 h-4 text-onam-charcoal/40 absolute left-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Password</label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 pl-10 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
                />
                <Lock className="w-4 h-4 text-onam-charcoal/40 absolute left-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-onam-green hover:bg-onam-green-light text-onam-cream font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              Log In as {selectedRole === 'seller' ? 'Seller' : 'Customer'}
              <ArrowRight className="w-4 h-4 text-onam-gold" />
            </button>

          </form>

          {/* Quick Demo Access buttons */}
          <div className="space-y-3.5 pt-4 border-t border-onam-gold/15">
            <span className="text-[10px] text-onam-charcoal/50 uppercase tracking-wider block text-center font-bold font-sans">
              Or Access Quick Sandbox Logins
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => handleQuickLogin('customer')}
                className="py-2.5 px-3 border border-onam-gold/30 hover:border-onam-green rounded-xl bg-onam-cream-dark/15 text-onam-green font-bold flex items-center justify-center gap-1 transition-all text-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-onam-gold-dark" />
                Demo Customer
              </button>
              <button
                onClick={() => handleQuickLogin('seller')}
                className="py-2.5 px-3 border border-onam-gold/30 hover:border-onam-green rounded-xl bg-onam-cream-dark/15 text-onam-green font-bold flex items-center justify-center gap-1 transition-all text-xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-onam-gold-dark" />
                Demo Seller
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Login;
