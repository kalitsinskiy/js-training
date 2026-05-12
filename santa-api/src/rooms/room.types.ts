export interface Room {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  members: string[];
  status: 'pending' | 'drawn';
  drawDate?: string;
}
