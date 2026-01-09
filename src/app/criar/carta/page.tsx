'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PenTool,
  Save,
  ChevronLeft,
  Loader2,
  Eye,
  Sparkles,
  Heart,
  Type,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { templatesApi, uploadsApi, LetterData } from '@/lib/api';

const PAPER_STYLES = [
  { name: 'Cream', value: '#fefcf6', lines: '#e8dcc8' },
  { name: 'White', value: '#ffffff', lines: '#e5e7eb' },
  { name: 'Pink', value: '#fdf2f8', lines: '#f9a8d4' },
  { name: 'Blue', value: '#eff6ff', lines: '#93c5fd' },
  { name: 'Yellow', value: '#fefce8', lines: '#fde047' },
  { name: 'Vintage', value: '#f5f0e6', lines: '#c9b99a' },
];

const INK_COLORS = [
  { name: 'Black', value: '#1f2937' },
  { name: 'Blue', value: '#1d4ed8' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Brown', value: '#78350f' },
  { name: 'Green', value: '#166534' },
];

const HANDWRITING_FONTS = [
  { name: 'Dancing Script', value: '"Comic Sans MS", cursive' },
  { name: 'Elegant', value: 'Georgia, serif' },
  { name: 'Classic', value: '"Times New Roman", serif' },
  { name: 'Casual', value: '"Segoe UI", sans-serif' },
];

function CartaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('Minha Carta de Amor');
  const [letterData, setLetterData] = useState<LetterData>({
    to: 'Para o amor da minha vida',
    from: 'Com todo meu amor',
    content: `Meu amor,

Enquanto escrevo estas palavras, meu coração transborda de sentimentos que nem sei expressar completamente.

Você chegou na minha vida como uma brisa suave de primavera e transformou tudo ao meu redor. Cada momento ao seu lado é um presente, cada sorriso seu ilumina meu dia.

Obrigado(a) por existir, por me escolher, por ser minha pessoa favorita no mundo inteiro.

Te amo infinitamente.`,
    signature: 'Seu(sua) para sempre ❤️',
  });
  const [paperStyle, setPaperStyle] = useState(PAPER_STYLES[0]);
  const [inkColor, setInkColor] = useState(INK_COLORS[0].value);
  const [font, setFont] = useState(HANDWRITING_FONTS[0].value);
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
          const style = PAPER_STYLES.find(s => s.value === template.backgroundColor);
          if (style) {
            setPaperStyle(style);
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
      };

      console.log('Saving letter data:', formattedLetterData);

      const data = {
        title,
        type: 'letter' as const,
        backgroundColor: paperStyle.value,
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
      alert('Erro ao salvar carta');
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
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50">
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
                <PenTool className="h-5 w-5 text-stone-600" />
                <h1 className="text-lg font-bold text-gray-900">Carta Manuscrita</h1>
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
          <LetterPreview
            letterData={letterData}
            paperStyle={paperStyle}
            inkColor={inkColor}
            font={font}
          />
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Letter Content */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-stone-600" />
                  Escreva sua Carta
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Título</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Minha Carta de Amor"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Para</label>
                    <Input
                      value={letterData.to}
                      onChange={(e) => setLetterData({ ...letterData, to: e.target.value })}
                      placeholder="Para quem é essa carta?"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Conteúdo</label>
                    <textarea
                      value={letterData.content}
                      onChange={(e) => setLetterData({ ...letterData, content: e.target.value })}
                      className="w-full p-4 border rounded-lg min-h-[300px] focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none resize-none"
                      style={{ fontFamily: font, color: inkColor }}
                      placeholder="Escreva sua carta aqui..."
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
                        placeholder="Sua assinatura"
                      />
                    </div>
                  </div>

                  {/* Photo Section */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-stone-600" />
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
                          className="w-full h-48 object-cover rounded-lg border-4 border-stone-200"
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
                        className="w-full h-32 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-stone-500 hover:bg-stone-50 transition-colors"
                      >
                        {uploadingPhoto ? (
                          <Loader2 className="h-8 w-8 text-stone-400 animate-spin" />
                        ) : (
                          <>
                            <ImageIcon className="h-8 w-8 text-stone-400" />
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
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Estilo do Papel</label>
                    <div className="grid grid-cols-3 gap-2">
                      {PAPER_STYLES.map((style) => (
                        <button
                          key={style.name}
                          onClick={() => setPaperStyle(style)}
                          className={`h-16 rounded-lg transition-all relative overflow-hidden ${
                            paperStyle.value === style.value
                              ? 'ring-2 ring-offset-2 ring-stone-500 scale-105'
                              : ''
                          }`}
                          style={{ backgroundColor: style.value }}
                          title={style.name}
                        >
                          {/* Lines */}
                          <div className="absolute inset-0 flex flex-col justify-center px-2">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className="h-px mb-2"
                                style={{ backgroundColor: style.lines }}
                              />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Cor da Tinta
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INK_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setInkColor(color.value)}
                          className={`w-10 h-10 rounded-full transition-all ${
                            inkColor === color.value
                              ? 'ring-2 ring-offset-2 ring-stone-500 scale-110'
                              : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Estilo da Letra</label>
                    <div className="grid grid-cols-2 gap-2">
                      {HANDWRITING_FONTS.map((f) => (
                        <button
                          key={f.name}
                          onClick={() => setFont(f.value)}
                          className={`px-4 py-3 rounded-lg text-sm transition-all ${
                            font === f.value
                              ? 'bg-stone-600 text-white'
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
              <div
                className="rounded-xl shadow-lg p-6 relative overflow-hidden"
                style={{ backgroundColor: paperStyle.value }}
              >
                <div className="absolute inset-0 flex flex-col justify-start pt-8 px-4">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-px mb-6"
                      style={{ backgroundColor: paperStyle.lines }}
                    />
                  ))}
                </div>
                <div className="relative">
                  <p className="text-xs mb-2" style={{ fontFamily: font, color: inkColor }}>
                    {letterData.to},
                  </p>
                  <p
                    className="text-xs line-clamp-3"
                    style={{ fontFamily: font, color: inkColor }}
                  >
                    {letterData.content.substring(0, 100)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LetterPreview({
  letterData,
  paperStyle,
  inkColor,
  font,
}: {
  letterData: LetterData;
  paperStyle: { value: string; lines: string };
  inkColor: string;
  font: string;
}) {
  const lines = letterData.content.split('\n');

  return (
    <div className="max-w-3xl mx-auto">
      {/* Paper Shadow Effect */}
      <div className="relative">
        {/* Background shadows for depth */}
        <div
          className="absolute -bottom-2 -right-2 w-full h-full rounded-lg opacity-20"
          style={{ backgroundColor: '#000' }}
        />
        <div
          className="absolute -bottom-1 -right-1 w-full h-full rounded-lg opacity-10"
          style={{ backgroundColor: '#000' }}
        />

        {/* Main Paper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-lg shadow-2xl p-8 md:p-12 overflow-hidden"
          style={{ backgroundColor: paperStyle.value }}
        >
          {/* Paper Lines */}
          <div className="absolute inset-0 flex flex-col pt-20 px-8 md:px-12 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="h-px"
                style={{
                  backgroundColor: paperStyle.lines,
                  marginBottom: '2rem',
                }}
              />
            ))}
          </div>

          {/* Red Margin Line (like notebook) */}
          <div
            className="absolute top-0 bottom-0 left-16 md:left-20 w-px"
            style={{ backgroundColor: '#fca5a5' }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Date */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-right text-sm mb-8"
              style={{ fontFamily: font, color: inkColor }}
            >
              {new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </motion.p>

            {/* To */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl mb-8"
              style={{ fontFamily: font, color: inkColor }}
            >
              {letterData.to},
            </motion.p>

            {/* Content with typing effect */}
            <div className="mb-8 min-h-[300px]">
              {lines.map((line, lineIndex) => (
                <motion.p
                  key={lineIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + lineIndex * 0.1 }}
                  className="text-lg md:text-xl leading-8 md:leading-10"
                  style={{ fontFamily: font, color: inkColor }}
                >
                  {line || '\u00A0'}
                </motion.p>
              ))}
            </div>

            {/* Photo */}
            {letterData.photo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + lines.length * 0.08 }}
                className="mb-8 flex justify-center"
              >
                <div className="relative inline-block transform hover:rotate-1 transition-transform">
                  <img
                    src={letterData.photo}
                    alt="Foto da carta"
                    className="max-w-xs md:max-w-sm rounded shadow-lg"
                    style={{
                      border: `6px solid white`,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    }}
                  />
                  <Sparkles
                    className="absolute -top-3 -right-3 h-6 w-6"
                    style={{ color: inkColor }}
                  />
                </div>
              </motion.div>
            )}

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + lines.length * 0.1 }}
              className="text-right mt-8"
            >
              <p
                className="text-lg md:text-xl italic"
                style={{ fontFamily: font, color: inkColor }}
              >
                {letterData.from}
              </p>
              <p
                className="text-2xl md:text-3xl mt-4"
                style={{ fontFamily: font, color: inkColor }}
              >
                {letterData.signature}
              </p>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-4 left-4"
          >
            <Heart className="h-16 w-16" style={{ color: inkColor }} />
          </motion.div>

          {/* Paper fold effect */}
          <div
            className="absolute top-0 right-0 w-16 h-16"
            style={{
              background: `linear-gradient(135deg, ${paperStyle.value} 50%, rgba(0,0,0,0.05) 50%)`,
            }}
          />
        </motion.div>
      </div>

      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
              scale: Math.random() * 0.5 + 0.3,
              opacity: 0.4,
            }}
            animate={{
              y: -100,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Heart
              className="h-6 w-6"
              style={{ color: inkColor, fill: inkColor }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function CartaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-pink-500" /></div>}>
      <CartaPageContent />
    </Suspense>
  );
}

