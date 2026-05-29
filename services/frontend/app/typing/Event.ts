export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "ended";
  organizer: string;
  tags: string[];
}