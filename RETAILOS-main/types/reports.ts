export type ReportType = 'daily' | 'weekly' | 'monthly' | 'inventory' | 'customer' | 'custom';

export interface ReportData {
  summary: {
    revenue: number;
    orders: number;
    profit: number;
    margin: number;
  };
  details: any;
  generatedAt: string;
}

export interface Report {
  id: string;
  userId: string;
  type: ReportType;
  data: ReportData;
  narrative?: string;
  createdAt: string;
}

export interface ReportSchedule {
  id: string;
  userId: string;
  type: ReportType;
  frequency: 'daily' | 'weekly' | 'monthly';
  email: string;
  dayOfWeek?: number;
  createdAt: string;
}
