'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Save,
  ChevronLeft,
  Loader2,
  Eye,
  Sparkles,
  Heart,
  PenTool,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { templatesApi, uploadsApi, LetterData } from '@/lib/api';

const ENVELOPE_COLORS = [
  { name: 'Classic Red', value: '#dc2626', paper: '#fef2f2' },
  { name: 'Rose Pink', value: '#ec4899', paper: '#fdf2f8' },
  { name: 'Royal Purple', value: '#7c3aed', paper: '#f5f3ff' },
  { name: 'Ocean Blue', value: '#2563eb', paper: '#eff6ff' },
  { name: 'Emerald', value: '#059669', paper: '#ecfdf5' },
  { name: 'Golden', value: '#d97706', paper: '#fffbeb' },
  { name: 'Classic White', value: '#f8fafc', paper: '#ffffff' },
  { name: 'Midnight', value: '#1e293b', paper: '#f1f5f9' },
];

const SEAL_COLORS = [
  { name: 'Gold', value: '#fbbf24' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Purple', value: '#8b5cf6' },
];

const FONTS = [
  { name: 'Elegante', value: 'Georgia, serif' },
  { name: 'Manuscrita', value: '"Comic Sans MS", cursive' },
  { name: 'Clássica', value: '"Times New Roman", serif' },
  { name: 'Moderna', value: 'Arial, sans-serif' },
];

export default function EnvelopePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('Carta de Amor');
  const [letterData, setLetterData] = useState<LetterData>({
    to: 'Meu amor',
    from: 'Com todo meu coração',
    content: `Querido(a),

Cada dia ao seu lado é uma nova aventura, um novo motivo para sorrir. Você transforma os dias comuns em momentos extraordinários.

Obrigado(a) por ser você, por ser meu porto seguro, minha alegria diária.

Te amo mais do que as palavras podem expressar.

Para sempre seu(sua),`,
    signature: '❤️',
    sealColor: '#fbbf24',
  });
  const [envelopeColor, setEnvelopeColor] = useState(ENVELOPE_COLORS[0]);
  const [font, setFont] = useState(FONTS[0].value);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      setUploadingPhoto(true);
      const result = await uploadsApi.upload(token, file, 'templates');
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '');
      const imageUrl = `${baseUrl}${result.url}`;
      setLetterData({ ...letterData, photo: imageUrl });
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Load existing template for editing
  useEffect(() => {
    const loadTemplate = async () => {
      if (!token || !templateId) return;
      
      try {
        setLoadingTemplate(true);
        const template = await templatesApi.getById(token, templateId);
        if (template) {
          setTitle(template.title);
          const color = ENVELOPE_COLORS.find(c => c.value === template.backgroundColor);
          if (color) {
            setEnvelopeColor(color);
          }
          if (template.letterData) {
            setLetterData(template.letterData);
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

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);
      
      // Ensure letter data is properly formatted
      const formattedLetterData = {
        to: letterData.to,
        from: letterData.from,
        content: letterData.content,
        signature: letterData.signature,
        sealColor: letterData.sealColor,
      };

      console.log('Saving envelope data:', formattedLetterData);

      const data = {
        title,
        type: 'envelope' as const,
        backgroundColor: envelopeColor.value,
        letterData: formattedLetterData,
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
      alert('Erro ao salvar envelope');
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
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
                <Mail className="h-5 w-5 text-red-500" />
                <h1 className="text-lg font-bold text-gray-900">Envelope Virtual</h1>
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
          <EnvelopePreview
            letterData={letterData}
            envelopeColor={envelopeColor}
            font={font}
          />
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Letter Content */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-pink-500" />
                  Conteúdo da Carta
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Título</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Carta de Amor"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Para</label>
                    <Input
                      value={letterData.to}
                      onChange={(e) => setLetterData({ ...letterData, to: e.target.value })}
                      placeholder="Meu amor"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Mensagem</label>
                    <textarea
                      value={letterData.content}
                      onChange={(e) => setLetterData({ ...letterData, content: e.target.value })}
                      className="w-full p-4 border rounded-lg min-h-[250px] focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                      style={{ fontFamily: font }}
                      placeholder="Escreva sua carta de amor aqui..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">De</label>
                      <Input
                        value={letterData.from}
                        onChange={(e) => setLetterData({ ...letterData, from: e.target.value })}
                        placeholder="Com amor"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Assinatura</label>
                      <Input
                        value={letterData.signature || ''}
                        onChange={(e) => setLetterData({ ...letterData, signature: e.target.value })}
                        placeholder="Seu nome ou emoji"
                      />
                    </div>
                  </div>

                  {/* Photo Section */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-pink-500" />
                      Foto (opcional)
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {letterData.photo ? (
                      <div className="relative group">
                        <img
                          src={letterData.photo}
                          alt="Foto da carta"
                          className="w-full h-48 object-cover rounded-lg border-2 border-pink-200"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/90"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPhoto}
                          >
                            {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                            Trocar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setLetterData({ ...letterData, photo: undefined })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="w-full h-32 border-2 border-dashed border-pink-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-pink-500 hover:bg-pink-50 transition-colors"
                      >
                        {uploadingPhoto ? (
                          <Loader2 className="h-8 w-8 text-pink-400 animate-spin" />
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 text-pink-400" />
                            <span className="text-sm text-gray-500">Clique para adicionar uma foto</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Aparência
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Cor do Envelope</label>
                    <div className="grid grid-cols-4 gap-2">
                      {ENVELOPE_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setEnvelopeColor(color)}
                          className={`h-12 rounded-lg transition-all ${
                            envelopeColor.value === color.value
                              ? 'ring-2 ring-offset-2 ring-pink-500 scale-105'
                              : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Cor do Selo</label>
                    <div className="flex gap-2">
                      {SEAL_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setLetterData({ ...letterData, sealColor: color.value })}
                          className={`w-10 h-10 rounded-full transition-all ${
                            letterData.sealColor === color.value
                              ? 'ring-2 ring-offset-2 ring-pink-500 scale-110'
                              : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Fonte</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FONTS.map((f) => (
                        <button
                          key={f.name}
                          onClick={() => setFont(f.value)}
                          className={`px-4 py-3 rounded-lg text-sm transition-all ${
                            font === f.value
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={{ fontFamily: f.value }}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Preview */}
              <div className="bg-gray-100 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-500 mb-4">Preview do Envelope</p>
                <div
                  className="w-48 h-32 mx-auto rounded-lg shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: envelopeColor.value }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: letterData.sealColor }}
                  >
                    <Heart className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EnvelopePreview({
  letterData,
  envelopeColor,
  font,
}: {
  letterData: LetterData;
  envelopeColor: { value: string; paper: string };
  font: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setShowLetter(true), 600);
    }
  };

  const handleReset = () => {
    setShowLetter(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div className="min-h-[700px] flex items-center justify-center perspective-1000">
      <AnimatePresence mode="wait">
        {!showLetter ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, y: -100 }}
            className="relative cursor-pointer"
            onClick={handleClick}
          >
            {/* Envelope Body */}
            <div
              className="relative w-80 h-52 md:w-96 md:h-64 rounded-lg shadow-2xl"
              style={{ backgroundColor: envelopeColor.value }}
            >
              {/* Inner Shadow/Fold */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)`,
                }}
              />

              {/* Envelope Flap */}
              <motion.div
                className="absolute -top-0 left-0 right-0 origin-bottom"
                animate={{
                  rotateX: isOpen ? 180 : 0,
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: 1000,
                }}
              >
                <svg
                  viewBox="0 0 384 128"
                  className="w-full"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                >
                  <path
                    d="M0 128 L192 0 L384 128 L0 128"
                    fill={envelopeColor.value}
                  />
                  <path
                    d="M0 128 L192 0 L384 128 L0 128"
                    fill="rgba(0,0,0,0.05)"
                  />
                </svg>
              </motion.div>

              {/* Seal */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                animate={{
                  scale: isOpen ? 0 : 1,
                  opacity: isOpen ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: letterData.sealColor }}
                >
                  <Heart className="h-8 w-8 text-white fill-white" />
                </div>
              </motion.div>

              {/* Decorative Lines */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="h-1 bg-white/20 rounded mb-2" style={{ width: '60%' }} />
                <div className="h-1 bg-white/20 rounded mb-2" style={{ width: '80%' }} />
                <div className="h-1 bg-white/20 rounded" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Click instruction */}
            {!isOpen && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-6 text-gray-500"
              >
                <Sparkles className="inline h-4 w-4 mr-1" />
                Clique para abrir
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-2xl"
          >
            {/* Letter Paper */}
            <div
              className="rounded-lg shadow-2xl p-8 md:p-12 relative overflow-hidden"
              style={{
                backgroundColor: envelopeColor.paper,
                fontFamily: font,
              }}
            >
              {/* Decorative corner */}
              <div
                className="absolute top-0 right-0 w-24 h-24"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${envelopeColor.value}20 50%)`,
                }}
              />

              {/* To */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xl md:text-2xl text-gray-700 mb-6">
                  {letterData.to},
                </p>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {letterData.content}
                </p>
              </motion.div>

              {/* Photo */}
              {letterData.photo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="relative">
                    <img
                      src={letterData.photo}
                      alt="Foto da carta"
                      className="max-w-xs md:max-w-sm rounded-lg shadow-lg transform rotate-1"
                      style={{ border: `4px solid ${envelopeColor.value}20` }}
                    />
                    <div 
                      className="absolute -top-2 -left-2 w-6 h-6 rounded-full shadow"
                      style={{ backgroundColor: envelopeColor.value }}
                    />
                    <div 
                      className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full shadow"
                      style={{ backgroundColor: envelopeColor.value }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Signature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-right"
              >
                <p className="text-gray-600 italic">{letterData.from}</p>
                <p className="text-3xl mt-2">{letterData.signature}</p>
              </motion.div>

              {/* Hearts decoration */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-4 left-4 flex gap-1"
              >
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className="h-4 w-4"
                    style={{ color: envelopeColor.value, fill: envelopeColor.value }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Close button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6"
            >
              <Button variant="outline" onClick={handleReset}>
                <Mail className="h-4 w-4 mr-2" />
                Fechar carta
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts */}
      {showLetter && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                scale: Math.random() * 0.5 + 0.5,
                rotate: Math.random() * 360,
              }}
              animate={{
                y: -100,
                rotate: Math.random() * 360 + 360,
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Heart
                className="h-6 w-6"
                style={{
                  color: i % 2 === 0 ? envelopeColor.value : letterData.sealColor,
                  fill: i % 2 === 0 ? envelopeColor.value : letterData.sealColor,
                  opacity: 0.6,
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

