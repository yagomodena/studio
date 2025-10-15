import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BriefcaseBusiness } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8" prefetch={false}>
          <BriefcaseBusiness className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-primary">{APP_NAME}</span>
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Acessar sua conta</CardTitle>
            <CardDescription>Bem-vindo de volta! Insira seus dados para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/dashboard">Login</Link>
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/signup" className="underline">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
