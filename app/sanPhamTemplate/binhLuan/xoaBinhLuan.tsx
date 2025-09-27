import getBearerToken from "@/app/Auth/Authentication";
import { ROLE_ADMIN } from "@/app/constant/Role";
import AppUser from "@/app/model/AppUser";
import BinhLuan from "@/app/model/BinhLuan";
import { url } from "@/app/server/backend";
import axios from "axios";
import { Alert, DimensionValue, Text, TouchableOpacity, View } from "react-native";

export default function XoaBinhLuan({userLogin, binhLuan, listBinhLuansHienThi, setTongSoBinhLuan, width} : {userLogin: AppUser | null, binhLuan: BinhLuan, listBinhLuansHienThi: BinhLuan[], setTongSoBinhLuan: Function, width: DimensionValue | undefined}) {
    const xoaBinhLuan = async () => {
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
            return;
        }

        const urlXoaBinhLuan = url(`api/binhluan/${binhLuan.bL_Id}`);

        try {
            await axios.delete(urlXoaBinhLuan, {headers: { Authorization: bearerToken}});

            Alert.alert('Thông báo', 'Xóa bình luận thành công');

            const indexBinhLuanBiXoa = listBinhLuansHienThi.findIndex((item: BinhLuan) => {
                return item.bL_Id === binhLuan.bL_Id
            })

            if (indexBinhLuanBiXoa !== -1) {
                listBinhLuansHienThi.splice(indexBinhLuanBiXoa, 1);
            }
            
            setTongSoBinhLuan((value: number) => value - 1);
        }catch {}
    }
    
    return (
        <View>
            {userLogin 
            ? userLogin?.id === binhLuan.bL_NguoiTao_Id || userLogin?.role === ROLE_ADMIN 
                    ? 
            (<View>
                <TouchableOpacity style={{backgroundColor: 'red', width: width, borderRadius: 8, alignItems: 'center'}} onPress={xoaBinhLuan}>
                    <Text style={{fontWeight: 'bold'}}>{'Xóa'}</Text>
                </TouchableOpacity>
            </View>)
            :
            (<View></View>)
            : (<View></View>)}
        </View>
    )
}