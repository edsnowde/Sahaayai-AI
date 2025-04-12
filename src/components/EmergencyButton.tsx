import { useState } from 'react';
import { AlertCircle, Phone } from 'lucide-react';
import { toast } from 'sonner';

const EmergencyButton = () => {
  const [isActivated, setIsActivated] = useState(false);
  
  const handleEmergency = () => {
    if (isActivated) return;

    // 🔊 Play emergency alert audio
    const audio = new Audio('/sos-alert.mp3');
    audio.play().catch(error => {
      console.error('Audio playback failed:', error);
    });

    setIsActivated(true);
    toast("Emergency services being contacted...", {
      description: "Help is on the way!",
      duration: 5000,
    });
    
    // Simulate contacting emergency contacts
    setTimeout(() => {
      toast.success("Emergency contacts notified", {
        description: "Your emergency contacts have been sent your location and are being called.",
      });
      setTimeout(() => setIsActivated(false), 5000);
    }, 3000);
  };
  
  return (
    <button
      className={`fixed bottom-6 right-6 btn-emergency flex items-center gap-2 z-10 ${isActivated ? 'bg-red-800' : ''}`}
      onClick={handleEmergency}
      disabled={isActivated}
    >
      {isActivated ? (
        <>
          <Phone className="h-6 w-6" />
          <span>Calling...</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-6 w-6" />
          <span>Emergency</span>
        </>
      )}
    </button>
  );
};

export default EmergencyButton;
