import { deleteToken } from "@/app/helpers/LogicHelper/authHelper";
import { useState } from "react";
import { Button, Modal, View } from "react-native";
import { temp_ThongTinTheoDoiUser } from "../user/tuongTacUser";
import { temp_ThongTinTheoDoiDoanhNghiep } from "@/app/doanhNghiepTemplate/tuongTacDoanhNghiep";

export default function Logout({setUserLogin} : {setUserLogin : any}) {
    const [modalLogout, setModalLogout] = useState<boolean | undefined>(false);

    const logoutThisDevice = async () => {
        await deleteToken(false);
        setUserLogin(null);
        setModalLogout(false);
        deleteRelatedTempData();
    }

    const logoutAllDevices = async () => {
        await deleteToken(true);
        setUserLogin(null);
        setModalLogout(false);
        deleteRelatedTempData();
    }

    const deleteRelatedTempData = () => {
        temp_ThongTinTheoDoiUser.length = 0;
        temp_ThongTinTheoDoiDoanhNghiep.length = 0;
    }

    return (
        <View>
            <Button title="Đăng xuất" color={'red'} onPress={() => setModalLogout(true)}/>
            <Modal
            visible={modalLogout}
            animationType='slide'
            presentationStyle='formSheet'
            >
                <View style={{marginTop: 'auto'}}>
                    <Button title="Đăng xuất trên thiết bị này" color={'red'} onPress={logoutThisDevice}/>
                    <View style={{marginBottom: 20}}></View>
                    <Button title="Đăng xuất trên tất cả thiết bị" color={'red'} onPress={logoutAllDevices}/>
                    <View style={{marginBottom: 20}}></View>
                    <Button title="Đóng" onPress={() => setModalLogout(false)}/>
                </View>
                
            </Modal>
        </View>
    )
}