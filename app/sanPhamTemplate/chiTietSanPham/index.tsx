import { getUserLogin } from "@/app/Auth/Authentication";
import { formatCurrency, getWidthScreen } from "@/app/helpers/LogicHelper/helper";
import BlurLine from "@/app/helpers/ViewHelpers/blurLine";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import { Updating } from "@/app/helpers/ViewHelpers/updating";
import AppUser from "@/app/model/AppUser";
import SanPham from "@/app/model/SanPham";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HEIGHT_SMARTPHONE } from "../../constant/SizeScreen";
import Footer from "../../helpers/ViewHelpers/footer";
import { url } from "../../server/backend";
import AnhSanPham from "./anhSanPham";
import BinhLuanSanPhan from "./binhLuan/binhLuanSanPham";
import DoanhNghiepSanPham from "./doanhNghiepSanPham";
import MoTaSanPham from "./moTaSanPham";
import NhaMaySanPham from "./nhaMaySanPham";
import QrCode from "./qrCode";
import SaoSanPham from "./saoSanPham";
import SuaSanPham from "./thaoTacTheoAuth/suaSanPham";
import XoaSanPham from "./thaoTacTheoAuth/xoaSanPham";
import WebsiteSanPham from "./websiteSanPham";
import { PADDING_DEFAULT } from "@/app/constant/Style";
import SanPhamsCungDanhMuc from "./sanPhamsCungDanhMuc";
import SanPhamsCungDoanhNghiepSoHuu from "./sanPhamsCungDoanhNghiepSoHuu";
import MaVach from "./maVach";

export const temp_SanPham : SanPham[] = [];

export default function Index() {
    const params = useLocalSearchParams();
    const sP_MaTruyXuat = params.sP_MaTruyXuat;
    const sP_MaVach = params.sP_MaVach;
    const [sanPham, setSanPham] = useState<SanPham | null>(null);
    const [userLogin, setUserLogin] = useState<AppUser | null>(null);
    const [reRenderSanPham, setReRenderSanPham] = useState<number>(0);

    let urlSanPham : string = url(`api/sanPham`);

    if (sP_MaTruyXuat) {
      urlSanPham += `/ma-truy-xuat/${sP_MaTruyXuat}`;
    }else if (sP_MaVach) {
      urlSanPham += `/ma-vach/${sP_MaVach}`
    }else {
      urlSanPham = '';
    }
  
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
          return sanPham.sP_MaTruyXuat === sP_MaTruyXuat || (sP_MaVach && sanPham.sP_MaVach === sP_MaVach);
        });

        if (!sanPhamInTemp) {
          if (urlSanPham) {
            const res = await axios.get(urlSanPham);
            if (res.data) {
              const sP: SanPham = res.data;
              setSanPham(sP);
              temp_SanPham.push(sP);
            }
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

    const refreshSanPham = async() => {
      const indexSanPhamInTemp = temp_SanPham.findIndex((sanPham: SanPham) => {
          return sanPham.sP_MaTruyXuat === sP_MaTruyXuat || (sP_MaVach && sanPham.sP_MaVach === sP_MaVach);
      });

      if (indexSanPhamInTemp !== -1) {
        temp_SanPham.splice(indexSanPhamInTemp, 1);
      }

      setReRenderSanPham((value: number) => value + 1);
    }

    return (
      <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: 'white' }}
          behavior={'height'}
        >
          <ScrollView 
          style={{backgroundColor: '#fff'}} 
          contentContainerStyle={styles.container} 
          refreshControl={(
                            <RefreshControl 
                              refreshing={false}
                              onRefresh={refreshSanPham}
                              progressViewOffset={30}/>
                          )}>
            {sanPham ? 
            (<View style={{flex: 1}}>
                  <AnhSanPham sP_Id={sanPham.sP_Id as string} dN_SoHuu_Id={sanPham.sP_DN_SoHuu_Id as string}/>
                  <Spacer height= {10} />
                  <View style={{flex: 1, padding: PADDING_DEFAULT}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>{sanPham.sP_Ten}</Text>
                        <View style={{marginLeft: 'auto'}}>
                            <TouchableOpacity onPress={() => shareSanPham()}>
                              <IconSymbol name="share" size={30} color="#007AFF" />
                            </TouchableOpacity>
                        </View>
                        
                    </View>

                    <Text style={{fontSize: 15}}>
                      {'Danh mục: '} {sanPham.sP_DM?.dM_Ten ? (<Text style={{fontSize: 15, fontWeight: 'bold'}}>{sanPham.sP_DM?.dM_Ten}</Text>) : (<Updating />)} 
                    </Text>
                      
                    <Text style={styles.textGia}>{'Giá: '}{sanPham.sP_Gia ? formatCurrency(sanPham.sP_Gia as number) : (<Updating />)}</Text>

                    <MaVach sanPham={sanPham}/>
                    
                    <View style={{height: 10}}></View>

                    <QrCode sanPham={sanPham} />
                    
                    <View style={{height: 10}}></View>

                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={{borderWidth: 0.5, borderRadius: 8, backgroundColor: '#f2f2f2', padding: PADDING_DEFAULT, height: 40}}
                                          onPress={() => router.push({pathname: '/loSanPhamTemplate', params:{sP_Id: sanPham.sP_Id, sP_Ten: sanPham.sP_Ten, sP_MaTruyXuat: sanPham.sP_MaTruyXuat, sP_DN_SoHuu_Id: sanPham.sP_DN_SoHuu_Id}})}>
                            <Text>{'Lô sản phẩm'}</Text>
                        </TouchableOpacity>
                        <View style={{width: 10}}></View>
                        <TouchableOpacity style={{borderWidth: 0.5, borderRadius: 8, backgroundColor: '#f2f2f2', padding: PADDING_DEFAULT, height: 40}}
                                          onPress={() => router.push({pathname: '/suKienTruyXuatTemplate', params:{sP_Id: sanPham.sP_Id, sP_Ten: sanPham.sP_Ten, sP_MaTruyXuat: sanPham.sP_MaTruyXuat, sP_DN_SoHuu_Id: sanPham.sP_DN_SoHuu_Id}})}>
                            <Text>{'Sự kiện truy xuất'}</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {sanPham.sP_Verified ? (
                      <View>
                          <View style={{height: 10}}></View>
                          <View style={{flexDirection: 'row'}}>
                            <IconSymbol name={'verified'} color={'green'}/>
                            <Text style={{color: 'green', fontWeight: 'bold', fontStyle: 'italic'}}>{'Verified'}</Text>
                          </View>
                      </View>
                    ) :  undefined}
                    
                    <View style={{height: 10}}></View>
                    <View style={{flexDirection: 'row'}}>
                        <SuaSanPham sanPham={sanPham} setReRenderSanPham={setReRenderSanPham} width={60} height={30} paddingVertical={5} fontSize={12}/>
                        <View style={{width: 10}}></View>
                        <XoaSanPham sanPham={sanPham} setSanPham={setSanPham} width={60} height={30} paddingVertical={5} fontSize={12}/>
                    </View>
                    
                    
                    <BlurLine />
                    <SaoSanPham sP_Id={sanPham.sP_Id as string} sizeSao={30} fontSize={25}/>
                    <Spacer height= {10} />
                    <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_SoHuu} vaiTro={"sở hữu"} />
                    <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_SanXuat} vaiTro={"sản xuất"} />
                    <DoanhNghiepSanPham doanhNghiep={sanPham.sP_DN_VanTai} vaiTro={"vận tải"} /> 
                    <NhaMaySanPham nhaMay={sanPham.sP_NM}/>
                    <MoTaSanPham moTa={sanPham.sP_MoTa as string}/>
                    <WebsiteSanPham sP_Website={sanPham.sP_Website} />
                    <BinhLuanSanPhan sP_Id={sanPham.sP_Id as string} userLogin={userLogin}/>
                    
                    <Spacer height={10}/>
                    <SanPhamsCungDoanhNghiepSoHuu sanPham={sanPham} />
                    <Spacer height={10}/>
                    <SanPhamsCungDanhMuc sanPham={sanPham} />
                  </View>
            </View>) 
            : (<View style={{backgroundColor: '#fff'}}>
                <Text>{'Không tồn tại sản phẩm'}</Text>
            </View>)}
        </ScrollView>
         <Footer height={getWidthScreen() <= HEIGHT_SMARTPHONE ? '6%' : '4%'} backgroundColor={'white'} />
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
  },
});