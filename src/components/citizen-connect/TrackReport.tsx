'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, ServerCrash, Calendar, Clock, MapPin, Tag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getReportByTrackingId } from '@/app/actions';
import type { Report, ReportStatus } from '@/lib/types';
import { format } from 'date-fns';

const statusColors: Record<ReportStatus, string> = {
  Submitted: 'bg-blue-500',
  Acknowledged: 'bg-yellow-500',
  'In Progress': 'bg-orange-500',
  Resolved: 'bg-green-500',
  Rejected: 'bg-red-500',
};

export function TrackReport() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [trackingId, setTrackingId] = useState(initialId);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!trackingId) {
      setError('Please enter a tracking ID.');
      setReport(null);
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const result = await getReportByTrackingId(trackingId);
        if (result) {
          setReport(result);
        } else {
          setReport(null);
          setError(`No report found with ID: ${trackingId}`);
        }
      } catch (e) {
          setReport(null);
          setError('An error occurred while fetching the report.');
      }
    });
  };

  useEffect(() => {
    if (initialId) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter your tracking ID (e.g., CC-123456)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="text-base"
        />
        <Button type="submit" onClick={handleSearch} disabled={isPending || !trackingId}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {isPending && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {error && !isPending && (
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {report && !isPending && (
        <Card className="w-full animate-in fade-in-50 duration-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">Report Status</CardTitle>
                <CardDescription>Tracking ID: {report.trackingId}</CardDescription>
              </div>
              <Badge variant="secondary" className="whitespace-nowrap flex items-center gap-2">
                 <span className={`h-2 w-2 rounded-full ${statusColors[report.status]}`}></span>
                 {report.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Tag className="w-4 h-4" /> Category</div>
                <p>{report.category}</p>
            </div>
             <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MessageSquare className="w-4 h-4" /> Description</div>
                <p className="bg-muted/50 p-3 rounded-md">{report.description}</p>
            </div>
             <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /> Location</div>
                <p>{report.address}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between text-xs text-muted-foreground border-t pt-4 gap-2 sm:gap-0">
            <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted: {format(new Date(report.submittedAt), "PPP")}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                 <span>Last updated: {format(new Date(report.updatedAt), "p, PPP")}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
