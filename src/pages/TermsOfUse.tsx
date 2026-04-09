import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border safe-area-top">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Terms of Use</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-8 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Terms of Use</h2>

        <p className="text-muted-foreground leading-relaxed">
          NotaGuard is provided 'as is' without warranties of any kind. The developer does not guarantee that the app will be error-free or uninterrupted.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          By using this app, you agree that you do so at your own risk. The developer is not responsible for any damages, losses, or issues resulting from the use of the app.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          The developer may update, modify, or discontinue the app at any time without notice.
        </p>

        <p className="text-xs text-muted-foreground/60 pt-4">
          Last updated: April 2026
        </p>
      </main>
    </div>
  );
};

export default TermsOfUse;
