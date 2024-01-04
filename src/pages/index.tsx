import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FaUtensils, FaShirt, FaPerson } from "react-icons/fa6";
import HomeLayout from "@/components/layouts/HomeLayout";
import PaidModal from "@/components/Modals/PaidModal";
import { type ReservationTableData } from "@/classes/ReservationTable";

const TypingEffect = dynamic(() => import("@/components/TypingEffect"), {
  ssr: false,
});

const optionModal: ReservationTableData = {
  isRetail: true,
  tableId: "963731bb-839f-46ae-92d5-09833a755857",
  id: "963731bb-839f-46ae-92d5-09833a755857",
};

export default function Home() {
  function onClickRetailTable() {
    const modalElement = document.getElementById(
      "reservationModal"
    ) as HTMLDialogElement | null;
    if (modalElement) {
      modalElement.showModal();
    }
  }

  return (
    <HomeLayout>
      <PaidModal selected={optionModal} />
      <div>
        <section className="mt-36">
          <div className="float-none mx-auto px-4 lg:flex  lg:items-center">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="sm:text-5xl text-3xl ">
                🎈
                <span className="from-green-300 mx-2 via-blue-500 to-purple-600 bg-gradient-to-r  bg-clip-text font-extrabold text-transparent ">
                  งานสานสัมพันธ์ ครั้งที่ 16
                </span>
                🎈
              </h1>
              <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text font-bold whitespace-nowrap text-transparent md:text-4xl sm:text-2xl text-xl">
                <TypingEffect text={["Information Technology for Industry"]} />
              </h1>
              <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed text-white">
                ทุกช่วงเวลา ร้อยเรียงเป็นเรื่องราวให้เราได้คิดถึง
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  className="inline-block  w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                  href="/reservation"
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaUtensils />
                    จองโต๊ะอาหาร
                  </span>
                </Link>
                <button
                  className="inline-block  w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                  onClick={onClickRetailTable}
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaPerson />
                    จองที่นั่งเดี่ยว
                  </span>
                </button>

                <Link
                  className="inline-block  w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                  href="/shop"
                >
                  <span className="inline-flex gap-2 text-xl">
                    <FaShirt />
                    จองเสื้อ
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomeLayout>
  );
}
