import { logOut } from "@/app/Auth/Authentication";
import { setForceReRenderDanhSachChat } from "@/app/chatTemplate/danhSachChat";
import { useState } from "react";
import { Button, Modal, View } from "react-native";

export default function Logout({setUserLogin} : {setUserLogin : any}) {
    const [modalLogout, setModalLogout] = useState<boolean | undefined>(false);

    const logout = async (allDevices: boolean) => {
        try {
            await logOut(allDevices);
            setUserLogin(null);
            setModalLogout(false);
            setForceReRenderDanhSachChat((value: number) => value + 1);
        }catch {}
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
                    <Button title="Đăng xuất trên thiết bị này" color={'red'} onPress={() => logout(false)} />
                    <View style={{marginBottom: 20}}></View>
                    <Button title="Đăng xuất trên tất cả thiết bị" color={'red'} onPress={() => logout(true)} />
                    <View style={{marginBottom: 20}}></View>
                    <Button title="Đóng" onPress={() => setModalLogout(false)}/>
                </View>
                
            </Modal>
        </View>
    )
}