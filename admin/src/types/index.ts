export interface Team {
  id: string;
  gender: string;
  ageGroup: string;
}

export interface Registration {
  id: string;
  programName: string;
  playerName: string;
  parentName: string;
  email: string;
  phone: string;
  waiverUrl?: string;
  teamId: string;
  teamLabel?: string;
  programId: string;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  season: string;
  price: number;
};

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;               // ISO date string
  startTime: string;          // ISO datetime string
  endTime?: string;           // ISO datetime string (optional)
  location?: string;
  type: string;               // "game", "practice", "tournament", etc.
  livestreamUrl?: string;     // URL for livestream (YouTube, Twitch, etc.)
  isActive: boolean;
  teamId: string;
  team: {                     // since it's required in schema
    id: string;
    gender: string;
    ageGroup: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
};

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
  name: string; // Changed from 'title' to 'name' for consistency with backend code
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;   // Add this line
  isActive: boolean;  // Add this line
  created_at: string;
}