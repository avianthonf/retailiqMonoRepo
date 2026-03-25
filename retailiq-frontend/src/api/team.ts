import { apiGet } from '@/api/client';

export interface TeamPingResponse {
  success: boolean;
}

export const pingTeam = () => apiGet<TeamPingResponse>('/api/v1/team/ping');
