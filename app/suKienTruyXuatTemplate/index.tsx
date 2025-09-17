import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
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

export default function DanhSachSuKienTruyXuat() {
    const params = useLocalSearchParams();
    const lsP_Id = params.lsP_Id;
    const lsP_MaLSP = params.lsP_MaLSP;
    const sP_Id = params.sP_Id;
    const sP_Ten = params.nM_Ten;
    const sP_MaTruyXuat = params.sP_MaTruyXuat;

    const [listSuKiens, setListSuKiens] = useState<SuKienTruyXuat[]>([]);
    const [tongSoSuKiens, setTongSoSuKiens] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const isNotMainScreen = () => {
      return lsP_Id;
    }

    const layCacSuKiens = async() => {
        setLoading(true);
        let urlSuKien = url('api/sukientruyxuat');

        if (isNotMainScreen()) {
            urlSuKien +=`/lo-san-pham/${lsP_Id}`;
        }

        urlSuKien += `?pageNumber=${pageNumber}&limit=${LIMIT_SU_KIEN_TRUY_XUAT}`;

        try {
            const res = await axios.get(urlSuKien);

            if (res.data.listSuKienTruyXuats) {
                const listSuKiensTuBackEnd: SuKienTruyXuat[] = res.data.listSuKienTruyXuats;

                for (const suKien of listSuKiensTuBackEnd) {
                    if (isNotMainScreen()) {
                        suKien.sK_LSP = {
                            lsP_Id: lsP_Id,
                            lsP_MaLSP: lsP_MaLSP,
                            lsP_SP: {
                                sP_Id: sP_Id,
                                sP_Ten: sP_Ten,
                                sP_MaTruyXuat: sP_MaTruyXuat,
                                sP_UriAvatar: await getUriAvatarSanPham(sP_Id as string)
                            }
                        } as LoSanPham;
                    }else {
                        if (suKien.sK_LSP?.lsP_SP) {
                            suKien.sK_LSP.lsP_SP.sP_UriAvatar = (await getUriAvatarSanPham(suKien.sK_LSP.lsP_SP.sP_Id)) as string;
                        }
                    }
                }

                const newListSuKiens = [];
                if (pageNumber > 1) {
                    newListSuKiens.push(...listSuKiens, ...listSuKiensTuBackEnd);
                }else {
                    newListSuKiens.push(...listSuKiensTuBackEnd);
                }

                setListSuKiens(newListSuKiens);
                setLoading(false);
            }

            if (res.data.tongSo) {
                setTongSoSuKiens(res.data.tongSo);
            }
        }catch {}
    }

    useEffect(() => {
        layCacSuKiens();
    },[pageNumber])

    const tongSoTrang : number = Math.ceil(tongSoSuKiens / LIMIT_SU_KIEN_TRUY_XUAT);

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        setPageNumber(pageNumber + 1);
      }
    };

    return (
        <View style={styles.container}>
            <Header title={('Nhật ký truy xuất' + (isNotMainScreen() ? ' của lô sản phẩm' :  '')) as string} fontSize={isNotMainScreen() ? 20 : 30} resource={(isNotMainScreen() ? lsP_MaLSP : '') as string | undefined | null}></Header>
            <FlatList
                data={listSuKiens}
                keyExtractor={(item: SuKienTruyXuat) => item.sK_Id as string}
                renderItem={({item}: {item: SuKienTruyXuat}) => {
                    return (
                        <SuKienTruyXuatRender suKien={item} isNotMainScreen={isNotMainScreen}/>
                    )
                }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0}
                />
                {loading ? (<Loading />) : (<View></View>)}
                {isNotMainScreen() ? (<Footer backgroundColor={'black'} height={'6%'}/>) : (<View></View>)}
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