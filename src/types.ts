export interface New {
  objectID: string;
  url: string;
  title: string;
  created_at: string;
  author: string;
  points: number;
  num_comments: number;
}

export interface AngoliaResponse {
  hits: New[];
  nbPages: number;
}
