import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBearerToken } from "../../Auth/Authentication";
import { quyenSuaDoanhNghiep } from "../../Auth/Authorization/AuthDoanhNghiep";
import { COVER_PHOTO } from "../../constant/KieuFile";
import { DOANH_NGHIEP } from "../../constant/KieuTaiNguyen";
import { getFileAsync, getUriFile, getUriImagesFromCamera, getUriImagesPickInDevice } from "../../helpers/LogicHelper/fileHelper";
import { url } from "../../server/backend";

const temp_UriCoverPhotoDoanhNghiep : {
    dN_Id: string,
    uri: string | undefined
}[] = [];

export default function CoverPhotoDoanhNghiep({dN_Id, height, canChange}:{dN_Id: string, height: DimensionValue | undefined, canChange: boolean}) {
    const [uriCoverPhoto, setUriCoverPhoto] = useState<string | undefined>(undefined);
    const [quyenSua, setQuyenSua] = useState<boolean>(false);
    const [showModalChangeCoverPhoto, setShowModalChangeCoverPhoto] = useState<boolean | undefined>(false);
    const [reRender, setReRender] = useState<number>(0);

    useEffect(() => {
        layUriCoverPhoto();
        layQuyenSua();
    }, [reRender])

    const layUriCoverPhoto = async() => {
            const uriCoverPhotoInTemp = temp_UriCoverPhotoDoanhNghiep.find((item) => {
                return item.dN_Id === dN_Id
            });

            if (!uriCoverPhotoInTemp) {
                const listFilesCoverPhoto = await getFileAsync(DOANH_NGHIEP, dN_Id, COVER_PHOTO);

                if (listFilesCoverPhoto.length > 0) {
                    const uri = getUriFile(listFilesCoverPhoto[0]);
                    setUriCoverPhoto(uri);
                    temp_UriCoverPhotoDoanhNghiep.push({
                        dN_Id: dN_Id as string,
                        uri: uri
                    })
                }else {
                    setUriCoverPhoto(undefined);
                }
            }else {
                setUriCoverPhoto(uriCoverPhotoInTemp.uri);
            }
    }

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaDoanhNghiep(dN_Id);
        setQuyenSua(quyenSua);
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
                formData.append("coverPhoto", {
                                    uri: uriCoverPhotoInDevice,
                                    type: "image/jpeg",
                                    name: "coverPhoto.jpg",
                                    } as any); //không dùng Blob, phải để thế này thì react native mới hoạt động upload ảnh được

                const uriUploadCoverPhoto = url(`api/doanhnghiep/cover-photo/${dN_Id}`);

                try {
                    await axios.post(uriUploadCoverPhoto, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                    Alert.alert('Thông báo', 'Đổi ảnh bìa thành công');

                    for (const tempUri of temp_UriCoverPhotoDoanhNghiep) {
                        if (tempUri.dN_Id === dN_Id) {
                            tempUri.dN_Id = '';
                        }
                    }
                    setReRender((value) => value + 1);
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
                const uriDeleteCoverPhoto = url(`api/doanhnghiep/cover-photo/${dN_Id}`);
                await axios.delete(uriDeleteCoverPhoto, { headers : {Authorization: bearerToken}});
                Alert.alert('Thông báo', 'Xóa ảnh bìa thành công');

                for (const tempUri of temp_UriCoverPhotoDoanhNghiep) {
                    if (tempUri.dN_Id === dN_Id) {
                        tempUri.dN_Id = '';
                    }
                }

                setReRender((value) => value + 1);
                setShowModalChangeCoverPhoto(false);
            }catch {
                Alert.alert('Lỗi', 'Xóa ảnh bìa thất bại');
            }
        }

    return (
        <View>
            {uriCoverPhoto ? 
            (
                <View>
                    <TouchableOpacity onPress={canChange ? () => setShowModalChangeCoverPhoto(true) : () => {}}>
                        <Image
                            source={{ uri: uriCoverPhoto }}
                            style={{width: '100%', height: height}}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>
            ) : (<View>
                    {canChange && quyenSua ? (
                        <View style={{height: 100}}>
                            <TouchableOpacity style={{...styles.statBox, alignItems: 'center'}} onPress={() => setShowModalChangeCoverPhoto(true)}>
                                <Text style={styles.statLabel}>{'Đặt ảnh bìa'}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (<View style={{height: 100}}></View>)}
                </View>)}

                <Modal
                visible={showModalChangeCoverPhoto && quyenSua}
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