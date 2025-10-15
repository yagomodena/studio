import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BriefcaseBusiness } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8" prefetch={false}>
          <BriefcaseBusiness className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-primary">{APP_NAME}</span>
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Crie sua conta</CardTitle>
            <CardDescription>Comece a gerenciar seu negócio de forma inteligente.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input id="company-name" placeholder="Sua Empresa LTDA" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Seu Nome Completo</Label>
                <Input id="full-name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/dashboard">Criar conta</Link>
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
