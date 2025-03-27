import { Card } from "./Card";

export interface ICardsService {
  find: (search: string, restricted?: boolean) => Card[];
}

export interface ICardsCacheWriter {
  write: (data: Card[]) => void;
}
