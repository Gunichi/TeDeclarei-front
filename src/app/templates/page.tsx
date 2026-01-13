'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Cake,
  BellRing,
  Plus,
  Trash2,
  Copy,
  Edit,
  Share2,
  ExternalLink,
  Loader2,
  Clock,
  HelpCircle,
  Timer,
  ImageIcon,
  Mail,
  PenTool,
  QrCode,
  Download,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { templatesApi, Template } from '@/lib/api';
import { TemplateThumbnail } from '@/components/template-thumbnail';

export default function TemplatesPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [templateToShare, setTemplateToShare] = useState<Template | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      loadTemplates();
    }
  }, [token]);

  const loadTemplates = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await templatesApi.getAll(token);
      setTemplates(data);
    } catch (err) {
      setError('Falha ao carregar templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !templateToDelete) return;

    try {
      setActionLoading(templateToDelete);
      await templatesApi.delete(token, templateToDelete);
      setTemplates(templates.filter((t) => t.id !== templateToDelete));
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Falha ao excluir template');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopy = async (id: string) => {
    if (!token) return;

    try {
      setActionLoading(id);
      const copied = await templatesApi.copy(token, id);
      setTemplates([copied, ...templates]);
    } catch (err) {
      console.error(err);
      alert('Falha ao copiar template');
    } finally {
      setActionLoading(null);
    }
  };

  const handleShare = (template: Template) => {
    setTemplateToShare(template);
    setShareDialogOpen(true);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar URL:', err);
      alert('Erro ao copiar link');
    }
  };

  const handleDownloadQRCode = (url: string, templateTitle: string) => {
    try {
      // Find the QR Code SVG element using ref or querySelector as fallback
      const qrCodeElement = qrCodeRef.current || document.querySelector('[data-qr-code]') as HTMLElement;
      if (!qrCodeElement) {
        alert('Erro ao encontrar QR Code');
        return;
      }

      const svg = qrCodeElement.querySelector('svg');
      if (!svg) {
        alert('Erro ao encontrar SVG do QR Code');
        return;
      }

      // Clone the SVG to avoid modifying the original
      const clonedSvg = svg.cloneNode(true) as SVGElement;
      
      // Set background to white for better printing
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', 'white');
      clonedSvg.insertBefore(rect, clonedSvg.firstChild);

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create an image and convert to PNG
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 400; // Higher resolution for printing
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          alert('Erro ao criar contexto do canvas');
          return;
        }

        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);
        
        // Draw the QR Code
        ctx.drawImage(img, 0, 0, size, size);

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (!blob) {
            alert('Erro ao gerar imagem do QR Code');
            return;
          }

          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `qr-code-${templateTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up URLs
          URL.revokeObjectURL(svgUrl);
          URL.revokeObjectURL(pngUrl);
        }, 'image/png');
      };

      img.onerror = () => {
        alert('Erro ao gerar imagem do QR Code');
        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    } catch (err) {
      console.error('Erro ao baixar QR Code:', err);
      alert('Erro ao baixar QR Code');
    }
  };

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
    return icons[type] || <Heart className="h-5 w-5 text-gray-500" />;
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
        proposal: 'Proposta',
        anniversary: 'Aniversário de Namoro',
        friendship: 'Amizade',
        thank_you: 'Agradecimento',
        custom: 'Personalizado',
      };
      return `Cartão - ${categoryNames[cardCategory] || cardCategory}`;
    }
    const names: Record<string, string> = {
      card: 'Cartão Especial',
      love: 'Amor',
      birthday: 'Aniversário',
      proposal: 'Proposta',
      timeline: 'Timeline',
      quiz: 'Quiz',
      counter: 'Contador',
      mural: 'Mural',
      envelope: 'Envelope',
      letter: 'Carta',
    };
    return names[type] || type;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-blue-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Meus Templates</h1>
            <p className="text-gray-600 mt-1">Gerencie e edite seus templates salvos</p>
          </div>

          <Button
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            onClick={() => router.push('/criar')}
          >
            <Plus size={20} className="mr-2" />
            Criar Novo
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        ) : templates.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Você ainda não tem templates
              </h3>
              <p className="text-gray-500 mb-4">
                Crie seu primeiro template e comece a compartilhar seus sentimentos!
              </p>
              <Button onClick={() => router.push('/create/love')} className="rounded-full">
                <Plus size={20} className="mr-2" />
                Criar primeiro template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="h-40 relative">
                    <TemplateThumbnail template={template} className="h-full w-full" />
                    
                    {/* Overlay badges */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getTypeColor(template.type)}`}>
                        {getTypeName(template.type, template.cardCategory)}
                      </span>
                    </div>
                    {template.isPublic && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100/90 text-green-700 backdrop-blur-sm">
                          Público
                        </span>
                      </div>
                    )}
                    
                    {/* Hover overlay with quick view */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/view/${template.shareToken}`, '_blank');
                        }}
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Visualizar
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                    </div>
                    <CardDescription>
                      Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const typeToPath: Record<string, string> = {
                            card: 'cartao',
                            timeline: 'timeline',
                            quiz: 'quiz',
                            counter: 'contador',
                            mural: 'mural',
                            envelope: 'envelope',
                            letter: 'carta',
                            // Legacy types redirect to cartao
                            love: 'cartao',
                            birthday: 'cartao',
                            proposal: 'cartao',
                          };
                          const path = typeToPath[template.type];
                          if (path) {
                            router.push(`/criar/${path}?id=${template.id}`);
                          } else {
                            router.push(`/create/${template.type}?id=${template.id}`);
                          }
                        }}
                        disabled={actionLoading === template.id}
                      >
                        <Edit size={16} className="mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(template)}
                      >
                        <Share2 size={16} className="mr-1" />
                        Compartilhar
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          •••
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(`/view/${template.shareToken}`, '_blank')}
                        >
                          <ExternalLink size={16} className="mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopy(template.id)}>
                          <Copy size={16} className="mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setTemplateToDelete(template.id);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir template?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O template será excluído permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={actionLoading === templateToDelete}
            >
              {actionLoading === templateToDelete ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog with QR Code */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Compartilhar Template
            </DialogTitle>
            <DialogDescription>
              Compartilhe este template através do link ou QR Code
            </DialogDescription>
          </DialogHeader>
          {templateToShare && (
            <div className="space-y-6 py-4">
              {/* URL Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Link para compartilhar</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/view/${templateToShare.shareToken}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(`${window.location.origin}/view/${templateToShare.shareToken}`)}
                  >
                    <Copy size={16} className="mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </label>
                <div 
                  ref={qrCodeRef}
                  className="flex justify-center p-4 bg-white rounded-lg border border-gray-200" 
                  data-qr-code
                >
                  <QRCodeSVG
                    value={`${window.location.origin}/view/${templateToShare.shareToken}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadQRCode(
                      `${window.location.origin}/view/${templateToShare.shareToken}`,
                      templateToShare.title
                    )}
                    className="w-full sm:w-auto"
                  >
                    <Download size={16} className="mr-2" />
                    Baixar QR Code
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Escaneie o QR Code para acessar o template ou baixe para imprimir
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

