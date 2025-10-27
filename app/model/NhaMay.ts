import DoanhNghiep from "./DoanhNghiep";

export default class NhaMay {
    nM_Id: string | undefined;
    
    nM_Ten: string | undefined;

    nM_MaNM: string | undefined;

    nM_DiaChi: string | undefined;

    nM_SoDienThoai: string | undefined;

    nM_Email: string | undefined;

    nM_DN_Id: string | undefined;

    nM_NgayTao: Date | undefined;

    nM_NguoiTao_Id: string | undefined;

    nM_NgaySua: Date | undefined;

    nM_NguoiSua_Id: string | undefined;

    nM_DN: DoanhNghiep | undefined;
}