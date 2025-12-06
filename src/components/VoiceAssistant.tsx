import { useState, useEffect, useRef } from 'react';
import WaveAnimation from './WaveAnimation';
import { toast } from 'sonner';
import ChatHistory from './ChatHistory';
import VoiceControls from './VoiceControls';
import useTextToSpeech from '@/hooks/useTextToSpeech';

interface VoiceAssistantProps {
  welcomeMessage?: string;
}

const VoiceAssistant = ({
  welcomeMessage = "Hello! I'm SahaayAI, your voice companion. How can I help you today?"
}: VoiceAssistantProps) => {

  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState(welcomeMessage);
  const [userName, setUserName] = useState('');
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'assistant', text: string }[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [delayValue, setDelayValue] = useState(5);
  const [isInDelay, setIsInDelay] = useState(false);
  const [delayTimerId, setDelayTimerId] = useState<number | null>(null);
  const [currentVoiceId, setCurrentVoiceId] = useState('default');

  // Load user + welcome message
  const welcomeSpokenRef = useRef(false);

  useEffect(() => {
    if (welcomeSpokenRef.current) return;
    welcomeSpokenRef.current = true;

    const userData = localStorage.getItem('sahaayUserData');

    if (userData) {
      const { name } = JSON.parse(userData);
      setUserName(name);

      const personalizedWelcome = welcomeMessage.replace(
        "Hello!",
        `Hello${name ? ', ' + name : ''}!`
      );

      // Speak the welcome message on mount (and add to chat history inside speakResponse)
      void speakResponse(personalizedWelcome);
    } else {
      // No user found — speak the generic welcome message
      void speakResponse(welcomeMessage);
    }

    const savedDelay = localStorage.getItem('sahaayDelayPreference');
    if (savedDelay) setDelayValue(Number(savedDelay));
    // run only on mount
  }, []);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechAPI) {
      recognitionRef.current = new SpeechAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        if (result?.[0]) {
          setTranscript(result[0].transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast.error("Microphone access is required.");
        setIsListening(false);
        setIsInDelay(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening && !isInDelay) {
          try { recognitionRef.current?.start(); } catch {}
        }
      };
    } else {
      toast.error("Speech recognition not supported in this browser.");
    }

    return () => {
      recognitionRef.current?.stop();
      if (delayTimerId) window.clearTimeout(delayTimerId);
    };
  }, [isListening, isInDelay]);

  // Auto process transcript after 1.5 sec
  useEffect(() => {
    if (!transcript || !isListening) return;

    const timeout = window.setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'user', text: transcript }]);
      // call async handler and ignore returned Promise here
      void handleVoiceCommand(transcript);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [transcript, isListening]);

  // Handle user commands — try backend first, fallback to local rules
  const handleVoiceCommand = async (command: string) => {
    const msg = command.toLowerCase();
    let reply = "";

    // Try backend (Gemini) first
    try {
      const backendUrl = 'http://localhost:5000/api/voice-assistant';
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: msg })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.response) {
          reply = data.response;
        }
      } else {
        console.warn('Backend returned non-OK response', res.status);
      }
    } catch (err) {
      console.warn('Backend fetch failed, will fall back to local rules', err);
    }

    // Fallback to local rules if reply still empty
    if (!reply) {
      if (msg.includes("hello") || msg.includes("hi")) {
        reply = `Hello${userName ? ', ' + userName : ''}! How can I assist you today?`;
      } else if (msg.includes("music")) {
        reply = `Sure${userName ? ', ' + userName : ''}! What music would you like to hear?`;
      } else if (msg.includes("news")) {
        reply = `Would you like local news or national news${userName ? ', ' + userName : ''}?`;
      } else if (msg.includes("medicine")) {
        reply = `What time should I set your medicine reminder${userName ? ', ' + userName : ''}?`;
      } else if (msg.includes("help")) {
        reply = `I'm here for you${userName ? ', ' + userName : ''}. Do you need emergency help?`;
      } else {
        reply = `Sorry${userName ? ', ' + userName : ''}, I didn’t understand that. Could you repeat?`;
      }
    }

    speakResponse(reply);
    setTranscript('');
  };

  // Use TTS hook (ElevenLabs or browser fallback)
  const { speak, isSpeaking } = useTextToSpeech({
    onSpeechEnd: () => startDelayResumeListening(),
    onSpeechStart: () => {}
  });

  const speakResponse = async (text: string) => {
    setResponse(text);
    setChatHistory(prev => [...prev, { type: 'assistant', text }]);

    const useEleven = !!localStorage.getItem('elevenLabsApiKey');

    if (!isMuted) {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsInDelay(true);
      }

      try {
        await speak(text, currentVoiceId, useEleven);
        // speak() will call onSpeechEnd which triggers startDelayResumeListening
      } catch (err) {
        console.error('TTS speak failed, falling back to browser TTS', err);
        // Fallback to browser TTS directly
        if ('speechSynthesis' in window) {
          const utter = new SpeechSynthesisUtterance(text);
          utter.lang = 'en-US';
          utter.rate = 0.9;
          utter.onend = () => startDelayResumeListening();
          window.speechSynthesis.speak(utter);
        } else {
          startDelayResumeListening();
        }
      }
    } else {
      startDelayResumeListening();
    }
  };

  const startDelayResumeListening = () => {
    toast.info(`Taking a moment...`);
    const timer = window.setTimeout(() => {
      setIsInDelay(false);
      try { recognitionRef.current?.start(); } catch {}
      toast.info("Listening...");
      setDelayTimerId(null);
    }, delayValue * 1000);

    setDelayTimerId(timer);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast.info("Stopped listening");
    } else {
      setTranscript('');
      setIsListening(true);
      try { recognitionRef.current?.start(); } catch {}
      toast.info("Listening...");
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    toast.info(isMuted ? "Unmuted" : "Muted");
  };

  const updateDelayPreference = (value: number[]) => {
    const newVal = value[0];
    setDelayValue(newVal);
    localStorage.setItem('sahaayDelayPreference', newVal.toString());
    toast.info(`Delay updated to ${newVal}s`);
  };

  return (
    <div className="card flex flex-col items-center max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-3">SahaayAI</h2>
        <p className="text-2xl">{userName ? `Hello, ${userName}!` : "Your Voice Companion"}</p>
      </div>

      {isInDelay ? (
        <div className="text-lg font-bold mb-4">Taking a moment...</div>
      ) : (
        <WaveAnimation isListening={isListening} className="mb-4" />
      )}

      <ChatHistory messages={chatHistory} currentTranscript={transcript} retro={true} />

      <div className="text-lg mb-6 font-bold">
        {isInDelay
          ? `I will listen again in ${delayValue}s`
          : isListening
            ? "I'm listening... Speak now"
            : "Tap the microphone to speak"}
      </div>

      <VoiceControls
        isListening={isListening}
        isMuted={isMuted}
        delayValue={delayValue}
        onToggleListening={toggleListening}
        onToggleMute={toggleMute}
        onDelayChange={updateDelayPreference}
        // <<< FIX: wrap setter so it matches expected (voice) => void signature
        onVoiceSelect={(voice: any) => setCurrentVoiceId(voice.id)}
        currentVoiceId={currentVoiceId}
      />
    </div>
  );
};

export default VoiceAssistant;
