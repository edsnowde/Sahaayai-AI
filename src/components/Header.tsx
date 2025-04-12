import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from '../assets/logo.jpg'; // Adjust if needed

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
      className="bg-yellow-200 border-b-4 border-black px-6 py-4 flex justify-between items-center shadow-[4px_4px_0_rgba(0,0,0,1)]"
      style={{ fontFamily: `'Comic Sans MS', cursive, sans-serif` }}
    >
      <Link to="/" className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src={logo}
            alt="SahaayAI Logo"
            className="w-full h-full object-contain border-2 border-black bg-white shadow-[2px_2px_0_rgba(0,0,0,1)]"
          />
        </div>
        <h1 className="text-3xl font-bold text-black tracking-wide">
          SahaayAI
        </h1>
      </Link>

      {showLanguageSelector && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-3 text-xl bg-white px-4 py-2 border-2 border-black cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,1)]"
          >
            <Globe className="h-6 w-6 text-black" />
            <span className="font-semibold">{language}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-yellow-100 border-2 border-black rounded-none mt-2 shadow-[3px_3px_0_rgba(0,0,0,1)] min-w-[200px] p-2 z-50">
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
