import getBearerToken from "@/app/helpers/LogicHelper/authHelper";
import { getFileAsync, getUriAvatarUser, getUriFile } from "@/app/helpers/LogicHelper/fileHelper";
import BlurLine from "@/app/helpers/ViewHelpers/blurLine";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import AppUser from "@/app/model/AppUser";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import ChonSaoSanPham from "./chonSaoSanPham";
import XoaBinhLuan from "./xoaBinhLuan";

export default function BinhLuanSanPhan({sP_Id, userLogin} : {sP_Id : string, userLogin : AppUser | null}) {
    const [listBinhLuans, setListBinhLuans] = useState<any[]>([]);
    const [tongSoBinhLuan, setTongSoBinhLuan] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [binhLuanPost, setBinhLuanPost] = useState<string>('');
    const [saoPost, setSaoPost] = useState<number>(0);

    const limit = 5;
    let tongSoTrang : number = Math.ceil(tongSoBinhLuan / limit);

    const layCacBinhLuans = () => {
        let urlBinhLuan = url(`api/binhluan/san-pham/${sP_Id}?pageNumber=${pageNumber}&limit=${limit}`);

        axios.get(urlBinhLuan).then((response) => {
            if (response.data.listBinhLuans) {
                let listBinhLuans = response.data.listBinhLuans;
                const listPromiseAnhDaiDienVaSoSao : any[] = []
                listBinhLuans.forEach((binhLuan : any) => {
                    binhLuan.bL_NguoiTao_Client.uriAnhDaiDien = null;
                    binhLuan.bL_NguoiTao_Client.soSao = 0;

                    let promiseAnhDaiDienBinhLuan = getUriAvatarUser(binhLuan.bL_NguoiTao_Client.id).then((uri) => {
                        if (uri) {
                            binhLuan.bL_NguoiTao_Client.uriAnhDaiDien = uri;
                        }
                    }).catch(() => {})

                    listPromiseAnhDaiDienVaSoSao.push(promiseAnhDaiDienBinhLuan);

                    let promiseSoSaoCuaNguoiBinhLuan = laySoSaoCuaMotNguoi(sP_Id, binhLuan.bL_NguoiTao_Client.id).then((soSao) => {
                        binhLuan.bL_NguoiTao_Client.soSao = soSao;
                    }).catch(() => {});

                listPromiseAnhDaiDienVaSoSao.push(promiseSoSaoCuaNguoiBinhLuan);
                })
                
                Promise.all(listPromiseAnhDaiDienVaSoSao).finally(() => {
                    setListBinhLuans(listBinhLuans);
                })
            }
            if (response.data.tongSo) {
                setTongSoBinhLuan(response.data.tongSo);
            }
        });
    }
    
    const laySoSaoCuaMotNguoi = async (sP_Id : string, userId : string) : Promise<number> => {
        let urlSoSao = url(`api/sanpham/sao-san-pham-user/${sP_Id}?userId=${userId}`);

        try {
            let soSao = (await axios.get(urlSoSao)).data;

            if (soSao) {
                return soSao;
            }
            return 0;
        }catch {
            return 0;
        }
    }

    useEffect(() => {
        layCacBinhLuans();
    }, [pageNumber])

    const backPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }

    const nextPage = () => {
        if (pageNumber < tongSoTrang) {
            setPageNumber(pageNumber + 1);
        }
    }

    const postBinhLuan = () => {
        if (binhLuanPost) {
            getBearerToken()
            .then((bearerToken : any) => {
                let urlPostBinhLuan = url('api/binhluan');
                axios.post(urlPostBinhLuan, {
                    bL_NoiDung: binhLuanPost,
                    bL_SP_Id: sP_Id
                }, {headers: {Authorization: bearerToken}})
                .then(() => {
                   layCacBinhLuans();
                })
            })
            .catch(() => Alert.alert('Lỗi', 'Lỗi đăng bình luận'))
        }else {
            Alert.alert('Lỗi', 'Chưa nhập bình luận');
        }
    }

    return (
        <View>
            <Text style={{marginBottom: 20, fontWeight: 'bold', fontSize: 20}}>Đánh giá sản phẩm ({tongSoBinhLuan})</Text>
            {listBinhLuans.map((item, indexBig) => {
                return (
                    <View key={item.sP_Id}>
                        <View style={{flexDirection: 'row'}}>
                            <Image
                                source={{ uri: item.bL_NguoiTao_Client.uriAnhDaiDien }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    borderWidth: 2,
                                    borderColor: '#007BFF',
                                    backgroundColor: '#ccc',
                                }}
                                />
                            <View>
                                <Text style={{fontWeight: 'bold'}}>{item.bL_NguoiTao_Client.name}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    {Array.from({length: 5}).map((_, index) => {
                                        if (index + 1 <= item.bL_NguoiTao_Client.soSao) {
                                            return (
                                                <IconSymbol key={index + '' + indexBig} name="star" size={20} color="#FFD700" />
                                            )
                                        }else {
                                            return (
                                                <IconSymbol key={index + '' + indexBig} name="star" size={20} color="grey" />
                                            )
                                        }
                                    })}
                                </View>
                                
                            </View>
                        </View>
                        <Text>{item.bL_NoiDung}</Text>
                        <Text style={{fontStyle: 'italic', fontSize: 10}}>{new Date(item.bL_NgayTao).toLocaleString()}</Text>
                        {userLogin ? (<XoaBinhLuan userLogin={userLogin} binhLuan={item}/>) : (<View></View>)}
                        <BlurLine />
                    </View>
                );
            })}
            <View style={{alignItems: 'center'}}>
                <Text>{pageNumber} / {tongSoTrang}</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={backPage}>
                        <Ionicons name="arrow-back" size={32} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextPage}>
                        <Ionicons name="arrow-forward" size={32} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            {userLogin ? (
                <View>
                    <View style={{height: 10}}></View>
                    <ChonSaoSanPham sP_Id={sP_Id} userId={userLogin.id as string} laySoSaoCuaMotNguoi={laySoSaoCuaMotNguoi}/>
                    <View style={{height: 10}}></View>
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
                            value={binhLuanPost}
                            onChangeText={setBinhLuanPost}
                            multiline={true}     // Cho phép nhiều dòng
                            numberOfLines={3}    // Gợi ý chiều cao ban đầu
                            textAlignVertical="top" // Cho chữ căn từ trên xuống (Android)
                            maxLength={1000}
                            />
                        <TouchableOpacity onPress={postBinhLuan}>
                            <Ionicons style={{marginLeft: 'auto'}} name="arrow-forward-circle-outline" size={50} color="blue" />
                        </TouchableOpacity>
                     </View>
                </View>
                
                    
            ) : (<View></View>)}
            <Spacer height={10}/>
        </View>
    )
}