import BlurLine from "@/app/helpers/ViewHelpers/blurLine";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import AppUser from "@/app/model/AppUser";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChonSaoSanPham from "./chonSaoSanPham";
import XoaBinhLuan from "./xoaBinhLuan";
import AvatarUser from "@/app/usertemplate/avatarUser";
import AnhBinhLuan from "./anhBinhLuan";
import PostBinhLuan from "./postBinhLuan";
import { useRouter } from "expo-router";
import { LIMIT_BINHLUAN } from "@/app/constant/Limit";
import BinhLuan from "@/app/model/BinhLuan";
import { laySoSaoCuaMotNguoiVoiMotSanPham } from "@/app/temp/tempSaoSanPhamCuaNguoiVoiSanPham";

export default function BinhLuanSanPhan({sP_Id, userLogin} : {sP_Id : string, userLogin : AppUser | null}) {
    const [listBinhLuans, setListBinhLuans] = useState<BinhLuan[]>([]);
    const [tongSoBinhLuan, setTongSoBinhLuan] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [soSaoBinhLuan, setSoSaoBinhLuan] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
    const router = useRouter();

    const [forceReRender, setForceReRender] = useState<number>(0);

    const tongSoTrang : number = Math.ceil(tongSoBinhLuan / LIMIT_BINHLUAN);

    useEffect(() => {
        layCacBinhLuans();
    }, [pageNumber, soSaoBinhLuan, forceReRender]);

    const layCacBinhLuans = async () => {
        try {
            const urlBinhLuan = url(`api/binhluan/san-pham/${sP_Id}?&pageNumber=${pageNumber}&limit=${LIMIT_BINHLUAN}&soSao=${soSaoBinhLuan}`);
            const response = await axios.get(urlBinhLuan);

            if (response.data.listBinhLuans) {
                const listBinhLuans : BinhLuan[] = response.data.listBinhLuans;

                for (const binhLuan of listBinhLuans) {
                    if (response.data.tongSo) {
                        binhLuan.temp_tongSoBinhLuanCuaSP = response.data.tongSo;
                    }
                    try {
                        if (binhLuan.bL_NguoiTao_Client) {
                            const soSao = await laySoSaoCuaMotNguoiVoiMotSanPham(sP_Id, binhLuan.bL_NguoiTao_Client.id);
                            binhLuan.bL_NguoiTao_Client.soSao = soSao;
                        }
                    }catch {}
                }
                setListBinhLuans(listBinhLuans);
            }

            if (response.data.tongSo) {
                setTongSoBinhLuan(response.data.tongSo);
            }
        }catch {}
    }

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

    const reloadBinhLuans = () => {
        if (pageNumber !== 1) {
            setPageNumber(1);
        }else {
            setForceReRender(value => value + 1);
        }
    }

    return (
        <View>
            <Text style={{marginBottom: 20, fontWeight: 'bold', fontSize: 20}}>{'Đánh giá sản phẩm '}({tongSoBinhLuan})</Text>
            <View style={{alignItems: 'center', marginBottom: 10}}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.touchSaoBinhLuan} onPress={() => setSoSaoBinhLuan(0)}>
                        <Text style={{fontWeight: soSaoBinhLuan === 0 ? 'bold' : 'normal'}}>Tất cả</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchSaoBinhLuan} onPress={() => setSoSaoBinhLuan(5)}>
                        <Text style={{fontWeight: soSaoBinhLuan === 5 ? 'bold' : 'normal'}}>5 <IconSymbol name="star" size={20} color="#FFD700" /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchSaoBinhLuan} onPress={() => setSoSaoBinhLuan(4)}>
                        <Text style={{fontWeight: soSaoBinhLuan === 4 ? 'bold' : 'normal'}}>4 <IconSymbol name="star" size={20} color="#FFD700" /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchSaoBinhLuan} onPress={() => setSoSaoBinhLuan(3)}>
                        <Text style={{fontWeight: soSaoBinhLuan === 3 ? 'bold' : 'normal'}}>3 <IconSymbol name="star" size={20} color="#FFD700" /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchSaoBinhLuan} onPress={() => setSoSaoBinhLuan(2)}>
                        <Text style={{fontWeight: soSaoBinhLuan === 2 ? 'bold' : 'normal'}}>2 <IconSymbol name="star" size={20} color="#FFD700" /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchSaoBinhLuan} onPress={() => setSoSaoBinhLuan(1)}>
                        <Text style={{fontWeight: soSaoBinhLuan === 1 ? 'bold' : 'normal'}}>1 <IconSymbol name="star" size={20} color="#FFD700" /></Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            {listBinhLuans.map((item) => {
                return (
                    <View key={item.bL_Id}>
                        <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => router.push({pathname: '/usertemplate/user', params: {userId: item.bL_NguoiTao_Client?.id}})}>
                            <AvatarUser userId={item.bL_NguoiTao_Client?.id} width={40} height={40} canChange={false} />
                            <View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontWeight: 'bold'}}>{item.bL_NguoiTao_Client?.name}</Text>
                                    <XoaBinhLuan userLogin={userLogin} binhLuan={item} listBinhLuansHienThi={listBinhLuans} setTongSoBinhLuan={setTongSoBinhLuan} width={'100%'}/>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {Array.from({length: 5}).map((_, index) => {
                                        if (index + 1 <= (item.bL_NguoiTao_Client?.soSao as number)) {
                                            return (
                                                <IconSymbol key={index + '' + item.bL_Id} name="star" size={20} color="#FFD700" />
                                            )
                                        }else {
                                            return (
                                                <IconSymbol key={index + '' + item.bL_Id} name="star" size={20} color="grey" />
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
                    <ChonSaoSanPham sP_Id={sP_Id} userId={userLogin.id as string} />
                    <View style={{height: 10}}></View>
                    <PostBinhLuan sP_Id={sP_Id} reloadBinhLuans={reloadBinhLuans}/>
                </View>
            ) : (<View></View>)}
            <Spacer height={10}/>
        </View>
    )
}

const styles = StyleSheet.create({
    touchSaoBinhLuan: {
        borderWidth: 0.5,
        borderRadius: 8,
        marginLeft: 10
    }
})