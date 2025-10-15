import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/constants";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-12 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Planos Flexíveis para seu Negócio</h2>
          <p className="mt-2 text-lg text-muted-foreground">Escolha o plano que melhor se adapta ao seu momento.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <Card key={plan.name} className={cn("flex flex-col", plan.isFeatured && "border-accent ring-2 ring-accent shadow-lg")}>
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold font-headline">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.priceSuffix}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild 
                  className={cn("w-full", plan.isFeatured ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "")}
                  variant={plan.isFeatured ? "default" : "outline"}
                >
                  <Link href="/signup">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
