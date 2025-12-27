export interface ExperienceData {
  id: number;
  organizationId: number;        // For create/update operations
  organization: string;          // Organization name (read-only)
  organizationType: string;      // Organization type (read-only)
  roleTitle: string;
  startDate: string;             // ISO format: "yyyy-MM-dd"
  endDate: string | null;        // ISO format or null for "present"
  description: string | null;
  published: boolean;
  sortOrder: number;
  accomplishments: string[];
}