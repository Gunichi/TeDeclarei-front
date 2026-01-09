'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Cake, 
  BellRing, 
  Copy, 
  Loader2, 
  Search, 
  Clock, 
  HelpCircle, 
  Timer, 
  ImageIcon, 
  Mail, 
  PenTool,
  Sparkles,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { publicTemplatesApi, templatesApi, PublicTemplate, TemplateType, Template } from '@/lib/api';
import { TemplateThumbnail } from '@/components/template-thumbnail';
import { TemplatePreviewModal } from '@/components/template-preview-modal';

export default function PublicTemplatesPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [templates, setTemplates] = useState<PublicTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [copying, setCopying] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<PublicTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [activeTab]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const type = activeTab !== 'all' ? (activeTab as TemplateType) : undefined;
      const data = await publicTemplatesApi.getAll(type);
      setTemplates(data);
    } catch (err) {
      setError('Falha ao carregar templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (template: PublicTemplate) => {
    if (!user || !token) {
      router.push('/auth');
      return;
    }

    try {
      setCopying(template.id);
      await templatesApi.create(token, {
        title: `${template.title} (Cópia)`,
        type: template.type,
        cardCategory: template.cardCategory,
        elements: template.elements,
        steps: template.steps,
        backgroundColor: template.backgroundColor,
        backgroundImage: template.backgroundImage,
        showParticles: template.showParticles,
        particleType: template.particleType,
        timelineEvents: template.timelineEvents,
        quizQuestions: template.quizQuestions,
        counterData: template.counterData,
        muralPhotos: template.muralPhotos,
        letterData: template.letterData,
      });
      router.push('/templates');
    } catch (err) {
      console.error(err);
      alert('Falha ao copiar template');
    } finally {
      setCopying(null);
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      card: <Heart className="h-5 w-5 text-rose-500" />,
      love: <Heart className="h-5 w-5 text-rose-500" />,
      birthday: <Cake className="h-5 w-5 text-amber-500" />,
      proposal: <BellRing className="h-5 w-5 text-purple-500" />,
      timeline: <Clock className="h-5 w-5 text-blue-500" />,
      quiz: <HelpCircle className="h-5 w-5 text-orange-500" />,
      counter: <Timer className="h-5 w-5 text-emerald-500" />,
      mural: <ImageIcon className="h-5 w-5 text-indigo-500" />,
      envelope: <Mail className="h-5 w-5 text-red-500" />,
      letter: <PenTool className="h-5 w-5 text-stone-600" />,
    };
    return icons[type] || <Sparkles className="h-5 w-5 text-pink-500" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      card: 'bg-rose-100 text-rose-700',
      love: 'bg-rose-100 text-rose-700',
      birthday: 'bg-amber-100 text-amber-700',
      proposal: 'bg-purple-100 text-purple-700',
      timeline: 'bg-blue-100 text-blue-700',
      quiz: 'bg-orange-100 text-orange-700',
      counter: 'bg-emerald-100 text-emerald-700',
      mural: 'bg-indigo-100 text-indigo-700',
      envelope: 'bg-red-100 text-red-700',
      letter: 'bg-stone-100 text-stone-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getTypeName = (type: string, cardCategory?: string) => {
    if (type === 'card' && cardCategory) {
      const categoryNames: Record<string, string> = {
        love: 'Amor',
        birthday: 'Aniversário',
        proposal: 'Pedido',
        anniversary: 'Aniversário de Namoro',
        friendship: 'Amizade',
        thank_you: 'Agradecimento',
        custom: 'Personalizado',
      };
      return `Cartão - ${categoryNames[cardCategory] || cardCategory}`;
    }
    const names: Record<string, string> = {
      card: 'Cartão',
      love: 'Amor',
      birthday: 'Aniversário',
      proposal: 'Pedido',
      timeline: 'Timeline',
      quiz: 'Quiz',
      counter: 'Contador',
      mural: 'Mural',
      envelope: 'Envelope',
      letter: 'Carta',
    };
    return names[type] || type;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-blue-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Modelos Públicos
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore nossa coleção de templates prontos e personalize para criar sua declaração perfeita
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-1 h-auto p-1">
              <TabsTrigger value="all" className="text-xs px-3">Todos</TabsTrigger>
              <TabsTrigger value="card" className="text-xs px-3 gap-1">
                <Heart size={12} /> Cartões
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-xs px-3 gap-1">
                <Clock size={12} /> Timeline
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs px-3 gap-1">
                <HelpCircle size={12} /> Quiz
              </TabsTrigger>
              <TabsTrigger value="counter" className="text-xs px-3 gap-1">
                <Timer size={12} /> Contador
              </TabsTrigger>
              <TabsTrigger value="mural" className="text-xs px-3 gap-1">
                <ImageIcon size={12} /> Mural
              </TabsTrigger>
              <TabsTrigger value="envelope" className="text-xs px-3 gap-1">
                <Mail size={12} /> Envelope
              </TabsTrigger>
              <TabsTrigger value="letter" className="text-xs px-3 gap-1">
                <PenTool size={12} /> Carta
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">{error}</div>
        ) : filteredTemplates.length === 0 ? (
          <Card className="text-center py-12 max-w-lg mx-auto">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum template encontrado
              </h3>
              <p className="text-gray-500">
                Tente buscar com outros termos ou selecione outra categoria
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group border-2 border-transparent hover:border-pink-200 cursor-pointer"
                  onClick={() => setPreviewTemplate(template)}
                >
                  {/* Thumbnail */}
                  <div className="h-44 relative">
                    <TemplateThumbnail template={template} className="h-full w-full" />
                    
                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm shadow-sm ${getTypeColor(template.type)}`}>
                        {getTypeName(template.type, template.cardCategory)}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shadow-lg text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTemplate(template);
                          }}
                        >
                          <Eye size={12} className="mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shadow-lg text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(template);
                          }}
                          disabled={copying === template.id}
                        >
                          {copying === template.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Copy size={12} className="mr-1" />
                          )}
                          Clonar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-2 flex-grow p-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <CardTitle className="text-base line-clamp-1">{template.title}</CardTitle>
                    </div>
                    {template.description && (
                      <CardDescription className="line-clamp-2 text-xs mt-1">
                        {template.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardFooter className="pt-0 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {template.author && (
                        <>
                          <span>Por {template.author}</span>
                        </>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full text-xs bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(template);
                      }}
                      disabled={copying === template.id}
                    >
                      {copying === template.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Copy size={12} className="mr-1" />
                          {user ? 'Usar' : 'Entrar'}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onClone={(template) => {
          handleCopy(template);
          setPreviewTemplate(null);
        }}
        isCloning={copying === previewTemplate?.id}
      />
    </div>
  );
}

