import { IMAGE } from "@/app/constant/KieuFile";
import { SAN_PHAM } from "@/app/constant/KieuTaiNguyen";
import { getFileAsync, getUriFile, getUriImagesFromCamera, getUriImagesPickInDevice } from "@/app/helpers/LogicHelper/fileHelper";
import File from "@/app/model/File";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBearerToken } from "../../Auth/Authentication";
import { quyenSuaSanPham } from "../../Auth/Authorization/AuthSanPham";
import { url } from "../../server/backend";

const temp_ListFilesAnhSanPham : {sP_Id: string, listFilesAnhSanPham: File[]}[] = [];

const { width } = Dimensions.get('window');
const height = 400;
export default function AnhSanPham({sP_Id, dN_SoHuu_Id} : {sP_Id : string, dN_SoHuu_Id: string}) 
{
    const [listFileAnhSanPhams, setListFileAnhSanPhams] = useState<File[]>([]);
    const [fileAnhHienTai, setFileAnhHienTai] = useState<File | undefined>(undefined);
    const [showModalTaiLenVaXoaAnh, setShowModalTaiLenVaXoaAnh] = useState<boolean | undefined>(false);
    const [quyenSuaSP, setQuyenSuaSP] = useState<boolean>(false);
    const [reRender, setReRender] = useState<number>(0);

    useEffect(() => {
      layAnhSanPham();
      layQuyenSuaSanPham();
    }, [reRender]);

    const layAnhSanPham = async() => {
      const listFilesAnhCuaSanPhamInTemp = temp_ListFilesAnhSanPham.find((item) => {
        return item.sP_Id === sP_Id;
      });

      if (!listFilesAnhCuaSanPhamInTemp) {
        const listFiles = await getFileAsync(SAN_PHAM, sP_Id, IMAGE);
        setListFileAnhSanPhams(listFiles);
        temp_ListFilesAnhSanPham.push({
            sP_Id: sP_Id,
            listFilesAnhSanPham: listFiles
          });
      }else {
        setListFileAnhSanPhams(listFilesAnhCuaSanPhamInTemp.listFilesAnhSanPham);
      }
      
    }

    const layQuyenSuaSanPham = async() => {
            const quyenSua = await quyenSuaSanPham(dN_SoHuu_Id);
            setQuyenSuaSP(quyenSua);
    }

    const openSuaXoaAnh = (fileAnh: File) => {
      if (quyenSuaSP) {
        setFileAnhHienTai(fileAnh);
        setShowModalTaiLenVaXoaAnh(true);
      }
    }

    const taiLenAnhSanPham = async(camera: boolean) => {
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
            
            const uriTaiLenAnhSP = url(`api/sanpham/photos/${sP_Id}`);

            try {
                await axios.post(uriTaiLenAnhSP, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: bearerToken}});
                Alert.alert('Thông báo', 'Tải lên ảnh thành công');
                setShowModalTaiLenVaXoaAnh(false);

                const indexFilesAnhCuaSanPhamInTemp = temp_ListFilesAnhSanPham.findIndex((item) => {
                  return item.sP_Id === sP_Id;
                });
                if (indexFilesAnhCuaSanPhamInTemp !== -1) {
                  temp_ListFilesAnhSanPham.splice(indexFilesAnhCuaSanPhamInTemp, 1);
                }

                setReRender((value) => value + 1);
            }catch {
                 Alert.alert('Lỗi', 'Tải ảnh lên ảnh thất bại');
            }
         }
    }

    const xoaAnhSanPham = async() => {
      const bearerToken =  await getBearerToken();

        if (!bearerToken) {
            Alert.alert("Lỗi", "Lỗi xác thực đăng nhập");
        }

        try {
            const uriXoaAnhSanPham = url(`api/sanpham/photos/${sP_Id}?f_id=${fileAnhHienTai?.f_Id}`);
            await axios.delete(uriXoaAnhSanPham, { headers : {Authorization: bearerToken}});
            Alert.alert('Thông báo', 'Xóa ảnh sản phẩm thành công');
            setShowModalTaiLenVaXoaAnh(false);

            const indexFilesAnhCuaSanPhamInTemp = temp_ListFilesAnhSanPham.findIndex((item) => {
              return item.sP_Id === sP_Id;
            });

            if (indexFilesAnhCuaSanPhamInTemp !== -1) {
              temp_ListFilesAnhSanPham.splice(indexFilesAnhCuaSanPhamInTemp, 1);
            }

            setReRender((value) => value + 1);
        }catch {
            Alert.alert('Lỗi', 'Xóa ảnh đại diện thất bại');
        }
    }

    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
        <View style={{height: height}}>
                {listFileAnhSanPhams.length > 0 ? (
                <FlatList
                  data={listFileAnhSanPhams}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => item.f_Id + '-' + index.toString()}
                  onScroll={onScroll}
                  renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => openSuaXoaAnh(item)}>
                      <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                      <View style={styles.indicatorContainer}>
                          {listFileAnhSanPhams.map((_, i) => (
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
            />) : (quyenSuaSP ? (
            <View style={{marginTop: 'auto', alignItems: 'center'}}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => taiLenAnhSanPham(true)}>
                      <IconSymbol name={'camera'} size={50} color={'blue'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => taiLenAnhSanPham(false)}>
                        <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
                    </TouchableOpacity>
                  </View>
                  <Text>{'Tải lên ảnh mới'}</Text>
              </View>
              ) : (<View></View>))
              }
                
          <Modal
          visible={showModalTaiLenVaXoaAnh && quyenSuaSP}
          animationType="slide">
            <View style={{marginTop: 'auto', flex: 1}}>
              <Image
                    source={{ uri: getUriFile(fileAnhHienTai as File) as string }}
                    style={{width: '100%', height: "83%", marginBottom: 10}}
                    resizeMode="cover"
                />

                <View style={{alignItems: 'center'}}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                              <TouchableOpacity onPress={() => taiLenAnhSanPham(true)}>
                                <IconSymbol name={'camera'} size={50} color={'blue'}/>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => taiLenAnhSanPham(false)}>
                                  <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
                              </TouchableOpacity>
                            </View>
                            <Text>{'Tải lên ảnh mới'}</Text>
                        </View>
                        <View style={{width: 20}}></View>
                        <View>
                            <TouchableOpacity onPress={xoaAnhSanPham}>
                              <IconSymbol name={'delete'} size={50} color={'red'}/>
                            </TouchableOpacity>
                            <Text>{'Xóa ảnh'}</Text>
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
    width: width,
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