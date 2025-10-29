import { Header } from '@/components/citizen-connect/Header';
import { StudentChatbot } from '@/components/citizen-connect/StudentChatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Target, Lightbulb } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
              {/* Left side - Information */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl lg:text-6xl/none">
                    AI Study Assistant
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Get instant help with your homework, understand difficult concepts, and improve your learning with our AI-powered study assistant.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FeatureCard
                    icon={BookOpen}
                    title="Subject Help"
                    description="Get explanations on Math, Science, English, History, and more."
                  />
                  <FeatureCard
                    icon={Brain}
                    title="Study Tips"
                    description="Learn effective study strategies and exam preparation techniques."
                  />
                  <FeatureCard
                    icon={Target}
                    title="Career Guidance"
                    description="Explore educational pathways and career options."
                  />
                  <FeatureCard
                    icon={Lightbulb}
                    title="Concept Clarity"
                    description="Break down complex topics into simple, understandable explanations."
                  />
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-sm">How to Use:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Type your question in the chat box</li>
                    <li>Get instant AI-powered responses</li>
                    <li>Click on suggested questions for quick help</li>
                    <li>Ask follow-up questions for deeper understanding</li>
                  </ul>
                </div>
              </div>

              {/* Right side - Chatbot */}
              <div className="flex items-center">
                <StudentChatbot />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-all hover:bg-secondary hover:shadow-md">
      <div className="bg-accent/10 p-2 rounded-full">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
