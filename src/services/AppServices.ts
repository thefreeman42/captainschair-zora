import { IAppContext, ICardsService } from "@zora";
import { CardsService } from "./CardsService";
import { DbService } from "./DbService";

export class AppServices implements IAppContext {
  constructor() {
    this.cardsService = new CardsService();
    this.dbService = new DbService(this.cardsService);
  }

  private dbService: DbService;
  private cardsService: CardsService;

  get cards() {
    return this.cardsService as ICardsService;
  }
}
