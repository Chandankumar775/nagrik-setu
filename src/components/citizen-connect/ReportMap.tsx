'use client';

import Image from 'next/image';
import type { Report } from '@/lib/types';
import { Card, CardDescription } from '@/components/ui/card';

// This is a placeholder for a real map component.
// In a real application, you would use a library like @vis.gl/react-google-maps
// and plot the `reports` data on it.

export function ReportMap({ reports }: { reports: Report[] }) {
    // We use a seed based on the number of reports to get a different map image
    // when the filtered data changes, simulating a map update.
    const mapSeed = reports.length > 0 ? reports.reduce((acc, r) => acc + r.id.charCodeAt(0), 0) : 'empty';

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
      <Image
        src={`https://picsum.photos/seed/${mapSeed}/800/600`}
        alt="Map of reported issues"
        fill
        className="object-cover"
        data-ai-hint="city map"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
        <Card className="bg-background/80 backdrop-blur-sm border-0">
          <CardDescription className="p-2 text-xs">
            Map view is a placeholder. In a real app, this would be an interactive map showing {reports.length} issues.
          </CardDescription>
        </Card>
      </div>
    </div>
  );
}
