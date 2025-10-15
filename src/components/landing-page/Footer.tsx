import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
