export enum AppState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface TranscriptionResponse {
  text?: string;
  transcription?: string;
  output?: string;
  message?: string;
  [key: string]: any;
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  wordCount: number;
}
