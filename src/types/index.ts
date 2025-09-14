export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  gradeLevel: string;
  role: 'student' | 'staff' | 'admin';
  createdAt: string;
}

export interface FoundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  dateFound: string;
  photos: string[];
  status: 'available' | 'claimed' | 'pending';
  submittedBy: string;
  claimedBy?: string;
  createdAt: string;
}

export interface ClaimRequest {
  id: string;
  itemId: string;
  claimantId: string;
  claimantName: string;
  message: string;
  contactInfo: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}