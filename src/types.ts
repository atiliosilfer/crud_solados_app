export type Order = {
  size: number;
  amount: number;
  sole_id: number;
  deleted_at: Date | null;
};

export type Stock = {
  size: number;
  amount: number;
  sole_id: number;
};

export type Sole = {
  id: number;
  name: string;
  deleted_at?: string;
};

export type PdfData = {
  soleId: number;
  soleName: string;
  orders: Order[];
  stocks: Stock[];
};
