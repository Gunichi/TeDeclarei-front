const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Debug log
  if (fetchOptions.body) {
    console.log('=== API REQUEST ===');
    console.log('Endpoint:', endpoint);
    console.log('Body being sent:', fetchOptions.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    fetchApi<{ accessToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchApi<{ accessToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: (token: string) =>
    fetchApi<User>('/auth/me', { token }),

  refreshToken: (token: string) =>
    fetchApi<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      token,
    }),
};

// Users
export const usersApi = {
  getProfile: (token: string) =>
    fetchApi<User>('/users/profile', { token }),

  updateProfile: (token: string, data: Partial<User>) =>
    fetchApi<User>('/users/profile', {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    }),

  deleteAccount: (token: string) =>
    fetchApi('/users/profile', {
      method: 'DELETE',
      token,
    }),
};

// Templates
export const templatesApi = {
  create: (token: string, data: CreateTemplateDto) =>
    fetchApi<Template>('/templates', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    }),

  getAll: (token: string) =>
    fetchApi<Template[]>('/templates', { token }),

  getById: (token: string, id: string) =>
    fetchApi<Template>(`/templates/${id}`, { token }),

  getByShareToken: (shareToken: string) =>
    fetchApi<Template>(`/templates/share/${shareToken}`),

  update: (token: string, id: string, data: Partial<CreateTemplateDto>) =>
    fetchApi<Template>(`/templates/${id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(data),
    }),

  delete: (token: string, id: string) =>
    fetchApi(`/templates/${id}`, {
      method: 'DELETE',
      token,
    }),

  copy: (token: string, id: string) =>
    fetchApi<Template>(`/templates/${id}/copy`, {
      method: 'POST',
      token,
    }),

  togglePublic: (token: string, id: string) =>
    fetchApi<Template>(`/templates/${id}/toggle-public`, {
      method: 'PATCH',
      token,
    }),
};

// Public Templates
export const publicTemplatesApi = {
  getAll: (type?: TemplateType) =>
    fetchApi<PublicTemplate[]>(`/public-templates${type ? `?type=${type}` : ''}`),

  getById: (id: string) =>
    fetchApi<PublicTemplate>(`/public-templates/${id}`),

  reseed: () =>
    fetchApi<{ message: string }>('/public-templates/reseed', {
      method: 'POST',
    }),
};

// Uploads
export const uploadsApi = {
  upload: async (token: string, file: File, folder: 'templates' | 'avatars' | 'backgrounds' = 'templates') => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/uploads?folder=${folder}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json() as Promise<{ url: string; filename: string }>;
  },

  delete: (token: string, filename: string, folder: string = 'templates') =>
    fetchApi(`/uploads/${filename}?folder=${folder}`, {
      method: 'DELETE',
      token,
    }),
};

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
}

export interface Position {
  x: number;
  y: number;
}

export interface ElementStyle {
  width?: string;
  height?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic' | string;
  textDecoration?: 'none' | 'underline' | 'line-through' | string;
  letterSpacing?: string;
  lineHeight?: string;
  transform?: string;
  opacity?: string;
  fontFamily?: string;
  textShadow?: string;
  boxShadow?: string;
  textStroke?: string;
  // New properties for animations and effects
  animation?: string;
  filter?: string;
  frame?: string;
}

export interface ButtonProps {
  randomMove?: boolean;
  text?: string;
  action?: string;
}

export type CardElementType = 
  | 'photo' 
  | 'text' 
  | 'button' 
  | 'sticker' 
  | 'shape' 
  | 'video' 
  | 'audio' 
  | 'gif'
  | 'divider'
  | 'countdown';

export interface ShapeProps {
  shapeType: 'heart' | 'star' | 'circle' | 'rectangle' | 'triangle' | 'arrow' | 'cloud' | 'diamond' | 'moon' | 'sun' | 'flower' | 'butterfly' | 'ring' | 'infinity' | 'music' | 'sparkle';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface CountdownProps {
  targetDate: string;
  label?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

export interface CardElement {
  id: string;
  type: CardElementType;
  content: string;
  position: Position;
  style: ElementStyle;
  buttonProps?: ButtonProps;
  shapeProps?: ShapeProps;
  countdownProps?: CountdownProps;
}

export interface Step {
  id: string;
  name: string;
  elements: CardElement[];
  backgroundColor: string;
  backgroundImage?: string;
  showParticles?: boolean;
  particleType?: ParticleType;
}

export type TemplateType = 'card' | 'love' | 'birthday' | 'proposal' | 'timeline' | 'quiz' | 'counter' | 'mural' | 'envelope' | 'letter';
export type CardCategory = 'love' | 'birthday' | 'proposal' | 'anniversary' | 'friendship' | 'thank_you' | 'custom';
export type ParticleType = 'hearts' | 'sparkles' | 'confetti' | 'stars' | 'petals';

// Timeline Types
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  emoji?: string;
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

// Counter Types
export interface CounterData {
  startDate: string;
  coupleNames: [string, string];
  message?: string;
  photo?: string;
}

// Mural Types
export interface MuralPhoto {
  id: string;
  url: string;
  caption?: string;
  date?: string;
}

// Letter Types
export interface LetterData {
  to: string;
  from: string;
  content: string;
  signature?: string;
  sealColor?: string;
  photo?: string;
}

export interface Template {
  id: string;
  userId: string;
  title: string;
  type: TemplateType;
  cardCategory?: CardCategory;
  elements: CardElement[];
  backgroundColor: string;
  backgroundImage?: string;
  showParticles: boolean;
  particleType: ParticleType;
  isPublic: boolean;
  shareToken: string;
  steps?: Step[];
  // Extended data for new types
  timelineEvents?: TimelineEvent[];
  quizQuestions?: QuizQuestion[];
  counterData?: CounterData;
  muralPhotos?: MuralPhoto[];
  letterData?: LetterData;
  createdAt: string;
  updatedAt: string;
}

export interface PublicTemplate {
  id: string;
  title: string;
  type: TemplateType;
  cardCategory?: CardCategory;
  elements: CardElement[];
  backgroundColor: string;
  backgroundImage?: string;
  showParticles: boolean;
  particleType: ParticleType;
  description?: string;
  author?: string;
  duration: number;
  timelineEvents?: TimelineEvent[];
  quizQuestions?: QuizQuestion[];
  counterData?: CounterData;
  muralPhotos?: MuralPhoto[];
  letterData?: LetterData;
  createdAt: string;
}

export interface CreateTemplateDto {
  title: string;
  type: TemplateType;
  cardCategory?: CardCategory;
  elements?: CardElement[];
  backgroundColor?: string;
  backgroundImage?: string;
  showParticles?: boolean;
  particleType?: ParticleType;
  isPublic?: boolean;
  steps?: Step[];
  // Extended data for new types
  timelineEvents?: TimelineEvent[];
  quizQuestions?: QuizQuestion[];
  counterData?: CounterData;
  muralPhotos?: MuralPhoto[];
  letterData?: LetterData;
}

