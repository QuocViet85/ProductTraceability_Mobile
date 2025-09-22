import { getUserLogin } from "@/app/Auth/Authentication";
import { formatCurrency } from "@/app/helpers/LogicHelper/helper";
import BlurLine from "@/app/helpers/ViewHelpers/blurLine";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import { Updating } from "@/app/helpers/ViewHelpers/updating";
import AppUser from "@/app/model/AppUser";
import SanPham from "@/app/model/SanPham";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Footer from "../helpers/ViewHelpers/footer";
import { url } from "../server/backend";
import AnhSanPham from "./anhSanPham";
import BinhLuanSanPhan from "./binhLuan/binhLuanSanPham";
import DoanhNghiepSanPham from "./doanhNghiepSanPham";
import MoTaSanPham from "./moTaSanPham";
import NguoiPhuTrach from "./nguoiPhuTrach";
import NhaMaySanPham from "./nhaMaySanPham";
import QrCode from "./qrCode";
import SaoSanPham from "./saoSanPham";
import WebsiteSanPham from "./websiteSanPham";
import SuaSanPham from "./thaoTacTheoAuth/suaSanPham";
import XoaSanPham from "./thaoTacTheoAuth/xoaSanPham";

export const temp_SanPham : SanPham[] = [];

export default function Index() {
    const params = useLocalSearchParams();
    const sP_MaTruyXuat = params.sP_MaTruyXuat;
    const [sanPham, setSanPham] = useState<SanPham | null>(null);
    const [userLogin, setUserLogin] = useState<AppUser | null>(null);
    const [reRenderSanPham, setReRenderSanPham] = useState<number>(0);

    const urlSanPham = url(`api/sanPham/ma-truy-xuat/${sP_MaTruyXuat}`);
  
    const router = useRouter();

    useEffect(() => {
        laySanPham();

        getUserLogin().then((userLogin : AppUser | null) => {
          if (userLogin) {
            setUserLogin(userLogin);
          }
        })
    }, [reRenderSanPham]);

    const laySanPham = async () => {
      try {
        const sanPhamInTemp = temp_SanPham.find((sanPham: SanPham) => {
          return sanPham.sP_MaTruyXuat === sP_MaTruyXuat;
        });

        if (!sanPhamInTemp) {
          const res = await axios.get(urlSanPham);
          if (res.data) {
            const sP: SanPham = res.data;
            setSanPham(sP);
            temp_SanPham.push(sP);
          }
        }else {
          setSanPham(sanPhamInTemp);
        }
      }catch {}
    }

    const shareSanPham = async () => {
      try {
        await Share.share({
          message: urlSanPham,
          url: urlSanPham,
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
                  <AnhSanPham sP_Id={sanPham.sP_Id ? sanPham.sP_Id : ''} dN_SoHuu_Id={sanPham.sP_DN_SoHuu_Id as string}/>
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
                <View style={{flexDirection: 'row'}}>
                    <QrCode urlSanPham={urlSanPham} />
                    <TouchableOpacity style={{borderWidth: 0.5, borderRadius: 8, backgroundColor: '#f2f2f2', paddingVertical: 10, alignItems: 'center', height: 40, marginLeft: 'auto'}}
                                      onPress={() => router.push({pathname: '/loSanPhamTemplate', params:{sP_Id: sanPham.sP_Id, sP_Ten: sanPham.sP_Ten, sP_MaTruyXuat: sanPham.sP_MaTruyXuat}})}>
                      <Text>{'Truy xuất sản phẩm'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 10}}></View>
                <View style={{flexDirection: 'row'}}>
                    <SuaSanPham sanPham={sanPham} setReRenderSanPham={setReRenderSanPham} width={40} height={30} paddingVertical={5} fontSize={12}/>
                    <View style={{width: 10}}></View>
                    <XoaSanPham sanPham={sanPham} setSanPham={setSanPham} width={40} height={30} paddingVertical={5} fontSize={12}/>
                </View>
                
                <BlurLine />
                  <SaoSanPham sP_Id={sanPham.sP_Id as string} />
                  <Spacer height= {10} />
                  <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_SoHuu} vaiTro={"sở hữu"} />
                  <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_SanXuat} vaiTro={"sản xuất"} />
                  <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_VanTai} vaiTro={"vận tải"} /> 
                  <NguoiPhuTrach userId={sanPham.sP_NguoiPhuTrach_Id as string} />
                  <NhaMaySanPham nhaMay={sanPham.sP_NM}/>
                  <MoTaSanPham moTa={sanPham.sP_MoTa as string}/>
                  <WebsiteSanPham sP_Website={sanPham.sP_Website} />
                  <BinhLuanSanPhan sP_Id={sanPham.sP_Id as string} userLogin={userLogin}/>
            </View>) 
            : (<View style={{backgroundColor: '#fff'}}>
                <Text>Không tồn tại sản phẩm</Text>
            </View>)}
        </ScrollView>
        <Footer backgroundColor={'black'} height={'6%'}/>
      </KeyboardAvoidingView>
    )
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