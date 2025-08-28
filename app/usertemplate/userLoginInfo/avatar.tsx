import getBearerToken from "@/app/helpers/LogicHelper/authHelper";
import { getUriAvatarUser, getUriImagesPickInDevice } from "@/app/helpers/LogicHelper/fileHelper";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";

export default function AvatarUserLogin({userId} : {userId : string | undefined}) {
    const [uriAvatar, setUriAvatar] = useState<string>('');

    useEffect(() => {
        getUriAvatarUser(userId as string).then((uri) => {
            if (uri) {
                setUriAvatar(uri);
            }
        })
    }, [uriAvatar])

    const changeAvatar = () => {
        getBearerToken()
        .then((bearerToken: string) => {
            getUriImagesPickInDevice().then((uriArr : string[]) => {
                if (uriArr.length > 0) {
                    const uriNewAvatarInDevice = uriArr[0];

                    console.log(uriNewAvatarInDevice)

                    const formData = new FormData();
                    formData.append("file", {
                                        uri: uriNewAvatarInDevice,
                                        type: "image/jpeg",
                                        name: "avatar.jpg",
                                        } as any); //không dùng Blob, phải để thế này thì react native mới hoạt động upload ảnh được

                    let uriChangeAvatar = url('api/auth/avatar');

                    getBearerToken()
                    .then((bearerToken : any) => {
                        axios.put(uriChangeAvatar, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}})
                        .then(() => {
                            Alert.alert('Thông báo', 'Đổi avatar thành công');
                            setUriAvatar('');
                        })
                        .catch(() => {
                            Alert.alert('Lỗi', 'Đổi avatar thất bại');
                        })
                    })
                    .catch(() => {
                        Alert.alert('Lỗi', 'Đổi avatar thất bại');
                    })
                }
            })
            
            
        })
        .catch(() => {
            Alert.alert('Lỗi', 'Đổi ảnh đại diện thất bại');
        })
    }

    return (
        <View>
        <TouchableOpacity onPress={changeAvatar}>
            <Image
                source={{uri: uriAvatar}}
                style={{
                    width: 70,
                    height: 70,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#007BFF',
                    backgroundColor: '#ccc',
                }}
                />
        </TouchableOpacity>
            
        </View>
        
    )
}