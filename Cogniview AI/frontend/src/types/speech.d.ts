// 🔥 Fix missing SpeechRecognition types

interface SpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;

  start(): void;
  stop(): void;

  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}