import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RefreshCcw, Loader2, Sparkles, History, Activity, Hash, Clock } from 'lucide-react';
import { AppState, HistoryItem } from './types';
import { sendAudioToN8n } from './services/n8nService';
import { NeonButton } from './components/NeonButton';
import { TypewriterText } from './components/TypewriterText';
import { initAudio, playStartSound, playStopSound } from './utils/soundUtils';
import { Navbar, FeaturesSection, MediaShowcase, Footer } from './components/LandingSections';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Initialize audio context on first interaction to allow playing sounds
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('neon_voice_history');
    const savedCount = localStorage.getItem('neon_voice_count');
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
    
    if (savedCount) {
      setTotalWordCount(parseInt(savedCount, 10) || 0);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current!);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const addToHistory = (text: string) => {
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
      wordCount
    };

    const updatedHistory = [newItem, ...history];
    const newTotalCount = totalWordCount + wordCount;

    setHistory(updatedHistory);
    setTotalWordCount(newTotalCount);

    localStorage.setItem('neon_voice_history', JSON.stringify(updatedHistory));
    localStorage.setItem('neon_voice_count', newTotalCount.toString());
  };

  const startVisualizer = (stream: MediaStream) => {
    if (!canvasRef.current) return;

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 256;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5; // Scale down slightly
        
        // Premium Gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#facc15'); // Yellow-400
        gradient.addColorStop(1, '#a16207'); // Yellow-800

        ctx.fillStyle = gradient;
        
        // Rounding the top of the bars
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight / 2 - 2, barWidth, barHeight / 2 + 2, [5, 5, 0, 0]);
        ctx.fill();

        // Mirror effect for sophisticated look
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x, canvas.height / 2, barWidth, barHeight / 4);
        ctx.globalAlpha = 1.0;

        x += barWidth + 1;
      }
    };

    draw();
  };

  const startRecording = async () => {
    try {
      initAudio(); // Ensure audio context is ready
      playStartSound();
      
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      startVisualizer(stream);

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        playStopSound();
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); // Typically audio/webm or audio/ogg
        handleAudioUpload(blob);
        
        // Stop all tracks to turn off mic
        stream.getTracks().forEach(track => track.stop());
        cancelAnimationFrame(animationFrameRef.current!);
      };

      mediaRecorderRef.current.start();
      setAppState(AppState.RECORDING);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMessage("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      // State change to PROCESSING happens in onstop logic
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    setAppState(AppState.PROCESSING);
    try {
      const text = await sendAudioToN8n(blob);
      setTranscription(text);
      addToHistory(text);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      setErrorMessage("Failed to process audio. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setAppState(AppState.IDLE);
    setTranscription(null);
    setErrorMessage(null);
  };

  const formatTime = (ms: number) => {
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-yellow-500/30 selection:text-yellow-200 font-sans text-white">
      
      <Navbar />

      {/* HERO SECTION (Includes the App) */}
      <section id="recorder" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
        
        {/* 3D Grid Floor Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Horizon Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-black to-yellow-900/10 z-0"></div>
            
            {/* Animated Perspective Grid */}
            <div className="absolute bottom-0 left-[-50%] w-[200%] h-[50%] opacity-20" 
                style={{ 
                transform: 'perspective(500px) rotateX(60deg)',
                transformOrigin: 'bottom center' 
                }}>
            <div className="w-full h-full bg-grid-animate"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full blur-[2px] floating-particle" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-500 rounded-full blur-[1px] floating-particle" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-yellow-600 rounded-full blur-[4px] floating-particle" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Ambient Lighting */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col gap-8">
            
            {/* Hero Text */}
            <div className="flex flex-col gap-6 items-center text-center mb-4">
                <div className="inline-flex items-center justify-center gap-2 mb-2 px-4 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs uppercase tracking-[0.2em] text-yellow-400 font-semibold">AI Voice Processor</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-100 to-yellow-500 neon-text-glow tracking-tighter lowercase leading-tight">
                    transcribe <br className="md:hidden"/> the future
                </h1>
                <p className="text-xl text-yellow-100/50 font-light max-w-2xl mx-auto">
                    Turn your voice into actionable data with zero latency. <br/>Powered by advanced neural networks.
                </p>

                {/* Data Metrics Bar */}
                <div className="flex items-center justify-between bg-yellow-950/20 border border-yellow-500/20 rounded-lg p-3 backdrop-blur-sm w-full max-w-md mx-auto">
                    <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-mono text-yellow-500/60 uppercase">System Status</span>
                    <span className="text-xs font-bold text-green-400">ONLINE</span>
                    </div>
                    <div className="h-4 w-[1px] bg-yellow-500/20"></div>
                    <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-mono text-yellow-500/60 uppercase">Total Words</span>
                    <span className="text-lg font-display font-bold text-yellow-400 leading-none">{totalWordCount}</span>
                    </div>
                </div>
            </div>

            {/* Dynamic Display Area (Recorder) */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-300 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative min-h-[300px] bg-black/80 backdrop-blur-xl border border-yellow-500/20 rounded-xl p-8 shadow-2xl flex flex-col items-center justify-center text-center overflow-hidden">
                    
                    {/* Grid Pattern Overlay inside container */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                    {/* Content States */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    
                    {appState === AppState.IDLE && (
                        <div className="space-y-6 animate-in fade-in duration-700">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-yellow-500/30 flex items-center justify-center mx-auto mb-4 hover:border-yellow-500/60 transition-colors cursor-pointer group/mic" onClick={startRecording}>
                            <Mic className="w-10 h-10 text-yellow-500/50 group-hover/mic:text-yellow-400 transition-colors" />
                        </div>
                        <p className="text-xl text-yellow-100/50 font-light">
                            Ready to capture your thoughts.
                            <br />
                            <span className="text-sm opacity-60">Click the microphone to begin.</span>
                        </p>
                        </div>
                    )}

                    {appState === AppState.RECORDING && (
                        <div className="w-full flex flex-col items-center gap-6">
                        <div className="text-yellow-400 animate-pulse font-mono tracking-widest text-sm uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            Recording Audio
                        </div>
                        <div className="w-full h-32 flex items-center justify-center">
                            <canvas ref={canvasRef} width="600" height="150" className="w-full h-full" />
                        </div>
                        <div className="text-xs text-yellow-500/40 font-mono">VISUALIZATION ACTIVE_</div>
                        </div>
                    )}

                    {appState === AppState.PROCESSING && (
                        <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-400 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-yellow-400 animate-pulse" />
                            </div>
                        </div>
                        <p className="text-yellow-400 font-mono text-sm animate-pulse tracking-widest">
                            PROCESSING_DATA...
                        </p>
                        </div>
                    )}

                    {appState === AppState.SUCCESS && transcription && (
                        <div className="w-full text-left bg-yellow-500/5 p-6 rounded-lg border border-yellow-500/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50"></div>
                        <div className="flex justify-between items-center mb-4 border-b border-yellow-500/10 pb-2">
                            <span className="text-xs font-mono text-yellow-500/60 uppercase tracking-wider">Output Stream</span>
                            <span className="text-xs font-mono text-yellow-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                SYNCED
                            </span>
                        </div>
                        <TypewriterText text={transcription} />
                        </div>
                    )}

                    {appState === AppState.ERROR && (
                        <div className="text-red-400 bg-red-950/20 p-6 rounded-lg border border-red-500/30 max-w-md backdrop-blur-md">
                        <p className="font-semibold mb-2 flex items-center gap-2">
                            <span className="text-red-500">⚠</span> Transmission Error
                        </p>
                        <p className="text-sm opacity-80 font-mono">{errorMessage}</p>
                        </div>
                    )}

                    </div>
                </div>
            </div>

            {/* Controls Area */}
            <div className="flex justify-center items-center gap-6 z-20">
            
            {appState === AppState.IDLE || appState === AppState.ERROR ? (
                <NeonButton 
                onClick={startRecording} 
                className="w-20 h-20 rounded-full shadow-lg shadow-yellow-900/20"
                >
                <Mic className="w-8 h-8" />
                </NeonButton>
            ) : null}

            {appState === AppState.RECORDING ? (
                <NeonButton 
                onClick={stopRecording}
                active
                className="w-20 h-20 rounded-full animate-pulse shadow-[0_0_50px_rgba(234,179,8,0.3)]"
                >
                <Square className="w-8 h-8 fill-current" />
                </NeonButton>
            ) : null}

            {appState === AppState.SUCCESS && (
                <div className="flex gap-4">
                <NeonButton onClick={resetApp} className="px-8 py-4 rounded-full">
                    <RefreshCcw className="w-5 h-5" />
                    <span>New Recording</span>
                </NeonButton>
                </div>
            )}

            </div>

            {/* Transmission Log / History */}
            {history.length > 0 && (
            <div className="w-full mt-4 animate-in slide-in-from-bottom-10 fade-in duration-700">
                <div className="flex items-center gap-2 mb-4 px-2">
                <History className="w-4 h-4 text-yellow-500/60" />
                <h3 className="text-sm font-mono uppercase tracking-widest text-yellow-500/60">Transmission Log</h3>
                </div>
                
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item) => (
                    <div key={item.id} className="bg-black/50 border border-yellow-500/10 rounded-md p-4 hover:border-yellow-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-yellow-500/40">
                        <Clock className="w-3 h-3" />
                        {formatTime(item.timestamp)}
                        </div>
                        <div className="text-[10px] font-mono text-yellow-500/40 border border-yellow-500/10 rounded px-1.5 py-0.5">
                        {item.wordCount} words
                        </div>
                    </div>
                    <p className="text-yellow-100/80 font-light text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {item.text}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
      </section>

      {/* NEW LANDING PAGE SECTIONS */}
      <FeaturesSection />
      
      <MediaShowcase />
      
      <Footer />

    </div>
  );
};

export default App;
