'use client';

import { Template, PublicTemplate, CardElement, TimelineEvent, QuizQuestion, MuralPhoto } from '@/lib/api';
import { Heart, Clock, HelpCircle, Timer, ImageIcon, Mail, PenTool, Sparkles, Gift } from 'lucide-react';

// Union type to accept both Template and PublicTemplate
type TemplateData = Template | PublicTemplate;

interface TemplateThumbnailProps {
  template: TemplateData;
  className?: string;
}

export function TemplateThumbnail({ template, className = '' }: TemplateThumbnailProps) {
  // Render card type thumbnail
  const renderCardThumbnail = () => {
    const elements = template.elements || template.steps?.[0]?.elements || [];
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: template.backgroundImage 
              ? `url(${template.backgroundImage}) center/cover`
              : template.backgroundColor || 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
          }}
        />
        
        {/* Particles overlay effect */}
        {template.showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="absolute text-xs opacity-40 animate-pulse"
                style={{
                  left: `${10 + (i * 12)}%`,
                  top: `${15 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              >
                {template.particleType === 'hearts' && '❤️'}
                {template.particleType === 'sparkles' && '✨'}
                {template.particleType === 'confetti' && '🎊'}
                {template.particleType === 'stars' && '⭐'}
                {template.particleType === 'petals' && '🌸'}
              </span>
            ))}
          </div>
        )}
        
        {/* Elements preview */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
          {elements.slice(0, 3).map((element: CardElement, idx: number) => (
            <div key={element.id || idx} className="mb-1 max-w-full">
              {element.type === 'text' && (
                <p 
                  className="text-white text-center truncate text-xs font-medium drop-shadow-lg"
                  style={{ 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    fontSize: idx === 0 ? '10px' : '8px',
                  }}
                >
                  {element.content?.slice(0, 25)}{element.content?.length > 25 ? '...' : ''}
                </p>
              )}
              {element.type === 'photo' && element.content && (
                <img 
                  src={element.content} 
                  alt="" 
                  className="w-12 h-12 object-cover rounded shadow-lg mx-auto"
                />
              )}
              {element.type === 'sticker' && (
                <span className="text-lg">{element.content}</span>
              )}
              {element.type === 'button' && (
                <div 
                  className="px-2 py-0.5 rounded text-[8px] text-white shadow"
                  style={{ backgroundColor: element.style?.backgroundColor || '#ec4899' }}
                >
                  {element.buttonProps?.text || 'Botão'}
                </div>
              )}
            </div>
          ))}
          {elements.length === 0 && (
            <Heart className="w-8 h-8 text-white/80" />
          )}
        </div>
        
        {/* Steps indicator */}
        {template.steps && template.steps.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {template.steps.slice(0, 5).map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render timeline thumbnail
  const renderTimelineThumbnail = () => {
    const events = template.timelineEvents || [];
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        />
        
        {/* Timeline line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/40" />
        
        {/* Events preview */}
        <div className="absolute inset-0 flex flex-col justify-center p-3 pl-6">
          {events.slice(0, 3).map((event: TimelineEvent, idx: number) => (
            <div key={event.id || idx} className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-[8px] font-medium truncate">
                  {event.emoji} {event.title?.slice(0, 15)}
                </p>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="flex items-center justify-center">
              <Clock className="w-8 h-8 text-white/80" />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render quiz thumbnail
  const renderQuizThumbnail = () => {
    const questions = template.quizQuestions || [];
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor || 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
          <HelpCircle className="w-6 h-6 text-white mb-2" />
          {questions.length > 0 ? (
            <>
              <p className="text-white text-[8px] text-center font-medium mb-2">
                {questions[0]?.question?.slice(0, 30)}...
              </p>
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-4 h-4 rounded bg-white/30 flex items-center justify-center text-[6px] text-white">
                    {n}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-white/80 text-[8px]">Quiz do Amor</p>
          )}
          <p className="text-white/60 text-[6px] mt-2">
            {questions.length} pergunta{questions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    );
  };

  // Render counter thumbnail
  const renderCounterThumbnail = () => {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor || 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
          <Timer className="w-6 h-6 text-white mb-1" />
          <p className="text-white text-[10px] font-bold">
            {template.counterData?.count || '365'}
          </p>
          <p className="text-white/80 text-[7px] text-center">
            {template.counterData?.label || 'dias juntos'}
          </p>
          <div className="flex gap-1 mt-2">
            {['❤️', '💕', '✨'].map((e, i) => (
              <span key={i} className="text-[10px]">{e}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render mural thumbnail
  const renderMuralThumbnail = () => {
    const photos = template.muralPhotos || [];
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor || '#fef3c7' }}
        />
        
        {/* Photo grid */}
        <div className="absolute inset-1 grid grid-cols-3 gap-0.5">
          {photos.slice(0, 6).map((photo: MuralPhoto, idx: number) => (
            <div 
              key={photo.id || idx}
              className="bg-white rounded overflow-hidden shadow-sm"
              style={{ transform: `rotate(${(idx % 3 - 1) * 3}deg)` }}
            >
              {photo.url ? (
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-3 h-3 text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {photos.length === 0 && (
            <>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div 
                  key={n}
                  className="bg-white rounded shadow-sm flex items-center justify-center"
                  style={{ transform: `rotate(${(n % 3 - 1) * 3}deg)` }}
                >
                  <ImageIcon className="w-3 h-3 text-gray-200" />
                </div>
              ))}
            </>
          )}
        </div>
        
        {/* Decorative tape */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-3 bg-yellow-200/80 rotate-1" />
      </div>
    );
  };

  // Render envelope thumbnail
  const renderEnvelopeThumbnail = () => {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor || 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Envelope shape */}
          <div className="relative w-20 h-14">
            <div className="absolute inset-0 bg-white rounded-sm shadow-lg" />
            <div 
              className="absolute top-0 left-0 right-0 h-0 border-l-[40px] border-r-[40px] border-t-[28px] border-l-transparent border-r-transparent"
              style={{ borderTopColor: template.letterData?.paperColor || '#fef3c7' }}
            />
            {/* Heart seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow">
              <Heart className="w-2 h-2 text-white fill-white" />
            </div>
          </div>
        </div>
        
        {/* Floating hearts */}
        {['❤️', '💕', '💌'].map((e, i) => (
          <span 
            key={i} 
            className="absolute text-xs opacity-60 animate-pulse"
            style={{ 
              left: `${20 + i * 25}%`, 
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.3}s`
            }}
          >
            {e}
          </span>
        ))}
      </div>
    );
  };

  // Render letter thumbnail
  const renderLetterThumbnail = () => {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: template.backgroundColor || '#f5f5dc' }}
        />
        
        <div className="absolute inset-2 flex flex-col">
          {/* Paper */}
          <div 
            className="flex-1 rounded shadow-lg p-2 relative overflow-hidden"
            style={{ 
              backgroundColor: template.letterData?.paperColor || '#fffef0',
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 11px, #e5e5e5 11px, #e5e5e5 12px)'
            }}
          >
            {/* Text lines */}
            <div className="space-y-1">
              <div className="h-1 bg-gray-300 rounded w-3/4" />
              <div className="h-1 bg-gray-200 rounded w-full" />
              <div className="h-1 bg-gray-200 rounded w-5/6" />
              <div className="h-1 bg-gray-200 rounded w-2/3" />
            </div>
            
            {/* Signature */}
            <div className="absolute bottom-2 right-2">
              <PenTool className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Decorative stamp */}
        <div className="absolute top-1 right-1 w-4 h-5 bg-red-100 border border-red-200 rounded-sm flex items-center justify-center">
          <Heart className="w-2 h-2 text-red-400" />
        </div>
      </div>
    );
  };

  // Select renderer based on type
  const renderThumbnail = () => {
    switch (template.type) {
      case 'card':
      case 'love':
      case 'birthday':
      case 'proposal':
        return renderCardThumbnail();
      case 'timeline':
        return renderTimelineThumbnail();
      case 'quiz':
        return renderQuizThumbnail();
      case 'counter':
        return renderCounterThumbnail();
      case 'mural':
        return renderMuralThumbnail();
      case 'envelope':
        return renderEnvelopeThumbnail();
      case 'letter':
        return renderLetterThumbnail();
      default:
        return renderCardThumbnail();
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {renderThumbnail()}
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
    </div>
  );
}

