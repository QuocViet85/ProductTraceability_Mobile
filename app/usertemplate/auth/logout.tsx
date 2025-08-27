import { deleteToken } from "@/app/helpers/LogicHelper/authHelper";
import { useState } from "react";
import { Button, Modal, View } from "react-native";

export default function Logout({setUserLogin} : {setUserLogin : any}) {
    const [modalLogout, setModalLogout] = useState<boolean | undefined>(false);

    const logoutThisDevice = () => {
        deleteToken(false).then(() => {
            setUserLogin(null);
            setModalLogout(false)
        });
    }

    const logoutAllDevices = () => {
        deleteToken(true).then(() => {
            setUserLogin(null);
            setModalLogout(false);
        })
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