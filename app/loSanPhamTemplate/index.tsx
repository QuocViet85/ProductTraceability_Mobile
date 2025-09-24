import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { LIMIT_LO_SANPHAM } from "../constant/Limit";
import Header from "../helpers/ViewHelpers/header";
import LoSanPham from "../model/LoSanPham";
import { url } from "../server/backend";
import LoSanPhamRender from "./loSanPhamRender";
import Footer from "../helpers/ViewHelpers/footer";
import Loading from "../helpers/ViewHelpers/loading";
import { paginate } from "../helpers/LogicHelper/helper";

export const temp_ListLoSanPhams : LoSanPham[] = [];

export default function DanhSachLoSanPham() {
    const params = useLocalSearchParams();
    const sP_Id: string = params.sP_Id as string;
    const sP_Ten: string = params.sP_Ten as string;
    const sP_MaTruyXuat: string = params.sP_MaTruyXuat as string;

    const [listLoSanPhams, setListLoSanPhams] = useState<LoSanPham[]>([]);
    const [tongSoLoSanPham, setTongSoLoSanPham] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [reRender, setReRender] = useState<number>(0);

    const tongSoTrang : number = Math.ceil(tongSoLoSanPham / LIMIT_LO_SANPHAM);

    useEffect(() => {
        layListLoSanPham();
    }, [pageNumber]);

    useEffect(() => {
        setPageNumber(1);
    }, [reRender])

    const layListLoSanPham = async() => {
        setLoading(true);

        const listLoSanPhamsTrongTemp = temp_ListLoSanPhams.filter((item) => {
            return item.lsP_SP_Id === sP_Id;
        });

        const listLoSanPhamsTrongTempCanLay = paginate(listLoSanPhamsTrongTemp, pageNumber, LIMIT_LO_SANPHAM) as LoSanPham[];

        const newListLoSanPhams = [];

        if (listLoSanPhamsTrongTempCanLay.length < 1) {
            const urlLoSanPham = url(`api/losanpham/san-pham/${sP_Id}?pageNumber=${pageNumber}&limit=${LIMIT_LO_SANPHAM}`);

            try {
                const res = await axios.get(urlLoSanPham);
                if (res.data.tongSo) {
                    setTongSoLoSanPham(res.data.tongSo);
                }   

                if (res.data.listLoSanPhams) {
                    const listLoSanPhamsTuBackEnd : LoSanPham[] = res.data.listLoSanPhams;

                    if (pageNumber > 1) {
                        newListLoSanPhams.push(...listLoSanPhams, ...listLoSanPhamsTuBackEnd);
                    }else {
                        newListLoSanPhams.push(...listLoSanPhamsTuBackEnd);
                    }
                    setListLoSanPhams(newListLoSanPhams);
                    temp_ListLoSanPhams.push(...listLoSanPhamsTuBackEnd);

                    for (const loSanPham of listLoSanPhamsTuBackEnd) {
                        try {
                            const doanhNghiepSoHuuId = (await axios.get(url(`api/losanpham/doanh-nghiep-so-huu-id/${loSanPham.lsP_Id}`))).data;
                            loSanPham.lsp_DoanhNghiepSoHuu_Id = doanhNghiepSoHuuId;
                        }catch {}
                        loSanPham.temp_TongSoVoiSanPham = res.data.tongSo ? res.data.tongSo : 0;
                    }
                }
            }catch {}
        }else {
            if (pageNumber > 1) {
                newListLoSanPhams.push(...listLoSanPhams, ...listLoSanPhamsTrongTempCanLay);
            }else {
                newListLoSanPhams.push(...listLoSanPhamsTrongTempCanLay);
            }
            setListLoSanPhams(newListLoSanPhams);
            setTongSoLoSanPham(temp_ListLoSanPhams[0].temp_TongSoVoiSanPham);
        }
        setLoading(false);
    }

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        setPageNumber(pageNumber + 1);
      }
    };

    
    return (
        <View style={styles.container}>
            <Header title={'Lô sản phẩm'} fontSize={20} resource={sP_Ten}/>
            <FlatList
                data={listLoSanPhams}
                keyExtractor={(item: LoSanPham, index) => `${item.lsP_Id}-${index}`}
                renderItem={({item}: {item: LoSanPham}) => {
                    return (
                        <LoSanPhamRender loSanPham={item} sP_Id={sP_Id} sP_Ten={sP_Ten} sP_MaTruyXuat={sP_MaTruyXuat} setReRenderLoSanPham={setReRender}/>
                    )
                }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0}
                />
            {loading ? (<Loading />) : (<View></View>)}
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