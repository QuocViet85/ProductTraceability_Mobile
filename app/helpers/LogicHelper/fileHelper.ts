import axios from "axios";
import { url } from "../../server/backend";

export async function getFileAsync(
  kieuTaiNguyen: string,
  taiNguyenId: string,
  kieuFile: string = "",
  limit: number = 0
) {
  let urlListAnhSanPhams = url(
    `api/file/tai-nguyen?kieuTaiNguyen=${kieuTaiNguyen}&taiNguyenId=${taiNguyenId}`
  );

  if (kieuFile) {
    urlListAnhSanPhams += `&kieuFile=${kieuFile}`;
  }

  if (limit) {
    urlListAnhSanPhams += `&limit=${limit}`;
  }

  return (await axios.get(urlListAnhSanPhams)).data;
}

export function getUriFile(file: any) {
  if (file) {
    let routeKieuFile = "";
    if (file.f_KieuFile === "image" || file.f_KieuFile === "avatar") {
      routeKieuFile = "images";
    }

    return url(`${routeKieuFile}/${file.f_Ten}`);
  } else {
    return;
  }
}
