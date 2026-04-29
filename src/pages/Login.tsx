import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { setCurrentDemoUser, getDemoData } from '@/lib/demoData';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('admin@profix.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message || 'Credenciales invalidas');
    } else {
      navigate('/');
    }
    setLoading(false);
  }

  function enterDemo() {
    const data = getDemoData();
    const admin = data.profiles.find((p: any) => p.email === 'admin@profix.com');
    if (admin) {
      setCurrentDemoUser(admin);
      window.location.href = '/';
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#0f1f33] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src="/icons/icon-192x192.png" alt="ProFix" className="h-16 w-16 mx-auto" />
          </div>
          <CardTitle className="text-2xl text-[#1e3a5f]">ProFix</CardTitle>
          <CardDescription>Plomeria & Electricidad Profesional</CardDescription>
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
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#2a4d7a]" disabled={loading}>
              {loading ? 'Entrando...' : 'Iniciar Sesion'}
            </Button>
          </form>
          <div className="mt-3">
            <button
              type="button"
              className="w-full py-2 px-4 border border-green-500 text-green-600 hover:bg-green-50 rounded-md font-medium"
              onClick={enterDemo}
            >
              Entrar en Modo Demo
            </button>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Demo: admin@profix.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
