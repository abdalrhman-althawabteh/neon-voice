import React from 'react';
import { Mic, Shield, Zap, Cpu, Globe, Play } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-yellow-500/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center rotate-45 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            <span className="text-black font-bold -rotate-45 text-xl font-display">N</span>
          </div>
          <span className="text-2xl font-display font-bold text-white tracking-tighter lowercase">
            neon <span className="text-yellow-400">voice</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#recorder" className="text-sm font-mono text-yellow-500/80 hover:text-yellow-400 transition-colors uppercase tracking-widest">App</a>
          <a href="#features" className="text-sm font-mono text-white/60 hover:text-white transition-colors uppercase tracking-widest">Features</a>
          <a href="#showcase" className="text-sm font-mono text-white/60 hover:text-white transition-colors uppercase tracking-widest">Showcase</a>
        </div>
        <button className="hidden md:block px-6 py-2 border border-yellow-500/50 text-yellow-400 font-display text-sm hover:bg-yellow-500 hover:text-black transition-all duration-300">
          GET ACCESS
        </button>
      </div>
    </nav>
  );
};

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Processing",
      desc: "Zero-latency audio conversion powered by n8n workflows."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Encrypted Data",
      desc: "End-to-end encryption ensures your voice data remains private."
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "AI Enhanced",
      desc: "Context-aware models clean up audio for perfect transcription."
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-black">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Engineered for <span className="text-yellow-500">Performance</span>
          </h2>
          <div className="h-1 w-24 bg-yellow-500"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-8 border border-white/10 bg-white/5 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-12 h-12 bg-black border border-yellow-500/30 rounded-lg flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                {f.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">{f.title}</h3>
              <p className="text-white/60 font-light leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const MediaShowcase: React.FC = () => {
  return (
    <section id="showcase" className="py-24 bg-[#080808] border-t border-yellow-500/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="w-full md:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              Visualize Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 neon-text-glow">
                Digital Footprint
              </span>
            </h2>
            <p className="text-lg text-white/60 font-light">
              Experience the future of voice interaction. Our interface provides real-time feedback with premium aesthetics designed for professionals.
            </p>
            
            <div className="flex items-center gap-4 text-sm font-mono text-yellow-500">
               <span className="flex items-center gap-2">
                 <Globe className="w-4 h-4" /> Global CDN
               </span>
               <span className="w-1 h-1 bg-white/20 rounded-full"></span>
               <span className="flex items-center gap-2">
                 <Play className="w-4 h-4" /> Live Demo
               </span>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
             {/* Decorative Video/Image Container */}
             <div className="relative aspect-video bg-black border border-yellow-500/30 rounded-lg overflow-hidden group">
                <div className="absolute inset-0 bg-yellow-500/10 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                
                {/* Abstract Tech Image */}
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
                  alt="Technology Visualization" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Overlay UI Elements to make it look like an app interface */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent z-20 flex items-end p-6">
                   <div className="font-mono text-xs text-yellow-400">
                      &gt; INITIALIZING NEURAL LINK... <br/>
                      &gt; CONNECTION ESTABLISHED.
                   </div>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500 rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                   <Play className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
             </div>
             
             {/* Floating Element */}
             <div className="absolute -bottom-6 -right-6 w-48 h-32 bg-black border border-yellow-500/30 p-4 rounded-lg shadow-2xl z-40 hidden md:block">
                <div className="flex justify-between items-end h-full gap-1">
                   {[40, 70, 45, 90, 60, 80, 50, 75].map((h, i) => (
                      <div key={i} className="w-full bg-yellow-500/80" style={{ height: `${h}%`}}></div>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-yellow-500/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-xl font-display font-bold text-white tracking-tighter lowercase">
            neon <span className="text-yellow-400">voice</span>
          </span>
          <p className="text-white/40 text-sm mt-2 font-mono">
            © 2024 Neon Voice Technologies.
          </p>
        </div>
        <div className="flex gap-6">
           <a href="#" className="text-white/40 hover:text-yellow-400 transition-colors">Terms</a>
           <a href="#" className="text-white/40 hover:text-yellow-400 transition-colors">Privacy</a>
           <a href="#" className="text-white/40 hover:text-yellow-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
