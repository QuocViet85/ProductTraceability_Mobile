import DanhMuc from "./DanhMuc";
import DoanhNghiep from "./DoanhNghiep";
import NhaMay from "./NhaMay";

export default class SanPham
{
    sP_Id: string | undefined;

    sP_Ten: string | undefined;

    sP_MaTruyXuat: string | undefined;

    sP_MaVach: string | undefined;

    sP_MoTa: string | undefined;

    sP_Website: string | undefined;

    sP_Gia: number | undefined;

    sP_MaQuocGia: string | undefined;

    sP_HangSanXuat: string | undefined;

    sP_NgayTao: Date | undefined;

    sP_NguoiTao_Id: string | undefined;

    sP_NgaySua: Date | undefined;

    sP_NguoiSua_Id: Date | undefined;

    sP_DM_Id: string | undefined;

    sP_DN_SoHuu_Id: string | undefined;

    sP_DN_VanTai_Id: string | undefined;

    sP_DN_SanXuat_Id: string | undefined;

    sP_NM_Id: string | undefined;

    sP_DM: DanhMuc | undefined;

    sP_DN_SoHuu: DoanhNghiep | undefined;

    sP_DN_SanXuat: DoanhNghiep | undefined;

    sP_DN_VanTai: DoanhNghiep | undefined;

    sP_NM: NhaMay | undefined;

    sP_Verified: boolean = false;

    uriAvatar: string | undefined | null;

    
}