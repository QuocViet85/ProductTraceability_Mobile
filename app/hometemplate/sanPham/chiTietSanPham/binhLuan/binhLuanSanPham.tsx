import BlurLine from "@/app/helpers/ViewHelpers/blurLine";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import AppUser from "@/app/model/AppUser";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import ChonSaoSanPham from "./chonSaoSanPham";
import XoaBinhLuan from "./xoaBinhLuan";
import AvatarUser from "@/app/usertemplate/avatarUser";
import AnhBinhLuan from "./anhBinhLuan";
import PostBinhLuan from "./postBinhLuan";
import { useRouter } from "expo-router";
import { LIMIT_BINHLUAN } from "@/app/constant/Limit";
import BinhLuan from "@/app/model/BinhLuan";

export default function BinhLuanSanPhan({sP_Id, userLogin} : {sP_Id : string, userLogin : AppUser | null}) {
    const [listBinhLuans, setListBinhLuans] = useState<BinhLuan[]>([]);
    const [tongSoBinhLuan, setTongSoBinhLuan] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const router = useRouter();

    const tongSoTrang : number = Math.ceil(tongSoBinhLuan / LIMIT_BINHLUAN);

    const layCacBinhLuans = async () => {
        try {
            const urlBinhLuan = url(`api/binhluan/san-pham/${sP_Id}?&pageNumber=${pageNumber}&limit=${LIMIT_BINHLUAN}`);
            const response = await axios.get(urlBinhLuan);

            if (response.data.listBinhLuans) {
                let listBinhLuans = response.data.listBinhLuans;

                for (const binhLuan of listBinhLuans) {
                    try {
                        const soSao = await laySoSaoCuaMotNguoi(sP_Id, binhLuan.bL_NguoiTao_Client.id);
                        binhLuan.bL_NguoiTao_Client.soSao = soSao;
                    }catch {}
                }
                setListBinhLuans(listBinhLuans);
            }
            
            if (response.data.tongSo) {
                setTongSoBinhLuan(response.data.tongSo);
            }
        }catch {}
    }
    
    const laySoSaoCuaMotNguoi = async (sP_Id : string, userId : string) : Promise<number> => {
        const urlSoSao = url(`api/sanpham/sao-san-pham-user/${sP_Id}?userId=${userId}`);

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

    return (
        <View>
            <Text style={{marginBottom: 20, fontWeight: 'bold', fontSize: 20}}>Đánh giá sản phẩm ({tongSoBinhLuan})</Text>
            {listBinhLuans.map((item, indexBig) => {
                return (
                    <View key={item.bL_SP_Id}>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => router.push({pathname: '/usertemplate/user', params: {userId: item.bL_NguoiTao_Client?.id}})}>
                            <AvatarUser userId={item.bL_NguoiTao_Client?.id} width={40} height={40} canChange={false} />
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontWeight: 'bold'}}>{item.bL_NguoiTao_Client?.name}</Text>
                                    <XoaBinhLuan userLogin={userLogin} binhLuan={item} layCacBinhLuans={layCacBinhLuans} width={'100%'}/>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {Array.from({length: 5}).map((_, index) => {
                                        if (index + 1 <= (item.bL_NguoiTao_Client?.soSao as number)) {
                                            return (
                                                <IconSymbol key={index + '' + indexBig} name="star" size={20} color="#FFD700" />
                                            )
                                        }else {
                                            return (
                                                <IconSymbol key={index + '' + indexBig} name="star" size={20} color="grey" />
                                            )
                                        }
                                    })}
                                    <Text style={{fontStyle: 'italic', fontSize: 10}}>{new Date(item.bL_NgayTao as Date).toLocaleString()}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text>{item.bL_NoiDung}</Text>
                        <AnhBinhLuan bL_Id={item.bL_Id as string}/>
                        <View style={{height: 10}}></View>
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