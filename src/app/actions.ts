'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addReport, getReportByTrackingId as getReport, getReports as getAllReports, getRandomReportData } from '@/lib/data';
import { intelligentReportCategorization } from '@/ai/flows/intelligent-report-categorization';
import type { Report, ReportCategory } from '@/lib/types';

// Schema for form submission
const ReportSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
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
  return new Promise(resolve => setTimeout(() => resolve(`Vicinity of ${lat.toFixed(4)}, ${lng.toFixed(4)}`), 200));
}

export async function submitReport(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ReportSchema.safeParse({
    description: formData.get('description'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { description, latitude, longitude } = validatedFields.data;
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  
  if (isNaN(lat) || isNaN(lng)) {
    return {
      message: 'Invalid location data. Please enable location services.',
      errors: { _form: ['Invalid location data. Please get your location again.'] },
    };
  }

  try {
    // 1. Get AI-based category and urgency
    const categorizationResult = await intelligentReportCategorization({
      reportDescription: description,
    });
    const category = categorizationResult.category as ReportCategory;
    const isUrgent = categorizationResult.isUrgent;

    // 2. Get address from coordinates
    const address = await getAddressFromCoordinates(lat, lng);

    // In a real app, you would handle file uploads to a cloud storage (e.g., S3, Firebase Storage)
    // and get back URLs. For this prototype, we'll use a placeholder URL from picsum.
    const photo = formData.get('photo') as File;
    const photoUrl = photo && photo.size > 0 ? `https://picsum.photos/seed/${Date.now()}/400/300` : undefined;

    // 3. Generate tracking ID
    const trackingId = `CC-${String(Date.now()).slice(-6)}`;

    // 4. Save to our "database"
    const newReport = await addReport({
      trackingId,
      description,
      category: category || 'Other',
      location: { lat, lng },
      address,
      photoUrl,
      isUrgent,
    });
    
    // 5. Revalidate admin path to show new report
    revalidatePath('/admin');
    
    // 6. Return success state with the new report
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
    const report = await getReport(trackingId);
    
    // If a report isn't found, generate a random one for prototype purposes
    if (!report) {
        return getRandomReportData(trackingId);
    }
    
    return report;
}

export async function getReports() {
    return await getAllReports();
}
