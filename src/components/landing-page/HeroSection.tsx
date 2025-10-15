import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-card py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary tracking-tighter">
            Gerencie seu negócio com facilidade e inteligência
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            {`EasyBusiness é a plataforma SaaS completa para controle de vendas, estoque e finanças. Simplifique sua gestão e foque no crescimento da sua empresa.`}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/signup">Comece grátis por 14 dias</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Saber mais</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
