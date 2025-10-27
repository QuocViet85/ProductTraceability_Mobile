import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBearerToken } from "../Auth/Authentication";
import { quyenSuaNhaMay } from "../Auth/Authorization/AuthNhaMay";
import { IMAGE } from "../constant/KieuFile";
import { NHA_MAY } from "../constant/KieuTaiNguyen";
import { getFileAsync, getUriFile, getUriImagesFromCamera, getUriImagesPickInDevice } from "../helpers/LogicHelper/fileHelper";
import { getWidthScreen } from "../helpers/LogicHelper/helper";
import File from "../model/File";
import { url } from "../server/backend";

const temp_ListFilesAnhNhaMay : {nM_Id: string, listFilesAnh: File[]}[] = [];

const height = 400;
export default function AnhNhaMay({nM_Id}: {nM_Id: string}) {
    const [listFilesAnhNhaMay, setListFilesAnhNhaMay] = useState<File[]>([]);
    const [fileAnhHienTai, setFileAnhHienTai] = useState<File | undefined>(undefined);
    const [showModalTaiLenVaXoaAnh, setShowModalTaiLenVaXoaAnh] = useState<boolean | undefined>(false);
    const [quyenSuaNM, setQuyenSuaNM] = useState<boolean>(false);
    const [reRender, setReRender] = useState<number>(0);
    
    useEffect(() => {
        layFilesAnhNhaMay();
        layQuyenSuaNhaMay();
    }, [reRender]);

    const layFilesAnhNhaMay = async() => {
      const listFilesAnhCuaNhaMayInTemp = temp_ListFilesAnhNhaMay.find((item) => {
        return item.nM_Id === nM_Id;
      });

      if (!listFilesAnhCuaNhaMayInTemp) {
        const listFilesAnhNhaMay = await getFileAsync(NHA_MAY, nM_Id, IMAGE);
        setListFilesAnhNhaMay(listFilesAnhNhaMay);

        temp_ListFilesAnhNhaMay.push({
          nM_Id: nM_Id,
          listFilesAnh: listFilesAnhNhaMay
        });
      }else {
        setListFilesAnhNhaMay(listFilesAnhCuaNhaMayInTemp.listFilesAnh);
      }
    }

    const layQuyenSuaNhaMay= async() => {
        const quyenSua = await quyenSuaNhaMay(nM_Id);
        setQuyenSuaNM(quyenSua);
    }

    const openSuaXoaAnh = (fileAnh: File) => {
      if (quyenSuaNM) {
        setFileAnhHienTai(fileAnh);
        setShowModalTaiLenVaXoaAnh(true);
      } 
    }

    const taiLenAnhNhaMay = async(camera: boolean) => {
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
                            name: "anhSanPham.jpg",
                            } as any); 
            }
            
            const uriTaiLenAnhNM = url(`api/nhamay/photos/${nM_Id}`);

            try {
                await axios.post(uriTaiLenAnhNM, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                Alert.alert('Thông báo', 'Tải lên ảnh thành công');
                setShowModalTaiLenVaXoaAnh(false);

                const indexFilesAnhCuaNhaMayInTemp = temp_ListFilesAnhNhaMay.findIndex((item) => {
                  return item.nM_Id === nM_Id;
                });
                if (indexFilesAnhCuaNhaMayInTemp !== -1) {
                  temp_ListFilesAnhNhaMay.splice(indexFilesAnhCuaNhaMayInTemp, 1);
                }

                setReRender((value) => value + 1);
            }catch {
                 Alert.alert('Lỗi', 'Tải ảnh lên ảnh thất bại');
            }
         }
    }

    const xoaAnhNhaMay = async() => {
      const bearerToken =  await getBearerToken();

        if (!bearerToken) {
            Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
        }

        try {
            const uriXoaAnhNhaMay = url(`api/nhamay/photos/${nM_Id}?f_id=${fileAnhHienTai?.f_Id}`);
            await axios.delete(uriXoaAnhNhaMay, { headers : {Authorization: bearerToken}});
            Alert.alert('Thông báo', 'Xóa ảnh thành công');
            setShowModalTaiLenVaXoaAnh(false);

            const indexFilesAnhCuaNhaMayInTemp = temp_ListFilesAnhNhaMay.findIndex((item) => {
              return item.nM_Id === nM_Id;
            });
            if (indexFilesAnhCuaNhaMayInTemp !== -1) {
              temp_ListFilesAnhNhaMay.splice(indexFilesAnhCuaNhaMayInTemp, 1);
            }
            setReRender((value) => value + 1);
        }catch {
            Alert.alert('Lỗi', 'Xóa ảnh đại diện thất bại');
        }
    }

    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / getWidthScreen());
        setActiveIndex(index);
    };

    return (
            <View style={{height: height}}>
                    {listFilesAnhNhaMay.length > 0 ? (
                    <FlatList
                      data={listFilesAnhNhaMay}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => item.f_Id + '-' + index.toString()}
                      onScroll={onScroll}
                      renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => openSuaXoaAnh(item)}>
                          <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                          <View style={styles.indicatorContainer}>
                              {listFilesAnhNhaMay.map((_, i) => (
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
                />) : (quyenSuaNM ? (
                  <View style={{marginTop: 'auto', flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity onPress={() => taiLenAnhNhaMay(true)}>
                            <IconSymbol name={'camera'} size={50} color={'blue'}/>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => taiLenAnhNhaMay(false)}>
                              <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
                          </TouchableOpacity>
                        </View>
                        <Text>{'Tải lên thêm ảnh nhà máy'}</Text>
                  </View>
                    ) : (<View></View>))
                    }
                    
              <Modal
              visible={showModalTaiLenVaXoaAnh && quyenSuaNM}
              animationType="slide">
                <View style={{marginTop: 'auto'}}>
                  <Image
                        source={{ uri: getUriFile(fileAnhHienTai as File) as string }}
                        style={{width: '100%', height: "77%", marginBottom: 40}}
                        resizeMode="cover"
                    />
    
                    <View>
                          <View style={{flexDirection: 'row'}}>
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                  <TouchableOpacity onPress={() => taiLenAnhNhaMay(true)}>
                                    <IconSymbol name={'camera'} size={50} color={'blue'}/>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={() => taiLenAnhNhaMay(false)}>
                                      <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
                                  </TouchableOpacity>
                                </View>
                                <Text>{'Tải lên thêm ảnh nhà máy'}</Text>
                            </View>
                            <View style={{width: 40}}></View>
                            <View>
                                <TouchableOpacity onPress={xoaAnhNhaMay}>
                                  <IconSymbol name={'delete'} size={50} color={'red'}/>
                                </TouchableOpacity>
                                <Text>{'Xóa ảnh nhà máy này'}</Text>
                            </View>
                          </View>
                      </View>
    
                    <Button title="Đóng" onPress={() => setShowModalTaiLenVaXoaAnh(false)}></Button>
                </View>
              </Modal>
            </View>
        );
}

const styles = StyleSheet.create({
  image: {
    width: getWidthScreen(),
    height: height,
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