import getBearerToken from "@/app/helpers/LogicHelper/authHelper";
import { getUriAvatarUser } from "@/app/helpers/LogicHelper/fileHelper";
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
import AvatarUser from "@/app/usertemplate/avatarUser";
import { SAN_PHAM } from "@/app/constant/KieuTaiNguyen";
import AnhBinhLuan from "./anhBinhLuan";
import PostBinhLuan from "./postBinhLuan";

export default function BinhLuanSanPhan({sP_Id, userLogin} : {sP_Id : string, userLogin : AppUser | null}) {
    const [listBinhLuans, setListBinhLuans] = useState<any[]>([]);
    const [tongSoBinhLuan, setTongSoBinhLuan] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [binhLuanPost, setBinhLuanPost] = useState<string>('');

    const limit = 5;
    let tongSoTrang : number = Math.ceil(tongSoBinhLuan / limit);

    const layCacBinhLuans = () => {
        const urlBinhLuan = url(`api/binhluan?kieuTaiNguyen=${SAN_PHAM}&taiNguyenId=${sP_Id}&pageNumber=${pageNumber}&limit=${limit}`);

        axios.get(urlBinhLuan).then((response) => {
            if (response.data.listBinhLuans) {
                let listBinhLuans = response.data.listBinhLuans;
                const listPromiseSoSao : any[] = []
                listBinhLuans.forEach((binhLuan : any) => {
                    let promiseSoSaoCuaNguoiBinhLuan = laySoSaoCuaMotNguoi(sP_Id, binhLuan.bL_NguoiTao_Client.id).then((soSao) => {
                        binhLuan.bL_NguoiTao_Client.soSao = soSao;
                    }).catch(() => {});

                listPromiseSoSao.push(promiseSoSaoCuaNguoiBinhLuan);
                })
                
                Promise.all(listPromiseSoSao).finally(() => {
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
                const urlPostBinhLuan = url(`api/sanpham/binh-luan/${sP_Id}`);
                axios.post(urlPostBinhLuan, {
                    bL_NoiDung: binhLuanPost,
                    bL_SP_Id: sP_Id
                }, {headers: {Authorization: bearerToken}})
                .then(() => {
                    setBinhLuanPost('');
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
                    <View key={item.bL_SP_Id}>
                        <View style={{flexDirection: 'row'}}>
                            <AvatarUser userId={item.bL_NguoiTao_Client.id} width={40} height={40} canChange={false} />
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
                        <AnhBinhLuan bL_Id={item.bL_Id}/>
                        <Text style={{fontStyle: 'italic', fontSize: 10}}>{new Date(item.bL_NgayTao).toLocaleString()}</Text>
                        {userLogin ? (<XoaBinhLuan userLogin={userLogin} binhLuan={item} layCacBinhLuans={layCacBinhLuans}/>) : (<View></View>)}
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
                    <PostBinhLuan sP_Id={sP_Id} layCacBinhLuans={layCacBinhLuans}/>
                </View>
            ) : (<View></View>)}
            <Spacer height={10}/>
        </View>
    )
}