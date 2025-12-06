import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  showLanguageSelector?: boolean;
}

const Header = ({ showLanguageSelector = true }: HeaderProps) => {
  const [language, setLanguage] = useState('English');
  
  const languages = [
    { name: 'English', code: 'en' },
    { name: 'हिन्दी (Hindi)', code: 'hi' },
    { name: 'ಕನ್ನಡ (Kannada)', code: 'ka' },
  ];

  return (
    <header 
      className="retro-header border-b-4 border-black px-6 py-4 flex justify-between items-center relative"
      style={{ fontFamily: `'Comic Sans MS', cursive, sans-serif` }}
    >
      <Link to="/" className="flex items-center gap-4">
        <div className="bg-white border-4 border-black w-30 h-30 flex items-center justify-center p-1 shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <img src="/icon.png" alt="SahaayAI logo" className="w-24 h-24 object-contain" />
        </div>
      </Link>

      {/* Centered title */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-5xl font-extrabold text-black pointer-events-none">
        SahaayAI
      </h1>

      {showLanguageSelector && (
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="flex items-center gap-3 text-xl bg-white px-4 py-2 border-2 border-black cursor-pointer"
          >
            <Globe className="h-6 w-6 text-black" />
            <span>{language}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-yellow-100 border-2 border-black rounded-none mt-2 shadow-[3px_3px_0_rgba(0,0,0,1)] min-w-[200px] p-2">
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                className="text-lg px-4 py-3 cursor-pointer hover:bg-yellow-300"
                onClick={() => setLanguage(lang.name)}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
