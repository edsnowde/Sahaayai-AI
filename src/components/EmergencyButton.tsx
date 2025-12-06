import { useEffect, useState } from "react";
import { AlertCircle, Phone, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const EmergencyButton = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [contacted, setContacted] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Simulate detecting the keyword "help"
  const handleVoiceCommand = (command: string) => {
    if (command.toLowerCase().includes("help")) {
      triggerEmergencyProtocol();
    }
  };

  const triggerEmergencyProtocol = () => {
    if (isActivated) return;

    setIsActivated(true);
    setContacted(false);
    setCountdown(60);

    toast("🚨 Emergency services being contacted...", {
      description: "Attempting to reach emergency contact...",
      duration: 4000,
    });

    // Simulate getting location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.info("📍 Location shared", {
          description: `Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)}`,
        });
      },
      () => {
        toast.error("❌ Location access denied.");
      }
    );
  };

  useEffect(() => {
    if (isActivated && !contacted && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isActivated && !contacted && countdown === 0) {
      escalateEmergency();
    }
  }, [countdown, isActivated, contacted]);

  const escalateEmergency = () => {
    toast.warning("⚠️ No response received", {
      description: "Escalating to hospital or police...",
    });

    setTimeout(() => {
      toast("🚓 Police or Hospital contacted", {
        description: "Help is being dispatched now.",
        icon: <ShieldAlert className="text-red-500" />,
        duration: 5000,
      });
      setIsActivated(false);
      setContacted(true);
    }, 3000);
  };

  const handleClick = () => {
    handleVoiceCommand("help"); // Simulate voice input saying "help"
  };

  return (
    <button
      className={`fixed bottom-6 right-6 z-10 transition-all
        ${isActivated ? "bg-red-800 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
      onClick={handleClick}
      disabled={isActivated}
      style={{
        border: '4px solid #000',
        background: isActivated ? '#A80000' : '#FF4D4D',
        color: '#fff',
        padding: '1rem 1.25rem',
        boxShadow: '4px 4px 0 rgba(0,0,0,1)',
        borderRadius: 0,
        fontFamily: `"Comic Sans MS", "Comic Sans", cursive, sans-serif`,
        fontWeight: 700,
      }}
    >
      <div className="flex items-center gap-3">
        {isActivated ? (
          <>
            <Phone className="h-5 w-5 animate-pulse" />
            <span>Calling... ({countdown})</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5" />
            <span>Emergency</span>
          </>
        )}
      </div>
    </button>
  );
};

export default EmergencyButton;
