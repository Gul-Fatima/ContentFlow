import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Bot,
  CheckCircle2,
  ArrowRight,
  BrainCircuit,
  CalendarClock,
  BarChart3,
  Zap,
  Shield,
  Users,
  Play,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Sparkles,
  Star } from
'lucide-react';
interface LandingPageProps {
  onEnterApp: () => void;
  onWatchDemo: () => void;
}
export const LandingPage = ({ onEnterApp, onWatchDemo }: LandingPageProps) => {
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
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Bot size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-brown">
              Agent.ai
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-brand-600 transition-colors">
              
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-brand-600 transition-colors">
              
              How it Works
            </a>
            <a
              href="#pricing"
              className="hover:text-brand-600 transition-colors">
              
              Pricing
            </a>
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-brand-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible">
            
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6">
              
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm bg-peach text-brand-900 border-peach/60 rounded-full">
                
                <Sparkles size={14} className="mr-2 inline-block" />
                Now with GPT-4o Integration
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight text-brown mb-8 leading-[1.1]">
              
              Your AI Social Media <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">
                Marketing Team
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              
              Stop spending hours on content. Agent.ai learns your brand voice,
              drafts posts, schedules content, and analyzes performance —
              automatically.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full"
                onClick={onEnterApp}>
                
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg rounded-full border-slate-300 hover:bg-cream"
                onClick={onWatchDemo}>
                
                <Play className="mr-2 h-5 w-5 fill-brown" /> Watch Demo
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-100 bg-cream/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Trusted by modern marketing teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using text placeholders for logos as requested, styled to look like logos */}
            <span className="text-xl font-bold font-serif flex items-center gap-2">
              <Zap size={24} /> Acme Inc.
            </span>
            <span className="text-xl font-bold font-mono flex items-center gap-2">
              <BoxIcon /> Layers
            </span>
            <span className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
              <CircleIcon /> Quotient
            </span>
            <span className="text-xl font-semibold flex items-center gap-2">
              <TriangleIcon /> Sisyphus
            </span>
            <span className="text-xl font-bold flex items-center gap-2">
              <HexagonIcon /> Hourglass
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-brown mb-6">
              Superpowers for your social strategy
            </h2>
            <p className="text-lg text-slate-600">
              Agent.ai isn't just a scheduling tool. It's an intelligent partner
              that understands your goals and executes them with precision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BrainCircuit className="h-8 w-8 text-brand-600" />}
              title="Brand Memory"
              description="The AI learns your unique voice, tone, and style guidelines. It never sounds generic—it sounds like you." />
            
            <FeatureCard
              icon={<CalendarClock className="h-8 w-8 text-pink-600" />}
              title="Smart Scheduling"
              description="Automatically identifies the best times to post for your specific audience to maximize engagement." />
            
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-emerald-600" />}
              title="Predictive Analytics"
              description="Don't just see what happened. See what will happen. Forecast trends and adjust strategy in real-time." />
            
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-amber-600" />}
              title="Brand Safety"
              description="Built-in guardrails ensure no content goes out that violates your compliance or brand safety rules." />
            
            <FeatureCard
              icon={<Users className="h-8 w-8 text-sky-600" />}
              title="Collaborative Workflow"
              description="Seamless approval flows for teams. Comment, edit, and approve content in one unified inbox." />
            
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-brand-600" />}
              title="Multi-Channel Repurposing"
              description="Turn one blog post into a Twitter thread, LinkedIn article, and Instagram carousel instantly." />
            
          </div>
        </div>
      </section>

      {/* Interactive Demo Preview */}
      <section className="py-24 bg-brand-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Manage everything from one <br />
                <span className="text-peach">
                  intelligent command center
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Experience the power of a unified dashboard where goals turn
                into tasks, and tasks turn into results.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-brand-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-peach" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Goal-Oriented Planning
                    </h3>
                    <p className="text-slate-400">
                      Set high-level goals like "Increase Brand Awareness" and
                      let the AI break it down.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Cross-Platform Sync
                    </h3>
                    <p className="text-slate-400">
                      Coordinate campaigns across Twitter, LinkedIn, and
                      Instagram seamlessly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Real-time ROI Tracking
                    </h3>
                    <p className="text-slate-400">
                      Measure the actual business impact of your social media
                      efforts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Button
                  className="bg-brand-600 hover:bg-brand-500 text-white border-none"
                  size="lg"
                  onClick={onEnterApp}>
                  
                  Explore the Dashboard
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl blur-lg opacity-30" />
              <div className="relative rounded-xl overflow-hidden border border-brand-700 shadow-2xl bg-brand-800">
                <img
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  alt="Dashboard Preview"
                  className="w-full h-auto opacity-90" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-brand-800 bg-brand-500 flex items-center justify-center text-xs font-bold">
                        AI
                      </div>
                      <div className="h-8 w-8 rounded-full border-2 border-brand-800 bg-brand-700" />
                      <div className="h-8 w-8 rounded-full border-2 border-brand-800 bg-brand-700" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                      Agent + 2 team members active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brown mb-4">
              Loved by marketing teams
            </h2>
            <p className="text-slate-600">
              Join 10,000+ marketers who trust Agent.ai
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Agent.ai has completely transformed our workflow. It's like having a senior social media manager working 24/7."
              author="Sarah Jenkins"
              role="CMO at TechFlow"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
            
            <TestimonialCard
              quote="The brand voice consistency is incredible. I was skeptical that AI could sound like us, but it nailed it within a week."
              author="Michael Chen"
              role="Head of Growth at ScaleUp"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
            
            <TestimonialCard
              quote="We've seen a 3x increase in engagement since switching to Agent.ai. The predictive analytics are a game changer."
              author="Jessica Williams"
              role="Social Lead at CreativeCo"
              avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-brand-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-600 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to automate your growth?
              </h2>
              <p className="text-brand-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of brands using Agent.ai to scale their social
                presence without scaling their headcount.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg bg-white text-brand-600 hover:bg-brand-50 border-none w-full sm:w-auto"
                  onClick={onEnterApp}>
                  
                  Get Started for Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg border-brand-400 text-white hover:bg-brand-700 w-full sm:w-auto">
                  
                  Contact Sales
                </Button>
              </div>
              <p className="mt-6 text-sm text-brand-200">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Bot size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight text-brown">
                  Agent.ai
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs mb-6">
                The AI-powered social media management platform for modern
                marketing teams.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Twitter size={20} />} />
                <SocialIcon icon={<Linkedin size={20} />} />
                <SocialIcon icon={<Instagram size={20} />} />
                <SocialIcon icon={<Mail size={20} />} />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-brown mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-brown mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-brand-600">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-brown mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-600">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2026 Agent.ai Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>);

};
// Helper Components
const FeatureCard = ({
  icon,
  title,
  description




}: {icon: React.ReactNode;title: string;description: string;}) =>
<Card className="border-none shadow-none bg-cream hover:bg-white hover:shadow-xl transition-all duration-300 group">
    <CardContent className="p-8">
      <div className="mb-6 p-3 bg-white rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brown mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </CardContent>
  </Card>;

const TestimonialCard = ({
  quote,
  author,
  role,
  avatar





}: {quote: string;author: string;role: string;avatar: string;}) =>
<Card className="border border-slate-100 shadow-sm">
    <CardContent className="p-8">
      <div className="flex gap-1 text-amber-400 mb-4">
        {[...Array(5)].map((_, i) =>
      <Star key={i} size={16} fill="currentColor" />
      )}
      </div>
      <p className="text-slate-700 mb-6 text-lg italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <img
        src={avatar}
        alt={author}
        className="w-10 h-10 rounded-full object-cover" />
      
        <div>
          <p className="font-semibold text-brown text-sm">{author}</p>
          <p className="text-slate-500 text-xs">{role}</p>
        </div>
      </div>
    </CardContent>
  </Card>;

const SocialIcon = ({ icon }: {icon: React.ReactNode;}) =>
<a
  href="#"
  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-100 hover:text-brand-600 transition-colors">
  
    {icon}
  </a>;

// Placeholder Icons for Logos
const BoxIcon = () =>
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round">
  
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>;

const CircleIcon = () =>
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round">
  
    <circle cx="12" cy="12" r="10"></circle>
  </svg>;

const TriangleIcon = () =>
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round">
  
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
  </svg>;

const HexagonIcon = () =>
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round">
  
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
  </svg>;