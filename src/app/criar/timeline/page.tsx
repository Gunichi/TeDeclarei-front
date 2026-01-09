'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  Loader2,
  Image as ImageIcon,
  Calendar,
  Heart,
  Sparkles,
  Eye,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { templatesApi, uploadsApi, TimelineEvent } from '@/lib/api';

const EMOJI_OPTIONS = ['💕', '❤️', '💍', '🎉', '🌹', '✨', '🎂', '🏠', '✈️', '🎓', '💒', '👶', '🐶', '🎸', '📸'];

const GRADIENT_BACKGROUNDS = [
  { name: 'Romance', value: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Purple', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { name: 'Golden', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { name: 'Night', value: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)' },
];

function TimelinePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const [title, setTitle] = useState('Nossa História de Amor');
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      title: 'Primeiro encontro',
      description: 'O dia em que tudo começou...',
      emoji: '💕',
    },
  ]);
  const [background, setBackground] = useState(GRADIENT_BACKGROUNDS[0].value);
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
          if (template.timelineEvents && template.timelineEvents.length > 0) {
            setEvents(template.timelineEvents);
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

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: 'Novo momento',
      description: 'Descreva esse momento especial...',
      emoji: '❤️',
    };
    setEvents([...events, newEvent]);
    setActiveEventId(newEvent.id);
  };

  const updateEvent = (id: string, updates: Partial<TimelineEvent>) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEvent = (id: string) => {
    if (events.length <= 1) return;
    setEvents(events.filter((e) => e.id !== id));
    if (activeEventId === id) {
      setActiveEventId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, eventId: string) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      const result = await uploadsApi.upload(token, file, 'templates');
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '');
      const imageUrl = `${baseUrl}${result.url}`;
      updateEvent(eventId, { image: imageUrl });
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem');
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);
      
      // Ensure events are properly formatted
      const sortedEvents = [...events]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(event => ({
          id: event.id,
          date: event.date,
          title: event.title,
          description: event.description,
          emoji: event.emoji,
          image: event.image,
        }));

      console.log('Saving timeline events:', sortedEvents);

      const data = {
        title,
        type: 'timeline' as const,
        backgroundColor: background,
        timelineEvents: sortedEvents,
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
      alert('Erro ao salvar timeline');
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
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
                <Clock className="h-5 w-5 text-blue-500" />
                <h1 className="text-lg font-bold text-gray-900">Timeline do Amor</h1>
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
          /* Preview Mode */
          <TimelinePreview title={title} events={events} background={background} />
        ) : (
          /* Edit Mode */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Settings Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Configurações
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Título da Timeline</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nossa História de Amor"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Cor de Fundo</label>
                    <div className="grid grid-cols-3 gap-2">
                      {GRADIENT_BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.name}
                          onClick={() => setBackground(bg.value)}
                          className={`h-12 rounded-lg transition-all ${
                            background === bg.value ? 'ring-2 ring-offset-2 ring-pink-500 scale-105' : ''
                          }`}
                          style={{ background: bg.value }}
                          title={bg.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={addEvent} className="w-full" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Momento
              </Button>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                        activeEventId === event.id ? 'ring-2 ring-pink-500' : ''
                      }`}
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setActiveEventId(activeEventId === event.id ? null : event.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-gray-400">
                            <GripVertical className="h-5 w-5" />
                            <span className="text-2xl">{event.emoji}</span>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {new Date(event.date).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800">{event.title}</h3>
                          </div>
                          {event.image && (
                            <img src={event.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                          )}
                        </div>
                      </div>

                      {activeEventId === event.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t bg-gray-50 p-4 space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Data</label>
                              <Input
                                type="date"
                                value={event.date}
                                onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Título</label>
                              <Input
                                value={event.title}
                                onChange={(e) => updateEvent(event.id, { title: e.target.value })}
                                placeholder="Ex: Primeiro beijo"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Descrição</label>
                            <textarea
                              value={event.description}
                              onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                              className="w-full p-3 border rounded-lg min-h-[80px] focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                              placeholder="Conte mais sobre esse momento especial..."
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Emoji</label>
                            <div className="flex flex-wrap gap-2">
                              {EMOJI_OPTIONS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => updateEvent(event.id, { emoji })}
                                  className={`text-2xl p-2 rounded-lg transition-all ${
                                    event.emoji === emoji
                                      ? 'bg-pink-100 scale-110'
                                      : 'hover:bg-gray-100'
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Foto</label>
                            {event.image ? (
                              <div className="relative inline-block">
                                <img
                                  src={event.image}
                                  alt=""
                                  className="w-32 h-32 rounded-lg object-cover"
                                />
                                <button
                                  onClick={() => updateEvent(event.id, { image: undefined })}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setActiveEventId(event.id);
                                  fileInputRef.current?.click();
                                }}
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Adicionar foto
                              </Button>
                            )}
                          </div>

                          <div className="flex justify-end pt-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteEvent(event.id)}
                              disabled={events.length <= 1}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => activeEventId && handleImageUpload(e, activeEventId)}
        className="hidden"
      />
    </div>
  );
}

function TimelinePreview({
  title,
  events,
  background,
}: {
  title: string;
  events: TimelineEvent[];
  background: string;
}) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div
      className="min-h-[600px] rounded-2xl overflow-hidden shadow-2xl p-8"
      style={{ background }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white text-center mb-12 drop-shadow-lg"
      >
        {title}
      </motion.h1>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-white/30 rounded-full" />

        {sortedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`relative flex items-center mb-12 ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            {/* Content */}
            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <span className="text-3xl mb-2 block">{event.emoji}</span>
                <span className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-1">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{event.description}</p>
                {event.image && (
                  <img
                    src={event.image}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg mt-3"
                  />
                )}
              </div>
            </div>

            {/* Center Dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
              </div>
            </div>

            {/* Spacer */}
            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-pink-500" /></div>}>
      <TimelinePageContent />
    </Suspense>
  );
}

