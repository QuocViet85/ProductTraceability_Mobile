import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBearerToken } from "../Auth/Authentication";
import { quyenSuaDoanhNghiep } from "../Auth/Authorization/AuthDoanhNghiep";
import { getUriAvatarDoanhNghiep, getUriImagesFromCamera, getUriImagesPickInDevice } from "../helpers/LogicHelper/fileHelper";
import { url } from "../server/backend";

const temp_UriAvatarDoanhNghiep : {
    dN_Id: string,
    uri: string | undefined
}[] = [];


export default function AvatarDoanhNghiep({dN_Id, width, height, canChange}: {dN_Id: string, width: DimensionValue | undefined, height: DimensionValue | undefined, canChange: boolean}) {
    const [uriAvatar, setUriAvatar] = useState<string | undefined>(undefined);
    const [quyenSua, setQuyenSua] = useState<boolean>(false);
    const [showModalChangeAvatar, setShowModalChangeAvatar] = useState<boolean | undefined>(false);
    const [reRender, setReRender] = useState<number>(0);

    useEffect(() => {
        layAvatarDoanhNghiep();
        layQuyenSua();
    }, [reRender, dN_Id]);

    const layAvatarDoanhNghiep = async() => {
        const uriAvatarInTemp = temp_UriAvatarDoanhNghiep.find((item) => {
            return item.dN_Id === dN_Id
        });

        if (!uriAvatarInTemp) {
            const uri = await getUriAvatarDoanhNghiep(dN_Id);

            setUriAvatar(uri);
            
            temp_UriAvatarDoanhNghiep.push({
                dN_Id: dN_Id,
                uri: uri
            });
        }else {
            setUriAvatar(uriAvatarInTemp.uri);
        }
    }

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaDoanhNghiep(dN_Id);
        setQuyenSua(quyenSua);
    }

    const setAvatar = async (camera: boolean) => {
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
                Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
            }
        let uriArr : string[] = [];
        if (camera) {
            uriArr = await getUriImagesFromCamera();
        }else {
            uriArr = await getUriImagesPickInDevice(false);
        }
        

        if (!uriArr) {
            Alert.alert("Lỗi", "Không truy cập được ảnh trong thiết bị");
            return;
        }

         if (uriArr.length > 0) {
            const uriAvatarInDevice = uriArr[0];

            const formData = new FormData();
                    formData.append("avatar", {
                                        uri: uriAvatarInDevice,
                                        type: "image/jpeg",
                                        name: "avatar.jpg",
                                        } as any); //không dùng Blob, phải để thế này thì react native mới hoạt động upload ảnh được

            const uriChangeAvatar = url(`api/doanhnghiep/avatar/${dN_Id}`);

            try {
                await axios.post(uriChangeAvatar, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                Alert.alert('Thông báo', 'Đổi avatar thành công');
                for (const tempUri of temp_UriAvatarDoanhNghiep) {
                    if (tempUri.dN_Id === dN_Id) {
                        tempUri.dN_Id = '';
                    }
                }
                setReRender((value) => value + 1);
                setShowModalChangeAvatar(false);
            }catch {
                 Alert.alert('Lỗi', 'Đổi avatar thất bại');
            }
         }
    }

    const deleteAvatar = async () => {
        const bearerToken =  await getBearerToken();

        if (!bearerToken) {
            Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
        }

        try {
            const uriDeleteCoverPhoto = url(`api/doanhnghiep/avatar/${dN_Id}`);
            await axios.delete(uriDeleteCoverPhoto, { headers : {Authorization: bearerToken}});
            Alert.alert('Thông báo', 'Xóa ảnh đại diện thành công');
            for (const tempUri of temp_UriAvatarDoanhNghiep) {
                if (tempUri.dN_Id === dN_Id) {
                    tempUri.dN_Id = '';
                }
            }
            setReRender((value) => value + 1);
            setShowModalChangeAvatar(false);
        }catch {
            Alert.alert('Lỗi', 'Xóa ảnh đại diện thất bại');
        }
    }

    const handleTouchAvatar = () => {
        if (canChange) {
            setShowModalChangeAvatar(true);
        }
    }

    const styles = StyleSheet.create({
        frameAvatarDoanhNghiep: {
            width: width,
            height: height,
            borderRadius: 32,
            backgroundColor: '#eee',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ccc',
        }
    })

    return (
        <View>
            <TouchableOpacity onPress={handleTouchAvatar}>
                {uriAvatar ? (
                <Image 
                source={{uri: uriAvatar ? uriAvatar : ''}}
                style={styles.frameAvatarDoanhNghiep}
                />) : (
                <View
                style={styles.frameAvatarDoanhNghiep}>
                    <Ionicons name={'business-outline'} size={width as number * 0.5}/>
                </View>)}
            </TouchableOpacity>
            
            <Modal
                visible={showModalChangeAvatar && quyenSua}
                animationType="slide">
                    <View style={{marginTop: 'auto', flex: 1}}>
                        <Image
                            source={{ uri: uriAvatar as string }}
                            style={{width: '100%', height: "83%", marginBottom: 10}}
                            resizeMode="cover"
                        />
                        <View style={{alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{alignItems: 'center'}}>
                                    <TouchableOpacity onPress={() => setAvatar(false)}>
                                        <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
                                    </TouchableOpacity>
                                    <Text>{'Ảnh trong máy'}</Text>
                                </View>
                                <View style={{width: 20}}></View>
                                <View style={{alignItems: 'center'}}>
                                    <TouchableOpacity onPress={() => setAvatar(true)}>
                                        <IconSymbol name={'camera'} size={50} color={'blue'}/>
                                    </TouchableOpacity>
                                    <Text>{'Camera'}</Text>
                                </View>
                                <View style={{width: 20}}></View>
                                {uriAvatar ? (
                                    <View style={{alignItems: 'center'}}>
                                        <TouchableOpacity onPress={deleteAvatar}>
                                            <IconSymbol name={'delete'} size={50} color={'red'}/>
                                        </TouchableOpacity>
                                        <Text>{'Xóa ảnh'}</Text>
                                    </View>
                                    ) : (<View></View>)}
                            </View>
                        </View>
                        <Button title="Đóng" onPress={() => setShowModalChangeAvatar(false)}></Button>
                    </View>
                </Modal>
        </View>
    )
}

