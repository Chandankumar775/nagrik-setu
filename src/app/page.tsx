import { Header } from '@/components/citizen-connect/Header';
import { ReportForm } from '@/components/citizen-connect/ReportForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileWarning, MapPin, Mic, Camera } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Report a Civic Issue,
                    <br />
                    Improve Your Community
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Spotted a pothole, broken streetlight, or overflowing trash? Let us know. 
                    Citizen Connect makes it easy to report issues and track their resolution.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <FeatureCard icon={Camera} title="Snap a Photo" description="A picture is worth a thousand words." />
                  <FeatureCard icon={Mic} title="Add a Voice Note" description="Quickly describe the issue in your own words." />
                  <FeatureCard icon={MapPin} title="Pinpoint Location" description="We automatically capture the exact location." />
                  <FeatureCard icon={FileWarning} title="Get Updates" description="Track the status of your report with a unique ID." />
                </div>
              </div>
              <Card className="shadow-lg" id="report-form">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">Report an Issue</CardTitle>
                  <CardDescription>Fill out the form below to submit a civic issue. No account required.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    return (
        <div className="flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-card">
            <Icon className="mt-1 h-6 w-6 text-accent" />
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
