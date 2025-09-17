'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addReport, getReportByTrackingId as getReport, getReports as getAllReports } from '@/lib/data';
import type { Report } from '@/lib/types';
import { intelligentReportCategorization } from '@/ai/flows/intelligent-report-categorization';

// Schema for form submission (still useful for type safety, but not enforced on client)
const ReportSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.'}),
  latitude: z.string(),
  longitude: z.string(),
});

export type FormState = {
  message: string;
  report?: Report;
  errors?: {
    description?: string[];
    latitude?: string[];
    longitude?: string[];
    _form?: string[];
  }
}

// Reverse geocoding to get address from lat/lng. For now, a mock.
async function getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
  // In a real app, you'd use a service like Google Maps Geocoding API.
  // For now, we return a mock address.
  return new Promise(resolve => setTimeout(() => resolve(`Ranchi, Jharkhand`), 100));
}

// A mock function to "upload" a photo. In a real app, this would upload to cloud storage.
async function uploadPhoto(photo: File): Promise<string> {
    // For the demo, we'll just return a placeholder URL.
    // This simulates an upload process and returns a URL.
    console.log(`"Uploading" photo: ${photo.name}, size: ${photo.size} bytes`);
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate upload delay
    return 'https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/6e83ebc4-af9a-45f4-a86f-60ae20c9c734.png';
}


export async function submitReport(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ReportSchema.safeParse({
    description: formData.get('description'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
  });
  
  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { description, latitude, longitude } = validatedFields.data;
  const photo = formData.get('photo') as File | null;
  
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
      return {
          message: 'Invalid location data. Please ensure location is captured correctly.',
          errors: { _form: ['Invalid location data.'] },
      }
  }

  try {
    // 1. Intelligent Categorization & Urgency Detection
    const aiResult = await intelligentReportCategorization({ reportDescription: description });
    
    // 2. Get address from coordinates
    const address = await getAddressFromCoordinates(lat, lng);

    // 3. Handle photo upload if present
    let photoUrl: string | undefined;
    if (photo instanceof File && photo.size > 0) {
        photoUrl = await uploadPhoto(photo);
    } else {
        photoUrl = 'https://assets.zeezest.com/blogs/PROD_india_villages_travel_1651054984192.jpg';
    }

    // 4. Generate tracking ID
    const trackingId = `CC-${String(Date.now()).slice(-6)}`;

    // 5. Save to our "database"
    const newReport = await addReport({
      trackingId,
      description,
      category: aiResult.category as any, // Cast because AI can return any string
      location: { lat, lng },
      address,
      photoUrl,
      isUrgent: aiResult.isUrgent,
      submittedBy: 'Rajesh Kumar', // Mock submitter name
    });
    
    // 6. Revalidate admin path to show new report
    revalidatePath('/admin');
    
    // 7. Return success state with the new report
    return {
      message: 'Report submitted successfully!',
      report: newReport,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: 'An unexpected error occurred during submission.',
      errors: { _form: [errorMessage] },
    }
  }
}

export async function getReportByTrackingId(trackingId: string): Promise<Report | null> {
    if (!trackingId) return null;
    return await getReport(trackingId);
}

export async function getReports() {
    return await getAllReports();
}
