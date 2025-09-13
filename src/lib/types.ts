export type ReportStatus = 'Submitted' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Rejected';

export type ReportCategory = 'Pothole' | 'Broken Streetlight' | 'Overflowing Trash Bin' | 'Traffic Signal Malfunction' | 'Water Leak' | 'Other';

export interface Report {
  id: string;
  trackingId: string;
  description: string;
  category: ReportCategory;
  photoUrl?: string;
  voiceUrl?: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  status: ReportStatus;
  submittedAt: Date;
  updatedAt: Date;
  isUrgent: boolean;
  submittedBy?: string;
}
