import type { NextApiRequest, NextApiResponse } from "next";
import ReservationTable, {
  type ReservationTableData,
} from "@/classes/ReservationTable";
import ReservationShirt, {
  type ReservationShirtData,
} from "@/classes/ReservationShirt";

type Data = {
  message: string;
  data?: any;
  //   data?: FAQData | FAQData[] | any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    switch (req.method) {
      case "GET":
        //@ts-ignore
        const data = await getTracking(req.query.search);
        res.status(200).json({ message: "success", data: data });
        break;
      case "POST":
        break;
      default:
        res.status(405).json({ message: "Method not allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    res.end();
  }
}

async function getTracking(search: string) {
  try {
    const shirt = await ReservationShirt.getReservationByKeyword(
      "phone",
      search
    );

    const table = await ReservationTable.getReservationByKeyword(
      "phone",
      search
    );

    const data = {
      shirt: shirt,
      table: table,
    };

    return data;
  } catch (error) {
    console.log(error);
    return "ไม่พบข้อมูล (Error)";
  }
}