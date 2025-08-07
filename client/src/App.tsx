import { useState } from 'react';
import { RegistrationForm } from '@/components/RegistrationForm';
import { LoginPage } from '@/components/LoginPage';

type PageType = 'register' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('register');

  const handleSuccessfulRegistration = () => {
    setCurrentPage('login');
  };

  const handleBackToRegistration = () => {
    setCurrentPage('register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {currentPage === 'register' ? (
          <RegistrationForm onSuccessfulRegistration={handleSuccessfulRegistration} />
        ) : (
          <LoginPage onBackToRegistration={handleBackToRegistration} />
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-gray-400">
          © 2024 Your App Name. Made with ❤️ for amazing users like you.
        </p>
      </div>
    </div>
  );
}

export default App;