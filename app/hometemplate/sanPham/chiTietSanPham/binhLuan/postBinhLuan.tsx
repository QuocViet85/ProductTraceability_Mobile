import getBearerToken from "@/app/helpers/LogicHelper/authHelper";
import { getUriImagesFromCamera, getUriImagesPickInDevice } from "@/app/helpers/LogicHelper/fileHelper";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PostBinhLuan({sP_Id, layCacBinhLuans}: {sP_Id: string, layCacBinhLuans: () => void}) {
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
                await axios.post(urlPostBinhLuan, formData, {headers: {
                    Authorization: bearerToken,
                    "Content-Type": 'multipart/form-data'
                }})

                setNoiDungBinhLuan('');
                layCacBinhLuans();
                setListUriAnhBinhLuan([]);
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
            <View style={{flexDirection: 'row'}}>
                <TextInput
                    style={{
                            height: 120,
                            borderColor: "gray",
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 8,
                            width: '85%'}}
                    placeholder="Nhập bình luận..."
                    value={noiDungBinhLuan}
                    onChangeText={setNoiDungBinhLuan}
                    multiline={true}     // Cho phép nhiều dòng
                    numberOfLines={3}    // Gợi ý chiều cao ban đầu
                    textAlignVertical="top" // Cho chữ căn từ trên xuống (Android)
                    maxLength={1000}
                    />
                <View>
                    <TouchableOpacity onPress={chonAnhBinhLuanTuCamera}>
                        <IconSymbol style={{marginLeft: 'auto'}} name="camera" size={50} color="blue" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={chonAnhBinhLuanTuThuVien}>
                        <IconSymbol style={{marginLeft: 'auto'}} name="photo-album" size={50} color="blue" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={postBinhLuan}>
                        <Ionicons style={{marginLeft: 'auto'}} name="arrow-forward-circle-outline" size={50} color="blue" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {listUriAnhBinhLuan.map((item, key) => {
                    return (
                            <TouchableOpacity key={key} onPress={() => huyAnhBinhLuan(item)}>
                                <Image key={key} source={{ uri: item }} style={{width: 80, height: 80, marginRight: 10}} />
                            </TouchableOpacity>
                    )
                })}
                </ScrollView>
                {listUriAnhBinhLuan.length > 0 ? (<View><Text>{'(nhấn vào ảnh để xóa)'}</Text></View>) : (<View></View>)}
            </View>
        </View>
        
    )
}

