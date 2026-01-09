'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Timer,
  Save,
  ChevronLeft,
  Loader2,
  Image as ImageIcon,
  Eye,
  Sparkles,
  Heart,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { templatesApi, uploadsApi, CounterData } from '@/lib/api';

const GRADIENT_BACKGROUNDS = [
  { name: 'Love', value: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)' },
  { name: 'Romance', value: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' },
  { name: 'Purple', value: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Night', value: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)' },
];

const HEART_ANIMATIONS = [
  { name: 'Pulse', value: 'pulse' },
  { name: 'Float', value: 'float' },
  { name: 'Bounce', value: 'bounce' },
];

export default function ContadorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('Nosso Amor');
  const [counterData, setCounterData] = useState<CounterData>({
    startDate: new Date().toISOString().split('T')[0],
    coupleNames: ['Você', 'Eu'],
    message: 'Cada segundo ao seu lado é um presente 💕',
  });
  const [background, setBackground] = useState(GRADIENT_BACKGROUNDS[0].value);
  const [heartAnimation, setHeartAnimation] = useState('pulse');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Load existing template for editing
  useEffect(() => {
    const loadTemplate = async () => {
      if (!token || !templateId) return;
      
      try {
        setLoadingTemplate(true);
        const template = await templatesApi.getById(token, templateId);
        if (template) {
          setTitle(template.title);
          setBackground(template.backgroundColor || GRADIENT_BACKGROUNDS[0].value);
          if (template.counterData) {
            setCounterData(template.counterData);
          }
        }
      } catch (err) {
        console.error('Error loading template:', err);
      } finally {
        setLoadingTemplate(false);
      }
    };

    loadTemplate();
  }, [token, templateId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      const result = await uploadsApi.upload(token, file, 'templates');
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '');
      const imageUrl = `${baseUrl}${result.url}`;
      setCounterData({ ...counterData, photo: imageUrl });
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem');
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);
      
      // Ensure counter data is properly formatted
      const formattedCounterData = {
        startDate: counterData.startDate,
        coupleNames: [counterData.coupleNames[0], counterData.coupleNames[1]] as [string, string],
        message: counterData.message,
        photo: counterData.photo,
      };

      console.log('Saving counter data:', formattedCounterData);

      const data = {
        title,
        type: 'counter' as const,
        backgroundColor: background,
        counterData: formattedCounterData,
        showParticles: true,
        particleType: 'hearts' as const,
      };

      if (templateId) {
        await templatesApi.update(token, templateId, data);
      } else {
        await templatesApi.create(token, data);
      }
      router.push('/templates');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar contador');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingTemplate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Fixed Header with Save Button */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md border-b z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-emerald-500" />
                <h1 className="text-lg font-bold text-gray-900">Contador de Amor</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Editar' : 'Preview'}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <div className="container mx-auto px-4 py-8">
        {showPreview ? (
          <CounterPreview
            title={title}
            counterData={counterData}
            background={background}
            heartAnimation={heartAnimation}
          />
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Settings Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Informações do Casal
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Título</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nosso Amor"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Nome 1</label>
                      <Input
                        value={counterData.coupleNames[0]}
                        onChange={(e) =>
                          setCounterData({
                            ...counterData,
                            coupleNames: [e.target.value, counterData.coupleNames[1]],
                          })
                        }
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Nome 2</label>
                      <Input
                        value={counterData.coupleNames[1]}
                        onChange={(e) =>
                          setCounterData({
                            ...counterData,
                            coupleNames: [counterData.coupleNames[0], e.target.value],
                          })
                        }
                        placeholder="Nome do amor"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Data do início
                    </label>
                    <Input
                      type="date"
                      value={counterData.startDate}
                      onChange={(e) =>
                        setCounterData({ ...counterData, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Mensagem especial</label>
                    <textarea
                      value={counterData.message || ''}
                      onChange={(e) =>
                        setCounterData({ ...counterData, message: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg min-h-[80px] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Uma mensagem especial para seu amor..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Foto do casal</label>
                    {counterData.photo ? (
                      <div className="relative inline-block">
                        <img
                          src={counterData.photo}
                          alt=""
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <button
                          onClick={() => setCounterData({ ...counterData, photo: undefined })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Adicionar foto
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Aparência
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Cor de fundo</label>
                    <div className="grid grid-cols-3 gap-2">
                      {GRADIENT_BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.name}
                          onClick={() => setBackground(bg.value)}
                          className={`h-16 rounded-lg transition-all ${
                            background === bg.value ? 'ring-2 ring-offset-2 ring-emerald-500 scale-105' : ''
                          }`}
                          style={{ background: bg.value }}
                          title={bg.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Animação do coração</label>
                    <div className="flex gap-2">
                      {HEART_ANIMATIONS.map((anim) => (
                        <button
                          key={anim.value}
                          onClick={() => setHeartAnimation(anim.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            heartAnimation === anim.value
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {anim.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Preview */}
              <div
                className="rounded-2xl p-6 shadow-lg"
                style={{ background }}
              >
                <div className="text-center text-white">
                  <p className="text-sm opacity-80">Preview</p>
                  <h3 className="text-xl font-bold mt-2">{title}</h3>
                  <p className="text-sm mt-1">
                    {counterData.coupleNames[0]} ❤️ {counterData.coupleNames[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

function CounterPreview({
  title,
  counterData,
  background,
  heartAnimation,
}: {
  title: string;
  counterData: CounterData;
  background: string;
  heartAnimation: string;
}) {
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(counterData.startDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44);
      const years = Math.floor(months / 12);

      setTimeElapsed({
        years,
        months: months % 12,
        days: Math.floor(days % 30.44),
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [counterData.startDate]);

  const heartClass = {
    pulse: 'animate-pulse',
    float: 'animate-bounce',
    bounce: 'animate-ping',
  }[heartAnimation];

  return (
    <div
      className="min-h-[700px] rounded-2xl overflow-hidden shadow-2xl p-8 flex items-center justify-center relative"
      style={{ background }}
    >
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20"
            initial={{
              x: Math.random() * 100 + '%',
              y: '100%',
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: '-100%',
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          >
            <Heart className="h-8 w-8 fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Photo */}
        {counterData.photo && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <img
                src={counterData.photo}
                alt=""
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2">
                <Heart className={`h-10 w-10 text-red-500 fill-red-500 ${heartClass}`} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl text-white/90 mt-2">
            {counterData.coupleNames[0]} <Heart className="inline h-5 w-5 text-red-400 fill-red-400 mx-1" /> {counterData.coupleNames[1]}
          </p>
        </motion.div>

        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-6"
        >
          <p className="text-white/80 text-sm mb-4 uppercase tracking-wider">Juntos há</p>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { value: timeElapsed.years, label: 'Anos' },
              { value: timeElapsed.months, label: 'Meses' },
              { value: timeElapsed.days, label: 'Dias' },
              { value: timeElapsed.hours, label: 'Horas' },
              { value: timeElapsed.minutes, label: 'Min' },
              { value: timeElapsed.seconds, label: 'Seg' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="bg-white/30 rounded-xl p-3">
                  <span className="text-3xl md:text-4xl font-bold text-white block">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs text-white/80 mt-1 block uppercase tracking-wider">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Message */}
        {counterData.message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-white/90 italic max-w-md mx-auto"
          >
            "{counterData.message}"
          </motion.p>
        )}

        {/* Start Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/60 text-sm mt-6"
        >
          Desde {new Date(counterData.startDate).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </motion.p>
      </div>
    </div>
  );
}

