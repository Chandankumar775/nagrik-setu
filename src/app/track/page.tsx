import { Header } from '@/components/citizen-connect/Header';
import { TrackReport } from '@/components/citizen-connect/TrackReport';
import { Suspense } from 'react';

export default function TrackPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center space-y-4">
              <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Track Your Report
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Enter the tracking ID you received upon submission to see the current status of your report.
              </p>
            </div>
            <div className="mx-auto max-w-xl mt-8">
              <Suspense fallback={<div>Loading...</div>}>
                <TrackReport />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
