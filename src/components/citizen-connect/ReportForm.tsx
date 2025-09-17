'use client';

import { useEffect, useState, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, MapPin, Send, CheckCircle, XCircle, FileImage, Mic, Camera } from 'lucide-react';
import { submitReport, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  description: z.string().min(10, { message: "Please describe the issue in at least 10 characters."}),
  photo: z.any().optional(),
  latitude: z.string().refine(val => val, { message: "Please capture your location." }),
  longitude: z.string().refine(val => val, { message: "Please capture your location." }),
});


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending} variant="accent">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit Report
        </Button>
    );
}


export function ReportForm() {
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const { toast } = useToast();

  const initialState: FormState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(submitReport, initialState);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
      photo: undefined,
      latitude: '',
      longitude: '',
    },
  });

  const { setValue, trigger, formState: { errors } } = form;

  useEffect(() => {
    if (state.message) {
      setShowResultDialog(true);
      if(!state.errors) {
        form.reset();
        setLocationStatus('idle');
        setFileName('');
      }
    }
  }, [state, form]);

  const handleGetLocation = () => {
    setLocationStatus('loading');
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude.toString());
        setValue('longitude', position.coords.longitude.toString());
        setLocationStatus('success');
        trigger(['latitude', 'longitude']); // Manually trigger validation
      },
      (error) => {
        setLocationStatus('error');
        setLocationError(`Error: ${error.message}. Please enable location services.`);
         toast({
          variant: 'destructive',
          title: 'Location Error',
          description: `Error: ${error.message}. Please enable location services.`,
        });
      }
    );
  };
  
  return (
    <>
      <Form {...form}>
        <form action={dispatch} className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., 'Large pothole on the main road causing traffic jams'" {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Attachments</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="photo-upload" className="font-normal w-full flex items-center gap-2 cursor-pointer border rounded-md p-3 hover:bg-muted transition-colors data-[error=true]:border-destructive">
                      <FileImage className="w-4 h-4 text-muted-foreground"/>
                      <span className="truncate">{fileName || 'Upload Photo (Optional)'}</span>
                    </FormLabel>
                    <FormControl>
                      <Input id="photo-upload" type="file" accept="image/*" className="sr-only" 
                        onChange={(e) => {
                          field.onChange(e.target.files ? e.target.files[0] : null);
                          setFileName(e.target.files?.[0]?.name || '');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="outline" className="h-auto p-3" onClick={() => toast({ title: 'Feature not implemented', description: 'This is a placeholder for voice recording.'})}>
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-muted-foreground" />
                    <span>Voice Note (Optional)</span>
                  </div>
              </Button>
            </div>
          </div>
          
          <FormItem>
              <FormLabel>Location</FormLabel>
              <div className="flex gap-2 items-start">
                  <Button type="button" variant="outline" onClick={handleGetLocation} disabled={locationStatus === 'loading'} data-success={locationStatus === 'success'} data-error={!!errors.latitude}>
                      {locationStatus === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {locationStatus === 'success' ? <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> : <MapPin className="mr-2 h-4 w-4" />}
                      {locationStatus === 'success' ? 'Location Captured' : 'Get Current Location'}
                  </Button>
              </div>
               {locationError && <p className="text-sm font-medium text-destructive">{locationError}</p>}
               <FormMessage>{errors.latitude?.message}</FormMessage>
          </FormItem>

          {/* Hidden fields for lat/lng */}
          <Input type="hidden" {...form.register('latitude')} />
          <Input type="hidden" {...form.register('longitude')} />
          
          {state.errors?._form && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
            </Alert>
          )}
          {state.errors?.latitude && (
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Location Required</AlertTitle>
                <AlertDescription>Please capture your location before submitting.</AlertDescription>
            </Alert>
           )}


          <SubmitButton />
        </form>
      </Form>
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
            {state.errors ? (
              <>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline text-destructive"><XCircle/>Submission Failed</DialogTitle>
                    <DialogDescription>{state.message}</DialogDescription>
                </DialogHeader>
                <p>Please review the form and try again.</p>
              </>
            ) : (
                <>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 font-headline text-green-600"><CheckCircle/>Report Submitted!</DialogTitle>
                    <DialogDescription>{state.message}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <p>Thank you for helping improve our community. Your report has been categorized as <span className='font-bold'>{state.report?.category}</span> and marked as {state.report?.isUrgent ? <span className='font-bold text-destructive'>Urgent</span> : 'not urgent'}.</p>
                    <Card className="bg-muted/50">
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Your Tracking ID</p>
                            <p className="text-lg font-mono font-bold text-accent">{state.report?.trackingId}</p>
                        </CardContent>
                    </Card>
                    <Link href={`/track?id=${state.report?.trackingId}`} passHref>
                        <Button className="w-full" variant="outline" onClick={() => setShowResultDialog(false)}>
                            Track Your Report
                        </Button>
                    </Link>
                </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
