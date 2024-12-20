import supabase from "@/libs/supabase";
import notify, { type NotifyData } from "@/libs/notify";
import ProductItem, {
  type ReservationProductItemData,
} from "./ReservationProductItem";
import ShortUniqueId from "short-unique-id";
import ProductOption, { type ProductOptionData } from "./ProductOption";
import { PaymentMethod, StatusPayment } from "@/interfaces/Payment.type";

export type ReservationProductData = {
  id?: string;
  tableId?: string;
  created_at?: string; // Assuming you handle the timestamp as a string
  name?: string;
  phone?: string;
  email?: string;
  generation?: number;
  refId?: string;
  slip?: string;
  method?: PaymentMethod;
  status?: StatusPayment;
  totalPrice?: number;
  trackingCode?: string;
  quantity?: number;
  address?: string;
  options?: ReservationProductItemData | ReservationProductItemData[];
  productsItem?: ReservationProductItemData | ReservationProductItemData[];
};

export default class ReservationProduct {
  public static async getReservations() {
    const { data, error } = await supabase
      .from("reservationProduct")
      .select(
        `
                *
                `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    return data;
  }

  public static async getReservation(id: string) {
    const { data, error } = await supabase
      .from("reservationProduct")
      .select(
        `
                    *,reservationProductItem(*,optionId(name,price),productId(name))
                    `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }
    return data;
  }

  public static async getReservationByKeyword(keyword: string, value: string) {
    const { data, error } = await supabase
      .from("reservationProduct")
      .select(
        `
      *, reservationProductItem(*,optionId(name,price),productId(name))
        `
      )
      .eq(keyword, value);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async createReservation(data: ReservationProductData) {
    try {
      const ProductOptionDB = await ProductOption.getProductOptions();
      const productItem = data.productsItem as ReservationProductItemData[];
      delete data.productsItem;

      data.id = new ShortUniqueId().rnd(10);

      const { data: res, error } = await supabase
        .from("reservationProduct")
        .insert([data])
        .select(`*`)
        .single();

      const oriderId = res.id;
      let totalPrice = 0;

      const options = productItem.map((item) => {
        const productOption = ProductOptionDB.find(
          (option) => option.id === item.optionId
        ) as ProductOptionData;

        const price = productOption.price || 0;
        // data.totalPrice +=  * item.quantity;
        totalPrice += price * item.quantity;

        return {
          orderId: oriderId,
          productId: item.productId,
          optionId: item.optionId,
          price,
          quantity: item.quantity,
        };
      });

      const resData = await ReservationProduct.updateReservation({
        id: oriderId,
        totalPrice,
      });

      const resItem = await ProductItem.createReservationProductItems(options);

      let itemList: string = ``;
      let total: number = 0;

      resItem.forEach((item: any) => {
        itemList += `\n${item.productId.name}`;
        itemList += `\n${item.optionId.name} x ${item.quantity} ชิ้น`;

        total += item.price * item.quantity;

        itemList += `\nราคา ${item.price * item.quantity} บาท\n`;
      });

      const linePayload: NotifyData = {
        message: `มีการจองสินค้า\nรหัสการจอง: ${resData.id}\nชื่อ: ${resData.name}\nรุ่น: ${resData.generation}\nเบอร์โทร: ${resData.phone}\nอีเมล: ${resData.email}\nที่อยู่: ${resData.address}\nราคา: ${resData.totalPrice} บาท\nวิธีการชำระเงิน: ${resData.method} 
        \nรายการสินค้า: ${itemList}
        `,
        stickerId: 51626507,
        stickerPackageId: 11538,
      };

      notify(linePayload, "product").then((res) =>
        console.log(`send notify: การจองสินค้า ${resData.trackingCode}`)
      );

      if (error) {
        throw error;
      }
      return resData;
    } catch (error) {
      console.error(error);
    }
  }

  public static async updateReservation(
    data: ReservationProductData
  ): Promise<ReservationProductData> {
    try {
      const { data: res, error } = await supabase
        .from("reservationProduct")
        .update(data)
        .eq("id", data.id)
        .select(`*`)
        .single();

      if (error) {
        throw error;
      }
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public static async deleteReservation(id: string) {
    const { error } = await supabase
      .from("reservationProduct")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    return true;
  }

  public static async getReservationByTrackingCode(trackingCode: string) {
    const { data, error } = await supabase
      .from("reservationProduct")
      .select(
        `
                    *
                    `
      )
      .eq("trackingCode", trackingCode);

    if (error) {
      throw error;
    }
    return data;
  }

  public static async updateReservationByTrackingCode(
    trackingCode: string,
    data: ReservationProductData
  ) {
    const { data: reservation, error: reservationError } = await supabase
      .from("reservationProduct")
      .select(
        `
                    *
                    `
      )
      .eq("trackingCode", trackingCode);

    if (reservationError) {
      throw reservationError;
    }

    if (reservation.length === 0) {
      throw {
        message: "ไม่พบรายการจอง",
      };
    }

    const { error } = await supabase
      .from("reservationProduct")
      .update(data)
      .eq("trackingCode", trackingCode);

    if (error) {
      throw error;
    }
    return data;
  }
}
