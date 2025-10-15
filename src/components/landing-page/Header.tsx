import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BriefcaseBusiness } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <BriefcaseBusiness className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold font-headline text-primary">{APP_NAME}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/signup">Cadastre-se</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
                <Link href="/" className="flex items-center gap-2" prefetch={false}>
                  <BriefcaseBusiness className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold font-headline text-primary">{APP_NAME}</span>
                </Link>
                 <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/signup">Cadastre-se</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
