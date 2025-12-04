export interface EditedImage {
  data: string; // Base64 data
  mimeType: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  READY_TO_EDIT = 'READY_TO_EDIT',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface PresetPrompt {
  label: string;
  text: string;
  icon: string;
}
