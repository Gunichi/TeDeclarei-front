'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Heart,
  Check,
  PartyPopper,
  Calendar,
  X,
  Mail,
  Sparkles,
} from 'lucide-react';
import Confetti from 'react-confetti';
import {
  templatesApi,
  Template,
  CardElement,
  TimelineEvent,
  QuizQuestion,
  CounterData,
  MuralPhoto,
  LetterData,
} from '@/lib/api';
import { ParticleBackground } from '@/components/particle-background';
import { Button } from '@/components/ui/button';

export default function TemplateViewerPage() {
  const params = useParams();
  const shareToken = params.shareToken as string;
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        if (!shareToken) throw new Error('Token não encontrado');
        const data = await templatesApi.getByShareToken(shareToken);
        console.log('Template loaded:', data);
        setTemplate(data);
      } catch (err) {
        setError('Template não encontrado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Template não encontrado</h1>
          <p className="text-gray-600">Este template pode ter sido excluído ou o link é inválido.</p>
        </div>
      </div>
    );
  }

  // Route to specific viewer based on type
  switch (template.type) {
    case 'timeline':
      return <TimelineViewer template={template} />;
    case 'quiz':
      return <QuizViewer template={template} />;
    case 'counter':
      return <CounterViewer template={template} />;
    case 'mural':
      return <MuralViewer template={template} />;
    case 'envelope':
      return <EnvelopeViewer template={template} />;
    case 'letter':
      return <LetterViewer template={template} />;
    default:
      return (
        <DefaultViewer
          template={template}
          currentStepIndex={currentStepIndex}
          setCurrentStepIndex={setCurrentStepIndex}
          showSuccess={showSuccess}
          setShowSuccess={setShowSuccess}
          windowSize={windowSize}
        />
      );
  }
}

// ============================================
// DEFAULT VIEWER (love, birthday, proposal)
// ============================================
function DefaultViewer({
  template,
  currentStepIndex,
  setCurrentStepIndex,
  showSuccess,
  setShowSuccess,
  windowSize,
}: {
  template: Template;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  showSuccess: boolean;
  setShowSuccess: (show: boolean) => void;
  windowSize: { width: number; height: number };
}) {
  const hasSteps = template?.steps && template.steps.length > 0;
  const currentStep = hasSteps ? template.steps![currentStepIndex] : null;
  const currentElements = currentStep?.elements || template?.elements || [];
  const currentBackground = currentStep?.backgroundColor || template?.backgroundColor || '#be185d';
  const currentBackgroundImage = currentStep?.backgroundImage || template?.backgroundImage;
  const currentShowParticles = template?.showParticles ?? true;
  const currentParticleType = template?.particleType || 'hearts';

  const handleButtonClick = (action?: string) => {
    if (action === 'success') {
      setShowSuccess(true);
    } else if (action === 'next' && hasSteps && currentStepIndex < template.steps!.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (action === 'prev' && currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToNextStep = () => {
    if (hasSteps && currentStepIndex < template.steps!.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: currentBackgroundImage
          ? `url(${currentBackgroundImage}) center/cover no-repeat`
          : currentBackground,
      }}
    >
      {currentShowParticles && <ParticleBackground type={currentParticleType} />}

      {showSuccess && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />
      )}

      {hasSteps && template.steps!.length > 1 && !showSuccess && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <Button
            variant="secondary"
            size="icon"
            onClick={goToPrevStep}
            disabled={currentStepIndex === 0}
            className="rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            {template.steps!.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStepIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStepIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={goToNextStep}
            disabled={currentStepIndex === template.steps!.length - 1}
            className="rounded-full bg-white/80 hover:bg-white shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="relative w-full max-w-4xl aspect-[4/3] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Você escolheu a melhor opção!!! 🎉
              </h2>
              <p className="text-xl text-white/90">Obrigado por usar o Te Declarei ❤️</p>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStepIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              {currentElements.map((element, index) => (
                <TemplateElement key={element.id || `element-${index}`} element={element} onButtonClick={handleButtonClick} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TemplateElement({
  element,
  onButtonClick,
}: {
  element: CardElement;
  onButtonClick: (action?: string) => void;
}) {
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    if (element.buttonProps?.randomMove) {
      const maxX = window.innerWidth - 150;
      const maxY = window.innerHeight - 50;
      setButtonPosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      });
    }
  };

  const position = element.position || { x: 400, y: 300 };
  const elementStyle = element.style || {};

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${(position.x / 800) * 100}%`,
    top: `${(position.y / 600) * 100}%`,
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
  };

  if (element.type === 'button' && element.buttonProps?.randomMove && (buttonPosition.x !== 0 || buttonPosition.y !== 0)) {
    style.position = 'fixed';
    style.left = buttonPosition.x;
    style.top = buttonPosition.y;
    style.transform = 'none';
  }

  if (element.type === 'text') {
    return (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          ...style,
          fontSize: elementStyle.fontSize || '24px',
          textAlign: elementStyle.textAlign || 'center',
          color: elementStyle.color || '#ffffff',
          fontWeight: elementStyle.fontWeight,
          fontStyle: elementStyle.fontStyle,
          textDecoration: elementStyle.textDecoration,
          letterSpacing: elementStyle.letterSpacing,
          lineHeight: elementStyle.lineHeight,
          opacity: elementStyle.opacity,
          textShadow: elementStyle.textShadow || '2px 2px 4px rgba(0,0,0,0.3)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {element.content}
      </motion.p>
    );
  }

  if (element.type === 'photo') {
    return (
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        src={element.content}
        alt="Template element"
        className="rounded-lg shadow-lg"
        style={{
          ...style,
          width: elementStyle.width || '200px',
          height: elementStyle.height || '200px',
          objectFit: elementStyle.objectFit || 'cover',
          borderRadius: elementStyle.borderRadius || '8px',
        }}
      />
    );
  }

  if (element.type === 'button') {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onMouseEnter={handleMouseEnter}
        onClick={() => onButtonClick(element.buttonProps?.action)}
        className="px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        style={{
          ...style,
          backgroundColor: elementStyle.backgroundColor || '#ec4899',
          color: elementStyle.color || '#ffffff',
          fontSize: elementStyle.fontSize || '16px',
          fontWeight: elementStyle.fontWeight || '600',
        }}
      >
        {element.buttonProps?.text || 'Click me!'}
      </motion.button>
    );
  }

  return null;
}

// ============================================
// TIMELINE VIEWER
// ============================================
function TimelineViewer({ template }: { template: Template }) {
  const events = template.timelineEvents || [];
  const background = template.backgroundColor || 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)';
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{ background }}
    >
      <ParticleBackground type={template.particleType || 'hearts'} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-white text-center mb-12 drop-shadow-lg"
      >
        {template.title}
      </motion.h1>

      <div className="max-w-4xl mx-auto relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-white/30 rounded-full" />

        {sortedEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
          >
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
                  <img src={event.image} alt="" className="w-full h-32 object-cover rounded-lg mt-3" />
                )}
              </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
              </div>
            </div>

            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: events.length * 0.2 }}
        className="text-center text-white/80 mt-12"
      >
        Criado com ❤️ no Te Declarei
      </motion.p>
    </div>
  );
}

// ============================================
// QUIZ VIEWER
// ============================================
function QuizViewer({ template }: { template: Template }) {
  const questions = template.quizQuestions || [];
  const background = template.backgroundColor || 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(optionIndex);
    setIsAnswered(true);

    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
  };

  const question = questions[currentQuestion];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background }}>
        <p className="text-white text-xl">Nenhuma pergunta encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background }}>
      {showResult && percentage >= 70 && <Confetti recycle={false} numberOfPieces={200} />}
      <ParticleBackground type={template.particleType || 'sparkles'} />

      <div className="w-full max-w-xl relative z-10">
        {showResult ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">{percentage >= 80 ? '🏆' : percentage >= 50 ? '😊' : '💪'}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{template.title}</h2>
            <p className="text-gray-600 mb-6">Resultado Final</p>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={352}
                  strokeDashoffset={352 - (352 * percentage) / 100}
                  className={percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-amber-500' : 'text-red-500'}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
              </div>
            </div>

            <p className="text-xl text-gray-700 mb-6">
              Você acertou <strong>{score}</strong> de <strong>{questions.length}</strong> perguntas!
            </p>

            <p className="text-gray-600 mb-6">
              {percentage >= 80
                ? '🎉 Incrível! Vocês se conhecem muito bem!'
                : percentage >= 50
                ? '💕 Muito bom! Vocês têm uma conexão especial!'
                : '💪 Continue conhecendo melhor seu amor!'}
            </p>

            <Button onClick={restart} size="lg" className="rounded-full">
              <PartyPopper className="h-5 w-5 mr-2" />
              Jogar novamente
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestion}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-gray-500">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                <span className="text-sm font-medium text-gray-700">{score} pontos</span>
              </div>
            </div>

            <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
              />
            </div>

            {question.image && <img src={question.image} alt="" className="w-full h-48 object-cover rounded-xl mb-6" />}

            <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    isAnswered
                      ? index === question.correctAnswer
                        ? 'bg-green-100 border-2 border-green-500 text-green-800'
                        : selectedAnswer === index
                        ? 'bg-red-100 border-2 border-red-500 text-red-800'
                        : 'bg-gray-100 text-gray-500'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isAnswered && index === question.correctAnswer
                          ? 'bg-green-500 text-white'
                          : isAnswered && selectedAnswer === index
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                    {isAnswered && index === question.correctAnswer && <Check className="h-5 w-5 text-green-600 ml-auto" />}
                  </div>
                </button>
              ))}
            </div>

            {isAnswered && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <Button onClick={nextQuestion} size="lg" className="w-full rounded-full">
                  {currentQuestion < questions.length - 1 ? 'Próxima pergunta' : 'Ver resultado'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COUNTER VIEWER
// ============================================
function CounterViewer({ template }: { template: Template }) {
  const counterData = template.counterData;
  const background = template.backgroundColor || 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)';

  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!counterData?.startDate) return;

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
  }, [counterData?.startDate]);

  if (!counterData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background }}>
        <p className="text-white text-xl">Dados do contador não encontrados</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background }}
    >
      <ParticleBackground type={template.particleType || 'hearts'} />

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
        {counterData.photo && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8">
            <div className="relative inline-block">
              <img
                src={counterData.photo}
                alt=""
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2">
                <Heart className="h-10 w-10 text-red-500 fill-red-500 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{template.title}</h1>
          <p className="text-xl text-white/90 mt-2">
            {counterData.coupleNames[0]} <Heart className="inline h-5 w-5 text-red-400 fill-red-400 mx-1" />{' '}
            {counterData.coupleNames[1]}
          </p>
        </motion.div>

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
                  <span className="text-3xl md:text-4xl font-bold text-white block">{String(item.value).padStart(2, '0')}</span>
                </div>
                <span className="text-xs text-white/80 mt-1 block uppercase tracking-wider">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/60 text-sm mt-6"
        >
          Desde{' '}
          {new Date(counterData.startDate).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </motion.p>
      </div>
    </div>
  );
}

// ============================================
// MURAL VIEWER
// ============================================
function MuralViewer({ template }: { template: Template }) {
  const photos = template.muralPhotos || [];
  const background = template.backgroundColor || 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)';
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background }}>
        <p className="text-gray-600 text-xl">Nenhuma foto encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background }}>
      <ParticleBackground type={template.particleType || 'hearts'} />

      <div className="text-center py-8 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 drop-shadow-sm"
        >
          {template.title}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-600 mt-2">
          {photos.length} memórias especiais
        </motion.p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 p-8 relative z-10">
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
            <img src={photo.url} alt="" className="w-48 h-48 object-cover" />
            {photo.caption && (
              <p className="absolute bottom-3 left-3 right-3 text-center text-sm text-gray-600">{photo.caption}</p>
            )}
            <Heart className="absolute -top-2 -right-2 h-6 w-6 text-red-500 fill-red-500" />
          </motion.div>
        ))}
      </div>

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
              <img src={photos[selectedPhoto].url} alt="" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
              {photos[selectedPhoto].caption && (
                <p className="text-white text-center mt-4 text-lg">{photos[selectedPhoto].caption}</p>
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

// ============================================
// ENVELOPE VIEWER
// ============================================
function EnvelopeViewer({ template }: { template: Template }) {
  const letterData = template.letterData;
  const envelopeColor = template.backgroundColor || '#dc2626';
  const sealColor = letterData?.sealColor || '#fbbf24';

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

  if (!letterData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <p className="text-gray-600 text-xl">Dados da carta não encontrados</p>
      </div>
    );
  }

  // Map envelope color to paper color
  const paperColors: { [key: string]: string } = {
    '#dc2626': '#fef2f2',
    '#ec4899': '#fdf2f8',
    '#7c3aed': '#f5f3ff',
    '#2563eb': '#eff6ff',
    '#059669': '#ecfdf5',
    '#d97706': '#fffbeb',
    '#f8fafc': '#ffffff',
    '#1e293b': '#f1f5f9',
  };
  const paperColor = paperColors[envelopeColor] || '#ffffff';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
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
            <div
              className="relative w-80 h-52 md:w-96 md:h-64 rounded-lg shadow-2xl"
              style={{ backgroundColor: envelopeColor }}
            >
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
                }}
              />

              <motion.div
                className="absolute -top-0 left-0 right-0 origin-bottom"
                animate={{ rotateX: isOpen ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: 1000,
                }}
              >
                <svg viewBox="0 0 384 128" className="w-full" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                  <path d="M0 128 L192 0 L384 128 L0 128" fill={envelopeColor} />
                  <path d="M0 128 L192 0 L384 128 L0 128" fill="rgba(0,0,0,0.05)" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: sealColor }}
                >
                  <Heart className="h-8 w-8 text-white fill-white" />
                </div>
              </motion.div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="h-1 bg-white/20 rounded mb-2" style={{ width: '60%' }} />
                <div className="h-1 bg-white/20 rounded mb-2" style={{ width: '80%' }} />
                <div className="h-1 bg-white/20 rounded" style={{ width: '40%' }} />
              </div>
            </div>

            {!isOpen && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-6 text-gray-500">
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
            <div
              className="rounded-lg shadow-2xl p-8 md:p-12 relative overflow-hidden"
              style={{ backgroundColor: paperColor }}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${envelopeColor}20 50%)`,
                }}
              />

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <p className="text-xl md:text-2xl text-gray-700 mb-6">{letterData.to},</p>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">{letterData.content}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-right"
              >
                <p className="text-gray-600 italic">{letterData.from}</p>
                <p className="text-3xl mt-2">{letterData.signature}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-4 left-4 flex gap-1"
              >
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className="h-4 w-4" style={{ color: envelopeColor, fill: envelopeColor }} />
                ))}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mt-6">
              <Button variant="outline" onClick={handleReset}>
                <Mail className="h-4 w-4 mr-2" />
                Fechar carta
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLetter && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                scale: Math.random() * 0.5 + 0.5,
                rotate: Math.random() * 360,
              }}
              animate={{ y: -100, rotate: Math.random() * 360 + 360 }}
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
                  color: i % 2 === 0 ? envelopeColor : sealColor,
                  fill: i % 2 === 0 ? envelopeColor : sealColor,
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

// ============================================
// LETTER VIEWER
// ============================================
function LetterViewer({ template }: { template: Template }) {
  const letterData = template.letterData;
  const paperColor = template.backgroundColor || '#fefcf6';
  const lineColor = '#e8dcc8';
  const inkColor = '#1f2937';

  if (!letterData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50">
        <p className="text-gray-600 text-xl">Dados da carta não encontrados</p>
      </div>
    );
  }

  const lines = letterData.content.split('\n');

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute -bottom-2 -right-2 w-full h-full rounded-lg opacity-20" style={{ backgroundColor: '#000' }} />
          <div className="absolute -bottom-1 -right-1 w-full h-full rounded-lg opacity-10" style={{ backgroundColor: '#000' }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-lg shadow-2xl p-8 md:p-12 overflow-hidden"
            style={{ backgroundColor: paperColor }}
          >
            <div className="absolute inset-0 flex flex-col pt-20 px-8 md:px-12 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="h-px"
                  style={{
                    backgroundColor: lineColor,
                    marginBottom: '2rem',
                  }}
                />
              ))}
            </div>

            <div className="absolute top-0 bottom-0 left-16 md:left-20 w-px" style={{ backgroundColor: '#fca5a5' }} />

            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-right text-sm mb-8"
                style={{ color: inkColor }}
              >
                {new Date().toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl mb-8"
                style={{ color: inkColor }}
              >
                {letterData.to},
              </motion.p>

              <div className="mb-8 min-h-[300px]">
                {lines.map((line, lineIndex) => (
                  <motion.p
                    key={lineIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + lineIndex * 0.1 }}
                    className="text-lg md:text-xl leading-8 md:leading-10"
                    style={{ color: inkColor }}
                  >
                    {line || '\u00A0'}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + lines.length * 0.1 }}
                className="text-right mt-8"
              >
                <p className="text-lg md:text-xl italic" style={{ color: inkColor }}>
                  {letterData.from}
                </p>
                <p className="text-2xl md:text-3xl mt-4" style={{ color: inkColor }}>
                  {letterData.signature}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-4 left-4"
            >
              <Heart className="h-16 w-16" style={{ color: inkColor }} />
            </motion.div>

            <div
              className="absolute top-0 right-0 w-16 h-16"
              style={{
                background: `linear-gradient(135deg, ${paperColor} 50%, rgba(0,0,0,0.05) 50%)`,
              }}
            />
          </motion.div>
        </div>

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
              animate={{ y: -100, rotate: Math.random() * 360 }}
              transition={{
                duration: Math.random() * 8 + 8,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Heart className="h-6 w-6" style={{ color: inkColor, fill: inkColor }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
