import axios from "axios";
import { url } from "../../server/backend";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";
import { AVATAR, COVER_PHOTO, IMAGE } from "@/app/constant/KieuFile";
import { DOANH_NGHIEP, USER } from "@/app/constant/KieuTaiNguyen";

export async function getFileAsync(
  kieuTaiNguyen: string,
  taiNguyenId: string,
  kieuFile: string = "",
  limit: number = 0
) {
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

export function getUriFile(file: any) {
  if (file) {
    let routeKieuFile = "";
    if (file.f_KieuFile === IMAGE || file.f_KieuFile === AVATAR || file.f_KieuFile === COVER_PHOTO) {
      routeKieuFile = "images";
    }

    return url(`${routeKieuFile}/${file.f_Ten}`);
  } else {
    return;
  }
}

export async function getUriAvatarUser(userId: string) {
  const fileAvatar = await getFileAsync(USER, userId, AVATAR);
  if (fileAvatar) {
    return getUriFile(fileAvatar[0])
  }
  return null;
}

export async function getUriAvatarDoanhNghiep(dN_Id: string) {
  const fileAvatar = await getFileAsync(DOANH_NGHIEP, dN_Id, AVATAR);
  if (fileAvatar) {
    return getUriFile(fileAvatar[0])
  }
  return null;
}

export async function getUriImagesPickInDevice() : Promise<string[]> {
  const uriImagesArr = [];
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
      Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền để chọn ảnh");
  }

  // Mở thư viện ảnh
  let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
  });

  if (!result.canceled) {
      for (const asset of result.assets) {
        uriImagesArr.push(asset.uri)
      }
  }
  return uriImagesArr;
}
