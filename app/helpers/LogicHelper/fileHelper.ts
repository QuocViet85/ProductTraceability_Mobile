import axios from "axios";
import { url } from "../../server/backend";
import * as ImagePicker from 'expo-image-picker';
import { Alert, PermissionsAndroid } from "react-native";
import { AVATAR, COVER_PHOTO, IMAGE } from "@/app/constant/KieuFile";
import { DOANH_NGHIEP, SAN_PHAM, USER } from "@/app/constant/KieuTaiNguyen";
import {launchCamera} from 'react-native-image-picker';
import File from "@/app/model/File";


export async function getFileAsync  (
  kieuTaiNguyen: string,
  taiNguyenId: string,
  kieuFile: string = "",
  limit: number = 0
) : Promise<File[]> {
  let urlListFile = url(
    `api/file/tai-nguyen?kieuTaiNguyen=${kieuTaiNguyen}&taiNguyenId=${taiNguyenId}`
  );

  if (kieuFile) {
    urlListFile += `&kieuFile=${kieuFile}`;
  }

  if (limit) {
    urlListFile += `&limit=${limit}`;
  }

  return (await axios.get(urlListFile)).data;
}

export function getUriFile(file: File) : string | undefined {
  if (file) {
    let routeFileTaiNguyen = "";
    if (file.f_KieuFile === IMAGE || file.f_KieuFile === AVATAR || file.f_KieuFile === COVER_PHOTO) {
      routeFileTaiNguyen = `images/${file.f_KieuTaiNguyen}/${file.f_TaiNguyen_Id}`;
    }

    return url(`${routeFileTaiNguyen}/${file.f_Ten}`);
  } else {
    return;
  }
}

export async function getUriAvatarUser(userId: string) : Promise<string | undefined> {
  const fileAvatars = await getFileAsync(USER, userId, AVATAR);
  if (fileAvatars && fileAvatars.length > 0) {
    return getUriFile(fileAvatars[0])
  }
  return undefined;
}

export async function getUriAvatarDoanhNghiep(dN_Id: string) : Promise<string | undefined> {
  const fileAvatars = await getFileAsync(DOANH_NGHIEP, dN_Id, AVATAR);
  if (fileAvatars && fileAvatars.length > 0) {
    return getUriFile(fileAvatars[0])
  }
  return undefined;
}

export async function getUriAvatarSanPham(sP_Id: string) {
    const files = await getFileAsync(SAN_PHAM, sP_Id as string, IMAGE, 1);

    if (files && files.length > 0) {
        return getUriFile(files[0]);
    }
}

export async function getUriImagesPickInDevice(allowsMultipleSelection: boolean, quality: number = 1) : Promise<string[]> {
  const uriImagesArr = [];
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền để chọn ảnh");
  }

  // Mở thư viện ảnh
  let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: quality,
      allowsMultipleSelection: allowsMultipleSelection
  });

  if (!result.canceled) {
      for (const asset of result.assets) {
        uriImagesArr.push(asset.uri)
      }
  }
  return uriImagesArr;
}

export async function getUriImagesFromCamera(quantity: number = 1) : Promise<string[]> {
  const uriImagesArr = [];
  const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền camera");
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: quantity,
    });

    if (!result.canceled) {
      for (const asset of result.assets) {
        uriImagesArr.push(asset.uri)
      }
    }
    return uriImagesArr;
}

export async function getBase64ImagesPickInDevice(allowsMultipleSelection: boolean, quantity: number = 1) : Promise<(string | null | undefined)[]> {
  const base64ImagesArr = [];
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền để chọn ảnh");
  }

  // Mở thư viện ảnh
  let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: quantity,
      base64: true,
      allowsMultipleSelection: allowsMultipleSelection
  });

  if (!result.canceled) {
      for (const asset of result.assets) {
        base64ImagesArr.push(asset.base64)
      }
  }
  return base64ImagesArr;
}

export async function getBase64ImagesFromCamera(quantity: number = 1) : Promise<(string | null | undefined)[]> {
  const base64ImagesArr = [];
  const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền camera");
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: quantity,
      base64: true,
    });

    if (!result.canceled) {
      for (const asset of result.assets) {
        base64ImagesArr.push(asset.base64)
      }
    }
    return base64ImagesArr;
}

export function generateBase64ToDisplayImage(base64: string): string {
  return `data:image/png;base64,${base64}`;
}

