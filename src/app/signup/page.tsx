'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BriefcaseBusiness } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { useAuth } from '@/firebase';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

function SignupForm() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'Plano Padrão';
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formState.email, formState.password);
      const user = userCredential.user;

      // Update user profile in Firebase Auth
      await updateProfile(user, { displayName: formState.fullName });

      // Call the Cloud Function to save user data to Firestore
      const functions = getFunctions(auth.app);
      const addUserToFirestore = httpsCallable(functions, 'addUserToFirestore');
      await addUserToFirestore({
        uid: user.uid,
        email: formState.email,
        name: formState.fullName,
        companyName: formState.companyName,
        phone: formState.phone,
        plan: plan,
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'Ocorreu um erro ao criar a conta.');
    }
  };

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
            <CardDescription>Comece a gerenciar seu negócio de forma inteligente. Plano selecionado: <strong>{plan}</strong></CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSignUp}>
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input id="companyName" value={formState.companyName} onChange={handleFormChange} placeholder="Sua Empresa LTDA" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Seu Nome Completo</Label>
                <Input id="fullName" value={formState.fullName} onChange={handleFormChange} placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formState.email} onChange={handleFormChange} placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" value={formState.phone} onChange={handleFormChange} placeholder="(99) 99999-9999" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={formState.password} onChange={handleFormChange} required />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Criar conta
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


export default function SignupPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignupForm />
    </Suspense>
  );
}