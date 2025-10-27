import { getBearerToken } from "@/app/Auth/Authentication";
import { getUriImagesFromCamera, getUriImagesPickInDevice } from "@/app/helpers/LogicHelper/fileHelper";
import BinhLuan from "@/app/model/BinhLuan";
import { url } from "@/app/server/backend";
import { temp_ListBinhLuansCuaUser } from "@/app/usertemplate/user/binhLuanCuaUser/binhLuanCuaUser";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { temp_ListBinhLuansCuaSanPham } from "./binhLuanSanPham";

export default function PostBinhLuan({sP_Id, reloadBinhLuans}: {sP_Id: string, reloadBinhLuans: () => void}) {
    const [noiDungBinhLuan, setNoiDungBinhLuan] = useState<string>('');
    const [listUriAnhBinhLuan, setListUriAnhBinhLuan] = useState<string[]>([])

    const postBinhLuan = async () => {
        if (noiDungBinhLuan) {
            const bearerToken = await getBearerToken();

            if (!bearerToken) {
                Alert.alert('Lỗi', 'Lỗi đăng bình luận');
            }

            const urlPostBinhLuan = url(`api/binhluan/san-pham/${sP_Id}`);

            const formData = new FormData();

            formData.append("noiDung", noiDungBinhLuan);

            for (const uri of listUriAnhBinhLuan) {
                formData.append("listImages", {
                    uri: uri,
                    type: "image/jpeg",
                    name: "avatar.jpg",
                } as any);
            };

            try {
                const res = await axios.post(urlPostBinhLuan, formData, {headers: {
                    Authorization: bearerToken,
                    "Content-Type": 'multipart/form-data'
                }});

                Alert.alert('Thông báo', 'Đăng bình luận thành công');

                const binhLuanNew : BinhLuan = res.data;

                const listBinhLuansCuaSanPhamTrongTemp = temp_ListBinhLuansCuaSanPham.filter((item: BinhLuan) => {
                    return item.bL_SP_Id === sP_Id;
                })
                if (listBinhLuansCuaSanPhamTrongTemp.length > 1) {
                    for (const binhLuan of listBinhLuansCuaSanPhamTrongTemp) {
                        binhLuan.temp_tongSoBinhLuanCuaSP += 1;
                    }
                    binhLuanNew.temp_tongSoBinhLuanCuaSP = listBinhLuansCuaSanPhamTrongTemp[0].temp_tongSoBinhLuanCuaSP;
                    temp_ListBinhLuansCuaSanPham.unshift(binhLuanNew);
                }

                const listBinhLuansCuaUserTrongTemp = temp_ListBinhLuansCuaUser.filter((item: BinhLuan) => {
                    return item.bL_SP_Id === sP_Id;
                })
                if (listBinhLuansCuaUserTrongTemp.length > 1) {
                    for (const binhLuan of listBinhLuansCuaUserTrongTemp) {
                        binhLuan.temp_tongSoBinhLuanCuaUser += 1;
                    }
                    binhLuanNew.temp_tongSoBinhLuanCuaUser = listBinhLuansCuaUserTrongTemp[0].temp_tongSoBinhLuanCuaUser;
                    temp_ListBinhLuansCuaUser.unshift(binhLuanNew);
                }
                
                setNoiDungBinhLuan('');
                setListUriAnhBinhLuan([]);
                reloadBinhLuans();
            }catch {
                Alert.alert('Lỗi', 'Lỗi đăng bình luận')
            }
        }else {
            Alert.alert('Lỗi', 'Chưa nhập bình luận');
        }
    }

    const limitAnh = 5;

    const chonAnhBinhLuanTuThuVien = async () => {
        const uriArr = await getUriImagesPickInDevice(true);
        if (uriArr.length > 0) {
            const newListUriAnhBinhLuan = [];
            newListUriAnhBinhLuan.push(...listUriAnhBinhLuan);
            newListUriAnhBinhLuan.push(...uriArr);
            if (validateGioiHanAnh(newListUriAnhBinhLuan)) {
                setListUriAnhBinhLuan(newListUriAnhBinhLuan);
            }
        }
    }

    const chonAnhBinhLuanTuCamera = async () => {
        const uriArr = await getUriImagesFromCamera();

        if (uriArr.length > 0) {
            const newListUriAnhBinhLuan = [];
            newListUriAnhBinhLuan.push(...listUriAnhBinhLuan);
            newListUriAnhBinhLuan.push(...uriArr);
            if (validateGioiHanAnh(newListUriAnhBinhLuan)) {
                setListUriAnhBinhLuan(newListUriAnhBinhLuan);
            }
        }
    }

    const huyAnhBinhLuan = (uri: string) => {
        const newListUriAnhBinhLuan = listUriAnhBinhLuan.filter(value => value !== uri);
        setListUriAnhBinhLuan(newListUriAnhBinhLuan);
    }

    const validateGioiHanAnh = (newListUriAnhBinhLuan: string[]) => {
        if( newListUriAnhBinhLuan.length < limitAnh) {
            return true;
        }else {
            Alert.alert("Lỗi", `Chỉ được upload không quá ${limitAnh} ảnh cho 1 bình luận`);
            return false;
        }
    }

    return (
        <View style={{flex: 1}}>
            <View>
                <TextInput
                    style={{
                            height: 120,
                            borderColor: "gray",
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 8,
                            width: '100%'}}
                    placeholder="Nhập bình luận..."
                    value={noiDungBinhLuan}
                    onChangeText={setNoiDungBinhLuan}
                    multiline={true}     // Cho phép nhiều dòng
                    numberOfLines={3}    // Gợi ý chiều cao ban đầu
                    textAlignVertical="top" // Cho chữ căn từ trên xuống (Android)
                    maxLength={1000}
                    />
                <View style={{height: 10}}></View>

                <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {listUriAnhBinhLuan.map((item, key) => {
                        return (
                                <TouchableOpacity key={key} onPress={() => huyAnhBinhLuan(item)}>
                                    <Image key={key} source={{ uri: item }} style={{width: 80, height: 80, marginRight: 10, borderRadius: 8}} />
                                </TouchableOpacity>
                        )
                    })}
                    </ScrollView>
                    {listUriAnhBinhLuan.length > 0 ? (<View><Text>{'(nhấn vào ảnh để xóa)'}</Text></View>) : (<View></View>)}
                </View>

                <View style={{alignItems: 'center', borderWidth: 0.3, borderRadius: 8}}>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={chonAnhBinhLuanTuCamera}>
                            <IconSymbol style={{marginLeft: 'auto'}} name="camera" size={30} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={chonAnhBinhLuanTuThuVien}>
                            <IconSymbol style={{marginLeft: 'auto'}} name="photo-album" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{marginTop: 5}}>{'Tải lên ảnh'}</Text>
                </View>
            </View>
            
            
            <View style={{height: 10}}></View>
            <TouchableOpacity style={{width: '100%', backgroundColor: 'green', alignItems: 'center', borderRadius: 8}} onPress={postBinhLuan}>
                <Text style={{color: 'white', fontSize: 20}}>{'Đăng bình luận'}</Text>
            </TouchableOpacity>
        </View>
    )
}

