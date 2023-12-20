import React, { useRef, useState } from "react";
import { type ReservationShirtData } from "@/classes/ReservationShirt";
import { type ReservationTableData } from "@/classes/ReservationTable";
import {
  statusOrderColor,
  statusOrder,
  paymentMethod,
} from "@/helpers/statusOrder";
import { TableData } from "@/classes/Table";
import { FaUpload, FaCheckCircle, FaBan } from "react-icons/fa";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/th";
import axios from "@/libs/axios";
import supabase from "@/libs/supabase";

type CallbackData = {
  id: string;
  status: string;
};

type CardShirtProps = {
  data: ReservationShirtData;
  callback?: (data: CallbackData) => void;
};

type CardTableProps = {
  data: ReservationTableData;
  callback?: (data: CallbackData) => void;
};

export default function CardTable({ data, callback }: CardTableProps) {
  const [Selectedfile, setSelectedfile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  const table = data.tableId as TableData;

  // function onClick() {
  //   if (callback) {
  //     const payload: CallbackData = {
  //       id: data.id,
  //       status: "PAID",
  //     };
  //     callback(payload);
  //   }
  // }

  function onClick() {
    fileInput.current?.click();
  }

  function onCancel() {
    setPreview(undefined);
    setSelectedfile(undefined);
    //clear file input
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }

  async function onUpload() {
    try {
      if (!setSelectedfile) {
        throw new Error("กรุณาเลือกไฟล์");
      }

      await supabase.storage
        .from("iti-event")
        .upload(`slip/${data.id}`, Selectedfile);

      //get url file
      const { data: publicURL } = supabase.storage
        .from("iti-event")
        .getPublicUrl(`slip/${data.id}`);

      const payload = {
        id: data.id,
        slip: publicURL.publicUrl,
        status: "WAIT",
      };

      const res = await (await axios.patch("/reservation/upload", payload)).data;



      Swal.fire({
        icon: "success",
        title: "อัพโหลดสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });

      setPreview(undefined);
      setSelectedfile(undefined);
      //clear file input
      if (fileInput.current) {
        fileInput.current.value = "";
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "อัพโหลดไม่สำเร็จ",
        text: error.message,
      });
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(undefined);
      return;
    }

    //sweert preview image
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    setSelectedfile(file);
  }

  return (
    <div className="flow-root rounded-lg border bg-white border-blue-500-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">รหัสการจอง</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.id}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">โต๊ะที่จอง</dt>
          <dd className="text-gray-700 sm:col-span-2">
            ({table.index}) {table.name}
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">เมื่อวันที่</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {moment(data.created_at).format("lll น.")}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">สถานะการจอง</dt>
          <dd className="text-gray-700 sm:col-span-2">
            <div className={`badge ${statusOrderColor(data.status)}`}>
              {statusOrder(data.status)}
            </div>
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">ชื่อ-นามสกุล</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.name}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">เบอร์โทรศัพท์</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.phone}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">อีเมล</dt>
          <dd className="text-gray-700 sm:col-span-2">{data.email}</dd>
        </div>
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">วิธีการชำระ</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {paymentMethod(data.method)}
          </dd>
        </div>
        {data.method !== " ONSIDE" && (
          <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">แนบหลักฐานการชำระ</dt>
            <dd className="text-gray-700 sm:col-span-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInput}
                onChange={onChange}
                className="hidden file-input file-input-xs file-input-bordered w-full max-w-xs bg-white"
              />
              {preview && data.status === "PENDING" && (
                <div className="my-2">
                  <img src={preview} alt="slip" className="w-44" />
                </div>
              )}
              <div className="flex flex-col mt-4 w-auto md:w-48  gap-4">
                {preview && data.status === "PENDING" && (
                  <React.Fragment>
                    <button
                      onClick={onUpload}
                      className="btn btn-sm w-full md:w-auto text-white hover:bg-green-700 bg-green-600 border-green-600"
                    >
                      <FaCheckCircle /> ยืนยันการชำระเงิน
                    </button>
                    <button
                      onClick={onCancel}
                      className="btn btn-sm w-full md:w-auto text-white hover:bg-red-700 bg-red-600 border-red-600"
                    >
                      <FaBan /> ยกเลิกการชำระเงิน
                    </button>
                  </React.Fragment>
                )}

                {data.status === "WAIT" && <h1>รอการตรวจสอบการชำระเงิน</h1>}

                {!preview && data.status === "PENDING" && (
                  <button
                    onClick={onClick}
                    className="btn btn-sm w-full md:w-auto text-white hover:bg-blue-700 bg-blue-600 border-blue-600"
                  >
                    <FaUpload /> เลือกไฟล์การชำระเงิน
                  </button>
                )}
              </div>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
