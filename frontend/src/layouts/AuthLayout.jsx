import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Left Column: Image / Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 border-r border-slate-800/50 items-center justify-center p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-800/10 z-0"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl filter mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl filter mix-blend-screen animate-pulse animation-delay-2000"></div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-lg text-center">
          <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
            University Learning <br/> & Management System
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Empowering education through seamless digital experiences. Access your courses, manage academics, and connect with your peers.
          </p>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
             <img 
              src="/images/login-illustration.png" 
              alt="Login Illustration" 
              className="w-full h-auto object-contain max-h-[350px] drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-slate-900">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 mb-6 lg:hidden shadow-lg shadow-indigo-600/20">
               <span className="text-white font-bold text-xl">U</span>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl">
             {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
