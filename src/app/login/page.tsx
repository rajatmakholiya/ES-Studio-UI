'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Logo & Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white shadow-md">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to SocialMetrics to continue.</p>
        </div>

        {/* Google OAuth Button */}
        <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-1">
          {/* Standard Google G Logo SVG */}
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="mx-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Or continue with email</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Email/Password Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Password</label>
              <Link href="#" className="text-[11px] font-bold text-[#6366f1] hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]"
              />
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl bg-[#6366f1] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#4f46e5] hover:shadow-lg active:scale-[0.98]">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <Link href="#" className="font-bold text-[#6366f1] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}