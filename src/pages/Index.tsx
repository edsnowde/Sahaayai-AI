import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { HeadphonesIcon, Heart, MessageCircle, ShieldCheck, Music } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-yellow-100 text-black font-sans" style={{ fontFamily: `'Comic Sans MS', cursive` }}>
      <Header showLanguageSelector={true} />

      <main className="flex-1 container py-8 px-4 md:py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black underline decoration-wavy">
            Welcome to SahaayAI
          </h1>
          <p className="text-2xl mb-8">
          A Voice That Cares, A Friend Who's Always There
                    </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-full text-lg shadow-[3px_3px_0_rgba(0,0,0,1)] border-2 border-black">
              Get Started
            </Link>
            <Link to="/dashboard" className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-lg shadow-[3px_3px_0_rgba(0,0,0,1)] border-2 border-black">
              Try a Demo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 text-center rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeadphonesIcon className="h-8 w-8 text-pink-700" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Entertainment</h3>
            <p>Enjoy music, news, and shows – just say it!</p>
          </div>

          <div className="bg-white p-6 text-center rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-purple-700" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Wellbeing</h3>
            <p>Get health tips, reminders and relax with meditation.</p>
          </div>

          <div className="bg-white p-6 text-center rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-orange-700" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Social</h3>
            <p>Talk to your family or make new friends online!</p>
          </div>

          <div className="bg-white p-6 text-center rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-green-700" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Safety</h3>
            <p>Need help? Say it and we’ll act fast!</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] mb-12">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
              <h2 className="text-3xl font-bold mb-4">Simple Voice Interface</h2>
              <p className="text-xl mb-4">
                Speak your needs clearly — SahaayAI listens and helps.
              </p>
              <ul className="space-y-3 text-lg">
                <li>✔ No typing needed</li>
                <li>✔ Supports Hindi, English & Kannada</li>
                <li>✔ One command for emergency help</li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-yellow-200 rounded-xl p-6 flex flex-col items-center">
              <Music className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-xl text-center italic">
                "Play some devotional music"
              </p>
              <p className="text-center mt-4">
                Say it out loud, and your wish comes true!
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-yellow-300 py-8 px-4 border-t-4 border-black">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-black mb-4">SahaayAI</h2>
          <p className="mb-6">Your friendly voice buddy for a simpler life!</p>
          <div className="flex justify-center gap-6">
            <Link to="/register" className="text-black underline">Register</Link>
            <Link to="#" className="text-black underline">About</Link>
            <Link to="#" className="text-black underline">Contact</Link>
          </div>
          <p className="mt-8 text-sm">© 2023 SahaayAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
