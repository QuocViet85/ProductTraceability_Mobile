import axios from "axios";
import { url } from "../server/backend";

export const temp_SoSaoCuaMotNguoiVoiMotSanPham : {sP_Id: string, userId: string, soSao: number}[] = [];

export const laySoSaoCuaMotNguoiVoiMotSanPham = async (sP_Id : string, userId : string, reload: boolean = false) : Promise<number> => {
    const soSaoInTemp = temp_SoSaoCuaMotNguoiVoiMotSanPham.find((item) => {
        return item.sP_Id === sP_Id && item.userId === userId;
    });

    if (!soSaoInTemp) {
        const urlSoSao = url(`api/sanpham/sao-san-pham-user/${sP_Id}?userId=${userId}`);

        try {
            const soSao = (await axios.get(urlSoSao)).data;

            temp_SoSaoCuaMotNguoiVoiMotSanPham.push({
                sP_Id: sP_Id,
                userId: userId,
                soSao: soSao
            });
            return soSao;
        }catch {
            return 0;
        }
    }else {
        return soSaoInTemp.soSao;
    }
}