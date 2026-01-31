
export type AppMode = 'chat' | 'voice' | 'generate' | 'vision';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: { title: string; uri: string }[];
  isAppForge?: boolean;
  codeBlocks?: { fileName: string; content: string; language: string }[];
}

export interface GenerationRequest {
  type: 'image' | 'video';
  prompt: string;
  status: 'idle' | 'loading' | 'completed' | 'error';
  resultUrl?: string;
}
