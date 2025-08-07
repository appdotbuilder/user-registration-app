import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/utils/trpc';
import { CheckCircle2, AlertCircle, Eye, EyeOff, UserPlus, Mail, Lock, User } from 'lucide-react';
import type { RegisterUserInput } from '../../../server/src/schema';

interface RegistrationFormProps {
  onSuccessfulRegistration: () => void;
}

export function RegistrationForm({ onSuccessfulRegistration }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [formData, setFormData] = useState<RegisterUserInput>({
    username: '',
    email: '',
    password: ''
  });

  const [validation, setValidation] = useState<{
    usernameExists: boolean;
    emailExists: boolean;
  } | null>(null);

  const [touched, setTouched] = useState<{
    username: boolean;
    email: boolean;
    password: boolean;
  }>({
    username: false,
    email: false,
    password: false
  });

  const validateField = (field: keyof RegisterUserInput, value: string) => {
    switch (field) {
      case 'username':
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 50) return 'Username must be less than 50 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
        break;
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (value.length > 100) return 'Password must be less than 100 characters';
        break;
    }
    return null;
  };

  const getFieldError = (field: keyof RegisterUserInput) => {
    if (!touched[field]) return null;
    return validateField(field, formData[field]);
  };

  const isFormValid = () => {
    return Object.keys(formData).every(key => {
      const field = key as keyof RegisterUserInput;
      return !validateField(field, formData[field]) && formData[field].length > 0;
    }) && !validation?.usernameExists && !validation?.emailExists;
  };

  const checkUserExists = async () => {
    if (formData.username.length >= 3 && /\S+@\S+\.\S+/.test(formData.email)) {
      try {
        const result = await trpc.checkUserExists.query({
          username: formData.username,
          email: formData.email
        });
        setValidation(result);
      } catch (error) {
        console.error('Failed to check user existence:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setAlert({ type: 'error', message: 'Please fix all validation errors before submitting.' });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const response = await trpc.registerUser.mutate(formData);
      
      if (response.success) {
        setAlert({ type: 'success', message: `🎉 ${response.message}` });
        // Reset form
        setFormData({ username: '', email: '', password: '' });
        setValidation(null);
        setTouched({ username: false, email: false, password: false });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onSuccessfulRegistration();
        }, 2000);
      } else {
        setAlert({ type: 'error', message: response.message });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setAlert({ type: 'error', message: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterUserInput, value: string) => {
    setFormData((prev: RegisterUserInput) => ({ ...prev, [field]: value }));
    setAlert(null);
    
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Clear validation when user starts typing
    if (validation) {
      setValidation(null);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'red';
    if (strength < 70) return 'yellow';
    return 'green';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 40) return 'Weak 😟';
    if (strength < 70) return 'Fair 😐';
    return 'Strong 😊';
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Card className="w-full max-w-md card-enhanced shadow-2xl border-0">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Join Us Today! ✨
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Create your account and start your amazing journey with us
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {alert && (
          <Alert className={`border-0 ${
            alert.type === 'success' 
              ? 'bg-green-50 text-green-800 success-pulse' 
              : 'bg-red-50 text-red-800'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <AlertDescription className="font-medium">
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('username', e.target.value)
                }
                onBlur={checkUserExists}
                className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 pl-10 ${
                  getFieldError('username') ? 'field-error' : 'input-enhanced'
                }`}
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {getFieldError('username') && (
              <p className="text-xs text-red-600 mt-1">{getFieldError('username')}</p>
            )}
            {validation?.usernameExists && (
              <Badge variant="destructive" className="text-xs">
                ❌ Username already taken
              </Badge>
            )}
            {touched.username && !getFieldError('username') && !validation?.usernameExists && (
              <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                ✅ Username available
              </Badge>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('email', e.target.value)
                }
                onBlur={checkUserExists}
                className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 pl-10 ${
                  getFieldError('email') ? 'field-error' : 'input-enhanced'
                }`}
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {getFieldError('email') && (
              <p className="text-xs text-red-600 mt-1">{getFieldError('email')}</p>
            )}
            {validation?.emailExists && (
              <Badge variant="destructive" className="text-xs">
                ❌ Email already registered
              </Badge>
            )}
            {touched.email && !getFieldError('email') && !validation?.emailExists && (
              <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                ✅ Email available
              </Badge>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('password', e.target.value)
                }
                className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 pl-10 pr-12 ${
                  getFieldError('password') ? 'field-error' : 'input-enhanced'
                }`}
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {getFieldError('password') && (
              <p className="text-xs text-red-600 mt-1">{getFieldError('password')}</p>
            )}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength >= 70 ? 'text-green-600' :
                    passwordStrength >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <Progress 
                  value={passwordStrength} 
                  className="h-2"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:transform-none disabled:opacity-50 btn-gradient"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Creating Account<span className="loading-dots"></span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create My Account 🚀
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}