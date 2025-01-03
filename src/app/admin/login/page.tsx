'use client';
import { useState } from 'react';
import Image from 'next/image';
import adminLoginBg from '../../../../public/assets/adminLoginBg.jpg'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('idle');

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/verify-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setStatus('idle');
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
  
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/admin/dashboard';
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background image container */}
      <div className="absolute inset-0 z-0">
        <Image
          src={adminLoginBg}
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Content */}
      <div className="w-full max-w-md p-8 space-y-6 bg-black/50 backdrop-blur-sm rounded-2xl shadow-2xl text-white relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-200 mb-2">
            {step === 1 ? 'Welcome Back' : 'Verify OTP'}
          </h2>
          <p className="text-yellow-600 font-bold">
            {step === 1 
              ? 'Please sign in to your account' 
              : 'Enter the OTP sent to your email'
            }
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 text-amber-800 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-amber-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'Verify OTP'}
            </button>

            <p className="text-center text-sm">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleLogin}
                className="text-blue-400 hover:text-blue-700 font-medium"
              >
                Resend OTP
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}