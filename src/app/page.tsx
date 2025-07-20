import { PatentAnalysisClient } from './patent-analysis-client';
import { Lightbulb, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">
              PatentPilot
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="#analyzer">Get Started</Link>
            </Button>
            <Button asChild>
              <Link href="#analyzer">Analyze Idea</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-center px-4">
          <div 
            className="absolute inset-0 bg-grid-white/[0.05] bg-background"
          />
          <div className="z-10 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
              From Spark to Patent
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              PatentPilot uses cutting-edge AI to analyze your invention's novelty, check for prior art, and give you the insights you need to move forward with confidence.
            </p>
            <div className="mt-8 flex justify-center gap-4">
               <Button size="lg" asChild>
                <Link href="#analyzer">
                  Start Analyzing
                  <ArrowDown className="ml-2 h-5 w-5"/>
                </Link>
               </Button>
            </div>
          </div>
        </section>

        <section id="analyzer" className="py-16 md:py-24">
           <PatentAnalysisClient />
        </section>

      </main>

      <footer className="p-4 sm:p-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} PatentPilot. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
