'use client';

import { useState, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Copy, 
  Heart, 
  HelpCircle, 
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
} from '@/components/ui/dialog';
import { PublicTemplate, CardElement, TimelineEvent, QuizQuestion } from '@/lib/api';
import { ParticleBackground } from '@/components/particle-background';

interface TemplatePreviewModalProps {
  template: PublicTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onClone: (template: PublicTemplate) => void;
  isCloning?: boolean;
}

export function TemplatePreviewModal({ 
  template, 
  isOpen, 
  onClose, 
  onClone,
  isCloning = false,
}: TemplatePreviewModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setQuizAnswers({});
      setShowQuizResult(false);
      setEnvelopeOpen(false);
    }
  }, [isOpen, template]);

  if (!template) return null;

  // PublicTemplate doesn't have steps, so we use the template's direct properties
  const currentStep = {
    elements: template.elements || [],
    backgroundColor: template.backgroundColor,
    backgroundImage: template.backgroundImage,
    showParticles: template.showParticles,
    particleType: template.particleType,
  };

  // Render element
  const renderElement = (element: CardElement) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.position.x,
      top: element.position.y,
    };

    switch (element.type) {
      case 'text':
        return (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              ...baseStyle,
              fontSize: element.style.fontSize,
              color: element.style.color,
              textAlign: element.style.textAlign as any,
              textShadow: element.style.textShadow,
              fontWeight: element.style.fontWeight,
              fontFamily: element.style.fontFamily,
            }}
            className={element.style.animation ? `animate-${element.style.animation}` : ''}
          >
            {element.content}
          </motion.div>
        );
      
      case 'photo':
        return (
          <motion.img
            key={element.id}
            src={element.content}
            alt=""
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              ...baseStyle,
              width: element.style.width,
              height: element.style.height,
              objectFit: 'cover',
              borderRadius: element.style.borderRadius || '8px',
              filter: element.style.filter,
            }}
          />
        );

      case 'sticker':
        return (
          <motion.span
            key={element.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              ...baseStyle,
              fontSize: element.style.fontSize || '48px',
            }}
            className={element.style.animation ? `animate-${element.style.animation}` : ''}
          >
            {element.content}
          </motion.span>
        );

      case 'button':
        return (
          <motion.button
            key={element.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 rounded-lg shadow-lg transition-transform hover:scale-105"
            style={{
              ...baseStyle,
              backgroundColor: element.style.backgroundColor || '#ec4899',
              color: element.style.color || '#ffffff',
              fontSize: element.style.fontSize,
            }}
            onClick={() => {
              // Button click handler - no steps navigation for PublicTemplate preview
            }}
          >
            {element.buttonProps?.text || 'Botão'}
          </motion.button>
        );

      case 'shape':
        return (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            style={baseStyle}
          >
            {renderShape(element)}
          </motion.div>
        );

      case 'divider':
        return (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            style={{
              ...baseStyle,
              width: element.style.width || '200px',
              height: '4px',
              backgroundColor: element.style.backgroundColor || '#ffffff',
              borderRadius: '2px',
            }}
          />
        );

      default:
        return null;
    }
  };

  // Render shape SVG
  const renderShape = (element: CardElement) => {
    const { shapeType, fill } = element.shapeProps || { shapeType: 'heart' };
    const size = parseInt(element.style.width || '60');

    const shapes: Record<string, JSX.Element> = {
      heart: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#ff6b6b'}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ),
      star: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || '#ffd700'}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      circle: (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill={fill || '#4ecdc4'}/>
        </svg>
      ),
    };

    return shapes[shapeType] || shapes.heart;
  };

  // Render Card type preview
  const renderCardPreview = () => (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: currentStep.backgroundImage 
            ? `url(${currentStep.backgroundImage}) center/cover`
            : currentStep.backgroundColor || template.backgroundColor,
        }}
      />

      {/* Particles */}
      {(currentStep.showParticles ?? template.showParticles) && (
        <ParticleBackground type={currentStep.particleType || template.particleType || 'hearts'} contained />
      )}

      {/* Elements */}
      <div className="absolute inset-0">
        {(currentStep.elements || []).map(renderElement)}
      </div>
    </div>
  );

  // Render Timeline preview
  const renderTimelinePreview = () => {
    const events = template.timelineEvents || [];
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor }}
        />
        {template.showParticles && (
          <ParticleBackground type={template.particleType || 'hearts'} contained />
        )}
        
        <div className="absolute inset-0 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">
            {template.title}
          </h2>
          
          <div className="relative max-w-2xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-white/30 rounded-full" />
            
            {/* Events */}
            <div className="space-y-8">
              {events.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative pl-20"
                >
                  {/* Dot */}
                  <div className="absolute left-6 top-2 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center text-sm">
                    {event.emoji || '💕'}
                  </div>
                  
                  {/* Card */}
                  <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                    <h3 className="font-bold text-gray-800 mb-1">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Quiz preview
  const renderQuizPreview = () => {
    const questions = template.quizQuestions || [];
    const currentQuestion = questions[currentStepIndex];
    
    if (showQuizResult) {
      const correctCount = questions.filter(
        (q) => quizAnswers[q.id] === q.correctAnswer
      ).length;
      
      return (
        <div className="w-full h-full relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ background: template.backgroundColor }}
          />
          {template.showParticles && (
            <ParticleBackground type={template.particleType || 'sparkles'} contained />
          )}
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="text-8xl mb-4">
                {correctCount === questions.length ? '🎉' : correctCount > questions.length / 2 ? '😊' : '💪'}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {correctCount === questions.length ? 'Perfeito!' : 'Resultado'}
              </h2>
              <p className="text-xl text-white/80 mb-6">
                Você acertou {correctCount} de {questions.length} perguntas!
              </p>
              <Button
                onClick={() => {
                  setCurrentStepIndex(0);
                  setQuizAnswers({});
                  setShowQuizResult(false);
                }}
                variant="secondary"
              >
                Jogar novamente
              </Button>
            </motion.div>
          </div>
        </div>
      );
    }

    if (!currentQuestion) return null;

    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor }}
        />
        {template.showParticles && (
          <ParticleBackground type={template.particleType || 'sparkles'} contained />
        )}
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Progress */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full ${
                  idx < currentStepIndex ? 'bg-white' : idx === currentStepIndex ? 'bg-white/80' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <HelpCircle className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-6">
              {currentQuestion.question}
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant={quizAnswers[currentQuestion.id] === idx ? 'default' : 'secondary'}
                  className="p-4 h-auto"
                  onClick={() => {
                    setQuizAnswers({ ...quizAnswers, [currentQuestion.id]: idx });
                    setTimeout(() => {
                      if (currentStepIndex < questions.length - 1) {
                        setCurrentStepIndex(currentStepIndex + 1);
                      } else {
                        setShowQuizResult(true);
                      }
                    }, 500);
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // Render Counter preview
  const renderCounterPreview = () => {
    const counterData = template.counterData;
    const startDate = counterData?.startDate ? new Date(counterData.startDate) : new Date();
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor }}
        />
        {template.showParticles && (
          <ParticleBackground type={template.particleType || 'hearts'} contained />
        )}
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-2xl text-white mb-4">
              <span>{counterData?.coupleNames?.[0] || 'Eu'}</span>
              <Heart className="w-8 h-8 text-red-400 fill-red-400 animate-pulse" />
              <span>{counterData?.coupleNames?.[1] || 'Você'}</span>
            </div>
            
            <h2 className="text-xl text-white/80 mb-6">Juntos há</h2>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { value: days, label: 'dias' },
                { value: hours, label: 'horas' },
                { value: minutes, label: 'min' },
                { value: seconds, label: 'seg' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/20 rounded-lg p-4">
                  <div className="text-4xl font-bold text-white">{item.value}</div>
                  <div className="text-sm text-white/70">{item.label}</div>
                </div>
              ))}
            </div>
            
            {counterData?.message && (
              <p className="text-white/90 text-lg">{counterData.message}</p>
            )}
          </motion.div>
        </div>
      </div>
    );
  };

  // Render Mural preview
  const renderMuralPreview = () => {
    const photos = template.muralPhotos || [];
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor }}
        />
        
        <div className="absolute inset-0 p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            {template.title}
          </h2>
          
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {photos.map((photo, idx) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, rotate: -5, scale: 0.8 }}
                animate={{ opacity: 1, rotate: (idx % 3 - 1) * 3, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-2 pb-10 rounded shadow-lg relative"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full aspect-square object-cover rounded"
                />
                {photo.caption && (
                  <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-600 px-2">
                    {photo.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Envelope preview
  const renderEnvelopePreview = () => {
    const letterData = template.letterData;

    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor }}
        />
        {template.showParticles && (
          <ParticleBackground type={template.particleType || 'hearts'} contained />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {!envelopeOpen ? (
              <motion.div
                key="envelope"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="cursor-pointer"
                onClick={() => setEnvelopeOpen(true)}
              >
                {/* Envelope */}
                <div className="relative w-80 h-56">
                  <div className="absolute inset-0 bg-white rounded-lg shadow-2xl" />
                  <div 
                    className="absolute top-0 left-0 right-0 h-0 border-l-[160px] border-r-[160px] border-t-[112px] border-l-transparent border-r-transparent"
                    style={{ borderTopColor: '#fef3c7' }}
                  />
                  {/* Seal */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: letterData?.sealColor || '#fbbf24' }}
                  >
                    <Heart className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <p className="text-center text-white mt-4 animate-pulse">Clique para abrir</p>
              </motion.div>
            ) : (
              <motion.div
                key="letter"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/95 backdrop-blur rounded-lg p-8 max-w-lg shadow-2xl max-h-[80%] overflow-y-auto"
                style={{ backgroundColor: '#fffef0' }}
              >
                <p className="text-gray-600 mb-4">Para: {letterData?.to || 'Meu amor'}</p>
                <div className="whitespace-pre-wrap text-gray-800 mb-6 font-serif">
                  {letterData?.content || 'Sua mensagem aqui...'}
                </div>
                <p className="text-right text-gray-600">{letterData?.from || 'Com amor'}</p>
                <p className="text-right text-2xl mt-2">{letterData?.signature || '❤️'}</p>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => setEnvelopeOpen(false)}
                >
                  Fechar carta
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Render Letter preview
  const renderLetterPreview = () => {
    const letterData = template.letterData;

    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor }}
        />
        {template.showParticles && (
          <ParticleBackground type={template.particleType || 'petals'} contained />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-lg rounded-lg shadow-2xl p-8 relative"
            style={{ 
              backgroundColor: '#fffef0',
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e5e5 27px, #e5e5e5 28px)',
            }}
          >
            {/* Decorative stamp */}
            <div className="absolute -top-2 -right-2 w-12 h-14 bg-red-100 border-2 border-red-200 rounded flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            
            <p className="text-gray-600 mb-4 font-serif italic">
              {letterData?.to || 'Para o amor da minha vida'}
            </p>
            
            <div 
              className="whitespace-pre-wrap text-gray-800 mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {letterData?.content || 'Sua mensagem aqui...'}
            </div>
            
            <p className="text-right text-gray-600 font-serif italic">
              {letterData?.from || 'Com amor'}
            </p>
            <p className="text-right text-xl mt-2">
              {letterData?.signature || '❤️'}
            </p>
          </motion.div>
        </div>
      </div>
    );
  };

  // Select renderer based on type
  const renderPreview = () => {
    switch (template.type) {
      case 'card':
      case 'love':
      case 'birthday':
      case 'proposal':
        return renderCardPreview();
      case 'timeline':
        return renderTimelinePreview();
      case 'quiz':
        return renderQuizPreview();
      case 'counter':
        return renderCounterPreview();
      case 'mural':
        return renderMuralPreview();
      case 'envelope':
        return renderEnvelopePreview();
      case 'letter':
        return renderLetterPreview();
      default:
        return renderCardPreview();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent p-4 flex items-center justify-between">
          <div className="text-white">
            <h2 className="font-bold text-lg">{template.title}</h2>
            <p className="text-sm text-white/70">{template.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onClone(template)}
              disabled={isCloning}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isCloning ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Usar este modelo
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Preview content */}
        <div className="w-full h-full">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

