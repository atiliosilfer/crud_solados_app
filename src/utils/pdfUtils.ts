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
      text: size,
      bold: true,
    }));

    const stockRows = SHOE_NUMBERING.map((size) => ({
      text: findAmountBySize(data.stocks, size),
    }));

    const orderRows = SHOE_NUMBERING.map((size) => ({
      text: findAmountBySize(data.orders, size),
    }));

    const finalRows = SHOE_NUMBERING.map((size) => ({
      text: findAmountBySize(data.stocks, size) - findAmountBySize(data.orders, size),
    }));

    return [
      { text: data.soleName, bold: true },
      {
        layout: "lightHorizontalLines",
        table: {
          headerRows: 1,
          widths: [50, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],

          body: [
            [" ", ...header],
            [{ text: "Estoque", bold: true }, ...stockRows],
            [{ text: "Pedidos", bold: true }, ...orderRows],
            [{ text: "Final", bold: true }, ...finalRows],
          ],
        },
      },
      "___________________________________________________________________________________________",
      " ",
    ];
  });

  const date = new Date();

  const header = [`Solados - ${date}`, " "];

  const content = header.concat(contentData as any);

  const file = {
    content: content.flat(),
  };

  pdfmake.createPdf(file).open({}, window.open("", "_blank"));
}

function findAmountBySize(arr: { size: number; amount: number }[], size: number): number {
  const item = arr.find((x) => x.size === size);
  return item ? item.amount : 0;
}
