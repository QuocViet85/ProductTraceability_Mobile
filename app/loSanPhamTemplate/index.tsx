import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LIMIT_LO_SANPHAM } from "../constant/Limit";
import Header from "../helpers/ViewHelpers/header";
import LoSanPham from "../model/LoSanPham";
import { url } from "../server/backend";
import LoSanPhamRender from "./loSanPhamRender";
import Footer from "../helpers/ViewHelpers/footer";
import Loading from "../helpers/ViewHelpers/loading";

export default function DanhSachLoSanPham() {
    const params = useLocalSearchParams();
    const sP_Id: string = params.sP_Id as string;
    const sP_Ten: string = params.sP_Ten as string;
    const sP_MaTruyXuat: string = params.sP_MaTruyXuat as string;

    const [listLoSanPhams, setListLoSanPhams] = useState<LoSanPham[]>([]);
    const [tongSoLoSanPham, setTongSoLoSanPham] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const tongSoTrang : number = Math.ceil(tongSoLoSanPham / LIMIT_LO_SANPHAM);

    useEffect(() => {
        layListLoSanPham();
    }, [pageNumber]);

    const layListLoSanPham = async() => {
        setLoading(true);
        const urlLoSanPham = url(`api/losanpham/san-pham/${sP_Id}?pageNumber=${pageNumber}&limit=${LIMIT_LO_SANPHAM}`);

        try {
            const res = await axios.get(urlLoSanPham);
            if (res.data.tongSo) {
                setTongSoLoSanPham(res.data.tongSo);
            }

            if (res.data.listLoSanPhams) {
                const listLoSanPhamsTuBackEnd = res.data.listLoSanPhams;

                const newListLoSanPhams = [];

                if (pageNumber > 1) {
                    newListLoSanPhams.push(...listLoSanPhams, ...listLoSanPhamsTuBackEnd);
                }else {
                    newListLoSanPhams.push(...listLoSanPhamsTuBackEnd);
                }
                setListLoSanPhams(newListLoSanPhams);
            }
            setLoading(false);
        }catch {}
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
                keyExtractor={(item: LoSanPham) => item.lsP_Id as string}
                renderItem={({item}: {item: LoSanPham}) => {
                    return (
                        <LoSanPhamRender loSanPham={item} sP_Id={sP_Id} sP_Ten={sP_Ten} sP_MaTruyXuat={sP_MaTruyXuat} />
                    )
                }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0}
                />
            {loading ? (<Loading />) : (<View></View>)}
            <Footer backgroundColor={'black'}/>
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