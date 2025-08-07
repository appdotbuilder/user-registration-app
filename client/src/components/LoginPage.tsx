import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, LogIn, ArrowLeft, Sparkles, Heart } from 'lucide-react';

interface LoginPageProps {
  onBackToRegistration: () => void;
}

export function LoginPage({ onBackToRegistration }: LoginPageProps) {
  return (
    <Card className="w-full max-w-md card-enhanced shadow-2xl border-0">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Welcome Back! 👋
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          You're now part of our amazing community
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="relative">
            <CheckCircle2 className="mx-auto w-20 h-20 text-green-500 mb-4 animate-pulse" />
            <Sparkles className="absolute top-0 right-1/2 transform translate-x-8 -translate-y-2 w-6 h-6 text-yellow-400 animate-bounce" />
            <Heart className="absolute bottom-0 left-1/2 transform -translate-x-8 translate-y-2 w-5 h-5 text-pink-400 animate-pulse" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Registration Successful! 🎉
          </h3>
          
          <div className="space-y-3 text-gray-700">
            <p className="text-lg font-medium">
              Your account has been created successfully! ✨
            </p>
            <p className="text-base">
              Welcome to our community! You can now sign in with your new credentials and start exploring all the amazing features we have to offer.
            </p>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-2">What's Next? 🚀</h4>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Complete your profile setup
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Explore our features and tools
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Connect with other members
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                Start your journey with us!
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            onClick={() => {
              // This would typically redirect to the actual login page
              alert('🎊 This would redirect to the sign-in page! For now, this is a demo completion.');
            }}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Continue to Sign In 🔐
          </Button>

          <Button
            variant="outline"
            className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            onClick={onBackToRegistration}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </Button>
        </div>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need help? Contact our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
              support team
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}