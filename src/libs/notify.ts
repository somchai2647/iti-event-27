import axios from "axios";

export type NotifyData = {
  message?: string;
  icon?: string;
  timeout?: number;
  imageThumbnail?: string;
  imageFullsize?: string;
  imageFile?: string;
  stickerPackageId?: number;
  stickerId?: number;
  notificationDisabled?: boolean;
  type?: "sticker" | "image" | "imageThumbnail" | "imageFullsize";
};

const LINE_API_URL = "https://notify-api.line.me/api/notify";
const LINE_TOKEN = process.env.LINE_NOTIFY_TOKEN;

export default async function notify(data: NotifyData) {
  const payload: NotifyData = {
    stickerId: 51626507,
    stickerPackageId: 11538,
    message: `${data.message}`,
  };

  await axios.post(LINE_API_URL, payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${LINE_TOKEN}`,
    },
  });

  return true;
}