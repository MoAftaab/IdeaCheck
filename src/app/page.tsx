import { PatentAnalysisClient } from './patent-analysis-client';
import { Lightbulb } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">
              PatentPilot
            </h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <PatentAnalysisClient />
      </main>
      <footer className="p-4 sm:p-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} PatentPilot. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
