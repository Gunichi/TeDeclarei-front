'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, PanInfo } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import {
  Heart,
  Cake,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Type,
  Image,
  Move,
  PaintBucket,
  Trash2,
  Save,
  Loader2,
  Plus,
  Layers,
  Copy,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import { templatesApi, uploadsApi, CardElement, TemplateType, ParticleType, Step } from '@/lib/api';
import { ParticleBackground } from '@/components/particle-background';

const GRADIENT_PRESETS = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { name: 'Cherry', value: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' },
  { name: 'Purple', value: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)' },
  { name: 'Rose', value: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)' },
  { name: 'Love', value: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' },
  { name: 'Night', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { name: 'Peach', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
];

const FONT_FAMILIES = [
  { name: 'Padrão', value: 'inherit' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times', value: '"Times New Roman", serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Courier', value: '"Courier New", monospace' },
  { name: 'Comic Sans', value: '"Comic Sans MS", cursive' },
  { name: 'Impact', value: 'Impact, fantasy' },
];

const TEXT_SHADOW_PRESETS = [
  { name: 'Nenhuma', value: 'none' },
  { name: 'Suave', value: '2px 2px 4px rgba(0,0,0,0.3)' },
  { name: 'Forte', value: '3px 3px 6px rgba(0,0,0,0.5)' },
  { name: 'Glow', value: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)' },
  { name: 'Neon Rosa', value: '0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff' },
  { name: 'Neon Azul', value: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff' },
  { name: 'Outline', value: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' },
  { name: '3D', value: '1px 1px 0 #ccc, 2px 2px 0 #bbb, 3px 3px 0 #aaa, 4px 4px 0 #999' },
];

// Draggable Element Component
interface DraggableElementProps {
  element: CardElement;
  isSelected: boolean;
  onDragEnd: (id: string, data: { x: number; y: number }) => void;
  onClick: (e: React.MouseEvent, element: CardElement) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function DraggableElement({ element, isSelected, onDragEnd, onClick, containerRef }: DraggableElementProps) {
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newX = element.position.x + info.offset.x;
    const newY = element.position.y + info.offset.y;
    onDragEnd(element.id, { x: newX, y: newY });
  };

  const getTextStyle = (): React.CSSProperties => ({
    fontSize: element.style.fontSize,
    color: element.style.color,
    textAlign: element.style.textAlign as React.CSSProperties['textAlign'],
    textShadow: element.style.textShadow || '2px 2px 4px rgba(0,0,0,0.3)',
    whiteSpace: 'pre-wrap',
    fontFamily: element.style.fontFamily || 'inherit',
    fontWeight: element.style.fontWeight || 'normal',
    fontStyle: element.style.fontStyle || 'normal',
    textDecoration: element.style.textDecoration || 'none',
    letterSpacing: element.style.letterSpacing || 'normal',
    lineHeight: element.style.lineHeight || 'normal',
    WebkitTextStroke: element.style.textStroke || 'unset',
    transform: element.style.transform || 'none',
  });

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      initial={{ x: element.position.x, y: element.position.y }}
      animate={{ x: element.position.x, y: element.position.y }}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      onClick={(e) => onClick(e, element)}
      whileDrag={{ scale: 1.02, zIndex: 100 }}
      style={{ touchAction: 'none' }}
    >
      {element.type === 'text' && (
        <p style={getTextStyle()}>
          {element.content}
        </p>
      )}
      {element.type === 'photo' && (
        <img
          src={element.content || 'https://via.placeholder.com/200'}
          alt="Element"
          draggable={false}
          style={{
            width: element.style.width,
            height: element.style.height,
            objectFit: 'cover',
            borderRadius: element.style.borderRadius || '8px',
            boxShadow: element.style.boxShadow || 'none',
          }}
        />
      )}
      {element.type === 'button' && (
        <button
          className="px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
          style={{
            backgroundColor: element.style.backgroundColor,
            color: element.style.color,
            fontSize: element.style.fontSize,
            fontWeight: '600',
            boxShadow: element.style.boxShadow || '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {element.buttonProps?.text || 'Botão'}
        </button>
      )}
    </motion.div>
  );
}

// Step Editor Component
interface StepEditorProps {
  step: Step;
  stepIndex: number;
  totalSteps: number;
  onUpdateStep: (stepIndex: number, updates: Partial<Step>) => void;
  onDeleteStep: (stepIndex: number) => void;
  isActive: boolean;
}

function CreateTemplatePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateType = params.templateType as TemplateType;
  const templateId = searchParams.get('id');

  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  
  // Steps state
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<CardElement | null>(null);
  const [activeEditTab, setActiveEditTab] = useState('content');

  // Current step helpers - usa o step real dos steps array
  const currentStep = steps[currentStepIndex] || {
    id: '1',
    name: 'Passo 1',
    elements: [],
    backgroundColor: '#be185d',
    backgroundImage: undefined,
    showParticles: true,
    particleType: 'hearts' as ParticleType,
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    console.log('=== INIT EFFECT ===');
    console.log('templateId:', templateId);
    console.log('token:', token ? 'exists' : 'null');
    console.log('steps.length:', steps.length);
    
    if (templateId && token) {
      loadTemplate();
    } else if (steps.length === 0) {
      // Só inicializa se não houver steps (evita reinicialização)
      console.log('Calling initializeDefaultSteps...');
      initializeDefaultSteps();
    }
  }, [templateId, token]);

  const loadTemplate = async () => {
    if (!token || !templateId) return;

    try {
      setLoading(true);
      const template = await templatesApi.getById(token, templateId);
      
      // Debug log
      console.log('=== LOAD TEMPLATE ===');
      console.log('Template loaded:', template);
      console.log('Template elements:', template.elements);
      console.log('Template steps:', template.steps);
      
      setTitle(template.title);
      
      if (template.steps && template.steps.length > 0) {
        setSteps(template.steps);
      } else {
        // Convert old format to steps
        setSteps([{
          id: '1',
          name: 'Passo 1',
          elements: template.elements,
          backgroundColor: template.backgroundColor,
          backgroundImage: template.backgroundImage,
          showParticles: template.showParticles,
          particleType: template.particleType,
        }]);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar template');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultSteps = () => {
    console.log('=== INITIALIZE DEFAULT STEPS ===');
    console.log('templateType:', templateType);
    
    const defaultTitle = templateType === 'love'
      ? 'Meu Cartão de Amor'
      : templateType === 'birthday'
      ? 'Feliz Aniversário'
      : 'Quer namorar comigo?';

    setTitle(defaultTitle);

    if (templateType === 'proposal') {
      setSteps([
        {
          id: '1',
          name: 'Introdução',
          elements: [
            {
              id: 'intro-text',
              type: 'text',
              content: 'Olá meu amor... ❤️',
              position: { x: 50, y: 100 },
              style: {
                fontSize: '42px',
                textAlign: 'center',
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              },
            },
            {
              id: 'next-btn-1',
              type: 'button',
              content: '',
              position: { x: 300, y: 400 },
              style: {
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#ec4899',
              },
              buttonProps: {
                text: 'Continuar →',
                action: 'next',
              },
            },
          ],
          backgroundColor: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
          showParticles: true,
          particleType: 'hearts',
        },
        {
          id: '2',
          name: 'Mensagem',
          elements: [
            {
              id: 'msg-text',
              type: 'text',
              content: 'Você é a pessoa mais especial\nda minha vida...',
              position: { x: 50, y: 120 },
              style: {
                fontSize: '36px',
                textAlign: 'center',
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              },
            },
            {
              id: 'next-btn-2',
              type: 'button',
              content: '',
              position: { x: 300, y: 400 },
              style: {
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#ec4899',
              },
              buttonProps: {
                text: 'Continuar →',
                action: 'next',
              },
            },
          ],
          backgroundColor: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
          showParticles: true,
          particleType: 'sparkles',
        },
        {
          id: '3',
          name: 'A Pergunta',
          elements: [
            {
              id: 'question-text',
              type: 'text',
              content: 'Quer namorar comigo? 💕',
              position: { x: 50, y: 100 },
              style: {
                fontSize: '48px',
                textAlign: 'center',
                color: '#ffffff',
                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)',
                fontWeight: 'bold',
              },
            },
            {
              id: 'yes-btn',
              type: 'button',
              content: '',
              position: { x: 150, y: 350 },
              style: {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#22c55e',
              },
              buttonProps: {
                text: 'Sim! 💖',
                action: 'success',
              },
            },
            {
              id: 'no-btn',
              type: 'button',
              content: '',
              position: { x: 400, y: 350 },
              style: {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#ef4444',
              },
              buttonProps: {
                text: 'Não 😢',
                randomMove: true,
              },
            },
          ],
          backgroundColor: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
          showParticles: true,
          particleType: 'hearts',
        },
      ]);
    } else {
      setSteps([{
        id: '1',
        name: 'Passo 1',
        elements: [
          {
            id: 'title',
            type: 'text',
            content: defaultTitle,
            position: { x: 50, y: 150 },
            style: {
              fontSize: '42px',
              textAlign: 'center',
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            },
          },
        ],
        backgroundColor: templateType === 'love' 
          ? 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)'
          : 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
        showParticles: true,
        particleType: 'hearts',
      }]);
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);

      const templateData = {
        title,
        type: templateType,
        elements: steps[0]?.elements || [],
        backgroundColor: steps[0]?.backgroundColor || '#be185d',
        backgroundImage: steps[0]?.backgroundImage,
        showParticles: steps[0]?.showParticles ?? true,
        particleType: steps[0]?.particleType || 'hearts',
        steps: steps,
      };

      // Debug logs
      console.log('=== FRONTEND SAVE ===');
      console.log('Steps:', steps);
      console.log('Steps length:', steps.length);
      console.log('Steps[0] elements:', steps[0]?.elements);
      console.log('Template data being sent:', templateData);

      if (templateId) {
        await templatesApi.update(token, templateId, templateData);
      } else {
        await templatesApi.create(token, templateData);
      }

      router.push('/templates');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar template');
    } finally {
      setSaving(false);
    }
  };

  // Step management
  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      name: `Passo ${steps.length + 1}`,
      elements: [],
      backgroundColor: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
      showParticles: true,
      particleType: 'hearts',
    };
    setSteps([...steps, newStep]);
    setCurrentStepIndex(steps.length);
  };

  const deleteStep = (index: number) => {
    if (steps.length <= 1) return;
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    if (currentStepIndex >= newSteps.length) {
      setCurrentStepIndex(newSteps.length - 1);
    }
  };

  const duplicateStep = (index: number) => {
    const stepToDuplicate = steps[index];
    const newStep: Step = {
      ...stepToDuplicate,
      id: Date.now().toString(),
      name: `${stepToDuplicate.name} (cópia)`,
      elements: stepToDuplicate.elements.map(el => ({
        ...el,
        id: `${el.id}-${Date.now()}`,
      })),
    };
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, newStep);
    setSteps(newSteps);
  };

  const updateCurrentStep = (updates: Partial<Step>) => {
    const newSteps = [...steps];
    const existingStep = newSteps[currentStepIndex] || {
      id: Date.now().toString(),
      name: `Passo ${currentStepIndex + 1}`,
      elements: [],
      backgroundColor: '#be185d',
    };
    newSteps[currentStepIndex] = { ...existingStep, ...updates };
    setSteps(newSteps);
  };

  // Element management
  const addElement = (type: 'photo' | 'text' | 'button') => {
    const newElement: CardElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Novo texto' : '',
      position: { x: 200, y: 200 },
      style: {
        width: type === 'photo' ? '200px' : undefined,
        height: type === 'photo' ? '200px' : undefined,
        fontSize: type === 'button' ? '18px' : '32px',
        color: '#ffffff',
        textAlign: 'center',
        backgroundColor: type === 'button' ? '#ec4899' : undefined,
        textShadow: type === 'text' ? '2px 2px 4px rgba(0,0,0,0.3)' : undefined,
      },
      buttonProps: type === 'button' ? { text: 'Clique aqui', randomMove: false } : undefined,
    };

    updateCurrentStep({
      elements: [...currentStep.elements, newElement],
    });
    setSelectedElement(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<CardElement>) => {
    updateCurrentStep({
      elements: currentStep.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      ),
    });
  };

  const deleteElement = (id: string) => {
    updateCurrentStep({
      elements: currentStep.elements.filter(el => el.id !== id),
    });
    setSelectedElement(null);
    setEditDialogOpen(false);
  };

  const handleDragStop = (id: string, data: { x: number; y: number }) => {
    updateElement(id, { position: { x: data.x, y: data.y } });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isBackground = false) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      const result = await uploadsApi.upload(token, file, isBackground ? 'backgrounds' : 'templates');
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '');
      const imageUrl = `${baseUrl}${result.url}`;

      if (isBackground) {
        updateCurrentStep({ backgroundImage: imageUrl });
      } else {
        const newElement: CardElement = {
          id: Date.now().toString(),
          type: 'photo',
          content: imageUrl,
          position: { x: 200, y: 200 },
          style: {
            width: '200px',
            height: '200px',
            borderRadius: '8px',
          },
        };
        updateCurrentStep({
          elements: [...currentStep.elements, newElement],
        });
        setSelectedElement(newElement.id);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem');
    }
  };

  const getThemeIcon = () => {
    switch (templateType) {
      case 'love': return <Heart className="h-6 w-6 text-rose-500" />;
      case 'birthday': return <Cake className="h-6 w-6 text-amber-500" />;
      case 'proposal': return <BellRing className="h-6 w-6 text-purple-500" />;
    }
  };

  const getThemeTitle = () => {
    switch (templateType) {
      case 'love': return 'Cartão de Amor';
      case 'birthday': return 'Cartão de Aniversário';
      case 'proposal': return 'Proposta de Namoro';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-purple-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-14 z-40 mt-14">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                {getThemeIcon()}
                <h1 className="text-lg font-bold text-gray-900">{getThemeTitle()}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do template"
                className="w-40 h-9 text-sm"
              />
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="bg-white border-b shadow-sm sticky top-[104px] z-30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  index === currentStepIndex
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  index === currentStepIndex ? 'bg-white/20' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </span>
                {step.name}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addStep}
              className="rounded-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Novo Passo
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-72 bg-white rounded-xl shadow-lg p-4 space-y-4 h-fit">
          {/* Step Settings */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Passo {currentStepIndex + 1}
              </h2>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateStep(currentStepIndex)}
                  title="Duplicar passo"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {steps.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteStep(currentStepIndex)}
                    className="text-red-500 hover:text-red-600"
                    title="Excluir passo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <Input
              value={currentStep.name}
              onChange={(e) => updateCurrentStep({ name: e.target.value })}
              placeholder="Nome do passo"
              className="text-sm"
            />
          </div>

          {/* Add Elements */}
          <div className="border-b pb-4">
            <h2 className="font-semibold text-gray-800 mb-3">Adicionar Elementos</h2>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => addElement('text')}>
                <Type className="h-5 w-5" />
                <span className="text-xs">Texto</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => fileInputRef.current?.click()}>
                <Image className="h-5 w-5" />
                <span className="text-xs">Foto</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => addElement('button')}>
                <Move className="h-5 w-5" />
                <span className="text-xs">Botão</span>
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e)}
              className="hidden"
            />
          </div>

          {/* Background */}
          <div className="border-b pb-4">
            <h2 className="font-semibold text-gray-800 mb-3">Fundo</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <PaintBucket className="h-4 w-4 mr-2" />
                Cor / Gradiente
                <div
                  className="w-6 h-6 rounded ml-auto border"
                  style={{ background: currentStep.backgroundColor }}
                />
              </Button>
              {showColorPicker && (
                <div className="p-2 bg-gray-50 rounded-lg">
                  <HexColorPicker 
                    color={currentStep.backgroundColor?.startsWith('#') ? currentStep.backgroundColor : '#be185d'} 
                    onChange={(color) => updateCurrentStep({ backgroundColor: color })} 
                  />
                  <p className="text-xs text-gray-500 mt-2 mb-1">Gradientes:</p>
                  <div className="grid grid-cols-4 gap-1">
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        className="w-full h-8 rounded border-2 border-transparent hover:border-gray-400 transition-all"
                        style={{ background: preset.value }}
                        onClick={() => updateCurrentStep({ backgroundColor: preset.value })}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => backgroundInputRef.current?.click()}
              >
                <Image className="h-4 w-4 mr-2" />
                Imagem de Fundo
              </Button>
              {currentStep.backgroundImage && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-500"
                  onClick={() => updateCurrentStep({ backgroundImage: undefined })}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Imagem
                </Button>
              )}
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
            </div>
          </div>

          {/* Effects */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">Efeitos</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentStep.showParticles ?? true}
                  onChange={(e) => updateCurrentStep({ showParticles: e.target.checked })}
                  className="rounded text-pink-500"
                />
                <span className="text-sm">Mostrar partículas</span>
              </label>
              {currentStep.showParticles && (
                <select
                  value={currentStep.particleType || 'hearts'}
                  onChange={(e) => updateCurrentStep({ particleType: e.target.value as ParticleType })}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="hearts">Corações ❤️</option>
                  <option value="sparkles">Brilhos ✨</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-grow">
          <div
            ref={canvasRef}
            className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl relative"
            style={{
              background: currentStep.backgroundImage
                ? `url(${currentStep.backgroundImage}) center/cover no-repeat`
                : currentStep.backgroundColor,
            }}
            onClick={() => setSelectedElement(null)}
          >
            {currentStep.showParticles && (
              <ParticleBackground type={currentStep.particleType || 'hearts'} contained />
            )}

            {currentStep.elements.map((element) => (
              <DraggableElement
                key={element.id}
                element={element}
                isSelected={selectedElement === element.id}
                onDragEnd={handleDragStop}
                onClick={(e, el) => {
                  e.stopPropagation();
                  setSelectedElement(el.id);
                  setEditingElement(el);
                  setEditDialogOpen(true);
                }}
                containerRef={canvasRef}
              />
            ))}

            {/* Step navigation preview */}
            {steps.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentStepIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentStepIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Navigation arrows */}
          {steps.length > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <Button
                variant="outline"
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <span className="flex items-center text-gray-500">
                {currentStepIndex + 1} / {steps.length}
              </span>
              <Button
                variant="outline"
                disabled={currentStepIndex === steps.length - 1}
                onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Edit Element Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Editar {editingElement?.type === 'text' ? 'Texto' : editingElement?.type === 'button' ? 'Botão' : 'Imagem'}
            </DialogTitle>
          </DialogHeader>

          {editingElement && (
            <Tabs value={activeEditTab} onValueChange={setActiveEditTab}>
              <TabsList className="w-full">
                <TabsTrigger value="content" className="flex-1">Conteúdo</TabsTrigger>
                <TabsTrigger value="style" className="flex-1">Estilo</TabsTrigger>
                {editingElement.type === 'button' && (
                  <TabsTrigger value="action" className="flex-1">Ação</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="content" className="space-y-4 mt-4">
                {editingElement.type === 'text' && (
                  <div>
                    <label className="text-sm font-medium">Texto</label>
                    <textarea
                      value={editingElement.content}
                      onChange={(e) => {
                        const updated = { ...editingElement, content: e.target.value };
                        setEditingElement(updated);
                        updateElement(editingElement.id, { content: e.target.value });
                      }}
                      className="w-full p-3 border rounded-lg mt-1 min-h-[100px]"
                      placeholder="Digite seu texto aqui..."
                    />
                  </div>
                )}

                {editingElement.type === 'button' && (
                  <div>
                    <label className="text-sm font-medium">Texto do Botão</label>
                    <Input
                      value={editingElement.buttonProps?.text || ''}
                      onChange={(e) => {
                        const updated = {
                          ...editingElement,
                          buttonProps: { ...editingElement.buttonProps, text: e.target.value },
                        };
                        setEditingElement(updated);
                        updateElement(editingElement.id, { buttonProps: updated.buttonProps });
                      }}
                      className="mt-1"
                    />
                  </div>
                )}

                {editingElement.type === 'photo' && (
                  <div>
                    <label className="text-sm font-medium">URL da Imagem</label>
                    <Input
                      value={editingElement.content}
                      onChange={(e) => {
                        const updated = { ...editingElement, content: e.target.value };
                        setEditingElement(updated);
                        updateElement(editingElement.id, { content: e.target.value });
                      }}
                      placeholder="https://..."
                      className="mt-1"
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="style" className="space-y-4 mt-4">
                {(editingElement.type === 'text' || editingElement.type === 'button') && (
                  <>
                    {/* Font Size */}
                    <div>
                      <label className="text-sm font-medium">Tamanho da Fonte</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="12"
                          max="120"
                          value={parseInt(editingElement.style.fontSize || '24')}
                          onChange={(e) => {
                            const updated = {
                              ...editingElement,
                              style: { ...editingElement.style, fontSize: `${e.target.value}px` },
                            };
                            setEditingElement(updated);
                            updateElement(editingElement.id, { style: updated.style });
                          }}
                          className="flex-1"
                        />
                        <span className="text-sm w-12">{editingElement.style.fontSize}</span>
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="text-sm font-medium">Cor do Texto</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={editingElement.style.color || '#ffffff'}
                          onChange={(e) => {
                            const updated = {
                              ...editingElement,
                              style: { ...editingElement.style, color: e.target.value },
                            };
                            setEditingElement(updated);
                            updateElement(editingElement.id, { style: updated.style });
                          }}
                          className="w-10 h-10 rounded border cursor-pointer"
                        />
                        <Input
                          value={editingElement.style.color || '#ffffff'}
                          onChange={(e) => {
                            const updated = {
                              ...editingElement,
                              style: { ...editingElement.style, color: e.target.value },
                            };
                            setEditingElement(updated);
                            updateElement(editingElement.id, { style: updated.style });
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {editingElement.type === 'text' && (
                      <>
                        {/* Font Family */}
                        <div>
                          <label className="text-sm font-medium">Fonte</label>
                          <select
                            value={editingElement.style.fontFamily || 'inherit'}
                            onChange={(e) => {
                              const updated = {
                                ...editingElement,
                                style: { ...editingElement.style, fontFamily: e.target.value },
                              };
                              setEditingElement(updated);
                              updateElement(editingElement.id, { style: updated.style });
                            }}
                            className="w-full p-2 border rounded-lg mt-1"
                          >
                            {FONT_FAMILIES.map((font) => (
                              <option key={font.name} value={font.value} style={{ fontFamily: font.value }}>
                                {font.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Text Formatting */}
                        <div>
                          <label className="text-sm font-medium">Formatação</label>
                          <div className="flex gap-2 mt-1">
                            <Button
                              variant={editingElement.style.fontWeight === 'bold' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const newWeight = editingElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
                                const updated = {
                                  ...editingElement,
                                  style: { ...editingElement.style, fontWeight: newWeight },
                                };
                                setEditingElement(updated);
                                updateElement(editingElement.id, { style: updated.style });
                              }}
                            >
                              <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={editingElement.style.fontStyle === 'italic' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const newStyle = editingElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
                                const updated = {
                                  ...editingElement,
                                  style: { ...editingElement.style, fontStyle: newStyle },
                                };
                                setEditingElement(updated);
                                updateElement(editingElement.id, { style: updated.style });
                              }}
                            >
                              <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={editingElement.style.textDecoration === 'underline' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const newDecoration = editingElement.style.textDecoration === 'underline' ? 'none' : 'underline';
                                const updated = {
                                  ...editingElement,
                                  style: { ...editingElement.style, textDecoration: newDecoration },
                                };
                                setEditingElement(updated);
                                updateElement(editingElement.id, { style: updated.style });
                              }}
                            >
                              <Underline className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Text Align */}
                        <div>
                          <label className="text-sm font-medium">Alinhamento</label>
                          <div className="flex gap-2 mt-1">
                            {[
                              { value: 'left', icon: AlignLeft },
                              { value: 'center', icon: AlignCenter },
                              { value: 'right', icon: AlignRight },
                            ].map(({ value, icon: Icon }) => (
                              <Button
                                key={value}
                                variant={editingElement.style.textAlign === value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  const updated = {
                                    ...editingElement,
                                    style: { ...editingElement.style, textAlign: value as 'left' | 'center' | 'right' },
                                  };
                                  setEditingElement(updated);
                                  updateElement(editingElement.id, { style: updated.style });
                                }}
                              >
                                <Icon className="h-4 w-4" />
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Text Shadow */}
                        <div>
                          <label className="text-sm font-medium">Sombra / Efeito</label>
                          <select
                            value={editingElement.style.textShadow || 'none'}
                            onChange={(e) => {
                              const updated = {
                                ...editingElement,
                                style: { ...editingElement.style, textShadow: e.target.value },
                              };
                              setEditingElement(updated);
                              updateElement(editingElement.id, { style: updated.style });
                            }}
                            className="w-full p-2 border rounded-lg mt-1"
                          >
                            {TEXT_SHADOW_PRESETS.map((shadow) => (
                              <option key={shadow.name} value={shadow.value}>
                                {shadow.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Letter Spacing */}
                        <div>
                          <label className="text-sm font-medium">Espaçamento entre letras</label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="range"
                              min="-5"
                              max="20"
                              value={parseInt(editingElement.style.letterSpacing || '0')}
                              onChange={(e) => {
                                const updated = {
                                  ...editingElement,
                                  style: { ...editingElement.style, letterSpacing: `${e.target.value}px` },
                                };
                                setEditingElement(updated);
                                updateElement(editingElement.id, { style: updated.style });
                              }}
                              className="flex-1"
                            />
                            <span className="text-sm w-12">{editingElement.style.letterSpacing || '0px'}</span>
                          </div>
                        </div>

                        {/* Text Stroke */}
                        <div>
                          <label className="text-sm font-medium">Contorno do texto</label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="0.5"
                              value={parseFloat(editingElement.style.textStroke?.split(' ')[0] || '0')}
                              onChange={(e) => {
                                const strokeWidth = e.target.value;
                                const strokeColor = editingElement.style.textStroke?.split(' ')[1] || '#000000';
                                const updated = {
                                  ...editingElement,
                                  style: { 
                                    ...editingElement.style, 
                                    textStroke: strokeWidth === '0' ? 'unset' : `${strokeWidth}px ${strokeColor}` 
                                  },
                                };
                                setEditingElement(updated);
                                updateElement(editingElement.id, { style: updated.style });
                              }}
                              className="flex-1"
                            />
                            <input
                              type="color"
                              value={editingElement.style.textStroke?.split(' ')[1] || '#000000'}
                              onChange={(e) => {
                                const strokeWidth = editingElement.style.textStroke?.split(' ')[0] || '1px';
                                const updated = {
                                  ...editingElement,
                                  style: { ...editingElement.style, textStroke: `${strokeWidth} ${e.target.value}` },
                                };
                                setEditingElement(updated);
                                updateElement(editingElement.id, { style: updated.style });
                              }}
                              className="w-10 h-10 rounded border cursor-pointer"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {editingElement.type === 'button' && (
                      <div>
                        <label className="text-sm font-medium">Cor de Fundo</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={editingElement.style.backgroundColor || '#ec4899'}
                            onChange={(e) => {
                              const updated = {
                                ...editingElement,
                                style: { ...editingElement.style, backgroundColor: e.target.value },
                              };
                              setEditingElement(updated);
                              updateElement(editingElement.id, { style: updated.style });
                            }}
                            className="w-10 h-10 rounded border cursor-pointer"
                          />
                          <Input
                            value={editingElement.style.backgroundColor || '#ec4899'}
                            onChange={(e) => {
                              const updated = {
                                ...editingElement,
                                style: { ...editingElement.style, backgroundColor: e.target.value },
                              };
                              setEditingElement(updated);
                              updateElement(editingElement.id, { style: updated.style });
                            }}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {editingElement.type === 'photo' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Largura</label>
                        <Input
                          value={editingElement.style.width?.replace('px', '') || '200'}
                          onChange={(e) => {
                            const updated = {
                              ...editingElement,
                              style: { ...editingElement.style, width: `${e.target.value}px` },
                            };
                            setEditingElement(updated);
                            updateElement(editingElement.id, { style: updated.style });
                          }}
                          type="number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Altura</label>
                        <Input
                          value={editingElement.style.height?.replace('px', '') || '200'}
                          onChange={(e) => {
                            const updated = {
                              ...editingElement,
                              style: { ...editingElement.style, height: `${e.target.value}px` },
                            };
                            setEditingElement(updated);
                            updateElement(editingElement.id, { style: updated.style });
                          }}
                          type="number"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Borda arredondada</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={parseInt(editingElement.style.borderRadius || '8')}
                          onChange={(e) => {
                            const updated = {
                              ...editingElement,
                              style: { ...editingElement.style, borderRadius: `${e.target.value}px` },
                            };
                            setEditingElement(updated);
                            updateElement(editingElement.id, { style: updated.style });
                          }}
                          className="flex-1"
                        />
                        <span className="text-sm w-12">{editingElement.style.borderRadius || '8px'}</span>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {editingElement.type === 'button' && (
                <TabsContent value="action" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Ação do botão</label>
                    <select
                      value={editingElement.buttonProps?.action || ''}
                      onChange={(e) => {
                        const updated = {
                          ...editingElement,
                          buttonProps: { ...editingElement.buttonProps, action: e.target.value || undefined },
                        };
                        setEditingElement(updated);
                        updateElement(editingElement.id, { buttonProps: updated.buttonProps });
                      }}
                      className="w-full p-2 border rounded-lg mt-1"
                    >
                      <option value="">Nenhuma</option>
                      <option value="next">Ir para próximo passo</option>
                      <option value="previous">Voltar para passo anterior</option>
                      <option value="success">Mostrar celebração 🎉</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="randomMove"
                      checked={editingElement.buttonProps?.randomMove || false}
                      onChange={(e) => {
                        const updated = {
                          ...editingElement,
                          buttonProps: { ...editingElement.buttonProps, randomMove: e.target.checked },
                        };
                        setEditingElement(updated);
                        updateElement(editingElement.id, { buttonProps: updated.buttonProps });
                      }}
                      className="rounded"
                    />
                    <label htmlFor="randomMove" className="text-sm cursor-pointer">
                      Botão que foge do mouse 😈
                    </label>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    💡 Use "Ir para próximo passo" para criar uma experiência interativa onde o usuário navega pelos passos.
                  </p>
                </TabsContent>
              )}
            </Tabs>
          )}

          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="destructive"
              onClick={() => editingElement && deleteElement(editingElement.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
            <Button onClick={() => setEditDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CreateTemplatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-pink-500" /></div>}>
      <CreateTemplatePageContent />
    </Suspense>
  );
}
