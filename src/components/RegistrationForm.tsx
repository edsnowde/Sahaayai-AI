import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('English');
  const navigate = useNavigate();

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'हिन्दी (Hindi)', code: 'hi' },
    { name: 'ಕನ್ನಡ (Kannada)', code: 'kn' },
    { name: 'తెలుగు (Telugu)', code: 'te' },
    { name: 'தமிழ் (Tamil)', code: 'ta' },
    { name: 'മലയാളം (Malayalam)', code: 'ml' },
    { name: 'বাংলা (Bengali)', code: 'bn' },
    { name: 'मराठी (Marathi)', code: 'mr' },
    { name: 'ગુજરાતી (Gujarati)', code: 'gu' }
  ];

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    toast.success("OTP sent successfully!", {
      description: "A verification code has been sent to your phone.",
    });
    setStep(2);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    toast.success("OTP verified successfully!");
    setStep(3);
  };

  const handleLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!language) {
      toast.error("Please select your preferred language");
      return;
    }

    toast.success(`Language set to ${language}!`);
    setStep(4);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast.error("Please enter your location");
      return;
    }

    toast.success("Registration successful!", {
      description: `Welcome ${name} to SahaayAI, your voice companion.`,
    });

    const userData = { name, phoneNumber, location, language };
    localStorage.setItem('sahaayUserData', JSON.stringify(userData));

    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation("Detected location");
          toast.success("Location detected!");
        },
        () => {
          toast.error("Could not detect location", {
            description: "Please enter your location manually.",
          });
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  };

  return (
    <div 
      className="bg-yellow-100 border-4 border-black p-8 max-w-xl mx-auto mt-10 shadow-[6px_6px_0_rgba(0,0,0,1)]"
      style={{ fontFamily: `'Comic Sans MS', cursive, sans-serif`, borderRadius: '0px' }}
    >
      <h2 className="text-4xl font-bold text-center mb-8 text-black">
        {step === 1 && "🌟 Let's Get Started!"}
        {step === 2 && "📲 Verify OTP"}
        {step === 3 && "🗣️ Choose Your Language"}
        {step === 4 && "📍 Set Your Location"}
      </h2>

      {step === 1 && (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xl mb-2 text-black">Your Name</label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-black text-xl py-3 px-4 w-full"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-xl mb-2 text-black">Phone Number</label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your 10-digit number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-2 border-black text-xl py-3 px-4 w-full"
            />
          </div>
          <Button type="submit" className="bg-black text-yellow-200 text-xl py-3 px-6 w-full hover:bg-yellow-400 hover:text-black border-2 border-black">
            Send OTP
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-xl mb-2 text-black">Enter OTP</label>
            <Input
              id="otp"
              type="text"
              placeholder="4-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={4}
              className="border-2 border-black text-xl py-3 px-4 w-full"
            />
            <p className="mt-2 text-lg text-black">
              OTP sent to: <strong>{phoneNumber}</strong>
            </p>
          </div>
          <Button type="submit" className="bg-black text-yellow-200 text-xl py-3 px-6 w-full hover:bg-yellow-400 hover:text-black border-2 border-black">
            Verify OTP
          </Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleLanguageSubmit} className="space-y-6">
          <label className="block text-xl mb-2 text-black">Select Preferred Language</label>
          <div className="flex items-center gap-2">
            <Globe className="text-black h-6 w-6" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="border-2 border-black w-full text-lg py-4">
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.name} className="text-lg py-2">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-black text-yellow-200 text-xl py-3 px-6 w-full hover:bg-yellow-400 hover:text-black border-2 border-black">
            Continue
          </Button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleLocationSubmit} className="space-y-6">
          <div>
            <label htmlFor="location" className="block text-xl mb-2 text-black">Your Location</label>
            <Input
              id="location"
              type="text"
              placeholder="Enter your city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-2 border-black text-xl py-3 px-4 w-full"
            />
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              className="mt-3 text-black border-2 border-black w-full text-lg py-3 bg-white hover:bg-yellow-300"
            >
              Detect My Location
            </Button>
          </div>
          <Button type="submit" className="bg-black text-yellow-200 text-xl py-3 px-6 w-full hover:bg-yellow-400 hover:text-black border-2 border-black">
            Complete Registration
          </Button>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;
