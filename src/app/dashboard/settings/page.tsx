import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua conta e empresa.</p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Atualize suas informações pessoais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empresa</CardTitle>
          <CardDescription>Gerencie os detalhes da sua empresa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input id="company-name" defaultValue="Sua Empresa LTDA" />
          </div>
           <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Excluir Conta</CardTitle>
          <CardDescription>
            Esta ação é irreversível. Todos os dados associados à sua conta serão permanentemente apagados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Excluir Minha Conta</Button>
        </CardContent>
      </Card>
    </div>
  );
}
