'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, PanInfo } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import {
  Heart,
  Cake,
  Gift,
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
  Star,
  Circle,
  Square,
  Triangle,
  Timer,
  Sparkles,
  Music,
  Video,
  Smile,
  Eye,
  Minus,
  Cloud,
  Diamond,
  ArrowRight,
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
import { 
  templatesApi, 
  uploadsApi, 
  CardElement, 
  CardCategory, 
  ParticleType, 
  Step,
  CardElementType,
} from '@/lib/api';
import { ParticleBackground } from '@/components/particle-background';

const CARD_CATEGORIES: { id: CardCategory; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'love', name: 'Amor', icon: <Heart className="h-5 w-5" />, color: 'text-rose-500' },
  { id: 'birthday', name: 'Aniversário', icon: <Cake className="h-5 w-5" />, color: 'text-amber-500' },
  { id: 'proposal', name: 'Pedido de Namoro', icon: <Gift className="h-5 w-5" />, color: 'text-purple-500' },
  { id: 'anniversary', name: 'Aniversário de Namoro', icon: <Sparkles className="h-5 w-5" />, color: 'text-pink-500' },
  { id: 'friendship', name: 'Amizade', icon: <Star className="h-5 w-5" />, color: 'text-blue-500' },
  { id: 'thank_you', name: 'Agradecimento', icon: <Heart className="h-5 w-5" />, color: 'text-green-500' },
  { id: 'custom', name: 'Personalizado', icon: <Smile className="h-5 w-5" />, color: 'text-gray-500' },
];

const GRADIENT_PRESETS = [
  // Românticos
  { name: 'Love', value: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', category: 'romantic' },
  { name: 'Rose', value: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)', category: 'romantic' },
  { name: 'Cherry', value: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)', category: 'romantic' },
  { name: 'Passion', value: 'linear-gradient(135deg, #c31432 0%, #240b36 100%)', category: 'romantic' },
  { name: 'Valentine', value: 'linear-gradient(135deg, #e55d87 0%, #5fc3e4 100%)', category: 'romantic' },
  { name: 'Romance', value: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', category: 'romantic' },
  // Sunset/Warm
  { name: 'Sunset', value: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', category: 'warm' },
  { name: 'Peach', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', category: 'warm' },
  { name: 'Gold', value: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', category: 'warm' },
  { name: 'Coral', value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)', category: 'warm' },
  { name: 'Mango', value: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)', category: 'warm' },
  // Cool
  { name: 'Ocean', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)', category: 'cool' },
  { name: 'Sky', value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', category: 'cool' },
  { name: 'Aqua', value: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)', category: 'cool' },
  { name: 'Forest', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', category: 'cool' },
  { name: 'Mint', value: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)', category: 'cool' },
  // Purple/Magic
  { name: 'Purple', value: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)', category: 'magic' },
  { name: 'Mystic', value: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', category: 'magic' },
  { name: 'Galaxy', value: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)', category: 'magic' },
  { name: 'Unicorn', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', category: 'magic' },
  // Dark
  { name: 'Night', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', category: 'dark' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #232526 0%, #414345 100%)', category: 'dark' },
  { name: 'Dark Rose', value: 'linear-gradient(135deg, #4a0e0e 0%, #000000 100%)', category: 'dark' },
  { name: 'Noir', value: 'linear-gradient(135deg, #200122 0%, #6f0000 100%)', category: 'dark' },
];

// Animações para elementos
const ELEMENT_ANIMATIONS = [
  { name: 'Nenhuma', value: 'none', css: '' },
  { name: 'Pulsar', value: 'pulse', css: 'animate-pulse' },
  { name: 'Flutuar', value: 'float', css: 'animate-bounce' },
  { name: 'Brilhar', value: 'glow', css: 'animate-glow' },
  { name: 'Balançar', value: 'shake', css: 'animate-shake' },
  { name: 'Girar', value: 'spin', css: 'animate-spin-slow' },
  { name: 'Zoom', value: 'zoom', css: 'animate-zoom' },
  { name: 'Piscar', value: 'blink', css: 'animate-blink' },
  { name: 'Heartbeat', value: 'heartbeat', css: 'animate-heartbeat' },
  { name: 'Bounce', value: 'bounce', css: 'animate-bounce-soft' },
  { name: 'Wiggle', value: 'wiggle', css: 'animate-wiggle' },
  { name: 'Fade In', value: 'fadeIn', css: 'animate-fade-in' },
  { name: 'Fade Scale', value: 'fadeScale', css: 'animate-fade-scale' },
  { name: 'Arco-íris', value: 'rainbow', css: 'animate-rainbow' },
  { name: 'Sparkle', value: 'sparkle', css: 'animate-sparkle' },
  { name: 'Slide Esquerda', value: 'slideLeft', css: 'animate-slide-left' },
  { name: 'Slide Direita', value: 'slideRight', css: 'animate-slide-right' },
  { name: 'Slide Cima', value: 'slideUp', css: 'animate-slide-up' },
];

// Molduras para fotos
const PHOTO_FRAMES = [
  { name: 'Nenhuma', value: 'none', style: {} },
  { name: 'Polaroid', value: 'polaroid', style: { padding: '12px 12px 40px 12px', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' } },
  { name: 'Círculo', value: 'circle', style: { borderRadius: '50%' } },
  { name: 'Coração', value: 'heart', style: { clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")' } },
  { name: 'Borda Dourada', value: 'gold', style: { border: '4px solid #ffd700', boxShadow: '0 0 10px rgba(255,215,0,0.5)' } },
  { name: 'Borda Rosa', value: 'pink', style: { border: '4px solid #ff69b4', boxShadow: '0 0 10px rgba(255,105,180,0.5)' } },
  { name: 'Sombra Suave', value: 'shadow', style: { boxShadow: '0 10px 30px rgba(0,0,0,0.3)' } },
  { name: 'Vintage', value: 'vintage', style: { border: '8px solid #d4c4a8', filter: 'sepia(30%)' } },
  { name: 'Neon', value: 'neon', style: { border: '3px solid #ff00ff', boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff' } },
];

// Filtros de imagem
const IMAGE_FILTERS = [
  { name: 'Normal', value: 'none' },
  { name: 'Sépia', value: 'sepia(100%)' },
  { name: 'Preto e Branco', value: 'grayscale(100%)' },
  { name: 'Vintage', value: 'sepia(50%) contrast(90%)' },
  { name: 'Brilho', value: 'brightness(120%)' },
  { name: 'Contraste', value: 'contrast(130%)' },
  { name: 'Saturação', value: 'saturate(150%)' },
  { name: 'Blur Suave', value: 'blur(1px)' },
  { name: 'Invertido', value: 'invert(100%)' },
  { name: 'Hue Rosa', value: 'hue-rotate(300deg)' },
  { name: 'Hue Azul', value: 'hue-rotate(180deg)' },
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

const STICKER_CATEGORIES = [
  {
    name: 'Amor',
    emojis: ['❤️', '💕', '💖', '💗', '💘', '💝', '💞', '💟', '💓', '💔', '❣️', '💑', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '💏'],
  },
  {
    name: 'Rostos',
    emojis: ['🥰', '😍', '😘', '🤗', '😊', '🥺', '🤩', '😻', '😇', '🥳', '😏', '🤭', '😌', '🥲', '😭', '🤧'],
  },
  {
    name: 'Flores',
    emojis: ['🌹', '🌸', '🌺', '🌷', '💐', '🌻', '🌼', '🪷', '🌱', '🌿', '🍀', '🪴', '🌵', '🌾', '💮', '🏵️'],
  },
  {
    name: 'Brilhos',
    emojis: ['⭐', '✨', '💫', '🌟', '⚡', '🔥', '💥', '🎇', '🎆', '🌠', '☄️', '💡', '🔮', '🪩', '✳️', '❇️'],
  },
  {
    name: 'Festa',
    emojis: ['🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍰', '🧁', '🥂', '🍾', '🎤', '🎧', '🪅', '🎯', '🎪', '🎭'],
  },
  {
    name: 'Natureza',
    emojis: ['🦋', '🐝', '🌈', '☀️', '🌙', '⭐', '🌸', '🍃', '🌊', '🏔️', '🌅', '🌄', '🌇', '🌃', '🌉', '🌌'],
  },
  {
    name: 'Luxo',
    emojis: ['💎', '👑', '🏆', '💍', '👸', '🤴', '🦄', '🌈', '🎩', '🪄', '💅', '👗', '👠', '💄', '🛍️', '🎭'],
  },
  {
    name: 'Comida',
    emojis: ['🍕', '🍫', '🍰', '🧁', '🍩', '🍪', '🍬', '🍭', '🍓', '🍒', '🍑', '🥝', '🍇', '🥐', '☕', '🧋'],
  },
  {
    name: 'Símbolos',
    emojis: ['♥️', '♡', '☆', '★', '○', '●', '◇', '◆', '△', '▲', '∞', '♾️', '☯️', '☮️', '✝️', '☪️'],
  },
  {
    name: 'Mãos',
    emojis: ['🤝', '🙏', '👏', '🤲', '🫶', '🤞', '🤟', '🤘', '👍', '👎', '✌️', '🖐️', '👋', '🫰', '🫵', '💪'],
  },
];

// Flatten for backward compatibility
const STICKER_EMOJIS = STICKER_CATEGORIES.flatMap(cat => cat.emojis).slice(0, 64);

const SHAPES = [
  { id: 'heart', name: 'Coração', icon: <Heart className="h-5 w-5" /> },
  { id: 'star', name: 'Estrela', icon: <Star className="h-5 w-5" /> },
  { id: 'circle', name: 'Círculo', icon: <Circle className="h-5 w-5" /> },
  { id: 'rectangle', name: 'Retângulo', icon: <Square className="h-5 w-5" /> },
  { id: 'triangle', name: 'Triângulo', icon: <Triangle className="h-5 w-5" /> },
  { id: 'arrow', name: 'Seta', icon: <ArrowRight className="h-5 w-5" /> },
  { id: 'cloud', name: 'Nuvem', icon: <Cloud className="h-5 w-5" /> },
  { id: 'diamond', name: 'Diamante', icon: <Diamond className="h-5 w-5" /> },
  { id: 'moon', name: 'Lua', icon: <span>🌙</span> },
  { id: 'sun', name: 'Sol', icon: <span>☀️</span> },
  { id: 'flower', name: 'Flor', icon: <span>🌸</span> },
  { id: 'butterfly', name: 'Borboleta', icon: <span>🦋</span> },
  { id: 'ring', name: 'Anel', icon: <span>💍</span> },
  { id: 'infinity', name: 'Infinito', icon: <span>∞</span> },
  { id: 'music', name: 'Nota', icon: <Music className="h-5 w-5" /> },
  { id: 'sparkle', name: 'Brilho', icon: <Sparkles className="h-5 w-5" /> },
];

// Templates prontos por categoria
const QUICK_TEMPLATES = {
  love: [
    { name: 'Romântico Simples', bg: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', elements: ['❤️', 'Te amo'] },
    { name: 'Paixão', bg: 'linear-gradient(135deg, #c31432 0%, #240b36 100%)', elements: ['🔥', 'Você é tudo'] },
    { name: 'Delicado', bg: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', elements: ['🌸', 'Meu amor'] },
  ],
  birthday: [
    { name: 'Festa', bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', elements: ['🎉', 'Feliz Aniversário!'] },
    { name: 'Elegante', bg: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)', elements: ['✨', 'Parabéns!'] },
  ],
  proposal: [
    { name: 'Clássico', bg: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', elements: ['💍', 'Quer namorar comigo?'] },
    { name: 'Divertido', bg: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)', elements: ['🥰', 'Namora comigo?'] },
  ],
};

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

  const renderShape = () => {
    const { shapeType, fill, stroke, strokeWidth } = element.shapeProps || { shapeType: 'heart' };
    const size = parseInt(element.style.width || '60');
    
    switch (shapeType) {
      case 'heart':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#ff6b6b'} stroke={stroke} strokeWidth={strokeWidth || 0}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 'star':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#ffd700'} stroke={stroke} strokeWidth={strokeWidth || 0}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        );
      case 'circle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill={fill || '#4ecdc4'} stroke={stroke} strokeWidth={strokeWidth || 0}/>
          </svg>
        );
      case 'rectangle':
        return (
          <svg width={size} height={size * 0.75} viewBox="0 0 24 18">
            <rect x="1" y="1" width="22" height="16" rx="2" fill={fill || '#9b59b6'} stroke={stroke} strokeWidth={strokeWidth || 0}/>
          </svg>
        );
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#e74c3c'} stroke={stroke} strokeWidth={strokeWidth || 0}>
            <polygon points="12 2 22 22 2 22"/>
          </svg>
        );
      case 'arrow':
        return (
          <svg width={size} height={size * 0.5} viewBox="0 0 24 12" fill={fill || '#3498db'} stroke={stroke} strokeWidth={strokeWidth || 0}>
            <path d="M0 6h18l-6-6h4l8 6-8 6h-4l6-6H0z"/>
          </svg>
        );
      case 'cloud':
        return (
          <svg width={size} height={size * 0.6} viewBox="0 0 24 14" fill={fill || '#ecf0f1'} stroke={stroke || '#bdc3c7'} strokeWidth={strokeWidth || 1}>
            <path d="M19.35 6.04A7.49 7.49 0 0012 0C9.11 0 6.6 1.64 5.35 4.04A5.994 5.994 0 000 10c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
        );
      case 'diamond':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#9b59b6'} stroke={stroke} strokeWidth={strokeWidth || 0}>
            <polygon points="12 2 22 12 12 22 2 12"/>
          </svg>
        );
      case 'moon':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#f1c40f'} stroke={stroke} strokeWidth={strokeWidth || 0}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        );
      case 'sun':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#f39c12'} stroke={stroke} strokeWidth={strokeWidth || 0}>
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3" stroke={fill || '#f39c12'} strokeWidth="2"/>
            <line x1="12" y1="21" x2="12" y2="23" stroke={fill || '#f39c12'} strokeWidth="2"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={fill || '#f39c12'} strokeWidth="2"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={fill || '#f39c12'} strokeWidth="2"/>
            <line x1="1" y1="12" x2="3" y2="12" stroke={fill || '#f39c12'} strokeWidth="2"/>
            <line x1="21" y1="12" x2="23" y2="12" stroke={fill || '#f39c12'} strokeWidth="2"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={fill || '#f39c12'} strokeWidth="2"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={fill || '#f39c12'} strokeWidth="2"/>
          </svg>
        );
      case 'flower':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#e91e63'}>
            <circle cx="12" cy="12" r="3" fill="#ffeb3b"/>
            <ellipse cx="12" cy="5" rx="3" ry="4" fill={fill || '#e91e63'}/>
            <ellipse cx="12" cy="19" rx="3" ry="4" fill={fill || '#e91e63'}/>
            <ellipse cx="5" cy="12" rx="4" ry="3" fill={fill || '#e91e63'}/>
            <ellipse cx="19" cy="12" rx="4" ry="3" fill={fill || '#e91e63'}/>
            <ellipse cx="7" cy="7" rx="3" ry="3" fill={fill || '#e91e63'} transform="rotate(-45 7 7)"/>
            <ellipse cx="17" cy="7" rx="3" ry="3" fill={fill || '#e91e63'} transform="rotate(45 17 7)"/>
            <ellipse cx="7" cy="17" rx="3" ry="3" fill={fill || '#e91e63'} transform="rotate(45 7 17)"/>
            <ellipse cx="17" cy="17" rx="3" ry="3" fill={fill || '#e91e63'} transform="rotate(-45 17 17)"/>
          </svg>
        );
      case 'butterfly':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#9c27b0'}>
            <ellipse cx="7" cy="9" rx="5" ry="6" fill={fill || '#9c27b0'}/>
            <ellipse cx="17" cy="9" rx="5" ry="6" fill={fill || '#9c27b0'}/>
            <ellipse cx="7" cy="16" rx="4" ry="5" fill={fill || '#9c27b0'} opacity="0.8"/>
            <ellipse cx="17" cy="16" rx="4" ry="5" fill={fill || '#9c27b0'} opacity="0.8"/>
            <ellipse cx="12" cy="12" rx="1" ry="6" fill="#333"/>
          </svg>
        );
      case 'ring':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24">
            <circle cx="12" cy="14" r="8" fill="none" stroke={fill || '#ffd700'} strokeWidth="3"/>
            <circle cx="12" cy="6" r="3" fill={fill || '#ffd700'}/>
            <path d="M9 6 L12 3 L15 6" fill={fill || '#ffd700'}/>
          </svg>
        );
      case 'infinity':
        return (
          <svg width={size} height={size * 0.5} viewBox="0 0 24 12" fill="none" stroke={fill || '#e91e63'} strokeWidth="2">
            <path d="M6 6c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4zm8 0c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4z"/>
          </svg>
        );
      case 'music':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#2196f3'}>
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        );
      case 'sparkle':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#ffc107'}>
            <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z"/>
            <path d="M19 2L20 5L23 6L20 7L19 10L18 7L15 6L18 5L19 2Z" opacity="0.6"/>
            <path d="M5 14L6 17L9 18L6 19L5 22L4 19L1 18L4 17L5 14Z" opacity="0.6"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Get animation class
  const getAnimationClass = () => {
    const animation = element.style.animation;
    if (!animation || animation === 'none') return '';
    
    const anim = ELEMENT_ANIMATIONS.find(a => a.value === animation);
    return anim?.css || '';
  };

  // Get photo frame style
  const getPhotoFrameStyle = (): React.CSSProperties => {
    const frame = element.style.frame;
    if (!frame || frame === 'none') return {};
    
    const frameStyles: Record<string, React.CSSProperties> = {
      'polaroid': { padding: '12px 12px 40px 12px', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
      'circle': { borderRadius: '50%', overflow: 'hidden' },
      'gold': { border: '4px solid #ffd700', boxShadow: '0 0 10px rgba(255,215,0,0.5)' },
      'pink': { border: '4px solid #ff69b4', boxShadow: '0 0 10px rgba(255,105,180,0.5)' },
      'shadow': { boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
      'vintage': { border: '8px solid #d4c4a8' },
      'neon': { border: '3px solid #ff00ff', boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff' },
    };
    return frameStyles[frame] || {};
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={containerRef}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      initial={{ x: element.position.x, y: element.position.y }}
      animate={{ x: element.position.x, y: element.position.y }}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${getAnimationClass()}`}
      onClick={(e) => onClick(e, element)}
      whileDrag={{ scale: 1.02, zIndex: 100 }}
      style={{ touchAction: 'none' }}
    >
      {element.type === 'text' && (
        <p style={getTextStyle()} className={getAnimationClass()}>
          {element.content}
        </p>
      )}
      {element.type === 'photo' && (
        <div style={getPhotoFrameStyle()}>
          <img
            src={element.content || 'https://via.placeholder.com/200'}
            alt="Element"
            draggable={false}
            className={getAnimationClass()}
            style={{
              width: element.style.width,
              height: element.style.height,
              objectFit: 'cover',
              borderRadius: element.style.borderRadius || '8px',
              boxShadow: element.style.boxShadow || 'none',
              filter: element.style.filter || 'none',
            }}
          />
        </div>
      )}
      {element.type === 'button' && (
        <button
          className={`px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105 ${getAnimationClass()}`}
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
      {element.type === 'sticker' && (
        <span className={getAnimationClass()} style={{ fontSize: element.style.fontSize || '48px', display: 'inline-block' }}>
          {element.content}
        </span>
      )}
      {element.type === 'shape' && <div className={getAnimationClass()}>{renderShape()}</div>}
      {element.type === 'divider' && (
        <div
          className={getAnimationClass()}
          style={{
            width: element.style.width || '200px',
            height: '4px',
            backgroundColor: element.style.backgroundColor || '#ffffff',
            borderRadius: '2px',
            opacity: element.style.opacity || '0.8',
          }}
        />
      )}
      {element.type === 'gif' && (
        <img
          src={element.content}
          alt="GIF"
          draggable={false}
          className={getAnimationClass()}
          style={{
            width: element.style.width || '200px',
            height: element.style.height || 'auto',
            borderRadius: element.style.borderRadius || '8px',
          }}
        />
      )}
      {element.type === 'countdown' && (
        <div
          className={`text-center p-4 rounded-lg ${getAnimationClass()}`}
          style={{
            backgroundColor: element.style.backgroundColor || 'rgba(255,255,255,0.2)',
            color: element.style.color || '#ffffff',
          }}
        >
          <p className="text-sm mb-1">{element.countdownProps?.label || 'Contagem'}</p>
          <p style={{ fontSize: element.style.fontSize || '24px', fontWeight: 'bold' }}>
            ⏰ {element.countdownProps?.targetDate || '00:00:00'}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function CreateCardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('id');
  const initialCategory = (searchParams.get('categoria') || 'love') as CardCategory;

  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [cardCategory, setCardCategory] = useState<CardCategory>(initialCategory);
  
  // Steps state
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<CardElement | null>(null);
  const [activeEditTab, setActiveEditTab] = useState('content');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    if (templateId && token) {
      loadTemplate();
    } else if (steps.length === 0) {
      initializeDefaultSteps();
    }
  }, [templateId, token]);

  const loadTemplate = async () => {
    if (!token || !templateId) return;

    try {
      setLoading(true);
      const template = await templatesApi.getById(token, templateId);
      
      setTitle(template.title);
      setCardCategory(template.cardCategory || 'love');
      
      if (template.steps && template.steps.length > 0) {
        setSteps(template.steps);
      } else {
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
    const categoryConfig = CARD_CATEGORIES.find(c => c.id === cardCategory);
    const defaultTitle = cardCategory === 'love'
      ? 'Meu Cartão de Amor'
      : cardCategory === 'birthday'
      ? 'Feliz Aniversário!'
      : cardCategory === 'proposal'
      ? 'Quer Namorar Comigo?'
      : cardCategory === 'anniversary'
      ? 'Feliz Aniversário de Namoro!'
      : cardCategory === 'friendship'
      ? 'Para Meu Melhor Amigo(a)'
      : cardCategory === 'thank_you'
      ? 'Muito Obrigado(a)!'
      : 'Meu Cartão Especial';

    setTitle(defaultTitle);

    if (cardCategory === 'proposal') {
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
      const bgColor = cardCategory === 'love' 
        ? 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)'
        : cardCategory === 'birthday'
        ? 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)'
        : cardCategory === 'anniversary'
        ? 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)'
        : cardCategory === 'friendship'
        ? 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)'
        : cardCategory === 'thank_you'
        ? 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
        : 'linear-gradient(135deg, #232526 0%, #414345 100%)';

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
        backgroundColor: bgColor,
        showParticles: true,
        particleType: 'hearts',
      }]);
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);

      // Deep clone to ensure proper serialization
      const clonedSteps = JSON.parse(JSON.stringify(steps));
      const clonedElements = JSON.parse(JSON.stringify(steps[0]?.elements || []));

      const templateData = {
        title,
        type: 'card' as const,
        cardCategory,
        elements: clonedElements,
        backgroundColor: steps[0]?.backgroundColor || '#be185d',
        backgroundImage: steps[0]?.backgroundImage,
        showParticles: steps[0]?.showParticles ?? true,
        particleType: steps[0]?.particleType || 'hearts',
        steps: clonedSteps,
      };

      console.log('Saving template:', JSON.stringify(templateData, null, 2));

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
  const addElement = (type: CardElementType, content?: string, additionalProps?: Partial<CardElement>) => {
    const newElement: CardElement = {
      id: Date.now().toString(),
      type,
      content: content || (type === 'text' ? 'Novo texto' : ''),
      position: { x: 200, y: 200 },
      style: {
        width: type === 'photo' || type === 'gif' ? '200px' : type === 'divider' ? '300px' : undefined,
        height: type === 'photo' ? '200px' : undefined,
        fontSize: type === 'button' ? '18px' : type === 'sticker' ? '48px' : '32px',
        color: '#ffffff',
        textAlign: 'center',
        backgroundColor: type === 'button' ? '#ec4899' : type === 'divider' ? '#ffffff' : undefined,
        textShadow: type === 'text' ? '2px 2px 4px rgba(0,0,0,0.3)' : undefined,
      },
      buttonProps: type === 'button' ? { text: 'Clique aqui', randomMove: false } : undefined,
      ...additionalProps,
    };

    updateCurrentStep({
      elements: [...currentStep.elements, newElement],
    });
    setSelectedElement(newElement.id);
    setShowStickerPicker(false);
    setShowShapePicker(false);
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
        addElement('photo', imageUrl);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem');
    }
  };

  const getCategoryInfo = () => {
    return CARD_CATEGORIES.find(c => c.id === cardCategory) || CARD_CATEGORIES[0];
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
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className={getCategoryInfo().color}>{getCategoryInfo().icon}</span>
                <h1 className="text-lg font-bold text-gray-900">Cartão Especial</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-pink-500 to-purple-600">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Steps Navigation */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-30">
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
            <Button variant="outline" size="sm" onClick={addStep} className="rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              Novo Passo
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white rounded-xl shadow-lg p-4 space-y-4 h-fit max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Category Selection */}
          <div className="border-b pb-4">
            <h2 className="font-semibold text-gray-800 mb-3">Categoria do Cartão</h2>
            <select
              value={cardCategory}
              onChange={(e) => setCardCategory(e.target.value as CardCategory)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              {CARD_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Step Settings */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Passo {currentStepIndex + 1}
              </h2>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => duplicateStep(currentStepIndex)} title="Duplicar passo">
                  <Copy className="h-4 w-4" />
                </Button>
                {steps.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => deleteStep(currentStepIndex)} className="text-red-500 hover:text-red-600" title="Excluir passo">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do cartão"
              className="text-sm mb-2"
            />
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
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => addElement('text')}>
                <Type className="h-4 w-4" />
                <span className="text-[10px]">Texto</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => fileInputRef.current?.click()}>
                <Image className="h-4 w-4" />
                <span className="text-[10px]">Foto</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => addElement('button')}>
                <Move className="h-4 w-4" />
                <span className="text-[10px]">Botão</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => setShowStickerPicker(!showStickerPicker)}>
                <Smile className="h-4 w-4" />
                <span className="text-[10px]">Sticker</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => setShowShapePicker(!showShapePicker)}>
                <Heart className="h-4 w-4" />
                <span className="text-[10px]">Forma</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => addElement('divider')}>
                <Minus className="h-4 w-4" />
                <span className="text-[10px]">Divisor</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1" onClick={() => addElement('countdown', '', { countdownProps: { targetDate: new Date().toISOString().split('T')[0], label: 'Contagem' } })}>
                <Timer className="h-4 w-4" />
                <span className="text-[10px]">Timer</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-col h-16 gap-1 opacity-50" disabled title="Em breve">
                <Video className="h-4 w-4" />
                <span className="text-[10px]">Vídeo</span>
              </Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e)} className="hidden" />

            {/* Sticker Picker */}
            {showStickerPicker && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                <p className="text-xs text-gray-500 mb-2">Escolha um sticker:</p>
                {STICKER_CATEGORIES.map((category) => (
                  <div key={category.name} className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">{category.name}</p>
                    <div className="grid grid-cols-8 gap-1">
                      {category.emojis.map((emoji, idx) => (
                        <button
                          key={`${category.name}-${idx}`}
                          onClick={() => addElement('sticker', emoji)}
                          className="text-2xl p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Shape Picker */}
            {showShapePicker && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Escolha uma forma:</p>
                <div className="grid grid-cols-4 gap-2">
                  {SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => addElement('shape', '', { shapeProps: { shapeType: shape.id as any, fill: '#ff6b6b' }, style: { width: '60px' } })}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-gray-200 rounded transition-colors"
                    >
                      {shape.icon}
                      <span className="text-[10px]">{shape.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Background */}
          <div className="border-b pb-4">
            <h2 className="font-semibold text-gray-800 mb-3">Fundo</h2>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setShowColorPicker(!showColorPicker)}>
                <PaintBucket className="h-4 w-4 mr-2" />
                Cor / Gradiente
                <div className="w-6 h-6 rounded ml-auto border" style={{ background: currentStep.backgroundColor }} />
              </Button>
              {showColorPicker && (
                <div className="p-2 bg-gray-50 rounded-lg max-h-80 overflow-y-auto">
                  <HexColorPicker 
                    color={currentStep.backgroundColor?.startsWith('#') ? currentStep.backgroundColor : '#be185d'} 
                    onChange={(color) => updateCurrentStep({ backgroundColor: color })} 
                  />
                  
                  {/* Gradientes por categoria */}
                  {['romantic', 'warm', 'cool', 'magic', 'dark'].map((category) => (
                    <div key={category} className="mt-2">
                      <p className="text-xs text-gray-500 mb-1 capitalize">
                        {category === 'romantic' ? '💕 Romântico' : 
                         category === 'warm' ? '☀️ Quente' :
                         category === 'cool' ? '🌊 Frio' :
                         category === 'magic' ? '✨ Mágico' : '🌙 Escuro'}
                      </p>
                      <div className="grid grid-cols-4 gap-1">
                        {GRADIENT_PRESETS.filter(p => p.category === category).map((preset) => (
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
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => backgroundInputRef.current?.click()}>
                <Image className="h-4 w-4 mr-2" />
                Imagem de Fundo
              </Button>
              {currentStep.backgroundImage && (
                <Button variant="outline" size="sm" className="w-full justify-start text-red-500" onClick={() => updateCurrentStep({ backgroundImage: undefined })}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Imagem
                </Button>
              )}
              <input ref={backgroundInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
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
                  <option value="confetti">Confete 🎊</option>
                  <option value="stars">Estrelas ⭐</option>
                  <option value="petals">Pétalas 🌸</option>
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
              <Button variant="outline" disabled={currentStepIndex === 0} onClick={() => setCurrentStepIndex(currentStepIndex - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <span className="flex items-center text-gray-500">
                {currentStepIndex + 1} / {steps.length}
              </span>
              <Button variant="outline" disabled={currentStepIndex === steps.length - 1} onClick={() => setCurrentStepIndex(currentStepIndex + 1)}>
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
              Editar {editingElement?.type === 'text' ? 'Texto' : editingElement?.type === 'button' ? 'Botão' : editingElement?.type === 'sticker' ? 'Sticker' : editingElement?.type === 'shape' ? 'Forma' : 'Elemento'}
            </DialogTitle>
          </DialogHeader>

          {editingElement && (
            <Tabs value={activeEditTab} onValueChange={setActiveEditTab}>
              <TabsList className="w-full">
                <TabsTrigger value="content" className="flex-1">Conteúdo</TabsTrigger>
                <TabsTrigger value="style" className="flex-1">Estilo</TabsTrigger>
                <TabsTrigger value="effects" className="flex-1">Efeitos</TabsTrigger>
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

                {editingElement.type === 'sticker' && (
                  <div>
                    <label className="text-sm font-medium">Trocar Sticker</label>
                    <div className="grid grid-cols-8 gap-1 mt-2">
                      {STICKER_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            const updated = { ...editingElement, content: emoji };
                            setEditingElement(updated);
                            updateElement(editingElement.id, { content: emoji });
                          }}
                          className={`text-2xl p-1 rounded transition-colors ${editingElement.content === emoji ? 'bg-pink-100' : 'hover:bg-gray-200'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {editingElement.type === 'shape' && (
                  <div>
                    <label className="text-sm font-medium">Cor da Forma</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={editingElement.shapeProps?.fill || '#ff6b6b'}
                        onChange={(e) => {
                          const updated = {
                            ...editingElement,
                            shapeProps: { ...editingElement.shapeProps!, fill: e.target.value },
                          };
                          setEditingElement(updated);
                          updateElement(editingElement.id, { shapeProps: updated.shapeProps });
                        }}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={editingElement.shapeProps?.fill || '#ff6b6b'}
                        onChange={(e) => {
                          const updated = {
                            ...editingElement,
                            shapeProps: { ...editingElement.shapeProps!, fill: e.target.value },
                          };
                          setEditingElement(updated);
                          updateElement(editingElement.id, { shapeProps: updated.shapeProps });
                        }}
                        className="flex-1"
                      />
                    </div>
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

                {editingElement.type === 'countdown' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Rótulo</label>
                      <Input
                        value={editingElement.countdownProps?.label || ''}
                        onChange={(e) => {
                          const updated = {
                            ...editingElement,
                            countdownProps: { ...editingElement.countdownProps!, label: e.target.value },
                          };
                          setEditingElement(updated);
                          updateElement(editingElement.id, { countdownProps: updated.countdownProps });
                        }}
                        placeholder="Contagem regressiva"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Data Alvo</label>
                      <Input
                        type="date"
                        value={editingElement.countdownProps?.targetDate || ''}
                        onChange={(e) => {
                          const updated = {
                            ...editingElement,
                            countdownProps: { ...editingElement.countdownProps!, targetDate: e.target.value },
                          };
                          setEditingElement(updated);
                          updateElement(editingElement.id, { countdownProps: updated.countdownProps });
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="style" className="space-y-4 mt-4">
                {(editingElement.type === 'text' || editingElement.type === 'button' || editingElement.type === 'sticker') && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Tamanho</label>
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

                    {editingElement.type !== 'sticker' && (
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
                    )}

                    {editingElement.type === 'text' && (
                      <>
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

                {(editingElement.type === 'photo' || editingElement.type === 'shape') && (
                  <div>
                    <label className="text-sm font-medium">Tamanho</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range"
                        min="20"
                        max="400"
                        value={parseInt(editingElement.style.width || '60')}
                        onChange={(e) => {
                          const updated = {
                            ...editingElement,
                            style: { ...editingElement.style, width: `${e.target.value}px`, height: editingElement.type === 'photo' ? `${e.target.value}px` : undefined },
                          };
                          setEditingElement(updated);
                          updateElement(editingElement.id, { style: updated.style });
                        }}
                        className="flex-1"
                      />
                      <span className="text-sm w-16">{editingElement.style.width}</span>
                    </div>
                  </div>
                )}

                {editingElement.type === 'photo' && (
                  <>
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

                    {/* Molduras */}
                    <div>
                      <label className="text-sm font-medium">Moldura</label>
                      <select
                        value={(editingElement.style as any).frame || 'none'}
                        onChange={(e) => {
                          const updated = {
                            ...editingElement,
                            style: { ...editingElement.style, frame: e.target.value },
                          };
                          setEditingElement(updated);
                          updateElement(editingElement.id, { style: updated.style });
                        }}
                        className="w-full p-2 border rounded-lg mt-1"
                      >
                        {PHOTO_FRAMES.map((frame) => (
                          <option key={frame.value} value={frame.value}>
                            {frame.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtros */}
                    <div>
                      <label className="text-sm font-medium">Filtro</label>
                      <select
                        value={editingElement.style.filter || 'none'}
                        onChange={(e) => {
                          const updated = {
                            ...editingElement,
                            style: { ...editingElement.style, filter: e.target.value },
                          };
                          setEditingElement(updated);
                          updateElement(editingElement.id, { style: updated.style });
                        }}
                        className="w-full p-2 border rounded-lg mt-1"
                      >
                        {IMAGE_FILTERS.map((filter) => (
                          <option key={filter.value} value={filter.value}>
                            {filter.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {editingElement.type === 'divider' && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Largura</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="50"
                          max="600"
                          value={parseInt(editingElement.style.width || '200')}
                          onChange={(e) => {
                            const updated = {
                              ...editingElement,
                              style: { ...editingElement.style, width: `${e.target.value}px` },
                            };
                            setEditingElement(updated);
                            updateElement(editingElement.id, { style: updated.style });
                          }}
                          className="flex-1"
                        />
                        <span className="text-sm w-16">{editingElement.style.width}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cor</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={editingElement.style.backgroundColor || '#ffffff'}
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
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Effects Tab */}
              <TabsContent value="effects" className="space-y-4 mt-4">
                {/* Animação */}
                <div>
                  <label className="text-sm font-medium">Animação</label>
                  <select
                    value={(editingElement.style as any).animation || 'none'}
                    onChange={(e) => {
                      const updated = {
                        ...editingElement,
                        style: { ...editingElement.style, animation: e.target.value },
                      };
                      setEditingElement(updated);
                      updateElement(editingElement.id, { style: updated.style });
                    }}
                    className="w-full p-2 border rounded-lg mt-1"
                  >
                    {ELEMENT_ANIMATIONS.map((anim) => (
                      <option key={anim.value} value={anim.value}>
                        {anim.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    💡 As animações tornam o elemento mais dinâmico e chamativo
                  </p>
                </div>

                {/* Preview da animação */}
                {(editingElement.style as any).animation && (editingElement.style as any).animation !== 'none' && (
                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className={`inline-block ${ELEMENT_ANIMATIONS.find(a => a.value === (editingElement.style as any).animation)?.css || ''}`}>
                      {editingElement.type === 'text' && <span className="text-2xl">{editingElement.content.slice(0, 20)}</span>}
                      {editingElement.type === 'sticker' && <span className="text-4xl">{editingElement.content}</span>}
                      {editingElement.type === 'button' && <span className="px-4 py-2 bg-pink-500 text-white rounded">{editingElement.buttonProps?.text || 'Botão'}</span>}
                      {editingElement.type === 'shape' && <span className="text-4xl">⬟</span>}
                      {editingElement.type === 'photo' && <span className="text-4xl">🖼️</span>}
                      {editingElement.type === 'countdown' && <span className="text-4xl">⏰</span>}
                      {editingElement.type === 'divider' && <div className="w-20 h-1 bg-gray-400 rounded" />}
                    </div>
                  </div>
                )}

                {/* Mais animações especiais */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const updated = {
                        ...editingElement,
                        style: { ...editingElement.style, animation: 'heartbeat' },
                      };
                      setEditingElement(updated);
                      updateElement(editingElement.id, { style: updated.style });
                    }}
                    className={`p-3 border rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-pink-50 ${(editingElement.style as any).animation === 'heartbeat' ? 'border-pink-500 bg-pink-50' : ''}`}
                  >
                    <Heart className="h-4 w-4 text-pink-500 animate-heartbeat" />
                    Heartbeat
                  </button>
                  <button
                    onClick={() => {
                      const updated = {
                        ...editingElement,
                        style: { ...editingElement.style, animation: 'bounce' },
                      };
                      setEditingElement(updated);
                      updateElement(editingElement.id, { style: updated.style });
                    }}
                    className={`p-3 border rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-blue-50 ${(editingElement.style as any).animation === 'bounce' ? 'border-blue-500 bg-blue-50' : ''}`}
                  >
                    <span className="animate-bounce">⬆️</span>
                    Bounce
                  </button>
                  <button
                    onClick={() => {
                      const updated = {
                        ...editingElement,
                        style: { ...editingElement.style, animation: 'wiggle' },
                      };
                      setEditingElement(updated);
                      updateElement(editingElement.id, { style: updated.style });
                    }}
                    className={`p-3 border rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-purple-50 ${(editingElement.style as any).animation === 'wiggle' ? 'border-purple-500 bg-purple-50' : ''}`}
                  >
                    <span className="animate-wiggle">↔️</span>
                    Wiggle
                  </button>
                  <button
                    onClick={() => {
                      const updated = {
                        ...editingElement,
                        style: { ...editingElement.style, animation: 'none' },
                      };
                      setEditingElement(updated);
                      updateElement(editingElement.id, { style: updated.style });
                    }}
                    className={`p-3 border rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-50 ${(editingElement.style as any).animation === 'none' || !(editingElement.style as any).animation ? 'border-gray-500 bg-gray-50' : ''}`}
                  >
                    ❌ Sem animação
                  </button>
                </div>

                {/* Opacidade */}
                <div>
                  <label className="text-sm font-medium">Opacidade</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={parseInt(String(editingElement.style.opacity || '100').replace('%', ''))}
                      onChange={(e) => {
                        const updated = {
                          ...editingElement,
                          style: { ...editingElement.style, opacity: `${e.target.value}%` },
                        };
                        setEditingElement(updated);
                        updateElement(editingElement.id, { style: updated.style });
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{editingElement.style.opacity || '100%'}</span>
                  </div>
                </div>

                {/* Rotação */}
                <div>
                  <label className="text-sm font-medium">Rotação</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={parseInt(String(editingElement.style.transform || '0').replace(/rotate\(|deg\)/g, '')) || 0}
                      onChange={(e) => {
                        const updated = {
                          ...editingElement,
                          style: { ...editingElement.style, transform: `rotate(${e.target.value}deg)` },
                        };
                        setEditingElement(updated);
                        updateElement(editingElement.id, { style: updated.style });
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{parseInt(String(editingElement.style.transform || '0').replace(/rotate\(|deg\)/g, '')) || 0}°</span>
                  </div>
                </div>

                {/* Escala */}
                <div>
                  <label className="text-sm font-medium">Escala</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={100}
                      onChange={(e) => {
                        const scale = parseInt(e.target.value) / 100;
                        const currentTransform = editingElement.style.transform || '';
                        const newTransform = currentTransform.includes('scale') 
                          ? currentTransform.replace(/scale\([^)]+\)/, `scale(${scale})`)
                          : `${currentTransform} scale(${scale})`.trim();
                        const updated = {
                          ...editingElement,
                          style: { ...editingElement.style, transform: newTransform },
                        };
                        setEditingElement(updated);
                        updateElement(editingElement.id, { style: updated.style });
                      }}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">100%</span>
                  </div>
                </div>
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
            <Button variant="destructive" onClick={() => editingElement && deleteElement(editingElement.id)}>
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

