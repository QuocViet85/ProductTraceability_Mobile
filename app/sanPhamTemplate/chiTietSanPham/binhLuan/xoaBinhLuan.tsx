import { getBearerToken } from "@/app/Auth/Authentication";
import { ROLE_ADMIN } from "@/app/constant/Role";
import AppUser from "@/app/model/AppUser";
import BinhLuan from "@/app/model/BinhLuan";
import { url } from "@/app/server/backend";
import { temp_ListBinhLuansCuaUser } from "@/app/usertemplate/user/binhLuanCuaUser/binhLuanCuaUser";
import axios from "axios";
import { Alert, DimensionValue, Text, TouchableOpacity, View } from "react-native";
import { temp_ListBinhLuansCuaSanPham } from "./binhLuanSanPham";
import { PADDING_DEFAULT } from "@/app/constant/Style";

export default function XoaBinhLuan({userLogin, binhLuan, setTongSoBinhLuan, setForceReRender, width} : {userLogin: AppUser | null, binhLuan: BinhLuan, setTongSoBinhLuan: Function, setForceReRender: Function, width: DimensionValue | undefined}) {
    const xoaBinhLuan = async () => {
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
            return;
        }

        const urlXoaBinhLuan = url(`api/binhluan/${binhLuan.bL_Id}`);

        try {
            await axios.delete(urlXoaBinhLuan, {headers: { Authorization: bearerToken}});

            Alert.alert('Thông báo', 'Xóa bình luận thành công');

            const indexBinhLuanBiXoaTrongTempBinhLuanCuaSanPham = temp_ListBinhLuansCuaSanPham.findIndex((item: BinhLuan) => {
                return item.bL_Id === binhLuan.bL_Id
            })

            if (indexBinhLuanBiXoaTrongTempBinhLuanCuaSanPham !== -1) {
                temp_ListBinhLuansCuaSanPham.splice(indexBinhLuanBiXoaTrongTempBinhLuanCuaSanPham, 1);
            }

            const indexBinhLuanBiXoaTrongTempBinhLuanCuaUser = temp_ListBinhLuansCuaUser.findIndex((item: BinhLuan) => {
                return item.bL_Id === binhLuan.bL_Id
            })

            if (indexBinhLuanBiXoaTrongTempBinhLuanCuaUser !== -1) {
                temp_ListBinhLuansCuaUser.splice(indexBinhLuanBiXoaTrongTempBinhLuanCuaUser, 1);
            }

            for (const binhLuanConLai of temp_ListBinhLuansCuaSanPham) {
                if (binhLuanConLai.bL_SP_Id === binhLuan.bL_SP_Id) {
                    binhLuanConLai.temp_tongSoBinhLuanCuaSP -= 1;
                }
            }

            for (const binhLuanConLai of temp_ListBinhLuansCuaUser) {
                if (binhLuanConLai.bL_NguoiTao_Id === binhLuan.bL_NguoiTao_Id) {
                    binhLuanConLai.temp_tongSoBinhLuanCuaUser -= 1;
                }
            }
            
            setForceReRender((value: number) => value + 1);
            setTongSoBinhLuan((value: number) => value - 1);
        }catch {}
    }
    
    return (
        <View>
            {userLogin 
            ? userLogin?.id === binhLuan.bL_NguoiTao_Id || userLogin?.role === ROLE_ADMIN 
                    ? 
            (<View>
                <TouchableOpacity style={{backgroundColor: 'red', width: width, borderRadius: 8, alignItems: 'center', paddingLeft: PADDING_DEFAULT, paddingRight: PADDING_DEFAULT}} onPress={xoaBinhLuan}>
                    <Text style={{fontWeight: 'bold'}}>{'Xóa'}</Text>
                </TouchableOpacity>
            </View>)
            :
            (<View></View>)
            : (<View></View>)}
        </View>
    )
}