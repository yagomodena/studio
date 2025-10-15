import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, FileText } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: <ShoppingCart className="h-8 w-8 text-accent" />,
    title: "Controle de Vendas",
    description: "Registre todas as suas vendas de forma rápida e segura, acompanhando o status de cada uma.",
    image: PlaceHolderImages.find(img => img.id === 'feature-sales')
  },
  {
    icon: <Package className="h-8 w-8 text-accent" />,
    title: "Gestão de Estoque",
    description: "Cadastre produtos, controle entradas e saídas, e receba alertas de estoque baixo para nunca perder uma venda.",
    image: PlaceHolderImages.find(img => img.id === 'feature-inventory')
  },
  {
    icon: <DollarSign className="h-8 w-8 text-accent" />,
    title: "Fluxo de Caixa",
    description: "Mantenha a saúde financeira do seu negócio em dia com um controle simples de receitas e despesas.",
    image: PlaceHolderImages.find(img => img.id === 'feature-finance')
  },
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: "Emissão de Documentos",
    description: "Gere documentos informativos para seus clientes com base nas vendas, de forma automática e profissional.",
    image: PlaceHolderImages.find(img => img.id === 'feature-orders')
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Funcionalidades Poderosas</h2>
          <p className="mt-2 text-lg text-muted-foreground">Tudo que você precisa para gerir seu negócio em um só lugar.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const featureImage = feature.image;
            return (
              <Card key={feature.title} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                {featureImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={featureImage.imageUrl}
                      alt={featureImage.description}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={featureImage.imageHint}
                    />
                  </div>
                )}
                <CardHeader className="flex flex-row items-center gap-4 pt-6">
                  {feature.icon}
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
