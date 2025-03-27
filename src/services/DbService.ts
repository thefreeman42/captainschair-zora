import { Card, CardDetails, CardOperation, ICardsCacheWriter } from "@zora";
import { CronJob } from "cron";
import { google } from "googleapis";

const API_KEY = process.env.GOOGLE_API_KEY;
const MAIN_SPREADSHEET_ID = process.env.GOOGLE_MASTER_SPREADSHEET_ID;
const SHEET_TITLE = "_Master";
const COLUMNS = ["B", "E", "F", "U", "V", "AR", "BA", "BJ", "BK"];
const RANGES = COLUMNS.map((c) => `'${SHEET_TITLE}'!${c}:${c}`);

const DEFAULT_CRON = "0 0 * * * *"; // every hour

const sheetsClient = google.sheets({
  version: "v4",
  auth: API_KEY,
});

export class DbService {
  private cronCards: CronJob;

  constructor(private cache: ICardsCacheWriter) {
    this.cronCards = CronJob.from({
      cronTime: process.env.DB_POLL_CRON ?? DEFAULT_CRON,
      onTick: this.pollAndCacheCards,
      start: true,
      runOnInit: true,
    });
  }

  pollAndCacheCards = async () => {
    const cards = await this.fetchCards();
    this.cache.write(cards);
  };

  fetchCards = async (): Promise<Card[]> => {
    console.log("[DbService] Beginning fetch operation for cards");
    const sheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId: MAIN_SPREADSHEET_ID,
    });

    const rowCount =
      sheetInfo.data.sheets?.find((s) => s.properties?.title === SHEET_TITLE)
        ?.properties?.gridProperties?.rowCount || 0;

    const sheetValues = await sheetsClient.spreadsheets.values.batchGet({
      spreadsheetId: MAIN_SPREADSHEET_ID,
      ranges: RANGES,
      majorDimension: "COLUMNS",
    });
    const columns = sheetValues.data.valueRanges;
    if (!columns || rowCount < 1) {
      console.error(
        "[DbService] Could not fetch cards from DB, sheet data malformed"
      );
      return [];
    }

    let rowData: string[][] = [];
    for (const i of Array(rowCount).keys()) {
      if (i === 0) continue; // header row
      let row: string[] = [];
      for (const j of Array(COLUMNS.length).keys()) {
        row = [...row, columns[j].values?.[0][i] || ""];
      }
      rowData = [...rowData, row];
    }

    const cards: Card[] = [];

    for (const row of rowData) {
      const deckString = row[0].replace("!", "");
      const deck = deckString === "_CommonCards" ? "Commons" : deckString;
      const id = row[1];
      const name = row[2];
      const box = row[3];
      if (id === "" || box === "") continue;
      try {
        cards.push({
          id,
          set: {
            deck,
            box,
          },
          details: JSON.parse(row[7]) as CardDetails,
          ops: JSON.parse(row[8]) as CardOperation[],
        });
      } catch (error) {
        console.error("[DbService] Failed to parse card", id, name, error);
      }
    }

    return cards;
  };
}
