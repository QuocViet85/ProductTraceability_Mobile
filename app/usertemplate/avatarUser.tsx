import { getBearerToken } from "@/app/Auth/Authentication";
import { getUriAvatarUser, getUriImagesFromCamera, getUriImagesPickInDevice } from "@/app/helpers/LogicHelper/fileHelper";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Image, Modal, Text, TouchableOpacity, View } from "react-native";
const temp_UriAvatarUser : {
    userId: string,
    uri: string | undefined
}[] = [];

export default function AvatarUser({userId, width, height, canChange} : {userId : string | undefined, width: number, height: number, canChange: boolean}) {
    const [uriAvatar, setUriAvatar] = useState<string | undefined>(undefined);
    const [showModalChangeAvatar, setShowModalChangeAvatar] = useState<boolean | undefined>(false);
    const [reRender, setReRender] = useState<number>(0);

    useEffect(() => {
        layUriAvatar();
    }, [reRender])

    const layUriAvatar = async() => {
        const uriAvatarInTemp = temp_UriAvatarUser.find((item) => {
            return item.userId === userId
        });

        if (!uriAvatarInTemp) {
            const uri = await getUriAvatarUser(userId as string);

            setUriAvatar(uri);

            temp_UriAvatarUser.push({
                    userId: userId as string,
                    uri: uri
            });
        }else {
            setUriAvatar(uriAvatarInTemp.uri);
        }
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
                    formData.append("file", {
                                        uri: uriAvatarInDevice,
                                        type: "image/jpeg",
                                        name: "avatar.jpg",
                                        } as any); //không dùng Blob, phải để thế này thì react native mới hoạt động upload ảnh được

            const uriChangeAvatar = url('api/auth/avatar');

            try {
                await axios.put(uriChangeAvatar, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                Alert.alert('Thông báo', 'Tải lên ảnh thành công');

                for (const tempUri of temp_UriAvatarUser) {
                    if (tempUri.userId === userId) {
                        tempUri.userId = '';
                    }
                }

                setReRender((value) => value + 1);
                setShowModalChangeAvatar(false);
            }catch {
                 Alert.alert('Lỗi', 'Tải lên ảnh thất bại');
            }
         }
    }

    const deleteAvatar = async () => {
        const bearerToken =  await getBearerToken();

        if (!bearerToken) {
            Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
        }

        try {
            const uriDeleteCoverPhoto = url('api/auth/avatar');
            await axios.delete(uriDeleteCoverPhoto, { headers : {Authorization: bearerToken}});
            Alert.alert('Thông báo', 'Xóa ảnh thành công');
            for (const tempUri of temp_UriAvatarUser) {
                    if (tempUri.userId === userId) {
                        tempUri.userId = '';
                    }
            }
            setReRender((value) => value + 1);
            setShowModalChangeAvatar(false);
        }catch {
            Alert.alert('Lỗi', 'Đổi ảnh đại diện thất bại');
        }
    }

    const handleTouchAvatar = () => {
        if (canChange) {
            setShowModalChangeAvatar(true);
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={handleTouchAvatar}>
                {uriAvatar ? (<Image
                    source={{uri: uriAvatar}}
                    style={{
                        width: width,
                        height: height,
                        borderRadius: 32,
                        backgroundColor: '#eee',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#ccc',
                    }}
                    />) : (<IconSymbol name={'account-circle'} size={height} color={'grey'}/>)}
            </TouchableOpacity>

            <Modal
            visible={showModalChangeAvatar}
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