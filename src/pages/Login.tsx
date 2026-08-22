import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight, Sparkles, Mail, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const { login, register, user, addToast } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'seller'>('customer');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Forms State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        if (!name || !phone) {
          setErrorMsg("Please fill in your name and phone number.");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters long.");
          setIsSubmitting(false);
          return;
        }
        await register(email, name, phone, password);
        addToast("Account registered successfully!", "success");
        navigate('/');
      } else {
        await login(email, password, selectedRole);
        addToast("Logged in successfully!", "success");
        if (selectedRole === 'seller') {
          navigate('/seller');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role: 'customer' | 'seller') => {
    setErrorMsg('');
    const quickEmail = role === 'seller' ? 'seller@malabarsnacks.com' : 'anjali@example.com';
    const quickPassword = 'password';
    try {
      await login(quickEmail, quickPassword, role);
      addToast("Logged in with Sandbox sandbox accounts!", "success");
      if (role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Sandbox access failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
      
      <div className="bg-white border border-onam-gold/25 rounded-3xl overflow-hidden shadow-lg animate-in zoom-in-95 duration-200">
        
        {/* Banner Decorative Header */}
        <div className="bg-onam-green text-onam-cream p-6 text-center space-y-2 border-b border-onam-gold/20 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-onam-gold/5 rounded-full blur-xl pointer-events-none" />
          <span className="text-xl">🪔</span>
          <h2 className="font-serif text-2xl font-bold text-onam-cream">
            {isSignUp ? 'Create Customer Account' : 'Welcome to Onam Bazaar'}
          </h2>
          <p className="text-xs text-onam-cream-dark/70 font-sans leading-relaxed">
            {isSignUp 
              ? 'Join our community to support local artisans and buy authentic Kerala products.'
              : 'Support rural craftsmanship. Log in to explore or manage listings.'
            }
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Active Status Display */}
          {user && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-950 font-sans text-center">
              Currently logged in as: <strong className="text-onam-green">{user.name}</strong> ({user.role})
            </div>
          )}

          {/* Error Message display */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-800 font-medium text-center font-sans">
              {errorMsg}
            </div>
          )}

          {/* Role selector Tab switcher (Login Only) */}
          {!isSignUp && (
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
          )}

          {/* Auth Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            
            {/* Signup Fields (Name and Phone) */}
            {isSignUp && (
              <>
                <div className="space-y-1.5">
                  <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Full Name</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Nair"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 pl-10 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
                    />
                    <User className="w-4 h-4 text-onam-charcoal/40 absolute left-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Phone Number</label>
                  <div className="relative flex items-center">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 pl-10 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
                    />
                    <ShieldCheck className="w-4 h-4 text-onam-charcoal/40 absolute left-3.5" />
                  </div>
                </div>
              </>
            )}

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
              disabled={isSubmitting}
              className="w-full bg-onam-green hover:bg-onam-green-light disabled:bg-gray-400 text-onam-cream font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              {isSubmitting 
                ? 'Processing...' 
                : isSignUp 
                  ? 'Sign Up as Customer' 
                  : `Log In as ${selectedRole === 'seller' ? 'Seller' : 'Customer'}`
              }
              <ArrowRight className="w-4 h-4 text-onam-gold" />
            </button>

          </form>

          {/* Toggle Switcher */}
          <div className="text-center pt-2 text-xs font-sans">
            {isSignUp ? (
              <p className="text-onam-charcoal/60">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
                  className="text-onam-green hover:text-onam-gold font-bold underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p className="text-onam-charcoal/60">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
                  className="text-onam-green hover:text-onam-gold font-bold underline cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Access buttons (Login Only) */}
          {!isSignUp && (
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
          )}

        </div>

      </div>

    </div>
  );
};
export default Login;
