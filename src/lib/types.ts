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

// Chat types for student help chatbot
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  startedAt: Date;
  updatedAt: Date;
  studentContext?: {
    grade?: string;
    subject?: string;
  };
}
