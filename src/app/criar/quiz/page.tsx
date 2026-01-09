'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  Loader2,
  Image as ImageIcon,
  Check,
  Eye,
  Sparkles,
  Trophy,
  Heart,
  PartyPopper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { templatesApi, uploadsApi, QuizQuestion } from '@/lib/api';
import Confetti from 'react-confetti';

const SAMPLE_QUESTIONS = [
  'Qual foi o nosso primeiro filme juntos?',
  'Onde foi nosso primeiro encontro?',
  'Qual a minha comida favorita?',
  'Qual foi a primeira música que dançamos?',
  'Qual é o meu maior medo?',
  'O que eu mais amo em você?',
  'Qual é o meu sonho?',
  'O que me faz mais feliz?',
];

const GRADIENT_BACKGROUNDS = [
  { name: 'Romantic', value: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)' },
  { name: 'Purple', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Mint', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Night', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
];

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const [title, setTitle] = useState('Quiz do Nosso Amor');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: '1',
      question: 'Onde nos conhecemos?',
      options: ['No trabalho', 'Na escola', 'Na academia', 'Online'],
      correctAnswer: 0,
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
          if (template.quizQuestions && template.quizQuestions.length > 0) {
            setQuestions(template.quizQuestions);
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

  const addQuestion = () => {
    const randomQuestion = SAMPLE_QUESTIONS[Math.floor(Math.random() * SAMPLE_QUESTIONS.length)];
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: randomQuestion,
      options: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestionId(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, i) => (i === optionIndex ? value : opt)) }
          : q
      )
    );
  };

  const deleteQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
    if (activeQuestionId === id) {
      setActiveQuestionId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, questionId: string) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      const result = await uploadsApi.upload(token, file, 'templates');
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '');
      const imageUrl = `${baseUrl}${result.url}`;
      updateQuestion(questionId, { image: imageUrl });
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem');
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);
      
      // Ensure questions are properly formatted
      const formattedQuestions = questions.map(q => ({
        id: q.id,
        question: q.question,
        options: [...q.options],
        correctAnswer: q.correctAnswer,
        image: q.image,
      }));

      console.log('Saving quiz questions:', formattedQuestions);

      const data = {
        title,
        type: 'quiz' as const,
        backgroundColor: background,
        quizQuestions: formattedQuestions,
        showParticles: true,
        particleType: 'sparkles' as const,
      };

      if (templateId) {
        await templatesApi.update(token, templateId, data);
      } else {
        await templatesApi.create(token, data);
      }
      router.push('/templates');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar quiz');
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
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
                <HelpCircle className="h-5 w-5 text-amber-500" />
                <h1 className="text-lg font-bold text-gray-900">Quiz do Amor</h1>
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
          <QuizPreview title={title} questions={questions} background={background} />
        ) : (
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
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Título do Quiz</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Quiz do Nosso Amor"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tema</label>
                    <div className="grid grid-cols-3 gap-2">
                      {GRADIENT_BACKGROUNDS.map((bg) => (
                        <button
                          key={bg.name}
                          onClick={() => setBackground(bg.value)}
                          className={`h-12 rounded-lg transition-all ${
                            background === bg.value ? 'ring-2 ring-offset-2 ring-amber-500 scale-105' : ''
                          }`}
                          style={{ background: bg.value }}
                          title={bg.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      {questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'} criada{questions.length !== 1 && 's'}
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={addQuestion} className="w-full" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Adicionar Pergunta
              </Button>
            </div>

            {/* Questions List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                      activeQuestionId === question.id ? 'ring-2 ring-amber-500' : ''
                    }`}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setActiveQuestionId(activeQuestionId === question.id ? null : question.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-800">{question.question}</h3>
                          <p className="text-sm text-gray-500">
                            {question.options.length} opções • Resposta: {question.options[question.correctAnswer]}
                          </p>
                        </div>
                        {question.image && (
                          <img src={question.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        )}
                      </div>
                    </div>

                    {activeQuestionId === question.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t bg-gray-50 p-4 space-y-4"
                      >
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Pergunta</label>
                          <Input
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                            placeholder="Digite a pergunta..."
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Opções (clique na correta)
                          </label>
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuestion(question.id, { correctAnswer: optIndex })}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    question.correctAnswer === optIndex
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-200 hover:bg-gray-300'
                                  }`}
                                >
                                  {question.correctAnswer === optIndex && <Check className="h-4 w-4" />}
                                </button>
                                <Input
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                  placeholder={`Opção ${optIndex + 1}`}
                                  className={question.correctAnswer === optIndex ? 'border-green-500' : ''}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Imagem (opcional)</label>
                          {question.image ? (
                            <div className="relative inline-block">
                              <img
                                src={question.image}
                                alt=""
                                className="w-32 h-32 rounded-lg object-cover"
                              />
                              <button
                                onClick={() => updateQuestion(question.id, { image: undefined })}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setActiveQuestionId(question.id);
                                fileInputRef.current?.click();
                              }}
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Adicionar imagem
                            </Button>
                          )}
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                            disabled={questions.length <= 1}
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
        onChange={(e) => activeQuestionId && handleImageUpload(e, activeQuestionId)}
        className="hidden"
      />
    </div>
  );
}

function QuizPreview({
  title,
  questions,
  background,
}: {
  title: string;
  questions: QuizQuestion[];
  background: string;
}) {
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
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div
      className="min-h-[600px] rounded-2xl overflow-hidden shadow-2xl p-8 flex items-center justify-center"
      style={{ background }}
    >
      {showResult && percentage >= 70 && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="w-full max-w-xl">
        {showResult ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 50 ? '😊' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">Resultado Final</p>
            
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
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

            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
              />
            </div>

            {question.image && (
              <img
                src={question.image}
                alt=""
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
            )}

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
                    {isAnswered && index === question.correctAnswer && (
                      <Check className="h-5 w-5 text-green-600 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
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

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-pink-500" /></div>}>
      <QuizPageContent />
    </Suspense>
  );
}

