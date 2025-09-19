import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import authHeroBg from '@/assets/auth-hero-bg-pink.jpg';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <main className="min-h-screen flex">
      {/* Left Side - Form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </section>

      {/* Right Side - Hero */}
      <section className="hidden lg:flex flex-1 relative">
        <div 
          className="w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${authHeroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-light/80"></div>
          <div className="relative z-10 flex flex-col justify-center items-start h-full p-16 text-white">
            <div className="max-w-lg">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Manage leads like a <span className="text-primary-lighter">pro</span>
              </h1>
              <p className="text-xl mb-8 text-primary-lighter leading-relaxed">
                LeadFlow helps sales teams organize, track, and convert leads more effectively with our intuitive lead management platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-lg">Track lead status & progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-lg">Organize with powerful filters</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-lg">Boost conversion rates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};