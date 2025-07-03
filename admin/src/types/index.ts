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
  date: string;
  team?: {
    gender: string;
    ageGroup: string;
  };
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  createdAt: string;
};
