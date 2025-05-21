
export interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  startTime: Date;
  duration: number; // in minutes
  isCompleted?: boolean;
}

export interface EventConflict {
  event1: Event;
  event2: Event;
}
