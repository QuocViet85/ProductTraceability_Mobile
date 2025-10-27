export default class BinhLuan
{
    bL_Id: string | undefined;

    bL_NoiDung: string | undefined;

    bL_SP_Id: string | undefined;

    bL_NgayTao: Date | undefined;

    bL_NguoiTao_Id: string | undefined;

    bL_NguoiTao_Client: {
        id: string,
        name: string | undefined,
        soSao: number,
    } | undefined;

    bL_SP: {
        sP_Id: string | undefined,
        sP_MaTruyXuat: string | undefined,
        sP_Ten: string | undefined,
        sP_UriAvatar: string | undefined,
    } | undefined;

    temp_tongSoBinhLuanCuaSP: number = 0;
    temp_tongSoBinhLuanCuaUser: number = 0;
}