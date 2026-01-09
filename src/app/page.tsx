'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Sparkles,
  ArrowRight,
  Cake,
  BellRing,
  Zap,
  Palette,
  Share2,
  Clock,
  HelpCircle,
  Timer,
  ImageIcon,
  Mail,
  PenTool,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden relative">
        {/* Background elements */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-32 -left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 right-20 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-pink-100 shadow-sm"
            >
              <Sparkles className="text-yellow-500 mr-2" size={16} />
              <span className="text-gray-700 text-sm font-medium">
                Expresse seu sentimento de forma especial
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
            >
              Compartilhe seu sentimento!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10"
            >
              Crie momentos inesquecíveis e expresse seus sentimentos mais profundos 
              com nossa encantadora coleção de cartões digitais e propostas especiais.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="rounded-full group"
                onClick={() => router.push(user ? '/create/love' : '/auth')}
              >
                Criar agora
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={() => router.push('/public-templates')}
              >
                Explorar modelos
              </Button>
            </motion.div>
          </div>

          {/* Card Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 max-w-4xl mx-auto relative"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 relative">
              <div className="absolute -right-4 -top-4 bg-gradient-to-br from-pink-400 to-purple-500 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform rotate-12 z-10">
                <Heart className="text-white" size={32} fill="white" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <CardPreview
                  title="Cartão de Amor"
                  color="bg-rose-50"
                  icon={<Heart className="text-rose-500" size={20} />}
                  onClick={() => router.push(user ? '/create/love' : '/auth')}
                />
                <CardPreview
                  title="Pedido de Namoro"
                  color="bg-violet-50"
                  icon={<BellRing className="text-violet-500" size={20} />}
                  onClick={() => router.push(user ? '/create/proposal' : '/auth')}
                  badge="Popular"
                />
                <CardPreview
                  title="Timeline do Amor"
                  color="bg-blue-50"
                  icon={<Clock className="text-blue-500" size={20} />}
                  onClick={() => router.push(user ? '/criar/timeline' : '/auth')}
                  badge="Novo"
                />
                <CardPreview
                  title="Quiz do Amor"
                  color="bg-amber-50"
                  icon={<HelpCircle className="text-amber-500" size={20} />}
                  onClick={() => router.push(user ? '/criar/quiz' : '/auth')}
                  badge="Novo"
                />
                <CardPreview
                  title="Contador"
                  color="bg-emerald-50"
                  icon={<Timer className="text-emerald-500" size={20} />}
                  onClick={() => router.push(user ? '/criar/contador' : '/auth')}
                  badge="Novo"
                />
                <CardPreview
                  title="Mural de Fotos"
                  color="bg-indigo-50"
                  icon={<ImageIcon className="text-indigo-500" size={20} />}
                  onClick={() => router.push(user ? '/criar/mural' : '/auth')}
                  badge="Novo"
                />
                <CardPreview
                  title="Envelope Virtual"
                  color="bg-red-50"
                  icon={<Mail className="text-red-500" size={20} />}
                  onClick={() => router.push(user ? '/criar/envelope' : '/auth')}
                  badge="Novo"
                />
                <CardPreview
                  title="Carta Manuscrita"
                  color="bg-stone-50"
                  icon={<PenTool className="text-stone-600" size={20} />}
                  onClick={() => router.push(user ? '/criar/carta' : '/auth')}
                  badge="Novo"
                />
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-pink-100 rounded-full border-4 border-white shadow-sm" />
            <div className="absolute -top-4 left-1/3 w-8 h-8 bg-indigo-100 rounded-full border-4 border-white shadow-sm" />
          </motion.div>
        </div>
      </section>

      {/* New Features Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">Novidades</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              8 formas de declarar seu amor
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Explore nossas novas funcionalidades e crie experiências únicas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Clock, title: 'Timeline', desc: 'Conte sua história' },
              { icon: HelpCircle, title: 'Quiz', desc: 'Teste o conhecimento' },
              { icon: Timer, title: 'Contador', desc: 'Tempo juntos' },
              { icon: ImageIcon, title: 'Mural', desc: 'Galeria de memórias' },
              { icon: Mail, title: 'Envelope', desc: 'Carta virtual' },
              { icon: PenTool, title: 'Manuscrita', desc: 'Escrita à mão' },
              { icon: Heart, title: 'Cartão', desc: 'Declaração clássica' },
              { icon: BellRing, title: 'Proposta', desc: 'Peça de namoro' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => router.push(user ? '/criar' : '/auth')}
              >
                <item.icon className="w-8 h-8 text-white mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                <p className="text-white/70 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Por que escolher o Te Declarei?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Oferecemos tudo que você precisa para criar declarações inesquecíveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="text-pink-500" size={32} />}
              title="Fácil de usar"
              description="Interface intuitiva que permite criar cartões incríveis em minutos, sem necessidade de habilidades técnicas."
            />
            <FeatureCard
              icon={<Palette className="text-purple-500" size={32} />}
              title="Totalmente personalizável"
              description="Personalize cores, textos, fotos e efeitos para criar algo verdadeiramente único e especial."
            />
            <FeatureCard
              icon={<Share2 className="text-indigo-500" size={32} />}
              title="Compartilhamento fácil"
              description="Compartilhe seus cartões com um link único ou exporte para enviar de diferentes formas."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Como funciona?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Três passos simples para criar sua declaração perfeita
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Escolha um modelo"
              description="Selecione entre nossos modelos de amor, aniversário ou propostas especiais."
            />
            <StepCard
              number="2"
              title="Personalize"
              description="Adicione suas fotos, textos e personalize as cores e efeitos."
            />
            <StepCard
              number="3"
              title="Compartilhe"
              description="Envie o link para sua pessoa especial e surpreenda!"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para criar sua declaração?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Junte-se a milhares de pessoas que já surpreenderam seus amores com o Te Declarei
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full bg-white text-purple-600 hover:bg-gray-100"
            onClick={() => router.push(user ? '/create/love' : '/auth')}
          >
            Começar agora — é grátis!
            <Heart className="ml-2" size={18} fill="currentColor" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CardPreview({
  title,
  color,
  icon,
  onClick,
  badge,
}: {
  title: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} p-3 md:p-4 rounded-lg border border-gray-100 flex flex-col items-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative group`}
    >
      {badge && (
        <span className={`absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
          badge === 'Novo' 
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {badge === 'Popular' && <Star className="inline w-2.5 h-2.5 mr-0.5 fill-amber-500" />}
          {badge}
        </span>
      )}
      <div className="mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-gray-800 font-medium text-xs md:text-sm text-center">{title}</h3>
    </button>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
