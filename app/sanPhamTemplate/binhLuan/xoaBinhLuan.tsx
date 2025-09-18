import getBearerToken from "@/app/Auth/Authentication";
import { ROLE_ADMIN } from "@/app/constant/Role";
import AppUser from "@/app/model/AppUser";
import { url } from "@/app/server/backend";
import axios from "axios";
import { DimensionValue, Text, TouchableOpacity, View } from "react-native";

export default function XoaBinhLuan({userLogin, binhLuan, layCacBinhLuans, width} : {userLogin: AppUser | null, binhLuan: any, layCacBinhLuans: () => void, width: DimensionValue | undefined}) {
    const xoaBinhLuan = async () => {
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
            return;
        }

        const urlXoaBinhLuan = url(`api/binhluan/${binhLuan.bL_Id}`);

        try {
            await axios.delete(urlXoaBinhLuan, {headers: { Authorization: bearerToken}});
            layCacBinhLuans();
        }catch {}
    }
    
    return (
        <View>
            {userLogin 
            ? userLogin?.id === binhLuan.bL_NguoiTao_Id || userLogin?.role === ROLE_ADMIN 
                    ? 
            (<View>
                <TouchableOpacity style={{backgroundColor: 'red', width: width, borderRadius: 8, alignItems: 'center'}} onPress={xoaBinhLuan}>
                    <Text style={{fontWeight: 'bold'}}>Xóa</Text>
                </TouchableOpacity>
            </View>)
            :
            (<View></View>)
            : (<View></View>)}
        </View>
    )
}