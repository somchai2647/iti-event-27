import React, { useState } from "react";
import { type TableData, TableWithReservation } from "@/classes/Table";
import Swal from "sweetalert2";
import PaidModal from "@/components/Modals/PaidModal";

type nickname = {
  id: string;
  nickname: string;
  generation: number;
  created_at: string;
  status: string;
  tableId: string;
};

type Props = {
  data: TableWithReservation[];
  admin?: boolean;
};

export default function TableLayout({ data, admin }: Props) {
  const [Selected, setSelected] = useState<TableWithReservation>(null);

  function getTableStatus(table: TableWithReservation) {
    const thisTable = table.reservation[0];

    if (thisTable?.status === "PENDING") {
      return "bg-blue-400 text-white cursor-pointer";
    }

    if (!table.isAvailable) {
      return "bg-neutral text-white cursor-not-allowed";
    }

    if (table.isReserved) {
      return "bg-green-500 text-white cursor-pointer";
      //cursor-not-allowed
    }

    return "bg-gray-200  cursor-pointer";
  }

  async function onClick(table: TableWithReservation) {
    if (admin) {
      console.log("admin Mode");
      return;
    }

    if ((table.isReserved && !table.isRetail) || !table.isAvailable) {
      // const thisTable = nickname?.find((item) => item.tableId === table.id);
      const thisTable = table.reservation[0];

      Swal.fire({
        title: "โต๊ะนี้ถูกจองแล้ว",
        html: `<b class="font-xl">${thisTable?.nickname} รุ่นที่ ${thisTable?.generation}</b>
          <br />
        `,
        // เมื่อ ${moment(data.generation).locale("th").format("l")}
        icon: "info",
        timer: 3000,
      });

      return;
    }

    Swal.fire({
      //หมดเขตการจอง
      title: "ขออภัย",
      html: `<b class="font-xl">ระบบปิดการจองแล้ว</b>`,
      icon: "info",
      timer: 3000,
    });

    return;

    const modalElement = document.getElementById(
      "reservationModal"
    ) as HTMLDialogElement | null;
    if (modalElement) {
      setSelected(table);
      modalElement.showModal();
    }
  }

  if (!data) return <div>loading...</div>;

  return (
    <React.Fragment>
      <PaidModal selected={Selected} />
      <div className="p-0 md:p-10">
        {!admin && (
          <div>
            <div className="text-center sm:mt-1 mt-4">
              <b className="text-xl md:text-3xl   text-amber-400  w-full">
                🔔 กรุณาชำระภายใน 3 วัน หลังจากการจองโต๊ะ
              </b>
              <br />
              <span
                title="มีการโทรแจ้งให้ทราบ 1 ครั้ง"
                className="text-xl text-white mt-4"
              >
               ⛔ ระบบปิดการจองแล้ว ⛔
              </span>
            </div>
            <div className="w-full text-center bg-blue-800 my-5">
              <h1 className="text-white text-xl p-5">👯‍♂️ STAGE 👯‍♂️</h1>
            </div>
            <div className="mb-2 flex gap-2">
              <div className="badge badge-neutral bg-gray-200 p-2 text-black">
                ว่าง
              </div>
              <div className="badge badge-neutral bg-blue-400 p-2 text-white">
                รอชำระ
              </div>
              <div className="badge badge-neutral bg-green-500 p-2 text-white">
                จองแล้ว
              </div>
              {/* <div className="badge badge-neutral p-2 bg-blue-800 text-white">
          อาจารย์
        </div> */}
              <div className="badge badge-neutral p-2 bg-neutral text-white">
                ไม่พร้อมให้บริการ
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 gap-2 w-full">
          {data?.map((table) => (
            <div
              key={table.id}
              onClick={() => onClick(table)}
              className={`flex-1 p-2 ${getTableStatus(
                table
              )}  rounded-md  text-black text-center lg:w-full lg:h-20 md:w-20 md:h-20 sm:h-12 sm:w-2/3`}
            >
              <p className={table.isReserved ? "text-white" : undefined}>
                {table.name}
              </p>
              <span className="hidden sm:block ">
                {table.isReserved && table.isAvailable && (
                  <b className="text-lg lg:text-2xl text-white">จองแล้ว</b>
                )}
                {!table.isReserved && table.isAvailable && (
                  <b className="text-lg lg:text-2xl">ว่าง</b>
                )}
                {!table.isAvailable && (
                  <b className="text-lg lg:text-xl">ไม่พร้อมให้บริการ</b>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
