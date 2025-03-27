import { Card, ICardsCacheWriter, ICardsService } from "@zora";

export class CardsService implements ICardsService, ICardsCacheWriter {
  private data: Card[] = [];
  private PUBLIC_BOXES = ["Core Box", "Promos1"];

  public write = (data: Card[]) => {
    console.log(`[CardsService] Caching ${data.length} cards`);
    this.data = data;
  };

  public find = (search: string, restricted = false) => {
    let results = this.data.filter((c) =>
      c.details.name.toLowerCase().includes(search.toLowerCase())
    );

    results = this.deduplicateFoundCards(results);
    console.log(`[CardsService] Found ${results.length} matching unique cards`);

    if (restricted) {
      results = this.filterPrivateCards(results);
      console.log(
        `[CardsService] Filtered down to ${results.length} cards available to the public`
      );
    }

    return results;
  };

  private deduplicateFoundCards = (cards: Card[]): Card[] => {
    const map: Record<string, Card> = {};
    for (const card of cards) {
      const keyArray = [card.details.name, card.details.suit];
      if (card.details.position === "development") keyArray.push("dev");
      const key = keyArray.join("-");

      if (key in map) continue;
      map[key] = card;
    }
    return Object.values(map);
  };

  private filterPrivateCards = (cards: Card[]): Card[] =>
    cards.filter((c) => this.PUBLIC_BOXES.includes(c.set.box));
}
