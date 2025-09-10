export default class BinhLuan
{
    bL_Id: string | undefined;

    bL_NoiDung: string | undefined;

    bL_SP_Id: string | undefined;

    bL_NgayTao: Date | undefined;

    bL_NguoiTao_Id: string | undefined;

    bL_NguoiTao_Client: {
        id: string,
        name: string,
        soSao: number
    } | undefined;

    bL_SP: {
        sP_Id: string,
        sP_MaTruyXuat: string,
        sP_Ten: string,
        sP_UriAvatar: string | undefined
    } | undefined;
    
}