export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'approved' | 'rejected';
export type Department = 'IT' | 'HR' | 'Finance' | 'Operations' | 'Network';
export type DocumentType = 'HLD' | 'LLD' | 'SDD' | 'Other';

export interface Document {
  type: DocumentType;
  file: File;
  description: string;
}

export interface Request {
  id: string;
  title: string;
  department: Department;
  priority: Priority;
  description: string;
  status: Status;
  createdAt: Date;
  documents?: Document[];
  businessJustification?: string;
  technicalDetails?: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: string;
  assignee?: string;
}