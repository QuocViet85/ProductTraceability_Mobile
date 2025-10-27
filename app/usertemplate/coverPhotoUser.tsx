import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBearerToken } from "../Auth/Authentication";
import { COVER_PHOTO } from "../constant/KieuFile";
import { USER } from "../constant/KieuTaiNguyen";
import { getFileAsync, getUriFile, getUriImagesFromCamera, getUriImagesPickInDevice } from "../helpers/LogicHelper/fileHelper";
import { url } from "../server/backend";

const temp_UriCoverPhotoUser : {
    userId: string,
    uri: string | undefined
}[] = []

export default function CoverPhotoUser({userId, height, canChange}: {userId: string, height: DimensionValue | undefined ,canChange: boolean}) {
    const [uriCoverPhoto, setUriCoverPhoto] = useState<string | undefined>(undefined);
    const [showModalChangeCoverPhoto, setShowModalChangeCoverPhoto] = useState<boolean | undefined>(false);
    const [reRender, setReRender] = useState<number>(0);
    
        useEffect(() => {
            layUriCoverPhoto();
        }, [reRender]);

        const layUriCoverPhoto = async() => {
            const uriCoverPhotoInTemp = temp_UriCoverPhotoUser.find((item) => {
                return item.userId === userId
            });

            if (!uriCoverPhotoInTemp) {
                const listFilesCoverPhoto = await getFileAsync(USER, userId, COVER_PHOTO);

                if (listFilesCoverPhoto.length > 0) {
                    const uri = getUriFile(listFilesCoverPhoto[0]);

                    setUriCoverPhoto(uri);

                    temp_UriCoverPhotoUser.push({
                        userId: userId as string,
                        uri: uri
                    });
                }else {
                    setUriCoverPhoto(undefined);
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

                const uriUploadCoverPhoto = url('api/auth/cover-photo');

                try {
                    await axios.put(uriUploadCoverPhoto, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                    Alert.alert('Thông báo', 'Tải lên ảnh thành công');

                    for (const tempUri of temp_UriCoverPhotoUser) {
                        if (tempUri.userId === userId) {
                            tempUri.userId = '';
                        }
                    }
                    setReRender((value) => value + 1);
                    setShowModalChangeCoverPhoto(false);
                }catch {
                    Alert.alert('Lỗi', 'Tải lên ảnh thất bại');
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

                Alert.alert('Thông báo', 'Xóa ảnh thành công');
                for (const tempUri of temp_UriCoverPhotoUser) {
                    if (tempUri.userId === userId) {
                        tempUri.userId = '';
                    }
                }

                setReRender((value) => value + 1);
                setShowModalChangeCoverPhoto(false);
            }catch {
                Alert.alert('Lỗi', 'Xóa ảnh thất bại');
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
                <View style={{marginTop: 'auto', flex: 1}}>
                    <Image
                        source={{ uri: uriCoverPhoto as string }}
                        style={{width: '100%', height: "83%", marginBottom: 10}}
                        resizeMode="cover"
                    />
                    <View style={{alignItems: 'center'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => setCoverPhoto(false)}>
                                    <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
                                </TouchableOpacity>
                                <Text>{'Ảnh trong máy'}</Text>
                            </View>
                            <View style={{width: 20}}></View>
                            <View style={{alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => setCoverPhoto(true)}>
                                    <IconSymbol name={'camera'} size={50} color={'blue'}/>
                                </TouchableOpacity>
                                <Text>{'Camera'}</Text>
                            </View>
                            <View style={{width: 20}}></View>
                            {uriCoverPhoto ? (
                                <View style={{alignItems: 'center'}}>
                                    <TouchableOpacity onPress={deleteCoverPhoto}>
                                        <IconSymbol name={'delete'} size={50} color={'red'}/>
                                    </TouchableOpacity>
                                    <Text>{'Xóa ảnh'}</Text>
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