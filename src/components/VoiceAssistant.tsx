
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import WaveAnimation from './WaveAnimation';
import ChatHistory from './ChatHistory';
import VoiceControls from './VoiceControls';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import useTextToSpeech from '@/hooks/useTextToSpeech';
import useVoiceAssistant from '@/hooks/useVoiceAssistant';

interface VoiceAssistantProps {
  welcomeMessage?: string;
}

const VoiceAssistant = ({ 
  welcomeMessage = "Hello! I'm SahaayAI, your voice companion. How can I help you today?" 
}: VoiceAssistantProps) => {
  const [transcript, setTranscript] = useState('');

  const {
    response,
    userName,
    chatHistory,
    delayValue,
    isInDelay,
    selectedVoice,
    useElevenLabs,
    handleVoiceCommand,
    updateDelayPreference,
    handlePostSpeechDelay,
    addMessageToHistory,
    handleVoiceSelect,
    setIsInDelay,
    setDelayTimerId,
  } = useVoiceAssistant({ welcomeMessage });

  const { 
    isSpeaking, 
    isMuted, 
    speak, 
    toggleMute 
  } = useTextToSpeech({
    onSpeechEnd: () => {
      if (isListening) {
        const timerId = handlePostSpeechDelay(isListening, () => {
          startListening();
        });
        setDelayTimerId(timerId);
      }
    }
  });

  const onTranscriptChange = (newTranscript: string) => {
    setTranscript(newTranscript);
  };

  const {
    isListening,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({ onTranscriptChange });
  
  // Handle transcript processing
  useEffect(() => {
    let timeoutId: number;
    
    if (transcript && isListening) {
      // Add a delay before processing to allow the user to finish speaking
      timeoutId = window.setTimeout(() => {
        // Add user's speech to chat history
        addMessageToHistory(transcript, 'user');
        
        // Generate response
        handleVoiceCommand(transcript).then((responseText) => {
          // Speak the response and add to chat history
          speakResponse(responseText);
        });
        
        // Reset transcript
        resetTranscript();
      }, 1500);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [transcript, isListening]);
  
  // Speak response function
  const speakResponse = async (text: string) => {
    addMessageToHistory(text, 'assistant');
  
    if (isListening) {
      stopListening();
      setIsInDelay(true);
    }
  
    const elevenLabsApiKey = localStorage.getItem('elevenLabsApiKey');
    await speak(text, selectedVoice.id, useElevenLabs, elevenLabsApiKey || undefined);
  };
  
  
  // Toggle listening
  const toggleListening = () => {
    // Cancel any existing delay timer when manually toggling
    if (isListening) {
      stopListening();
      setIsInDelay(false);
      toast.info("Stopped listening");
    } else {
      setTranscript('');
      startListening();
      setIsInDelay(false);
      toast.info("Listening...");
    }
  };
  
  // Toggle mute
  const handleToggleMute = () => {
    toggleMute();
    if (isMuted) {
      toast.info("Voice responses unmuted");
    } else {
      toast.info("Voice responses muted");
    }
  };
  
  return (
    <div className="card flex flex-col items-center bg-[#f2f0e6] font-mono border-4 border-black shadow-xl p-6">
      <div className="text-center mb-4">
        <h2 className="text-4xl font-extrabold text-black">SahaayAI</h2>
        <p className="text-2xl font-bold text-black">
          {userName ? `Hello, ${userName}!` : 'Your Retro Voice Companion'}
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center w-full mb-6">
        {isInDelay ? (
          <div className="h-12 flex items-center justify-center mb-4">
            <div className="text-black text-lg">
              Taking a moment...
            </div>
          </div>
        ) : (
          <WaveAnimation isListening={isListening} className="mb-4" />
        )}
        
        <div className="bg-white border-2 border-black p-4 rounded-md w-full max-w-lg h-64 overflow-y-auto mb-4">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-md mb-3 border-2 max-w-[85%] text-lg font-bold leading-6
                ${msg.type === 'user'
                  ? 'ml-auto bg-yellow-200 border-yellow-700 text-black'
                  : 'mr-auto bg-cyan-100 border-cyan-800 text-black'}`}
            >
              {msg.text}
            </div>
          ))}
          {transcript && isListening && (
            <div className="italic text-gray-700 text-lg">{transcript}</div>
          )}
        </div>
        
        <div className="text-lg font-semibold text-center mb-4 text-black">
          {isInDelay 
            ? `I'll listen again in ${delayValue} seconds${userName ? ', ' + userName : ''}` 
            : isListening 
              ? `I'm listening${userName ? ', ' + userName : ''}... Speak now` 
              : `Tap the microphone to speak${userName ? ', ' + userName : ''}`}
        </div>
        
        <VoiceControls
          isListening={isListening}
          isMuted={isMuted}
          delayValue={delayValue}
          onToggleListening={toggleListening}
          onToggleMute={handleToggleMute}
          onDelayChange={updateDelayPreference}
          onVoiceSelect={handleVoiceSelect}
          currentVoiceId={selectedVoice.id}
          retro={true}
        />
      </div>
    </div>
  );
};

export default VoiceAssistant;