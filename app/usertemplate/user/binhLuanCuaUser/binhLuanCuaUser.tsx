import { getUserLogin } from "@/app/Auth/Authentication";
import { LIMIT_BINHLUAN } from "@/app/constant/Limit";
import { paginate } from "@/app/helpers/LogicHelper/helper";
import BlurLine from "@/app/helpers/ViewHelpers/blurLine";
import AppUser from "@/app/model/AppUser";
import BinhLuan from "@/app/model/BinhLuan";
import AvatarSanPham from "@/app/sanPhamTemplate/avatarSanPham";
import AnhBinhLuan from "@/app/sanPhamTemplate/binhLuan/anhBinhLuan";
import XoaBinhLuan from "@/app/sanPhamTemplate/binhLuan/xoaBinhLuan";
import { url } from "@/app/server/backend";
import { laySoSaoCuaMotNguoiVoiMotSanPham } from "@/app/temp/tempSaoSanPhamCuaNguoiVoiSanPham";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const temp_ListBinhLuans: BinhLuan[] = [];

export default function BinhLuanCuaUser({userId} : {userId: string}) {
    const [listBinhLuans, setListBinhLuans] = useState<BinhLuan[]>([]);
    const [tongSoBinhLuan, setTongSoBinhLuan] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [userLogin, setUserLogin] = useState<AppUser | null>(null);
    const router = useRouter();

    const tongSoTrang : number = Math.ceil(tongSoBinhLuan / LIMIT_BINHLUAN);

    useEffect(() => {
        getUserLogin().then((userLogin) => {
            setUserLogin(userLogin);
        })
    }, [])

    useEffect(() => {
        layCacBinhLuans();
    }, [pageNumber])

    const layCacBinhLuans = async() => {
        const listBinhLuansCuaUserTrongTemp = temp_ListBinhLuans.filter((item) => {
            return item.bL_NguoiTao_Id === userId;
        }); 

        const listBinhLuansCuaUserTrongTempCanLay = paginate(listBinhLuansCuaUserTrongTemp, pageNumber, LIMIT_BINHLUAN);

        if (listBinhLuansCuaUserTrongTempCanLay.length < 1) {
            const uriListBinhLuan = url(`api/binhluan/user/${userId}?pageNumber=${pageNumber}&limit=${LIMIT_BINHLUAN}`);

            const response = await axios.get(uriListBinhLuan);

            if (response.data.listBinhLuans) {
                const listBinhLuans : BinhLuan[] = response.data.listBinhLuans;

                for (const binhLuan of listBinhLuans) {
                    if (response.data.tongSo) {
                        binhLuan.temp_tongSoBinhLuanCuaSP = response.data.tongSo;
                    }
                    try {
                        if (binhLuan.bL_NguoiTao_Client) {
                            const soSao = await laySoSaoCuaMotNguoiVoiMotSanPham(binhLuan.bL_SP_Id as string, binhLuan.bL_NguoiTao_Client.id);
                            binhLuan.bL_NguoiTao_Client.soSao = soSao;
                        }
                    }catch {}
                }
                setListBinhLuans(listBinhLuans);
                temp_ListBinhLuans.push(...listBinhLuans);
            }

            if (response.data.tongSo) {
                setTongSoBinhLuan(response.data.tongSo);
            }
        }else {
            for (const binhLuan of listBinhLuansCuaUserTrongTempCanLay) {
                try {
                    if (binhLuan.bL_NguoiTao_Client) {
                        const soSao = await laySoSaoCuaMotNguoiVoiMotSanPham(binhLuan.bL_SP_Id, binhLuan.bL_NguoiTao_Client.id);
                        binhLuan.bL_NguoiTao_Client.soSao = soSao;
                    }
                }catch {}
            }
            setListBinhLuans(listBinhLuansCuaUserTrongTempCanLay);
            setTongSoBinhLuan(listBinhLuansCuaUserTrongTempCanLay[0].temp_tongSoBinhLuanCuaUser);
        }
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
    return (
        <View>
            {listBinhLuans.length > 0 ? (
                <View>
                    <View>
                        {listBinhLuans.map((item: BinhLuan, key) => {
                            return (
                                <View key={key}>
                                        <View>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={{fontStyle: 'italic', fontSize: 10}}>{new Date(item.bL_NgayTao as Date).toLocaleString()}</Text>
                                                <View style={{flexDirection: 'row'}}>
                                                    {Array.from({length: 5}).map((_, index) => {
                                                        if (index + 1 <= (item.bL_NguoiTao_Client?.soSao as number)) {
                                                            return (
                                                                <IconSymbol key={index + key} name="star" size={20} color="#FFD700" />
                                                            )
                                                        }else {
                                                            return (
                                                                <IconSymbol key={index + key} name="star" size={20} color="grey" />
                                                            )
                                                        }
                                                    })}
                                                    <XoaBinhLuan userLogin={userLogin} binhLuan={item} layCacBinhLuans={layCacBinhLuans} width={'100%'}/>
                                                </View>
                                            </View>
                                            
                                            <Text style={{fontSize: 20}}>{item.bL_NoiDung}</Text>
                                            <AnhBinhLuan bL_Id={item.bL_Id as string}/>
                                        </View>
                                        <View style={styles.viewSanPham}>
                                                <TouchableOpacity style={styles.touchAvatarSanPham} onPress={() => router.push({pathname: '/sanPhamTemplate', params: {sP_MaTruyXuat: item.bL_SP?.sP_MaTruyXuat as string} })}>
                                                    <AvatarSanPham sP_Id={item.bL_SP_Id as string} width={50} height={50} marginBottom={undefined}/>
                                                    <View style={{marginLeft: 10}}>
                                                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>{item.bL_SP?.sP_Ten}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                        </View>
                                    <BlurLine />
                                </View>
                                
                            )
                        })}
                    </View>
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
                </View>
                
            ) :
            (<View></View>)}
            
        </View>
    )
}

const styles = StyleSheet.create({
    viewSanPham: {
        flex: 1, 
        margin: 5,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 10
    },
    touchAvatarSanPham: {
        width: '100%',
        height: 40, 
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row'
    },
    avatarSanPham: {
        width: 50,
        height: 50,
        borderRadius: 8
    }
});
