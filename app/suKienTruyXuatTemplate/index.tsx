import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import SuKienTruyXuat from "../model/SuKienTruyXuat";
import { url } from "../server/backend";
import { LIMIT_SU_KIEN_TRUY_XUAT } from "../constant/Limit";
import axios from "axios";
import LoSanPham from "../model/LoSanPham";
import { getUriAvatarSanPham } from "../helpers/LogicHelper/fileHelper";
import Loading from "../helpers/ViewHelpers/loading";
import Footer from "../helpers/ViewHelpers/footer";
import SuKienTruyXuatRender from "./suKienTruyXuatRender";
import Header from "@/app/helpers/ViewHelpers/header";
import { paginate } from "../helpers/LogicHelper/helper";
import ThemSuKienTruyXuat from "./thaoTacTheoAuth/themSuKienTruyXuat";
import BlurLine from "../helpers/ViewHelpers/blurLine";
import { PADDING_DEFAULT } from "../constant/Style";

export const temp_ListSuKienTruyXuats: SuKienTruyXuat[] = []; 

export default function DanhSachSuKienTruyXuat() {
    const params = useLocalSearchParams();
    const sP_Id = params.sP_Id;
    const sP_Ten = params.sP_Ten;
    const sP_MaTruyXuat = params.sP_MaTruyXuat;
    const sP_DN_SoHuu_Id = params.sP_DN_SoHuu_Id;

    const [listSuKiens, setListSuKiens] = useState<SuKienTruyXuat[]>([]);
    const [tongSoSuKiens, setTongSoSuKiens] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [reRender, setReRender] = useState<number>(0);

    useEffect(() => {
        layCacSuKiens();
    },[pageNumber]);

    const layCacSuKiens = async() => {
        setLoading(true);

        const newListSuKiens = [];

        const listSuKiensTrongTemp = temp_ListSuKienTruyXuats.filter((item) => {
            return item.sK_SP_Id === sP_Id;
        });

        const listSuKiensTrongTempCanLay = paginate(listSuKiensTrongTemp, pageNumber, LIMIT_SU_KIEN_TRUY_XUAT) as SuKienTruyXuat[];

        if (listSuKiensTrongTempCanLay.length < 1) {
            const urlSuKien = url(`api/sukientruyxuat/san-pham/${sP_Id}?pageNumber=${pageNumber}&limit=${LIMIT_SU_KIEN_TRUY_XUAT}`);
            try {
                const res = await axios.get(urlSuKien);

                if (res.data.tongSo) {
                    setTongSoSuKiens(res.data.tongSo);
                }

                if (res.data.listSuKienTruyXuats) {
                    const listSuKiensTuBackEnd: SuKienTruyXuat[] = res.data.listSuKienTruyXuats;

                    for (const suKien of listSuKiensTuBackEnd) {
                        suKien.sK_SP = {
                                sP_Id: sP_Id as string,
                                sP_Ten: sP_Ten as string,
                                sP_MaTruyXuat: sP_MaTruyXuat as string,
                                sP_UriAvatar: await getUriAvatarSanPham(sP_Id as string) 
                        };

                        suKien.temp_TongSoVoiSanPham = res.data.tongSo ? res.data.tongSo : 0;
                        suKien.sK_DoanhNghiepSoHuu_Id = sP_DN_SoHuu_Id as string;
                    }

                    temp_ListSuKienTruyXuats.push(...listSuKiensTuBackEnd); //không phải màn hình chính thì cache

                    if (pageNumber > 1) {
                        newListSuKiens.push(...listSuKiens, ...listSuKiensTuBackEnd);
                    }else {
                        newListSuKiens.push(...listSuKiensTuBackEnd);
                    }
                    setListSuKiens(newListSuKiens);
                    setLoading(false);
                }
            }catch {}

        }else {
            if (pageNumber > 1) {
                newListSuKiens.push(...listSuKiens, ...listSuKiensTrongTempCanLay);
            }else {
                newListSuKiens.push(...listSuKiensTrongTempCanLay);
            }
            setListSuKiens(newListSuKiens);
            setTongSoSuKiens(temp_ListSuKienTruyXuats[0].temp_TongSoVoiSanPham);
            setLoading(false);
            return;
        }
    }

    const tongSoTrang : number = Math.ceil(tongSoSuKiens / LIMIT_SU_KIEN_TRUY_XUAT);

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        setPageNumber(pageNumber + 1);
      }
    };

    const layListSuKiensTuDau = async() => {
        temp_ListSuKienTruyXuats.forEach((item: SuKienTruyXuat, key: number) => {
            if (item.sK_SP_Id === sP_Id) {
                temp_ListSuKienTruyXuats[key] = new SuKienTruyXuat();
            }
        })
        if (pageNumber !== 1) {
            setPageNumber(1)
        }else {
            layCacSuKiens();
        }
    }

    return (
        <View style={styles.container}>
            <Header title={'Nhật ký truy xuất của sản phẩm'} fontSize={20} resource={sP_Ten as string}></Header>
            <View style={{flex: 1, padding: PADDING_DEFAULT}}>
                <View style={{marginTop: 10}}>
                    <ThemSuKienTruyXuat sanPhamId={sP_Id as string} doanhNghiepSoHuuId={sP_DN_SoHuu_Id as string} listSuKiensHienThi={listSuKiens} setTongSoSuKiens={setTongSoSuKiens} setReRenderSuKien={setReRender} width={250} height={30} paddingVertical={5} fontSize={12}/>
                </View>
                <BlurLine />
                <FlatList
                    data={listSuKiens}
                    keyExtractor={(item: SuKienTruyXuat, index) => item.sK_Id as string + '-' + index}
                    renderItem={({item}: {item: SuKienTruyXuat}) => {
                        return (
                            <SuKienTruyXuatRender suKien={item} listSuKiensHienThi={listSuKiens} pageNumber={pageNumber} setTongSoSuKiens={setTongSoSuKiens} setReRenderSuKien={setReRender}/>
                        )
                    }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0}
                    refreshControl={(
                                    <RefreshControl  
                                    refreshing={false}
                                    onRefresh={layListSuKiensTuDau} //hành vi khi refresh
                                    progressViewOffset={30}/> //kéo mũi tên xuống bao nhiêu thì refresh
                                    )}
                    />
                    {loading ? (<Loading />) : (<View></View>)}
            </View>
            <Footer backgroundColor={'black'} height={'6%'}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,                     // cho phép chiếm toàn màn hình
        flexDirection: 'column',     // mặc định
        justifyContent: 'flex-start',// bắt đầu từ trên xuống
        backgroundColor: '#fff',
        height: '100%'
  },
})