import LoSanPham from "./LoSanPham";
import SanPham from "./SanPham";

export default class SuKienTruyXuat
{
    sK_Id: string | undefined;

    sK_SP_Id: string | undefined;

    sK_LSP_Id: string | undefined;

    sK_Ten: string | undefined;

    sK_MaSK: string | undefined;

    sK_MoTa: string | undefined;

    sK_DiaDiem: string | undefined;

    sK_ThoiGian: Date | undefined;

    sK_NgayTao: Date | undefined

    sK_NguoiTao_Id: string | undefined;

    sK_NgaySua: Date | undefined;

    sK_NguoiSua_Id: string | undefined;

    sK_SP: {
        sP_Id: string | undefined,
        sP_Ten: string | undefined,
        sP_MaTruyXuat: string | undefined,
        sP_UriAvatar: string | undefined
    } | undefined;

    sK_LSP: LoSanPham | undefined;

    sK_DoanhNghiepSoHuu_Id: string | undefined;

    temp_TongSoVoiSanPham: number = 0;
}