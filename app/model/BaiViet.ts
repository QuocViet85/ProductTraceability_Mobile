export default class BaiViet {
    bV_Id: string | undefined;
    bV_TieuDe: string | undefined;
    bV_NoiDung: string | undefined;
    bV_NguoiTao_Id: string | undefined;
    bV_SP_Id: string | undefined;
    bV_NgayTao: Date | undefined;
    bV_NgaySua: Date | undefined;
    bV_SP: {sP_Id: string, sP_Ten: string, sP_UriAvatar: any } | undefined;
}