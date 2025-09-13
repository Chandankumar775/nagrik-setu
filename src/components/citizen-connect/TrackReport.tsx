'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, ServerCrash, Calendar, Clock, MapPin, Tag, MessageSquare, CheckCircle, Hourglass, ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getReportByTrackingId } from '@/app/actions';
import type { Report, ReportStatus } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import React from 'react';

const statusSteps: ReportStatus[] = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'];

const statusIcons: Record<ReportStatus, React.ReactNode> = {
  Submitted: <CheckCircle />,
  Acknowledged: <CheckCircle />,
  'In Progress': <Hourglass />,
  Resolved: <ShieldCheck />,
  Rejected: <XCircle />,
}

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
          // Update URL without reloading page
          window.history.pushState({}, '', `/track?id=${trackingId}`);
        } else {
          setReport(null);
          setError(`An error occurred while fetching the report.`);
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
          <AlertTitle>Error</AlertTitle>
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
                <Badge variant={report.status === 'Rejected' ? 'destructive' : 'secondary'} className="whitespace-nowrap flex items-center gap-2">
                   {statusIcons[report.status]}
                   {report.status}
                </Badge>
              </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            
            <StatusTimeline currentStatus={report.status} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Tag className="w-4 h-4" /> Category</div>
                  <p>{report.category}</p>
              </div>
               <div className="grid gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4" /> Location</div>
                  <p>{report.address}</p>
              </div>
            </div>
             <div className="grid gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MessageSquare className="w-4 h-4" /> Description</div>
                <p className="bg-muted/50 p-3 rounded-md text-sm">{report.description}</p>
            </div>
             
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between text-xs text-muted-foreground border-t pt-4 gap-2 sm:gap-0">
            <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted: {format(new Date(report.submittedAt), "PPP")}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                 <span>Last updated: {formatDistanceToNow(new Date(report.updatedAt), { addSuffix: true })}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}


function StatusTimeline({ currentStatus }: { currentStatus: ReportStatus }) {
  const currentIndex = statusSteps.indexOf(currentStatus);

  if (currentStatus === 'Rejected') {
    return (
      <div className='flex items-center justify-center p-4 bg-destructive/10 rounded-lg border border-destructive/20'>
        <XCircle className="w-5 h-5 text-destructive mr-2"/>
        <p className="text-destructive font-medium">This report has been rejected.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 text-sm">Progress Timeline</h3>
      <div className="flex justify-between items-center">
        {statusSteps.map((status, index) => (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center text-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                index <= currentIndex ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-muted-foreground/20 text-muted-foreground'
              )}>
                {statusIcons[status]}
              </div>
              <p className={cn("text-xs mt-2", index <= currentIndex ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{status}</p>
            </div>
            {index < statusSteps.length - 1 && <div className={cn("flex-1 h-1 mx-2 transition-colors duration-300", index < currentIndex ? 'bg-primary' : 'bg-muted-foreground/20')} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
