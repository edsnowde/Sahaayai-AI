import { cn } from "@/lib/utils";

interface WaveAnimationProps {
  isListening: boolean;
  className?: string;
}

const WaveAnimation = ({ isListening, className }: WaveAnimationProps) => {
  if (!isListening) return null;

  return (
    <div
      className={cn(
        "flex items-end justify-center gap-2 h-16 p-2 bg-yellow-100 border-4 border-black rounded-xl shadow-lg",
        className
      )}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-4 rounded bg-black animate-retro-wave"
          style={{
            height: `${Math.random() * 20 + 20}px`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
