export interface Listings {
    id: string;
    title: string | null;
    description: string | null;
    briefing: string | null;
    email: string | null;
    banner: string | null

  }

  export interface ListingTasks {
    id: string;
    listingId: string
    platform: string
    description: string
  }