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
  
  // Create a hardcoded mock report for demonstration purposes
  const mockReport: Report = {
    id: `rep-mock-${Date.now()}`,
    trackingId: `CC-${String(Date.now()).slice(-6)}`,
    description: formData.get('description') as string || "This is a mocked report. A large pothole was reported on the main road, causing significant traffic disruption and potential danger to motorists.",
    category: 'Pothole',
    location: { lat: 23.3441, lng: 85.3096 }, // Mocked coordinates for Ranchi
    address: 'Mock Address, Near Main Road, Ranchi, Jharkhand',
    photoUrl: 'https://d3i6fh83elv35t.cloudfront.net/static/2020/05/2020-05-21T100018Z_383787307_RC2WSG9NQ3MW_RTRMADP_3_ASIA-STORM-INDIA-1024x696.jpg',
    isUrgent: true,
    submittedBy: 'Rajesh Kumar',
    status: 'Submitted',
    submittedAt: new Date(),
    updatedAt: new Date(),
  };

  // Revalidate the admin path to simulate the new report appearing on the dashboard
  revalidatePath('/admin');
  
  // Return a successful state with the complete mock report data
  return {
    message: 'Report submitted successfully!',
    report: mockReport,
  };
}

export async function getReportByTrackingId(trackingId: string): Promise<Report | null> {
    if (!trackingId) return null;
    const report = await getReport(trackingId);
    return report ?? null;
}

export async function getReports() {
    return await getAllReports();
}
