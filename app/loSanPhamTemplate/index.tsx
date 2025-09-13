import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LIMIT_LO_SANPHAM } from "../constant/Limit";
import Header from "../helpers/ViewHelpers/header";
import LoSanPham from "../model/LoSanPham";
import { url } from "../server/backend";
import LoSanPhamRender from "./loSanPhamRender";
import Footer from "../helpers/ViewHelpers/footer";

export default function DanhSachLoSanPham() {
    const params = useLocalSearchParams();
    const sP_Id: string = params.sP_Id as string;
    const sP_Ten: string = params.sP_Ten as string;

    const [listLoSanPhams, setListLoSanPhams] = useState<LoSanPham[]>([]);
    const [tongSoLoSanPham, setTongSoLoSanPham] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const tongSoTrang : number = Math.ceil(tongSoLoSanPham / LIMIT_LO_SANPHAM);

    useEffect(() => {
        layListLoSanPham();
    }, [pageNumber]);

    const layListLoSanPham = async() => {
        const urlLoSanPham = url(`api/losanpham/san-pham/${sP_Id}?pageNumber=${pageNumber}&limit=${LIMIT_LO_SANPHAM}`);

        try {
            const res = await axios.get(urlLoSanPham);
            if (res.data.tongSo) {
                setTongSoLoSanPham(res.data.tongSo);
            }

            if (res.data.listLoSanPhams) {
                setListLoSanPhams(res.data.listLoSanPhams);
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

    
    return (
        <View style={styles.container}>
            <Header title={'Lô sản phẩm'} fontSize={20} resource={sP_Ten}/>
            <ScrollView style={{marginTop: 10}}>
                {listLoSanPhams.length > 0 
                ? listLoSanPhams.map((item, key) => {
                    return (
                        <LoSanPhamRender key={key} loSanPham={item}/>
                    )
                })
                : (<View></View>)}
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
            </ScrollView>
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