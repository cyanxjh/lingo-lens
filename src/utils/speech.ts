// Speech synthesis utility for instant, zero-latency natural audio playback

let voicesLoaded = false;
let availableVoices: SpeechSynthesisVoice[] = [];

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  availableVoices = window.speechSynthesis.getVoices();
  if (availableVoices.length > 0) {
    voicesLoaded = true;
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

export function getVoiceForLanguage(bcp47: string): SpeechSynthesisVoice | undefined {
  if (!voicesLoaded) {
    loadVoices();
  }
  const prefix = bcp47.split('-')[0].toLowerCase();

  // Try exact match first
  let match = availableVoices.find(
    (v) => v.lang.toLowerCase() === bcp47.toLowerCase() || v.lang.replace('_', '-').toLowerCase() === bcp47.toLowerCase()
  );

  // Try enhanced / natural voices (like Google, Siri, Natural, Premium)
  if (!match) {
    match = availableVoices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(prefix) &&
        (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
  }

  // Fallback to any voice with the matching language prefix
  if (!match) {
    match = availableVoices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  }

  return match;
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function playSpeech(text: string, bcp47: string, options: SpeakOptions = {}): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('Speech synthesis not supported on this device');
    return false;
  }

  try {
    // Cancel ongoing speech to ensure 0-latency instant playback
    window.speechSynthesis.cancel();

    // Clean markdown asterisks if any
    const cleanText = text.replace(/\*\*/g, '').replace(/\[.*?\]/g, '').trim();
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = bcp47;
    utterance.rate = options.rate ?? 0.95; // Slightly measured for clear learning
    utterance.pitch = options.pitch ?? 1.0;

    const voice = getVoiceForLanguage(bcp47);
    if (voice) {
      utterance.voice = voice;
    }

    if (options.onStart) {
      utterance.onstart = () => options.onStart?.();
    }
    if (options.onEnd) {
      utterance.onend = () => options.onEnd?.();
    }
    if (options.onError) {
      utterance.onerror = (e) => {
        // Interrupted is normal when user clicks another word or stop
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          options.onError?.(e);
        } else {
          options.onEnd?.();
        }
      };
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Error playing speech:', err);
    options.onError?.(err);
    return false;
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
