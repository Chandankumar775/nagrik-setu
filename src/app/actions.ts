'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addReport, getReportByTrackingId as getReport, getReports as getAllReports } from '@/lib/data';
import type { Report } from '@/lib/types';

// Schema for form submission (still useful for type safety, but not enforced on client)
const ReportSchema = z.object({
  description: z.string(),
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

export async function submitReport(prevState: FormState, formData: FormData): Promise<FormState> {
  // Use mock data if real data is missing to ensure success
  const description = (formData.get('description') as string) || 'Mock report: Large pothole causing issues.';
  const latitude = (formData.get('latitude') as string) || '23.3441'; // Mock lat for Ranchi
  const longitude = (formData.get('longitude') as string) || '85.3096'; // Mock lng for Ranchi
  
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  try {
    // 1. Get address from coordinates
    const address = await getAddressFromCoordinates(lat, lng);

    // Use the specific image provided by the user for the mock report
    const photoUrl = 'https://assets.zeezest.com/blogs/PROD_india_villages_travel_1651054984192.jpg';

    // 2. Generate tracking ID
    const trackingId = `CC-${String(Date.now()).slice(-6)}`;

    // 3. Save to our "database"
    const newReport = await addReport({
      trackingId,
      description,
      category: 'Pothole', // Mock category
      location: { lat, lng },
      address,
      photoUrl,
      isUrgent: false, // Mock urgency
      submittedBy: 'Rajesh Kumar', // Mock submitter name
    });
    
    // 4. Revalidate admin path to show new report
    revalidatePath('/admin');
    
    // 5. Return success state with the new report
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
