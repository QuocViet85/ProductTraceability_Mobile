import NhaMay from "./NhaMay";

export default class LoSanPham
{
    lsP_Id: string | undefined;

    lsP_MaLSP: string | undefined;

    lsP_SP_Id: string | undefined;

    lsP_Ten: string | undefined;

    lsP_NgaySanXuat: Date | undefined;

    lsP_NgayHetHan: Date | undefined;

    lsP_SoLuong: number | undefined;

    lsP_MoTa: string | undefined;

    lsP_NM_Id: string | undefined;

    lsP_NgayTao: Date | undefined;

    lsP_NguoiTao_Id: string | undefined;

    lsP_NgaySua: Date | undefined;

    lsP_NguoiSua_Id: Date | undefined;

     lsP_SP: {
        sP_Id: string, 
        sP_Ten: string, 
        sP_MaTruyXuat: string,
        sP_UriAvatar: string
    } | undefined;

    lsP_NM: NhaMay | undefined

    temp_TongSoVoiSanPham: number = 0;
}