import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { url } from "../../../server/backend";
import AnhSanPham from "./anhSanPham";
import Spacer from "@/app/helpers/spacer";
import DoanhNghiepSanPham from "./doanhNghiepSanPham";
import NguoiPhuTrach from "./nguoiPhuTrach";
import { Updating } from "@/app/helpers/updating";
import BlurLine from "@/app/helpers/blurLine";
import SaoSanPham from "./saoSanPham";
import MoTaSanPham from "./moTaSanPham";
import BinhLuanSanPhan from "./binhLuanSanPham";

export default function Index() {
    const params = useLocalSearchParams();
    const sP_Id = params.sP_Id;
    const [sanPham, setSanPham] = useState<any>();
    

    useEffect(() => {
        let urlSanPham = url(`api/sanPham/${sP_Id}`);
        console.log(urlSanPham)
        axios.get(urlSanPham).then((res: any) => {
            const sP = res.data;
            setSanPham(sP);
        })
    }, []);

    return (
      <View>
          <ScrollView style={{backgroundColor: '#fff'}} contentContainerStyle={styles.container}>
            {sanPham ? 
            (<View style={{flex: 1}}>
                  <AnhSanPham sP_Id={sanPham.sP_Id ? sanPham.sP_Id : ''} />
                  <Spacer height= {10} />
                  <Text style={{fontWeight: 'bold', fontSize: 25}}>{sanPham.sP_Ten}</Text>
                  {sanPham.sP_Gia ? (<Text style={styles.textGia}>Giá: {formatCurrency(sanPham.sP_Gia)}</Text>) : (
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textGia}>Giá: <Updating /></Text> 
                </View>)}
                <Text style = {{fontSize: 15}}>Mã vạch: 
                    {sanPham.sP_MaVach ? sanPham.sP_MaVach : (<Updating />)}
                </Text>
                <BlurLine />
                  <SaoSanPham sP_Id={sanPham.sP_Id} />
                  <Spacer height= {10} />
                  <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_SoHuu} vaiTro={"sở hữu"} />
                  <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_SanXuat} vaiTro={"sản xuất"} />
                  <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_VanTai} vaiTro={"vận tải"} /> 
                  <NguoiPhuTrach userId={sanPham.sP_NguoiPhuTrach_Id} />
                  <MoTaSanPham moTa={sanPham.sP_MoTa}/>
                  <BinhLuanSanPhan sP_Id={sanPham.sP_Id}/>

                  <Spacer height={40}/>
            </View>) 
            : (<View>
                <Text>Không tồn tại sản phẩm</Text>
            </View>)}
        </ScrollView>
        
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
  container: {                 // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    backgroundColor: '#fff',
    width: '100%'
  },
  content: {
    marginTop: 60,
    width: '100%'
  },
  textGia: {
    fontWeight: 'bold', 
    color:'green',
    fontSize: 25
  }
});