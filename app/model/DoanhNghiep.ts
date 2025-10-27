export default class DoanhNghiep 
{
    dN_Id: string | undefined;

    dN_Ten: string | undefined;

    dN_MaSoThue: string | undefined;

    dN_MaGLN: string | undefined;

    dN_MaGS1: string | undefined;

    dN_DiaChi: string | undefined;

    dN_SoDienThoai: string | undefined;

    dN_Email: string | undefined;

    dN_KieuDN: number | undefined;

    dN_JsonData: string | undefined;

    dN_NgayTao: Date | undefined;

    dN_NguoiTao_Id: string | undefined;

    dN_List_CDN: {cdN_ChuDN: {id: string, name: string}}[] | undefined;

    temp_TongSo: number = 0;
}