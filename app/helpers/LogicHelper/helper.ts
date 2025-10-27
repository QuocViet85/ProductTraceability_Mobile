import { url } from "@/app/server/backend";
import axios from "axios";
import { Link } from "expo-router";
import { Alert, Dimensions, Linking } from "react-native";
import * as Clipboard from 'expo-clipboard';

export function layMaTruyXuatTuUrl(url: string) {
    const indexGachCheoCuoi : number = url.lastIndexOf('/');
    const maTruyXuat = url.substring(indexGachCheoCuoi + 1);

    return maTruyXuat;
}

export async function giaiMaCode(base64: any) {
    try {
    const urlGiaiMaQrCode = url('api/code/giai-ma');
    const response = await axios.post(urlGiaiMaQrCode, {imageBase64: base64}, {
        headers: {"Content-Type": "application/json"}
    })

    if (response.data.data) {
      console.log('✅ QR Content:', response.data.data);
      return response.data.data;
    } else {
      console.log('❌ Không decode được mã');
      throw new Error('Không decode được');
    }
  } catch (err : any) {
    console.log('❌ Không decode được mã', err.response.data.error);
    throw new Error('Không decode được');
  }
}

export function makePhoneCall(phoneNumber: string | undefined) {
  const url = `tel:${phoneNumber}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Lỗi', 'Thiết bị không hỗ trợ gọi điện');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('Lỗi khi gọi điện:', err));
};

export function formatCurrency(price: number) : string {
    const vnFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    });
    return vnFormatter.format(price);
}

export async function openWebsite(url: string) {
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
}

export function paginate(resource: any[], pageNumber: number, limit: number) : any[] {
  const start = (pageNumber - 1) * limit;
  const end = start + limit;
  return resource.slice(start, end);
}

export function getWidthScreen() : number {
  return Dimensions.get('window').width;
}

export function getHeightScreen() : number {
  return Dimensions.get('window').height;
}

export async function handleCopy(text: string) {
      await Clipboard.setStringAsync(text);
  };