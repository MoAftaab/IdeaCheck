"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Wand2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzePatentIdea, type AnalyzePatentIdeaOutput } from "@/ai/flows/patent-idea-analysis";
import { generateKeywords } from "@/ai/flows/generate-keywords";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  ideaDescription: z
    .string()
    .min(50, {
      message: "Your idea description must be at least 50 characters long.",
    })
    .max(5000, {
      message: "Your idea description cannot exceed 5000 characters.",
    }),
  keywords: z.string().min(3, {
    message: "Please provide at least one relevant keyword.",
  }),
});

export function PatentAnalysisClient() {
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzePatentIdeaOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ideaDescription: "",
      keywords: "",
    },
  });

  const handleGenerateKeywords = async () => {
    const ideaDescription = form.getValues("ideaDescription");
    if (!ideaDescription || ideaDescription.length < 50) {
      form.setError("ideaDescription", {
        type: "manual",
        message: "Please enter an idea description of at least 50 characters to generate keywords.",
      });
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const result = await generateKeywords({ ideaDescription });
      form.setValue("keywords", result.keywords, { shouldValidate: true });
    } catch (error) {
      console.error("Keyword generation failed:", error);
      toast({
        variant: "destructive",
        title: "Keyword Generation Failed",
        description: "There was an error generating keywords. Please try again.",
      });
    } finally {
      setIsGeneratingKeywords(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzePatentIdea(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your idea. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 sm:py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Turn Your Idea into a Patent
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Describe your invention and provide some keywords. Our AI will perform
          a real-time patentability analysis and provide suggestions for
          improvement.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Submit Your Idea
          </CardTitle>
          <CardDescription>
            Provide as much detail as possible for a more accurate analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="ideaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Idea Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A smart coffee mug that maintains a set temperature and tracks caffeine intake..."
                        className="min-h-[150px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the core of your invention. Describe its function,
                      structure, and what makes it unique.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-lg">Keywords</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateKeywords}
                        disabled={isGeneratingKeywords}
                      >
                        {isGeneratingKeywords ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        Generate Keywords
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="e.g., smart mug, temperature control, IoT, beverage"
                        className="text-base"
                        {...field}
                      />
    
                    </FormControl>
                    <FormDescription>
                      Comma-separated keywords to help refine the search.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Patentability"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && <LoadingState />}
      {analysisResult && <ResultsDisplay result={analysisResult} />}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
           <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    </div>
  );
}

function ResultsDisplay({ result }: { result: AnalyzePatentIdeaOutput }) {
  const { patentabilityAnalysis, improvementSuggestions } = result;

  const isPatentable = patentabilityAnalysis.isPatentable;

  return (
    <div className="max-w-4xl mx-auto mt-12 animate-in fade-in-50 duration-500">
      <div className="text-center mb-8">
        <h3 className="font-headline text-3xl font-bold tracking-tight text-primary">
          Analysis Report
        </h3>
        <Badge
          className={`mt-4 text-lg py-1 px-4 ${
            isPatentable
              ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300"
              : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300"
          }`}
          variant="outline"
        >
          {isPatentable ? (
            <CheckCircle2 className="mr-2 h-5 w-5" />
          ) : (
            <XCircle className="mr-2 h-5 w-5" />
          )}
          {isPatentable ? "Likely Patentable" : "Not Likely Patentable"}
        </Badge>
      </div>

      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <FileText className="text-primary" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base prose dark:prose-invert max-w-none">
            <p>{patentabilityAnalysis.analysisSummary}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Sparkles className="text-accent" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base prose dark:prose-invert max-w-none">
            <p>{improvementSuggestions}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <BookOpen className="text-primary" />
              Cited Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-base">
              {patentabilityAnalysis.citedResources.map((resource, index) => (
                <li key={index} className="flex items-start gap-3">
                  <LinkIcon className="h-4 w-4 mt-1 shrink-0 text-primary/80" />
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
