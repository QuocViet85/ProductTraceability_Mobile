import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBearerToken } from "../Auth/Authentication";
import { quyenSuaSanPham } from "../Auth/Authorization/AuthSanPham";
import { IMAGE } from "../constant/KieuFile";
import { LO_SAN_PHAM } from "../constant/KieuTaiNguyen";
import { getFileAsync, getUriFile, getUriImagesFromCamera, getUriImagesPickInDevice } from "../helpers/LogicHelper/fileHelper";
import { Updating } from "../helpers/ViewHelpers/updating";
import File from "../model/File";
import LoSanPham from "../model/LoSanPham";
import { url } from "../server/backend";

const temp_ListAnhLoSanPhams: {lsP_Id: string | undefined, listAnhLoSanPhams: File[]}[] = [];

const { width } = Dimensions.get('window');
export default function AnhLoSanPham({loSanPham, sP_DN_SoHuu_Id}: {loSanPham: LoSanPham, sP_DN_SoHuu_Id: string | undefined}) {
    const [listFileAnhLoSanPhams, setListFileAnhLoSanPhams] = useState<File[]>([]);
    const [showModalAnhLoSanPham, setShowModalAnhLoSanPham] = useState<boolean | undefined>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [fileAnhHienTai, setFileAnhHienTai] = useState<File | undefined>(undefined);
    const [quyenSuaSP, setQuyenSuaSP] = useState<boolean>(false);
    const [showModalXoaAnh, setShowModalXoaAnh] = useState<boolean | undefined>(false);
    const [reRender, setReRender] = useState<number>(0);

    useEffect(() => {
        layListFileAnhLoSanPham();
        layQuyenSuaSanPham();
    }, [reRender]);

    const layListFileAnhLoSanPham = async() => {
        const listFilesInTemp = temp_ListAnhLoSanPhams.find((item) => {
                return item.lsP_Id === loSanPham.lsP_Id;
        });

        if (!listFilesInTemp) {
            const listFileAnhLoSanPhams = await getFileAsync(LO_SAN_PHAM, loSanPham.lsP_Id as string, IMAGE);
            setListFileAnhLoSanPhams(listFileAnhLoSanPhams);
            temp_ListAnhLoSanPhams.push({
                lsP_Id: loSanPham.lsP_Id,
                listAnhLoSanPhams: listFileAnhLoSanPhams,
            })
        }else {
            setListFileAnhLoSanPhams(listFilesInTemp.listAnhLoSanPhams);
        }
    }

    const layQuyenSuaSanPham = async() => {
        if (!sP_DN_SoHuu_Id) {
            setQuyenSuaSP(false);
            return;
        }
        const quyenSua = await quyenSuaSanPham(sP_DN_SoHuu_Id);
        setQuyenSuaSP(quyenSua);
    }

    const openXoaAnh = (fileAnh: File) => {
        if (quyenSuaSP) {
            setFileAnhHienTai(fileAnh);
            setShowModalXoaAnh(true);
        }
    }

    const taiLenAnhLoSanPham = async(camera: boolean) => {
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
                            name: "anhLoSanPham.jpg",
                            } as any); 
            }
            
            const uriTaiLenAnhLSP = url(`api/losanpham/photos/${loSanPham.lsP_Id}`);

            try {
                await axios.post(uriTaiLenAnhLSP, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                Alert.alert('Thông báo', 'Tải lên ảnh thành công');

                const indexFilesAnhCuaLoSanPhamInTemp = temp_ListAnhLoSanPhams.findIndex((item) => {
                    return item.lsP_Id === loSanPham.lsP_Id;
                });
                if (indexFilesAnhCuaLoSanPhamInTemp !== -1) {
                    temp_ListAnhLoSanPhams.splice(indexFilesAnhCuaLoSanPhamInTemp, 1);
                }

                setReRender((value) => value + 1);
            }catch {
                Alert.alert('Lỗi', 'Tải ảnh lên ảnh thất bại');
            }
        }
    }

    const xoaAnhLoSanPham = async() => {
    const bearerToken =  await getBearerToken();

        if (!bearerToken) {
            Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
        }

        try {
            const uriXoaAnhLoSanPham = url(`api/losanpham/photos/${loSanPham.lsP_Id}?f_id=${fileAnhHienTai?.f_Id}`);
            await axios.delete(uriXoaAnhLoSanPham, { headers : {Authorization: bearerToken}});
            Alert.alert('Thông báo', 'Xóa ảnh thành công');
            setShowModalXoaAnh(false);

            const indexFilesAnhCuaLoSanPhamInTemp = temp_ListAnhLoSanPhams.findIndex((item) => {
                return item.lsP_Id === loSanPham.lsP_Id;
            });
            if (indexFilesAnhCuaLoSanPhamInTemp !== -1) {
                temp_ListAnhLoSanPhams.splice(indexFilesAnhCuaLoSanPhamInTemp, 1);
            }

            setReRender((value) => value + 1);
        }catch {
            Alert.alert('Lỗi', 'Xóa ảnh lô sản phẩm thất bại');
        }
    }

    const renderTaiLenAnhLoSanPham = (size: number | undefined, fontSize: number | undefined) => quyenSuaSP ? (
                <View style={{alignItems: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => taiLenAnhLoSanPham(false)}>
                        <IconSymbol name={'photo-album'} size={size} color={'blue'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => taiLenAnhLoSanPham(true)}>
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
            {listFileAnhLoSanPhams.length > 0 ? 
            (<View>
                <Text style={{fontWeight: 'bold'}}>{'Hình ảnh lô sản phẩm: '}</Text>
                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setShowModalAnhLoSanPham(true)}>
                    {listFileAnhLoSanPhams.map((item, key) => {
                        if (key <= 2) {
                            return (<Image key={key} source={{ uri: getUriFile(item) }} style={{width: 80, height: 80, marginRight: 10, borderRadius: 8}} />)
                        }else if (key === 3) {
                            return (
                                <View key={key} style={{backgroundColor: 'grey', borderRadius: 8}}>
                                    <IconSymbol key={key} name="more-horiz" size={80} color="white" />
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
                        <Text style={{fontWeight: 'bold'}}>{'Hình ảnh lô sản phẩm: '}</Text>
                        <Updating />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        {renderTaiLenAnhLoSanPham(30, undefined)}
                    </View>
                </View>
            )}

            <Modal
                visible={showModalAnhLoSanPham}
                animationType={'slide'}
                style={{width: '100%', height: '100%'}}
                >
                    <View style={{ flex: 1}}>
                        <FlatList
                            data={listFileAnhLoSanPhams}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={onScroll}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => openXoaAnh(item)}>
                                        <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                                        <View style={styles.indicatorContainer}>
                                            {listFileAnhLoSanPhams.map((_, i) => (
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
                                {renderTaiLenAnhLoSanPham(50, undefined)}
                            </View>
                            
                            <Modal
                            visible={showModalXoaAnh}
                            animationType="slide"
                            transparent= {true}>
                                <View style={{ marginTop: '80%', alignItems: 'center' }}>
                                    <View style={{ width: '50%', backgroundColor: 'white', borderRadius: 8 }}>
                                        <View style={{alignItems: 'center'}}>
                                            <TouchableOpacity onPress={xoaAnhLoSanPham}>
                                                <IconSymbol name={'delete'} size={50} color={'red'}/>
                                            </TouchableOpacity>
                                            <Text>{'Xóa ảnh'}</Text>
                                        </View>
                                        <Button title="Đóng" onPress={() => setShowModalXoaAnh(false)}></Button>
                                    </View>
                                    
                                </View>
                                
                            </Modal>

                            <View style={{marginTop: 'auto'}}>
                                <Button title="Đóng" onPress={() => setShowModalAnhLoSanPham(false)}></Button>
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