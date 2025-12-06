import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon,
  color = "bg-yellow-200",  // Light retro yellow
  onClick 
}: FeatureCardProps) => {
  return (
    <div 
      className={`border-4 border-black bg-white p-6 w-full rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer transition-none`}
      onClick={onClick}
      style={{
        fontFamily: `'Comic Sans MS', cursive, sans-serif`, // 90s classic font
        maxWidth: "100%",
      }}
    >
      <div className={`w-20 h-20 ${color} border-2 border-black flex items-center justify-center mb-4`}>
        <Icon className="h-10 w-10 text-black" />
      </div>
      <h3 className="text-3xl font-bold text-black mb-3">{title}</h3>
      <p className="text-xl text-black leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
