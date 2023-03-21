export interface Tile {
  id: string;
  title: string;
  standalone?: boolean;
  isGroup?: boolean;
  category: TileCategory;
  image?: string;
  contentLink?: string;
  content: any;
  dateCreation: Date;
  dateModification?: Date;
}

export interface TileContentTodo {
  id: string;
  key: string;
  value: boolean
}

export interface TileContentEvent {
  id: string;
  key: string;
  value: string;
}

export enum TileCategory {
  TODOS = "TODOS",
  TOREAD = "TOREAD",
  EVENT = "EVENT",
  WEATHER = "WEATHER",
  POST = "POST",
}
