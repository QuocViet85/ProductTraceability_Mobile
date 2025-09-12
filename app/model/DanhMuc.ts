export default class DanhMuc
{
    dM_Id: string | undefined;

    dM_Ten: string | undefined;

    dM_MoTa: string | undefined;

    dM_DMCha_Id: string | undefined;

    dM_DMCha: DanhMuc | undefined;

    dM_List_DMCon: DanhMuc[] | undefined;

    dM_NgayTao: Date | undefined;

    dM_NguoiTao_Id: string | undefined;

    dM_NgaySua: Date | undefined;

    dM_NguoiSua_Id: string | undefined;
}