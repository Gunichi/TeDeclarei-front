'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImageIcon,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  Loader2,
  Eye,
  Sparkles,
  Heart,
  X,
  Calendar,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { templatesApi, uploadsApi, MuralPhoto } from '@/lib/api';

const GRADIENT_BACKGROUNDS = [
  { name: 'Cream', value: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' },
  { name: 'Rose', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { name: 'Lavender', value: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { name: 'Mint', value: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Night', value: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)' },
];

const LAYOUTS = [
  { name: 'Grid', value: 'grid' },
  { name: 'Masonry', value: 'masonry' },
  { name: 'Polaroid', value: 'polaroid' },
];

function MuralPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('Nosso Mural do Amor');
  const [photos, setPhotos] = useState<MuralPhoto[]>([]);
  const [background, setBackground] = useState(GRADIENT_BACKGROUNDS[0].value);
  const [layout, setLayout] = useState('polaroid');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
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
          if (template.muralPhotos && template.muralPhotos.length > 0) {
            setPhotos(template.muralPhotos);
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
    const files = e.target.files;
    if (!files || !token) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await uploadsApi.upload(token, file, 'templates');
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '');
        const imageUrl = `${baseUrl}${result.url}`;

        const newPhoto: MuralPhoto = {
          id: Date.now().toString() + Math.random(),
          url: imageUrl,
          caption: '',
          date: new Date().toISOString().split('T')[0],
        };
        setPhotos((prev) => [...prev, newPhoto]);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
    }
  };

  const updatePhoto = (id: string, updates: Partial<MuralPhoto>) => {
    setPhotos(photos.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
    setEditingPhoto(null);
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);
      
      // Ensure photos are properly formatted
      const formattedPhotos = photos.map(p => ({
        id: p.id,
        url: p.url,
        caption: p.caption,
        date: p.date,
      }));

      console.log('Saving mural photos:', formattedPhotos);

      const data = {
        title,
        type: 'mural' as const,
        backgroundColor: background,
        muralPhotos: formattedPhotos,
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
      alert('Erro ao salvar mural');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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
                <ImageIcon className="h-5 w-5 text-indigo-500" />
                <h1 className="text-lg font-bold text-gray-900">Mural de Fotos</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Editar' : 'Preview'}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving || photos.length === 0} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
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
          <MuralPreview title={title} photos={photos} background={background} layout={layout} />
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Settings Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Configurações
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Título</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nosso Mural do Amor"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Fundo</label>
                    <div className="grid grid-cols-3 gap-2">
                      {GRADIENT_BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.name}
                          onClick={() => setBackground(bg.value)}
                          className={`h-12 rounded-lg transition-all ${
                            background === bg.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105' : ''
                          }`}
                          style={{ background: bg.value }}
                          title={bg.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Layout</label>
                    <div className="flex flex-wrap gap-2">
                      {LAYOUTS.map((l) => (
                        <button
                          key={l.value}
                          onClick={() => setLayout(l.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            layout === l.value
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {l.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                size="lg"
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5 mr-2" />
                )}
                Adicionar Fotos
              </Button>

              <p className="text-center text-sm text-gray-500">
                <Heart className="inline h-4 w-4 text-pink-500 mr-1" />
                {photos.length} {photos.length === 1 ? 'foto' : 'fotos'} no mural
              </p>
            </div>

            {/* Photos Grid */}
            <div className="lg:col-span-3">
              {photos.length === 0 ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Nenhuma foto ainda
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Clique aqui ou no botão ao lado para adicionar fotos ao seu mural
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Fotos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {photos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative group bg-white rounded-xl shadow-lg overflow-hidden ${
                          editingPhoto === photo.id ? 'ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full aspect-square object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditingPhoto(editingPhoto === photo.id ? null : photo.id)}
                            title="Editar legenda e data"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePhoto(photo.id)}
                            title="Remover foto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Caption input - always visible at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-2">
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
                            placeholder="Adicionar legenda..."
                            className="w-full bg-transparent text-white text-xs placeholder-white/60 border-none outline-none focus:ring-0"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Photo Modal */}
      <AnimatePresence>
        {editingPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.find((p) => p.id === editingPhoto) && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">Editar Foto</h3>
                    <button
                      onClick={() => setEditingPhoto(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <img
                    src={photos.find((p) => p.id === editingPhoto)!.url}
                    alt=""
                    className="w-full aspect-video object-cover rounded-lg mb-4"
                  />

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        ✨ Legenda
                      </label>
                      <textarea
                        value={photos.find((p) => p.id === editingPhoto)!.caption || ''}
                        onChange={(e) => updatePhoto(editingPhoto, { caption: e.target.value })}
                        placeholder="Adicione uma legenda especial para esse momento..."
                        className="w-full p-3 border rounded-lg min-h-[80px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {(photos.find((p) => p.id === editingPhoto)!.caption || '').length}/200
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Data do momento
                      </label>
                      <Input
                        type="date"
                        value={photos.find((p) => p.id === editingPhoto)!.date || ''}
                        onChange={(e) => updatePhoto(editingPhoto, { date: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="destructive"
                        onClick={() => deletePhoto(editingPhoto)}
                        className="flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                      <Button onClick={() => setEditingPhoto(null)} className="flex-1">
                        Concluir
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

function MuralPreview({
  title,
  photos,
  background,
  layout,
}: {
  title: string;
  photos: MuralPhoto[];
  background: string;
  layout: string;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const renderPhotos = () => {
    switch (layout) {
      case 'polaroid':
        return (
          <div className="flex flex-wrap justify-center gap-6 p-8">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, rotate: Math.random() * 20 - 10, y: 50 }}
                animate={{ opacity: 1, rotate: Math.random() * 10 - 5, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                className="bg-white p-3 pb-12 shadow-xl cursor-pointer relative"
                style={{ transform: `rotate(${Math.random() * 10 - 5}deg)` }}
                onClick={() => setSelectedPhoto(index)}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-48 h-48 object-cover"
                />
                {photo.caption && (
                  <p className="absolute bottom-3 left-3 right-3 text-center text-sm text-gray-600 font-handwriting">
                    {photo.caption}
                  </p>
                )}
                <Heart className="absolute -top-2 -right-2 h-6 w-6 text-red-500 fill-red-500" />
              </motion.div>
            ))}
          </div>
        );

      case 'masonry':
        return (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 p-8">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4 break-inside-avoid cursor-pointer group"
                onClick={() => setSelectedPhoto(index)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full object-cover"
                  />
                  {photo.caption && (
                    <div className="p-3">
                      <p className="text-sm text-gray-600">{photo.caption}</p>
                      {photo.date && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(photo.date).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );

      default: // grid
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer group"
                onClick={() => setSelectedPhoto(index)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full aspect-square object-cover"
                  />
                  {photo.caption && (
                    <div className="p-3 bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0">
                      <p className="text-sm text-white truncate">{photo.caption}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <div
      className="min-h-[700px] rounded-2xl overflow-hidden shadow-2xl relative"
      style={{ background }}
    >
      {/* Header */}
      <div className="text-center py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 drop-shadow-sm"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mt-2"
        >
          {photos.length} memórias especiais
        </motion.p>
      </div>

      {/* Photos */}
      {renderPhotos()}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1);
              }}
              className="absolute left-4 text-white hover:text-pink-400 transition-colors"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>

            <motion.div
              key={selectedPhoto}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[selectedPhoto].url}
                alt=""
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              {photos[selectedPhoto].caption && (
                <p className="text-white text-center mt-4 text-lg">
                  {photos[selectedPhoto].caption}
                </p>
              )}
              {photos[selectedPhoto].date && (
                <p className="text-white/60 text-center mt-2 text-sm">
                  {new Date(photos[selectedPhoto].date!).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0);
              }}
              className="absolute right-4 text-white hover:text-pink-400 transition-colors"
            >
              <ChevronRight className="h-12 w-12" />
            </button>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-pink-400 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MuralPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-pink-500" /></div>}>
      <MuralPageContent />
    </Suspense>
  );
}

