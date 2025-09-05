import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Leaf, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Debes confirmar tu email antes de iniciar sesión.');
          } else {
            setError(error.message);
          }
        } else {
          toast.success('¡Bienvenido de vuelta!');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('Este email ya está registrado. ¿Quieres iniciar sesión?');
          } else if (error.message.includes('Password should be at least')) {
            setError('La contraseña debe tener al menos 6 caracteres.');
          } else {
            setError(error.message);
          }
        } else {
          toast.success('¡Cuenta creada! Revisa tu email para confirmar tu registro.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError('Ha ocurrido un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {isLogin 
                ? 'Accede a tu cuenta de Sétales & Lluvia'
                : 'Únete a la comunidad de buscadores de setas'
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-primary-hover shadow-medium transition-smooth"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-smooth"
            >
              {isLogin 
                ? '¿No tienes cuenta? Regístrate aquí' 
                : '¿Ya tienes cuenta? Inicia sesión'
              }
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Al continuar, aceptas nuestros términos de servicio y política de privacidad.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}