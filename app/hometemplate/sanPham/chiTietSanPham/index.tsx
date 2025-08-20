import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { url } from "../../../server/backend";
import AnhSanPham from "./anhSanPham";
import Spacer from "@/app/helpers/spacer";
import DoanhNghiepSanPham from "./doanhNghiepSanPham";

export default function Index() {
    const params = useLocalSearchParams();
    const sP_Id = params.sP_Id;
    const [sanPham, setSanPham] = useState<any>();
    

    useEffect(() => {
        let urlSanPham = url(`api/sanPham/${sP_Id}`)
        axios.get(urlSanPham).then((res: any) => {
            const sP = res.data;
            setSanPham(sP);
        })
    }, []);

    return (
        <View style={styles.container}>
            {sanPham ? 
            (<View>
                  <AnhSanPham sP_Id={sanPham.sP_Id ? sanPham.sP_Id : ''} />
                  <Spacer height= {10} />
                  <Text style={{fontWeight: 'bold', fontSize: 25}}>{sanPham.sP_Ten}</Text>
                  <Text style={{fontWeight: 'bold', color:'green'}}>{formatCurrency(sanPham.sP_Gia)}</Text>
                  <Spacer height= {10} />
                  <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_SoHuu} vaiTro={"sở hữu"} />
                  <Spacer height= {10} />
            </View>) 
            : (<View>
                <Text>Không tồn tại sản phẩm</Text>
            </View>)}
            
        </View>
    )
}

function formatCurrency(price: number) : string {
    const vnFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    });
    return vnFormatter.format(price);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                     // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  content: {
    marginTop: 60,
    width: '100%'
  },
});