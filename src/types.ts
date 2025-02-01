export interface CountdownEvent {
  id: string;
  name: string;
  targetDate: Date;
  logoUrl?: string;
  duration: number;
  description: string;
  createdAt: Date;
}

export interface CountdownBoxProps {
  event: CountdownEvent;
  onStart: (id: string) => void;
  onDelete: (id: string) => void;
}