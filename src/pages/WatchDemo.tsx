import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Bot,
  Play,
  CheckCircle2,
  ArrowRight,
  BrainCircuit,
  BarChart3,
  CalendarClock } from
'lucide-react';
interface WatchDemoProps {
  onEnterApp: () => void;
  onBack: () => void;
}
export const WatchDemo = ({ onEnterApp, onBack }: WatchDemoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  return (
    <div className="min-h-screen bg-cream text-brown font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={onBack}>
            
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Bot size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-brown">
              Agent.ai
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={onBack}
              className="hover:text-brand-600 transition-colors">
              
              Features
            </button>
            <button
              onClick={onBack}
              className="hover:text-brand-600 transition-colors">
              
              How it Works
            </button>
            <button
              onClick={onBack}
              className="hover:text-brand-600 transition-colors">
              
              Pricing
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              onClick={onEnterApp}>
              
              Log in
            </Button>
            <Button onClick={onEnterApp}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero / Video Section */}
      <section className="pt-32 pb-20 bg-brand-900 text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-brand-600/20 rounded-full blur-3xl mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-brand-600/20 rounded-full blur-3xl mix-blend-screen" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6">
              
              <Badge
                variant="secondary"
                className="bg-brand-500/20 text-brand-200 border-brand-500/30 px-4 py-1.5">
                
                <Play size={12} className="mr-2 fill-current" /> 3-Minute
                Walkthrough
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              
              See how Agent.ai automates <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
                your entire workflow
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-400 max-w-2xl mx-auto">
              
              From brand voice calibration to multi-channel scheduling, watch
              how our AI agent handles the heavy lifting.
            </motion.p>
          </motion.div>

          {/* Video Player Container */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.4,
              duration: 0.8
            }}
            className="max-w-5xl mx-auto">
            
            <div className="relative aspect-video bg-brand-800 rounded-2xl overflow-hidden shadow-2xl border border-brand-700 group">
              {!isPlaying ?
              <>
                  {/* Thumbnail / Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-900">
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                    onClick={() => setIsPlaying(true)}
                    className="group/play relative flex items-center justify-center h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 hover:bg-white/20">
                    
                      <div className="absolute inset-0 rounded-full animate-ping bg-white/20" />
                      <Play size={40} className="ml-2 text-white fill-white" />
                    </button>
                  </div>

                  {/* Video UI Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Agent.ai Product Tour
                        </h3>
                        <p className="text-sm text-slate-300">
                          3:24 • 4K Quality
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                        variant="outline"
                        className="text-white border-white/20 bg-black/20 backdrop-blur-md">
                        
                          Updated for 2026
                        </Badge>
                      </div>
                    </div>
                  </div>
                </> :

              <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-16 w-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading demo stream...</p>
                    <Button
                    variant="ghost"
                    className="mt-4 text-white hover:text-white hover:bg-white/10"
                    onClick={() => setIsPlaying(false)}>
                    
                      Cancel
                    </Button>
                  </div>
                </div>
              }
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapters / Key Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="h-12 w-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 mb-4">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold text-brown">
                0:45 — Brand Memory
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Watch how to configure the AI to match your specific tone of
                voice. Upload your brand guidelines and see the AI adapt
                instantly.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Tone calibration sliders</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Negative keyword lists</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="h-12 w-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 mb-4">
                <CalendarClock size={24} />
              </div>
              <h3 className="text-xl font-bold text-brown">
                1:30 — Auto-Scheduling
              </h3>
              <p className="text-slate-600 leading-relaxed">
                See the "Smart Schedule" feature in action. The agent analyzes
                your audience activity and fills your calendar automatically.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Cross-platform sync</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Visual calendar drag-and-drop</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-brown">
                2:15 — ROI Analytics
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Don't just track likes. Track revenue. We'll show you how to
                connect your conversion events to social performance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Custom report generation</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Competitor benchmarking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-cream border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brown mb-6">
            Ready to try it yourself?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Get full access to all features shown in the demo. No credit card
            required for the 14-day trial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-14 px-8 text-lg w-full sm:w-auto"
              onClick={onEnterApp}>
              
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg w-full sm:w-auto bg-white"
              onClick={onBack}>
              
              Back to Homepage
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Bot size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-brown">
              Agent.ai
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Agent.ai Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-brand-600">
              Privacy
            </a>
            <a href="#" className="hover:text-brand-600">
              Terms
            </a>
            <a href="#" className="hover:text-brand-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>);

};