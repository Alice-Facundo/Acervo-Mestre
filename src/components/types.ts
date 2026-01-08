export interface Resource {
  id: string;
  title: string;
  author: string;
  subject: string;
  year: string;
  type: string;
  icon: 'download' | 'document' | 'link' | 'folder';
  bgColor: string;
  iconColor: string;
  views?: number;
  downloads?: number;
  likes?: number;
  resources?: number;
  visibility?: string;
  isPlaylist?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  resources: number;
  visibility: string;
}
