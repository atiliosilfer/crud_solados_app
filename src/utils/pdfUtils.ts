import { Order, Sole, Stock, PdfData } from "../types";
import { invoke } from "@tauri-apps/api/tauri";
import { SHOE_NUMBERING } from "../constants";
import pdfmake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts";
pdfmake.vfs = pdfFonts;

export async function generatePdfData(soles: Sole[]): Promise<PdfData[]> {
  const pdfDataPromises: Promise<PdfData>[] = soles.map(async (sole) => {
    const orders: Order[] = await invoke("get_orders", { id: sole.id });
    const stocks: Stock[] = await invoke("get_stocks", { id: sole.id });

    return {
      soleId: sole.id,
      soleName: sole.name,
      orders: orders,
      stocks: stocks,
    };
  });

  const pdfData: PdfData[] = await Promise.all(pdfDataPromises);
  return pdfData;
}

export function generatePdfFile(data: PdfData[]) {
  const contentData = data.map((data) => {
    const header = SHOE_NUMBERING.map((size) => ({
      text: size.toString(),
      bold: true,
    }));

    header.push({ text: "Total", bold: true });

    const stockRows = SHOE_NUMBERING.map((size) => ({
      text: findAmountBySize(data.stocks, size),
    }));

    stockRows.push({ text: findSumAmount(data.stocks) });

    const orderRows = SHOE_NUMBERING.map((size) => ({
      text: findAmountBySize(data.orders, size),
    }));

    orderRows.push({ text: findSumAmount(data.orders) });

    const finalRows = SHOE_NUMBERING.map((size) => ({
      text: findAmountBySize(data.stocks, size) - findAmountBySize(data.orders, size),
    }));

    finalRows.push({ text: findSumAmount(data.stocks) - findSumAmount(data.orders) });

    return [
      {
        table: {
          headerRows: 1,
          widths: [75, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 30],

          body: [
            [{ text: data.soleName, bold: true }, ...header],
            [{ text: "Estoque", bold: true }, ...stockRows],
            [{ text: "Pedidos", bold: true }, ...orderRows],
            [{ text: "Estoque Final", bold: true }, ...finalRows],
          ],
        },
      },
      " ",
    ];
  });

  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const dateHeader: string = date.toLocaleString("pt-BR", options);

  const header = [`Relatórios de solados - ${dateHeader}`, " "];

  const footer = [
    " ",
    `Total das fichas: ${sumTotalAmountOrder(data)} pares`,
    `Total do estoque final: ${sumTotalAmountStock(data) - sumTotalAmountOrder(data)} pares`,
  ];

  const content = header.concat(contentData as any).concat(footer);

  const file = {
    content: content.flat(),
  };

  pdfmake.createPdf(file).open({}, window.open("", "_blank"));
}

function findAmountBySize(arr: { size: number; amount: number }[], size: number): number {
  const item = arr.find((x) => x.size === size);
  return item ? item.amount : 0;
}

function findSumAmount(arr: { amount: number }[]): number {
  return arr.reduce((acc, order) => acc + order.amount, 0);
}

function sumAmountOrder(orders: Order[]): number {
  return orders.reduce((acc, order) => acc + order.amount, 0);
}

function sumTotalAmountOrder(pdfDataArray: PdfData[]): number {
  let sumAmounts: number = 0;

  for (const pdfData of pdfDataArray) {
    const orders = pdfData.orders;
    const sumOrdersAmounts: number = orders.reduce((acc, order) => acc + order.amount, 0);
    sumAmounts += sumOrdersAmounts;
  }

  return sumAmounts;
}

function sumTotalAmountStock(pdfDataArray: PdfData[]): number {
  let sumAmounts: number = 0;

  for (const pdfData of pdfDataArray) {
    const stocks = pdfData.stocks;
    const sumOrdersAmounts: number = stocks.reduce((acc, stock) => acc + stock.amount, 0);
    sumAmounts += sumOrdersAmounts;
  }

  return sumAmounts;
}
