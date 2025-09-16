import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getFileAsync, getUriFile, getUriImagesFromCamera, getUriImagesPickInDevice } from "../helpers/LogicHelper/fileHelper";
import { USER } from "../constant/KieuTaiNguyen";
import { COVER_PHOTO } from "../constant/KieuFile";
import getBearerToken from "../helpers/LogicHelper/authHelper";
import { url } from "../server/backend";
import axios from "axios";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { STATE_CHANGE } from "../constant/State";

const temp_UriCoverPhotoUser : {
    userId: string,
    uri: string
}[] = []

export default function CoverPhotoUser({userId, height, canChange}: {userId: string, height: DimensionValue | undefined ,canChange: boolean}) {
    const [uriCoverPhoto, setUriCoverPhoto] = useState<string | null>(null);
    const [showModalChangeCoverPhoto, setShowModalChangeCoverPhoto] = useState<boolean | undefined>(false);
    
        useEffect(() => {
            layUriCoverPhoto();
        }, [uriCoverPhoto]);

        const layUriCoverPhoto = async() => {
            const uriCoverPhotoInTemp = temp_UriCoverPhotoUser.find((item) => {
                return item.userId === userId
            });

            if (!uriCoverPhotoInTemp || uriCoverPhoto === STATE_CHANGE) {
                const listFilesCoverPhoto = await getFileAsync(USER, userId, COVER_PHOTO);

                    if (listFilesCoverPhoto.length > 0) {
                        const uri = getUriFile(listFilesCoverPhoto[0]);
                    if (uri) {
                        setUriCoverPhoto(uri);

                        if (uriCoverPhoto === STATE_CHANGE) {
                            const indexOldCoverPhotoInTemp = temp_UriCoverPhotoUser.findIndex((item) => {
                                return item.userId === userId
                            });
                            if (indexOldCoverPhotoInTemp !== - 1) {
                                temp_UriCoverPhotoUser.splice(indexOldCoverPhotoInTemp, 1);
                            }
                        }

                        temp_UriCoverPhotoUser.push({
                            userId: userId as string,
                            uri: uri
                        })
                    }
                }

                
            }else {
                setUriCoverPhoto(uriCoverPhotoInTemp.uri);
            }
        }

        const setCoverPhoto = async (camera: boolean) => {
            const bearerToken =  await getBearerToken();

            if (!bearerToken) {
                Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
            }

            let uriArr: string[] = [];

            if (camera) {
                uriArr = await getUriImagesFromCamera();
            }else {
                uriArr = await getUriImagesPickInDevice(false);
            }

            if (!uriArr) {
                Alert.alert("Lỗi", "Không truy cập được ảnh trong thiết bị");
            }

            if (uriArr.length > 0) {
                 const uriCoverPhotoInDevice = uriArr[0];

                const formData = new FormData();
                formData.append("file", {
                                    uri: uriCoverPhotoInDevice,
                                    type: "image/jpeg",
                                    name: "coverPhoto.jpg",
                                    } as any); //không dùng Blob, phải để thế này thì react native mới hoạt động upload ảnh được

                const uriDeleteCoverPhoto = url('api/auth/cover-photo');

                try {
                    await axios.put(uriDeleteCoverPhoto, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                    Alert.alert('Thông báo', 'Đổi ảnh bìa thành công');
                    setUriCoverPhoto(STATE_CHANGE);
                    setShowModalChangeCoverPhoto(false);
                }catch {
                    Alert.alert('Lỗi', 'Đổi ảnh bìa thất bại');
                }
            }
        }

        const deleteCoverPhoto = async () => {
            const bearerToken =  await getBearerToken();

            if (!bearerToken) {
                Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
            }

            try {
                const uriDeleteCoverPhoto = url('api/auth/cover-photo');
                await axios.delete(uriDeleteCoverPhoto, { headers : {Authorization: bearerToken}});
                Alert.alert('Thông báo', 'Xóa ảnh bìa thành công');
                setUriCoverPhoto(null);
                setShowModalChangeCoverPhoto(false);
            }catch {
                Alert.alert('Lỗi', 'Đổi ảnh bìa thất bại');
            }
        }
    return (
        <View>
            {
                uriCoverPhoto ?
                (
                    <View>
                        <TouchableOpacity onPress={canChange ? () => setShowModalChangeCoverPhoto(true) : () => {}}>
                            <Image
                                source={{ uri: uriCoverPhoto as string }}
                                style={{width: '100%', height: height, marginBottom: 40}}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View>
                
                ) : 
                (
                    <View>
                        {canChange ? (
                            <View style={{height: 100}}>
                                <TouchableOpacity style={{...styles.statBox, alignItems: 'center'}} onPress={() => setShowModalChangeCoverPhoto(true)}>
                                    <Text style={styles.statLabel}>{'Đặt ảnh bìa'}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (<View style={{height: 100}}></View>)}
                    </View>
                )
            }

            <Modal
            visible={showModalChangeCoverPhoto}
            animationType="slide">
                <View style={{marginTop: 'auto'}}>
                    <Image
                        source={{ uri: uriCoverPhoto as string }}
                        style={{width: '100%', height: "80%", marginBottom: 40}}
                        resizeMode="cover"
                    />
                    <View style={{alignItems: 'center'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => setCoverPhoto(true)}>
                                <IconSymbol name={'camera'} size={50} color={'blue'}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setCoverPhoto(false)}>
                                <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
                            </TouchableOpacity>
                            <Text>{`${uriCoverPhoto ? 'Đổi' : 'Tải lên'} ảnh bìa`}</Text>
                            {uriCoverPhoto ? (
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={deleteCoverPhoto}>
                                    <IconSymbol name={'delete'} size={50} color={'red'}/>
                                    </TouchableOpacity>
                                    <Text>Xóa ảnh bìa</Text>
                                </View>
                                ) : (<View></View>)}
                        </View>
                    </View>                                
                    <Button title="Đóng" onPress={() => setShowModalChangeCoverPhoto(false)}></Button>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#555', fontSize: 13 },
})