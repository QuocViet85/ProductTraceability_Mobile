import { url } from "@/app/server/backend";
import axios from "axios";

export function layMaTruyXuatTuUrl(url: string) {
    const indexGachCheoCuoi : number = url.lastIndexOf('/');
    const maTruyXuat = url.substring(indexGachCheoCuoi + 1);

    return maTruyXuat;
}

export async function giaiMaQrCode(base64: any) {
    try {
    const urlGiaiMaQrCode = url('api/qrcode/giai-ma');
    const response = await axios.post(urlGiaiMaQrCode, {imageBase64: base64}, {
        headers: {"Content-Type": "application/json"}
    })

    if (response.data.data) {
      console.log('✅ QR Content:', response.data.data);
      return response.data.data;
    } else {
      console.log('❌ Không decode được mã QR');
      throw new Error('Không decode được');
    }
  } catch (err : any) {
    console.log('❌ Không decode được mã QR', err.response.data.error);
    throw new Error('Không decode được');
  }
}