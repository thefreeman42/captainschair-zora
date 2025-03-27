export type CardDetails = {
  name: string;
  suit: string;
  position?: string;
  traits?: string[];
  skills?: string[];
  awayTeams?: number;
  drones?: number;
  score?: string;
};

export type CardSet = {
  deck: string;
  box: string;
};

export type CardOperation = {
  id: string;
  type: string;
  restriction?: string;
  isAction?: boolean;
  droneAction?: number;
  isAttack?: boolean;
  isExplicitNonOp?: boolean;
  text: string;
};

export type Card = {
  id: string;
  set: CardSet;
  details: CardDetails;
  ops: CardOperation[];
};
