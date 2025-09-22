import { Header } from "@/components/Header";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-6 py-8">
        {children}
      </div>
    </div>
  );
}