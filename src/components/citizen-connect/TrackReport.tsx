'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, ServerCrash, Calendar, Clock, MapPin, Tag, MessageSquare, CheckCircle, Hourglass, ShieldCheck, XCircle, User, Phone } from 'lucide-react';
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
import Image from 'next/image';

const statusSteps: ReportStatus[] = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'];

const statusInfo: Record<ReportStatus, { icon: React.ReactNode, text: string, color: string }> = {
  Submitted: { icon: <CheckCircle />, text: 'Submitted', color: 'bg-blue-500' },
  Acknowledged: { icon: <CheckCircle />, text: 'Acknowledged', color: 'bg-yellow-500' },
  'In Progress': { icon: <Hourglass />, text: 'In Progress', color: 'bg-orange-500' },
  Resolved: { icon: <ShieldCheck />, text: 'Resolved', color: 'bg-green-500' },
  Rejected: { icon: <XCircle />, text: 'Rejected', color: 'bg-destructive' },
}

export function TrackReport() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (idToSearch: string) => {
    if (!idToSearch) {
      setError('Please enter a tracking ID.');
      setReport(null);
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const result = await getReportByTrackingId(idToSearch);
        if (result) {
          setReport(result);
        } else {
          setReport(null);
          setError('No report found with this tracking ID. Please check the ID and try again.');
        }
        window.history.pushState({}, '', `/track?id=${idToSearch}`);
      } catch (e) {
          setReport(null);
          setError('An error occurred while fetching the report.');
      }
    });
  };
  
  useEffect(() => {
    const initialId = searchParams.get('id');
    if (initialId) {
      setTrackingId(initialId);
      handleSearch(initialId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter your tracking ID (e.g., CC-MOCK-1)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(trackingId)}
          className="text-base"
        />
        <Button type="submit" onClick={() => handleSearch(trackingId)} disabled={isPending || !trackingId}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="sr-only">Search</span>
        </Button>
      </div>
      
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <a href="/" className="hover:underline">Home</a>
        {' > '}
        <a href="/track" className="hover:underline">Track Report</a>
        {report && ' > Status'}
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
        <Card className="w-full animate-in fade-in-50 duration-500 overflow-hidden border">
          <CardHeader className="bg-muted/30">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-blue-800">Report Status</CardTitle>
                  <CardDescription className="font-mono font-bold text-lg">Tracking ID: {report.trackingId}</CardDescription>
                </div>
                <Badge variant={report.status === 'Rejected' ? 'destructive' : 'default'} className={cn('whitespace-nowrap flex items-center gap-2 text-base', statusInfo[report.status].color)}>
                   {React.cloneElement(statusInfo[report.status].icon as React.ReactElement, { className: 'w-5 h-5'})}
                   {report.status}
                </Badge>
              </div>
          </CardHeader>
          <CardContent className="grid gap-6 p-6">
            
            <StatusTimeline currentStatus={report.status} />

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              <InfoRow label="Category" value={report.category} icon={<Tag />} />
              <InfoRow label="Submitted By" value={report.submittedBy || 'Anonymous'} icon={<User />} />
              <InfoRow label="Submitted On" value={format(new Date(report.submittedAt), "dd-MM-yyyy")} icon={<Calendar />} />
              <InfoRow label="Last Updated" value={format(new Date(report.updatedAt), "dd-MM-yyyy")} icon={<Clock />} />
              <div className="md:col-span-2">
                <InfoRow label="Location" value={report.address} icon={<MapPin />} />
              </div>
              <div className="md:col-span-2">
                <InfoRow label="Description" value={report.description} icon={<MessageSquare />} multiline />
              </div>
               <div className="md:col-span-2">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground"><MessageSquare className="w-4 h-4" /> Photo Evidence</h4>
                {report.photoUrl ? (
                  <div className="mt-2 border rounded-md p-2 w-48 h-36 relative">
                     <Image src={report.photoUrl} alt="Report photo" layout="fill" className="rounded-md object-cover" data-ai-hint="pothole road" />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic mt-1">No photo provided</p>
                )}
               </div>
            </div>
             
          </CardContent>
          <CardFooter className="flex-col items-start text-sm text-muted-foreground border-t bg-muted/30 p-6 gap-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4"/>
              <strong>Need Help?</strong> Contact your local municipal office.
            </div>
            <span>For urgent complaints call 1800-XXX-XXXX.</span>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value, icon, multiline = false }: { label: string, value: string, icon: React.ReactNode, multiline?: boolean}) {
  return (
    <div className='grid gap-1'>
      <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground">{React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4'})} {label}</h4>
      {multiline ? (
        <p className="text-sm bg-muted/50 p-3 rounded-md">{value}</p>
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  )
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
      <h3 className="font-semibold mb-4 text-sm text-blue-800">Progress Timeline</h3>
      <div className="flex justify-between items-center">
        {statusSteps.map((status, index) => (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center text-center w-24">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                index <= currentIndex ? 'bg-green-600 border-green-600 text-white' : 'bg-muted border-muted-foreground/20 text-muted-foreground'
              )}>
                {React.cloneElement(statusInfo[status].icon as React.ReactElement, { className: 'w-5 h-5'})}
              </div>
              <p className={cn("text-xs mt-2", index <= currentIndex ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{status}</p>
            </div>
            {index < statusSteps.length - 1 && <div className={cn("flex-1 h-1 mx-2 transition-colors duration-300", index < currentIndex ? 'bg-green-600' : 'bg-muted-foreground/20')} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
