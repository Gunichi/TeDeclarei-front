'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Heart,
  Clock,
  HelpCircle,
  Timer,
  ImageIcon,
  Mail,
  PenTool,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuth } from '@/contexts/auth-context';

interface CreationType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  href: string;
  badge?: string;
  popular?: boolean;
}

const creationTypes: CreationType[] = [
  {
    id: 'card',
    title: 'Cartão Especial',
    description: 'Crie cartões para amor, aniversário, pedido de namoro, agradecimento e muito mais! Com textos, fotos, stickers, formas e efeitos especiais.',
    icon: <Heart className="w-8 h-8" />,
    color: 'text-rose-500',
    gradient: 'from-rose-400 to-pink-600',
    href: '/criar/cartao',
    popular: true,
    badge: 'Completo',
  },
  {
    id: 'timeline',
    title: 'Timeline do Amor',
    description: 'Conte a história do relacionamento com uma linha do tempo interativa e fotos.',
    icon: <Clock className="w-8 h-8" />,
    color: 'text-blue-500',
    gradient: 'from-blue-400 to-cyan-600',
    href: '/criar/timeline',
  },
  {
    id: 'quiz',
    title: 'Quiz do Amor',
    description: 'Crie um quiz divertido sobre vocês dois e descubra o quanto se conhecem!',
    icon: <HelpCircle className="w-8 h-8" />,
    color: 'text-amber-500',
    gradient: 'from-amber-400 to-orange-600',
    href: '/criar/quiz',
  },
  {
    id: 'counter',
    title: 'Contador de Amor',
    description: 'Um contador animado mostrando há quanto tempo vocês estão juntos.',
    icon: <Timer className="w-8 h-8" />,
    color: 'text-emerald-500',
    gradient: 'from-emerald-400 to-teal-600',
    href: '/criar/contador',
  },
  {
    id: 'mural',
    title: 'Mural de Fotos',
    description: 'Monte um mural interativo com as melhores fotos do casal e legendas.',
    icon: <ImageIcon className="w-8 h-8" />,
    color: 'text-indigo-500',
    gradient: 'from-indigo-400 to-blue-600',
    href: '/criar/mural',
  },
  {
    id: 'envelope',
    title: 'Envelope Virtual',
    description: 'Envie uma carta virtual com envelope animado que abre para revelar a mensagem.',
    icon: <Mail className="w-8 h-8" />,
    color: 'text-red-500',
    gradient: 'from-red-400 to-rose-600',
    href: '/criar/envelope',
  },
  {
    id: 'letter',
    title: 'Carta Manuscrita',
    description: 'Simule uma carta escrita à mão com efeito de escrita animada.',
    icon: <PenTool className="w-8 h-8" />,
    color: 'text-stone-600',
    gradient: 'from-stone-400 to-stone-600',
    href: '/criar/carta',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function CriarPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm border border-pink-100">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Escolha como quer surpreender
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                O que você quer criar?
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Escolha entre nossas opções de criação e surpreenda quem você ama 
              com algo único e especial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {creationTypes.map((type) => (
              <motion.div
                key={type.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredCard(type.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => router.push(type.href)}
                className="relative group cursor-pointer"
              >
                <div
                  className={`
                    relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg
                    border-2 transition-all duration-300
                    ${hoveredCard === type.id 
                      ? 'border-pink-300 shadow-xl scale-[1.02] -translate-y-1' 
                      : 'border-transparent hover:border-pink-100'
                    }
                  `}
                >
                  {/* Badge */}
                  {type.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {type.badge}
                      </span>
                    </div>
                  )}

                  {/* Popular Badge */}
                  {type.popular && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-amber-500" />
                      Popular
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`
                      w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient}
                      flex items-center justify-center text-white mb-4
                      group-hover:scale-110 transition-transform duration-300
                    `}
                  >
                    {type.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {type.description}
                  </p>

                  {/* Action */}
                  <div className={`
                    flex items-center text-sm font-medium ${type.color}
                    group-hover:gap-2 transition-all duration-300
                  `}>
                    <span>Criar agora</span>
                    <ArrowRight className={`
                      w-4 h-4 transition-all duration-300
                      ${hoveredCard === type.id ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2'}
                    `} />
                  </div>

                  {/* Background decoration */}
                  <div
                    className={`
                      absolute -bottom-20 -right-20 w-40 h-40 rounded-full
                      bg-gradient-to-br ${type.gradient} opacity-5
                      group-hover:opacity-10 transition-opacity duration-300
                    `}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              💡 Dicas para uma declaração perfeita
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-md"
            >
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold text-gray-800 mb-2">Seja autêntico</h3>
              <p className="text-gray-600 text-sm">
                Escreva com suas próprias palavras. As mensagens mais especiais vêm do coração.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md"
            >
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-semibold text-gray-800 mb-2">Use fotos especiais</h3>
              <p className="text-gray-600 text-sm">
                Escolha fotos que representem momentos importantes da relação de vocês.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md"
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Escolha o momento certo</h3>
              <p className="text-gray-600 text-sm">
                Envie em um momento especial para tornar a surpresa ainda mais memorável.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

