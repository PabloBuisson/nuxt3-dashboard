export interface Tile {
  id: string;
  title: string;
  standalone?: boolean;
  category: TileCategory;
  image?: string;
  contentLink?: string;
  content: any[];
  dateCreation: Date;
  dateModification?: Date;
}

export enum TileCategory {
  TODOS = "TODOS",
  TOREAD = "TOREAD",
  EVENT = "EVENT",
  WEATHER = "WEATHER",
  POST = "POST",
}
