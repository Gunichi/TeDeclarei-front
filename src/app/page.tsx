'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  ChevronRight,
  Clock,
  Heart,
  HelpCircle,
  ImageIcon,
  Mail,
  MousePointer2,
  Palette,
  PenTool,
  Play,
  Share2,
  Star,
  Timer,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Pre-calculated heart positions for consistent rendering
const HEART_CONFIGS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: (i * 73) % 100,
  scale: 0.5 + (i % 5) * 0.1,
  rotate: (i * 37) % 360,
  duration: 18 + (i % 8),
  delay: i * 0.8,
  size: 12 + (i % 16),
}));

// Floating hearts animation component
function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {HEART_CONFIGS.map((config) => (
        <motion.div
          key={config.id}
          className="absolute"
          style={{ left: `${config.x}%` }}
          initial={{
            y: '100vh',
            opacity: 0,
            scale: config.scale,
          }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.4, 0.4, 0],
            rotate: config.rotate,
          }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            delay: config.delay,
            ease: 'linear',
          }}
        >
          <Heart
            className="text-pink-400/50"
            size={config.size}
            fill="currentColor"
          />
        </motion.div>
      ))}
    </div>
  );
}

// Gradient orbs background - lighter version
function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-pink-200/60 to-rose-200/60 rounded-full blur-[100px]" />
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-gradient-to-l from-violet-200/50 to-purple-200/50 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-t from-fuchsia-200/40 to-pink-100/40 rounded-full blur-[80px]" />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeCard, setActiveCard] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const cardTypes = [
    { icon: Heart, title: 'Cartão de Amor', color: 'from-rose-500 to-pink-600', bgLight: 'bg-rose-50', route: '/create/love', emoji: '💕' },
    { icon: BellRing, title: 'Pedido Especial', color: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50', route: '/create/proposal', emoji: '💍', badge: 'Popular' },
    { icon: Clock, title: 'Timeline do Amor', color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', route: '/criar/timeline', emoji: '📖', badge: 'Novo' },
    { icon: HelpCircle, title: 'Quiz do Amor', color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', route: '/criar/quiz', emoji: '🎯', badge: 'Novo' },
    { icon: Timer, title: 'Contador', color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', route: '/criar/contador', emoji: '⏰', badge: 'Novo' },
    { icon: ImageIcon, title: 'Mural de Fotos', color: 'from-indigo-500 to-blue-600', bgLight: 'bg-indigo-50', route: '/criar/mural', emoji: '📸', badge: 'Novo' },
    { icon: Mail, title: 'Envelope Virtual', color: 'from-red-500 to-rose-600', bgLight: 'bg-red-50', route: '/criar/envelope', emoji: '💌', badge: 'Novo' },
    { icon: PenTool, title: 'Carta Manuscrita', color: 'from-stone-500 to-zinc-600', bgLight: 'bg-stone-50', route: '/criar/carta', emoji: '✍️', badge: 'Novo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/50 via-white to-violet-50/30 text-gray-900 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen relative flex items-center justify-center pt-20"
      >
        <GradientOrbs />
        <FloatingHearts />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-pink-100 shadow-sm rounded-full px-5 py-2.5 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span className="text-gray-600 text-sm font-medium tracking-wide">
                +10.000 declarações enviadas
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tight"
            >
              <span className="block text-gray-800">Declare seu</span>
              <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">
                amor
              </span>
              <span className="block text-gray-600 text-4xl sm:text-5xl md:text-6xl mt-2 font-bold">
                de forma inesquecível
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Crie experiências digitais mágicas para surpreender quem você ama. 
              Cartões interativos, timelines, quizzes e muito mais.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500 text-white hover:shadow-[0_20px_40px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-1"
                onClick={() => router.push(user ? '/criar' : '/auth')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Criar agora — grátis
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg font-medium text-gray-700 hover:text-gray-900 border-gray-200 hover:border-pink-200 hover:bg-pink-50/50"
                onClick={() => router.push('/public-templates')}
              >
                <Play className="mr-2" size={18} />
                Ver exemplos
              </Button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-gray-400"
              >
                <MousePointer2 size={20} />
                <span className="text-xs tracking-widest uppercase">Scroll</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Cards Showcase Section */}
      <section className="py-24 md:py-32 relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 via-transparent to-violet-50/30" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-pink-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
              Experiências Únicas
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
              8 formas de{' '}
              <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                emocionar
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Escolha a experiência perfeita para expressar seus sentimentos
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {cardTypes.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => router.push(user ? card.route : '/auth')}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer p-6 md:p-8 border shadow-sm hover:shadow-xl
                  ${activeCard === index 
                    ? 'bg-gradient-to-br ' + card.color + ' border-transparent text-white shadow-lg' 
                    : card.bgLight + ' border-gray-100 hover:border-pink-200'}
                  transition-all duration-500`}
              >
                {card.badge && (
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full
                    ${card.badge === 'Novo' 
                      ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' 
                      : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {card.badge === 'Popular' && <Star className="inline w-2.5 h-2.5 mr-0.5 -mt-0.5" fill="currentColor" />}
                    {card.badge}
                  </span>
                )}
                
                <div className="text-4xl md:text-5xl mb-4">{card.emoji}</div>
                
                <h3 className={`font-bold text-base md:text-lg mb-1 transition-colors
                  ${activeCard === index ? 'text-white' : 'text-gray-800 group-hover:text-gray-900'}`}
                >
                  {card.title}
                </h3>
                
                <div className={`flex items-center gap-1 text-sm transition-all
                  ${activeCard === index ? 'text-white/80' : 'text-gray-400 group-hover:text-pink-500'}`}
                >
                  <span>Criar</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-violet-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
                Por que Te Declarei?
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-800">
                A forma mais{' '}
                <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                  criativa
                </span>
                <br />de expressar amor
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Nosso editor intuitivo permite que você crie experiências digitais 
                impressionantes em minutos, sem precisar de nenhuma habilidade técnica.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Zap, title: 'Criação instantânea', desc: 'Pronto em menos de 5 minutos', color: 'text-amber-500', bg: 'bg-amber-50' },
                  { icon: Palette, title: 'Totalmente personalizável', desc: 'Cores, fontes, fotos e muito mais', color: 'text-pink-500', bg: 'bg-pink-50' },
                  { icon: Share2, title: 'Compartilhe facilmente', desc: 'Um link único para surpreender', color: 'text-violet-500', bg: 'bg-violet-50' },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className={`shrink-0 w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={feature.color} size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                      <p className="text-gray-500 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border-2 border-pink-100" />
                <div className="absolute inset-8 rounded-full border-2 border-rose-100" />
                <div className="absolute inset-16 rounded-full border-2 border-violet-100" />
                
                {/* Center content */}
                <div className="absolute inset-24 rounded-full bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center shadow-xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Heart className="text-pink-500" size={60} fill="currentColor" />
                  </motion.div>
                </div>

                {/* Floating elements */}
                {[
                  { emoji: '💕', top: '10%', left: '20%', delay: 0 },
                  { emoji: '💌', top: '20%', right: '15%', delay: 0.5 },
                  { emoji: '✨', bottom: '25%', left: '10%', delay: 1 },
                  { emoji: '🌹', bottom: '15%', right: '20%', delay: 1.5 },
                  { emoji: '💍', top: '50%', left: '5%', delay: 2 },
                  { emoji: '🎯', top: '40%', right: '5%', delay: 2.5 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl md:text-3xl drop-shadow-sm"
                    style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: item.delay }}
                  >
                    {item.emoji}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 md:py-32 relative bg-gradient-to-b from-white via-rose-50/30 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-rose-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
              Simples e Rápido
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800">
              3 passos para{' '}
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                emocionar
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { number: '01', title: 'Escolha', desc: 'Selecione o tipo de declaração perfeita para o momento', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
              { number: '02', title: 'Personalize', desc: 'Adicione fotos, textos e deixe do seu jeito único', icon: Palette, color: 'text-violet-500', bg: 'bg-violet-50' },
              { number: '03', title: 'Envie', desc: 'Compartilhe o link e surpreenda quem você ama', icon: Share2, color: 'text-pink-500', bg: 'bg-pink-50' },
            ].map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                {/* Connecting line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-pink-200 to-transparent" />
                )}
                
                <div className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-pink-100 transition-all duration-300">
                  <span className="text-6xl font-black bg-gradient-to-br from-gray-200 to-gray-100 bg-clip-text text-transparent">
                    {step.number}
                  </span>
                  
                  <div className={`mt-6 mb-4 w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center border border-gray-100`}>
                    <step.icon className={step.color} size={24} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 md:px-6 relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="inline-block mb-8"
          >
            <span className="text-7xl drop-shadow-lg">💝</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto leading-tight text-white">
            Pronto para criar algo{' '}
            <span className="text-white/90 underline decoration-white/30 underline-offset-8">
              inesquecível
            </span>
            ?
          </h2>
          
          <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Junte-se a milhares de pessoas que já emocionaram seus amores
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="group relative overflow-hidden rounded-full px-10 py-7 text-xl font-bold bg-white text-pink-600 hover:bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
              onClick={() => router.push(user ? '/criar' : '/auth')}
            >
              <span className="relative z-10 flex items-center gap-3">
                Começar agora
                <Heart className="group-hover:scale-110 transition-transform" size={24} fill="currentColor" />
              </span>
            </Button>
          </motion.div>

          <p className="mt-6 text-white/60 text-sm">
            100% gratuito • Sem cartão de crédito
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
