import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBearerToken } from "../Auth/Authentication";
import { quyenSuaSanPham } from "../Auth/Authorization/AuthSanPham";
import { IMAGE } from "../constant/KieuFile";
import { SK_TRUY_XUAT } from "../constant/KieuTaiNguyen";
import { getFileAsync, getUriFile, getUriImagesFromCamera, getUriImagesPickInDevice } from "../helpers/LogicHelper/fileHelper";
import { Updating } from "../helpers/ViewHelpers/updating";
import File from "../model/File";
import SuKienTruyXuat from "../model/SuKienTruyXuat";
import { url } from "../server/backend";

const temp_ListFilesAnhSuKien : {sK_Id: string, listFilesAnhSuKien: File[]}[] = [];

const { width } = Dimensions.get('window');
export default function AnhSuKienTruyXuat({suKien}: {suKien: SuKienTruyXuat}) {
    const [listFilesAnhSuKien, setListFilesAnhSuKien] = useState<File[]>([]);
    const [showModalAnhSuKien, setShowModalAnhSuKien] = useState<boolean | undefined>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [fileAnhHienTai, setFileAnhHienTai] = useState<File | undefined>(undefined);
    const [quyenSuaSP, setQuyenSuaSP] = useState<boolean>(false);
    const [showModalXoaAnh, setShowModalXoaAnh] = useState<boolean | undefined>(false);
    const [reRender, setReRender] = useState<number>(0);

    useEffect(() => {
        layListFileAnhSuKien();
        layQuyenSuaSanPham();
    }, [reRender]);

    const layListFileAnhSuKien = async() => {
        const listFilesInTemp = temp_ListFilesAnhSuKien.find((item) => {
            return item.sK_Id === suKien.sK_Id;
        });

        if (!listFilesInTemp) {
            const listFileAnhSuKiens = await getFileAsync(SK_TRUY_XUAT, suKien.sK_Id as string, IMAGE);
            setListFilesAnhSuKien(listFileAnhSuKiens);
            temp_ListFilesAnhSuKien.push({
                sK_Id: suKien.sK_Id as string,
                listFilesAnhSuKien: listFileAnhSuKiens
            })
        }else {
            setListFilesAnhSuKien(listFilesInTemp.listFilesAnhSuKien);
        }
    }

    const layQuyenSuaSanPham = async() => {
        const quyenSua = await quyenSuaSanPham(suKien.sK_DoanhNghiepSoHuu_Id);
        setQuyenSuaSP(quyenSua);
    }

    const openXoaAnh = (fileAnh: File) => {
        if (quyenSuaSP) {
            setFileAnhHienTai(fileAnh);
            setShowModalXoaAnh(true);
        }
    }

    const taiLenAnhSuKien = async(camera: boolean) => {
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
            Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
        }
        let uriArr : string[] = [];
        if (camera) {
            uriArr = await getUriImagesFromCamera();
        }else {
            uriArr = await getUriImagesPickInDevice(true);
        }
        

        if (!uriArr) {
            Alert.alert("Lỗi", "Không truy cập được ảnh trong thiết bị");
            return;
        }

        if (uriArr.length > 0) {
            const formData = new FormData();

            for (const uriAvatarInDevice of uriArr) {
                formData.append("listFiles", {
                            uri: uriAvatarInDevice,
                            type: "image/jpeg",
                            name: "anhSuKienTruyXuat.jpg",
                            } as any); 
            }
            
            const uriTaiLenAnhSK = url(`api/sukientruyxuat/photos/${suKien.sK_Id}`);

            try {
                await axios.post(uriTaiLenAnhSK, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                Alert.alert('Thông báo', 'Tải lên ảnh thành công');

                const indexFilesAnhCuaSuKienInTemp = temp_ListFilesAnhSuKien.findIndex((item) => {
                    return item.sK_Id === suKien.sK_Id;
                });
                if (indexFilesAnhCuaSuKienInTemp !== -1) {
                    temp_ListFilesAnhSuKien.splice(indexFilesAnhCuaSuKienInTemp, 1);
                }

                setReRender((value) => value + 1);
            }catch {
                Alert.alert('Lỗi', 'Tải ảnh lên ảnh thất bại');
            }
        }
    }

    const xoaAnhSuKien = async() => {
    const bearerToken =  await getBearerToken();

        if (!bearerToken) {
            Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
        }

        try {
            const uriXoaAnhSuKien = url(`api/sukientruyxuat/photos/${suKien.sK_Id}?f_id=${fileAnhHienTai?.f_Id}`);
            await axios.delete(uriXoaAnhSuKien, { headers : {Authorization: bearerToken}});
            Alert.alert('Thông báo', 'Xóa ảnh thành công');
            setShowModalXoaAnh(false);

            const indexFilesAnhCuaSuKienInTemp = temp_ListFilesAnhSuKien.findIndex((item) => {
                    return item.sK_Id === suKien.sK_Id;
            });
            if (indexFilesAnhCuaSuKienInTemp !== -1) {
                temp_ListFilesAnhSuKien.splice(indexFilesAnhCuaSuKienInTemp, 1);
            }

            setReRender((value) => value + 1);
        }catch {
            Alert.alert('Lỗi', 'Xóa ảnh lô sản phẩm thất bại');
        }
    }

    const renderTaiLenAnhSuKien = (size: number | undefined, fontSize: number | undefined) => quyenSuaSP ? (
            <View style={{alignItems: 'center'}}>   
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => taiLenAnhSuKien(false)}>
                        <IconSymbol name={'photo-album'} size={size} color={'blue'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => taiLenAnhSuKien(true)}>
                        <IconSymbol name={'camera'} size={size} color={'blue'}/>
                    </TouchableOpacity>
                </View>
                <Text style={{fontSize: fontSize}}>{'Tải lên ảnh mới'}</Text>
            </View>
            ) :  null

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
            <View>
                {listFilesAnhSuKien.length > 0 ? 
                (<View>
                    <Text style={{fontWeight: 'bold'}}>{'Hình ảnh sự kiện truy xuất: '}</Text>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setShowModalAnhSuKien(true)}>
                        {listFilesAnhSuKien.map((item, key) => {
                            if (key <= 2) {
                                return (<Image key={item.f_Id + '_' + key} source={{ uri: getUriFile(item) }} style={{width: 80, height: 80, marginRight: 10, borderRadius: 8}} />)
                            }else if (key === 3) {
                                return (
                                    <View key={key} style={{backgroundColor: 'grey', borderRadius: 8}}>
                                        <IconSymbol key={item.f_Id + '_' + key} name="more-horiz" size={80} color="white" />
                                    </View>
                            )
                            }
                            else {
                                return (<View key={key}></View>)
                            }
                        })}
                    </TouchableOpacity>
                </View>)
                : (
                    <View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontWeight: 'bold'}}>{'Hình ảnh sự kiện truy xuất: '}</Text>
                            <Updating />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            {renderTaiLenAnhSuKien(30, undefined)}
                        </View>
                        
                    </View>
                    
                )}
    
                <Modal
                    visible={showModalAnhSuKien}
                    animationType={'slide'}
                    style={{width: '100%', height: '100%'}}
                    >
                        <View style={{flex: 1}}>
                            <FlatList
                                data={listFilesAnhSuKien}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={onScroll}
                                keyExtractor={(item, index) => item.f_Id + '_' + index}
                                renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => openXoaAnh(item)}>
                                    <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                                    <View style={styles.indicatorContainer}>
                                        {listFilesAnhSuKien.map((_, i) => (
                                        <View
                                            key={i}
                                            style={[
                                            styles.dot,
                                                { backgroundColor: i === activeIndex ? '#333' : '#aaa' },
                                            ]}
                                        />
                                        ))}
                                    </View>
                                </TouchableOpacity>
                                )}
                            />
                            <View style={{alignItems: 'center'}}>
                                {renderTaiLenAnhSuKien(50, undefined)}
                            </View>
                            
                            <Modal
                            visible={showModalXoaAnh}
                            animationType="slide"
                            transparent= {true}>
                                <View style={{ marginTop: '80%', alignItems: 'center' }}>
                                    <View style={{ width: '50%', backgroundColor: 'white', borderRadius: 8 }}>
                                        <View style={{alignItems: 'center'}}>
                                            <TouchableOpacity onPress={xoaAnhSuKien}>
                                                <IconSymbol name={'delete'} size={50} color={'red'}/>
                                            </TouchableOpacity>
                                            <Text>{'Xóa ảnh'}</Text>
                                        </View>
                                        <Button title="Đóng" onPress={() => setShowModalXoaAnh(false)}></Button>
                                    </View>
                                </View>
                            </Modal>

                            <View style={{marginTop: 'auto'}}>
                                <Button title="Đóng" onPress={() => setShowModalAnhSuKien(false)}></Button>
                            </View>
                        </View>
                    </Modal>
            </View>
        )
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5,
  },
});