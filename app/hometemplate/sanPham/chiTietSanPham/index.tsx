import BlurLine from "@/app/helpers/ViewHelpers/blurLine";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import { Updating } from "@/app/helpers/ViewHelpers/updating";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { url } from "../../../server/backend";
import AnhSanPham from "./anhSanPham";
import BinhLuanSanPhan from "./binhLuan/binhLuanSanPham";
import DoanhNghiepSanPham from "./doanhNghiepSanPham";
import MoTaSanPham from "./moTaSanPham";
import NguoiPhuTrach from "./nguoiPhuTrach";
import SaoSanPham from "./saoSanPham";
import AppUser from "@/app/model/AppUser";
import { getUserLogin } from "@/app/helpers/LogicHelper/authHelper";

export default function Index() {
    const params = useLocalSearchParams();
    const sP_MaTruyXuat = params.sP_MaTruyXuat;
    const [sanPham, setSanPham] = useState<any>();
    const [uriSanPham, setUriSanPham] = useState<string>('');
    const [userLogin, setUserLogin] = useState<AppUser | null>(null);
    

    useEffect(() => {
        let urlSanPham = url(`api/sanPham/ma-truy-xuat/${sP_MaTruyXuat}`);
        axios.get(urlSanPham).then((res: any) => {
            const sP = res.data;
            setSanPham(sP);
            setUriSanPham(urlSanPham);
        })

        getUserLogin().then((userLogin : AppUser | null) => {
          if (userLogin) {
            setUserLogin(userLogin);
          }
        })
    }, []);

    const shareSanPham = async () => {
      try {
        await Share.share({
          message: uriSanPham,
          url: uriSanPham,
        });
      }catch {}
    }

    return (
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "position" : "position"}
        >
          <ScrollView style={{backgroundColor: '#fff'}} contentContainerStyle={styles.container}>
            {sanPham ? 
            (<View style={{flex: 1}}>
                  <AnhSanPham sP_Id={sanPham.sP_Id ? sanPham.sP_Id : ''} />
                  <Spacer height= {10} />
                  <View style={{flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>{sanPham.sP_Ten}</Text>
                        <TouchableOpacity style={{marginLeft: 'auto'}} onPress={() => shareSanPham()}>
                            <IconSymbol name="share" size={30} color="#007AFF" />
                        </TouchableOpacity>
                  </View>
                  
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
                  <BinhLuanSanPhan sP_Id={sanPham.sP_Id} userLogin={userLogin}/>

                  <Spacer height={40}/>
            </View>) 
            : (<View>
                <Text>Không tồn tại sản phẩm</Text>
            </View>)}
        </ScrollView>
      </KeyboardAvoidingView>
    )
}

Index.options = {
  headerShown: false
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