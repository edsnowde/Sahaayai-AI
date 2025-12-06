
import Header from '@/components/Header';
import RegistrationForm from '@/components/RegistrationForm';

const Registration = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showLanguageSelector={true} />
      
      <main className="flex-1 container py-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="card p-6 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Welcome to SahaayAI
            </h1>
            <p className="text-xl text-black">
              Your personal voice companion for daily wellbeing and assistance.
            </p>
          </div>
          
          <RegistrationForm />
        </div>
      </main>
    </div>
  );
};

export default Registration;
