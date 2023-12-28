import React from "react";
import { FaCircleCheck, FaClock, FaExclamation, FaCashRegister } from "react-icons/fa6";

type Props = {
  data?: {
    success?: number;
    wait?: number;
    pending?: number;
    failed?: number;
  };
};

export default function Stat({ data }: Props) {
  return (
    <div>
      <div className="stats shadow flex flex-col md:flex-row">
        <div className="stat bg-slate-50">
          <div className="stat-figure text-3xl text-green-400">
            <FaCircleCheck />
          </div>
          <div className="stat-title text-black">ยืนยันการชำระเงินแล้ว</div>
          <div className="stat-value text-green-400">{data.success}</div>
          <div className="stat-desc text-black">โต๊ะ/รายการสินค้า</div>
        </div>

        <div className="stat bg-slate-50  text-blue-400 ">
          <div className="stat-figure text-3xl  ">
            <FaCashRegister />
          </div>
          <div className="stat-title text-black">รอการตรวจสอบ</div>
          <div className="stat-value">{data.wait}</div>
          <div className="stat-desc text-black">โต๊ะ/รายการสินค้า</div>
        </div>

        <div className="stat bg-slate-50  text-amber-400 ">
          <div className="stat-figure text-3xl  ">
            <FaClock />
          </div>
          <div className="stat-title text-black">ค้างชำระ</div>
          <div className="stat-value">{data.pending}</div>
          <div className="stat-desc text-black">
            หลุดจอง/ข้อมูลไม่ถูกต้อง/อื่น ๆ
          </div>
        </div>

        <div className="stat bg-slate-50  text-red-400 ">
          <div className="stat-figure text-3xl  ">
            <FaExclamation />
          </div>
          <div className="stat-title text-black">ล้มเหลว</div>
          <div className="stat-value">{data.failed}</div>
          <div className="stat-desc text-black">
            หลุดจอง/ข้อมูลไม่ถูกต้อง/อื่น ๆ
          </div>
        </div>
      </div>
    </div>
  );
}