export interface Team {
  id: string;
  gender: string;
  ageGroup: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;               // ISO date string
  startTime?: string;         // ISO datetime string (optional in production)
  endTime?: string;           // ISO datetime string (optional)
  location?: string;
  type?: string;              // "game", "practice", "tournament", etc.
  livestreamUrl?: string;     // URL for livestream (YouTube, Twitch, etc.)
  isActive?: boolean;
  teamId: string;
  team?: {                    // since it might not be included in all responses
    id: string;
    gender: string;
    ageGroup: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  title: string;
  url: string;
  type: string; // "image" | "video"
  createdAt: string;
  updatedAt: string;
}

export interface Merchandise {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  isActive: boolean;
  created_at: string;
} 