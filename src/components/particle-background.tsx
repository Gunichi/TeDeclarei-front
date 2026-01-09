'use client';

import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container, ISourceOptions } from '@tsparticles/engine';
import { ParticleType } from '@/lib/api';

interface ParticleBackgroundProps {
  type?: ParticleType;
  contained?: boolean;
}

export function ParticleBackground({ type = 'hearts', contained = false }: ParticleBackgroundProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log('Particles loaded', container);
  };

  const options: ISourceOptions = useMemo(() => {
    if (type === 'hearts') {
      return {
        fullScreen: contained ? false : { enable: true, zIndex: 0 },
        fpsLimit: 60,
        particles: {
          number: {
            value: 30,
            density: {
              enable: true,
            },
          },
          color: {
            value: ['#ff6b6b', '#ee5a5a', '#ff8787', '#fa5252', '#e03131'],
          },
          shape: {
            type: 'char',
            options: {
              char: {
                value: ['❤️', '💕', '💗', '💖', '💘'],
                font: 'Segoe UI Emoji',
                style: '',
                weight: '400',
              },
            },
          },
          opacity: {
            value: { min: 0.4, max: 0.9 },
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          size: {
            value: { min: 10, max: 25 },
          },
          move: {
            enable: true,
            speed: { min: 1, max: 3 },
            direction: 'top' as const,
            random: true,
            straight: false,
            outModes: {
              default: 'out' as const,
            },
          },
          wobble: {
            enable: true,
            distance: 10,
            speed: 10,
          },
          rotate: {
            value: { min: 0, max: 360 },
            direction: 'random' as const,
            animation: {
              enable: true,
              speed: 5,
            },
          },
        },
        detectRetina: true,
      };
    }

    if (type === 'confetti') {
      return {
        fullScreen: contained ? false : { enable: true, zIndex: 0 },
        fpsLimit: 60,
        particles: {
          number: {
            value: 60,
            density: {
              enable: true,
            },
          },
          color: {
            value: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3'],
          },
          shape: {
            type: ['square', 'circle'],
          },
          opacity: {
            value: { min: 0.6, max: 1 },
          },
          size: {
            value: { min: 4, max: 10 },
          },
          move: {
            enable: true,
            speed: { min: 3, max: 6 },
            direction: 'bottom' as const,
            random: true,
            straight: false,
            outModes: {
              default: 'out' as const,
            },
          },
          wobble: {
            enable: true,
            distance: 20,
            speed: 15,
          },
          rotate: {
            value: { min: 0, max: 360 },
            direction: 'random' as const,
            animation: {
              enable: true,
              speed: 15,
            },
          },
        },
        detectRetina: true,
      };
    }

    if (type === 'stars') {
      return {
        fullScreen: contained ? false : { enable: true, zIndex: 0 },
        fpsLimit: 60,
        particles: {
          number: {
            value: 40,
            density: {
              enable: true,
            },
          },
          color: {
            value: ['#ffffff', '#ffd700', '#fff8dc'],
          },
          shape: {
            type: 'char',
            options: {
              char: {
                value: ['⭐', '✦', '★', '✶'],
                font: 'Segoe UI Emoji',
                style: '',
                weight: '400',
              },
            },
          },
          opacity: {
            value: { min: 0.3, max: 1 },
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          size: {
            value: { min: 8, max: 18 },
          },
          move: {
            enable: true,
            speed: { min: 0.3, max: 1 },
            direction: 'none' as const,
            random: true,
            straight: false,
            outModes: {
              default: 'bounce' as const,
            },
          },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.1,
              opacity: 1,
            },
          },
        },
        detectRetina: true,
      };
    }

    if (type === 'petals') {
      return {
        fullScreen: contained ? false : { enable: true, zIndex: 0 },
        fpsLimit: 60,
        particles: {
          number: {
            value: 25,
            density: {
              enable: true,
            },
          },
          color: {
            value: ['#ffb7c5', '#ffc0cb', '#ff69b4', '#fff0f5', '#ffe4e9'],
          },
          shape: {
            type: 'char',
            options: {
              char: {
                value: ['🌸', '🌺', '💮', '🏵️', '✿'],
                font: 'Segoe UI Emoji',
                style: '',
                weight: '400',
              },
            },
          },
          opacity: {
            value: { min: 0.5, max: 0.9 },
          },
          size: {
            value: { min: 12, max: 22 },
          },
          move: {
            enable: true,
            speed: { min: 1, max: 2 },
            direction: 'bottom' as const,
            random: true,
            straight: false,
            outModes: {
              default: 'out' as const,
            },
          },
          wobble: {
            enable: true,
            distance: 30,
            speed: 10,
          },
          rotate: {
            value: { min: 0, max: 360 },
            direction: 'random' as const,
            animation: {
              enable: true,
              speed: 3,
            },
          },
        },
        detectRetina: true,
      };
    }

    // Sparkles (default)
    return {
      fullScreen: contained ? false : { enable: true, zIndex: 0 },
      fpsLimit: 60,
      particles: {
        number: {
          value: 50,
          density: {
            enable: true,
          },
        },
        color: {
          value: ['#ffd700', '#ffec8b', '#fff8dc', '#fffacd', '#f0e68c'],
        },
        shape: {
          type: 'char',
          options: {
            char: {
              value: ['✨', '⭐', '🌟', '💫', '✦'],
              font: 'Segoe UI Emoji',
              style: '',
              weight: '400',
            },
          },
        },
        opacity: {
          value: { min: 0.3, max: 1 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        size: {
          value: { min: 8, max: 20 },
        },
        move: {
          enable: true,
          speed: { min: 0.5, max: 2 },
          direction: 'none' as const,
          random: true,
          straight: false,
          outModes: {
            default: 'bounce' as const,
          },
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.05,
            opacity: 1,
          },
        },
      },
      detectRetina: true,
    };
  }, [type, contained]);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id={`tsparticles-${type}-${contained ? 'contained' : 'full'}`}
      particlesLoaded={particlesLoaded}
      options={options}
      className={contained ? 'absolute inset-0 pointer-events-none' : ''}
    />
  );
}
