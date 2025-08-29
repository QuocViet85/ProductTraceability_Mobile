import { ROLE_ADMIN } from "@/app/constant/Role";
import getBearerToken from "@/app/helpers/LogicHelper/authHelper";
import AppUser from "@/app/model/AppUser";
import { url } from "@/app/server/backend";
import axios from "axios";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function XoaBinhLuan({userLogin, binhLuan, layCacBinhLuans} : {userLogin: AppUser, binhLuan: any, layCacBinhLuans: () => void}) {
    const xoaBinhLuan = () => {
        getBearerToken()
        .then((bearerToken: any) => {
            let urlXoaBinhLuan = url(`api/binhluan/${binhLuan.bL_Id}`);

            axios.delete(urlXoaBinhLuan, {headers: { Authorization: bearerToken}})
                    .then(() => {
                        layCacBinhLuans();
                    })
                    .catch(() => {})
        })
        .catch(() => {})
    }
    return (
        <View>
            {userLogin.id === binhLuan.bL_NguoiTao_Id || userLogin.role === ROLE_ADMIN ? 
            (<View>
                <TouchableOpacity onPress={xoaBinhLuan}>
                    <Text style={{backgroundColor: 'red', width: '8%'}}>Xóa</Text>
                </TouchableOpacity>
            </View>)
            :
            (<View></View>)}
            
        </View>
    )
}