import { Document } from 'mongoose';

export interface Activity {
    site: string,
    description: string,
    time: string
}

export interface PlanActivity {
  day: number;
  activities: Activity[]
}

export interface ItineraryType extends Document {
  userId: string;
  title: string;
  location: string;
  plan: PlanActivity[];
  createdAt: Date;
  updatedAt: Date;
}
