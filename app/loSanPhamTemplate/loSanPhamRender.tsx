import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoSanPham from "../model/LoSanPham";
import { Updating } from "../helpers/ViewHelpers/updating";
import Spacer from "../helpers/ViewHelpers/spacer";
import { useRouter } from "expo-router";
import AnhLoSanPham from "./anhLoSanPham";
import MoTaLoSanPham from "./moTaLoSanPham";
import SuaLoSanPham from "./thaoTacTheoAuth/suaLoSanPham";
import XoaLoSanPham from "./thaoTacTheoAuth/xoaLoSanPham";

export default function LoSanPhamRender({loSanPham, sP_Id, sP_Ten, sP_MaTruyXuat, setReRenderLoSanPham}: {loSanPham: LoSanPham, sP_Id: string | undefined, sP_Ten: string | undefined, sP_MaTruyXuat: string | undefined, setReRenderLoSanPham: Function}) {
    const router = useRouter();
    return (
        <View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Tên lô sản phẩm: </Text>
                {loSanPham.lsP_Ten ? <Text>{loSanPham.lsP_Ten}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Mã lô sản phẩm: </Text>
                <Text>{loSanPham.lsP_MaLSP}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Số lượng: </Text>
                {loSanPham.lsP_SoLuong ? <Text>{loSanPham.lsP_SoLuong.toLocaleString()}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Ngày sản xuất: </Text>
                {loSanPham.lsP_NgaySanXuat ? <Text>{loSanPham.lsP_NgaySanXuat.toLocaleString()}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Ngày hết hạn: </Text>
                {loSanPham.lsP_NgayHetHan ? (<Text>{loSanPham.lsP_NgayHetHan.toLocaleString()}</Text>) : (<Text>{'Không có'}</Text>)}
            </View>
            <MoTaLoSanPham moTa={loSanPham.lsP_MoTa}/>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Nhà máy: </Text>
                {loSanPham.lsP_NM ? (
                    <TouchableOpacity style={{backgroundColor: '#f2f2f2'}} onPress={() => router.push({pathname: '/nhaMayTemplate', params: {nM_Id: loSanPham.lsP_NM?.nM_Id} })}>
                        <Text>{loSanPham.lsP_NM.nM_Ten}</Text>
                    </TouchableOpacity>
                    ) : (<Updating />)}
            </View>
            <AnhLoSanPham loSanPham={loSanPham}/>
            <View style={{flexDirection: 'row'}}>
                <SuaLoSanPham loSanPham={loSanPham} setReRenderLoSanPham={setReRenderLoSanPham} width={40} height={30} paddingVertical={5} fontSize={12}/>
                <View style={{width: 10}}></View>
                <XoaLoSanPham loSanPham={loSanPham} setReRenderLoSanPham={setReRenderLoSanPham} width={40} height={30} paddingVertical={5} fontSize={12}/>
            </View>
            <View style={{height: 10}}></View>
            
            <View style={{alignItems: 'center'}}>
                <TouchableOpacity style={styles.statBox} onPress={() => router.push({pathname: '/suKienTruyXuatTemplate', params: {
                    lsP_Id: loSanPham.lsP_Id,
                    lsP_MaLSP: loSanPham.lsP_MaLSP,
                    sP_Id: sP_Id, 
                    sP_Ten: sP_Ten, 
                    sP_MaTruyXuat: sP_MaTruyXuat}})}>
                    <Text style={styles.statLabel}>{'Xem sự kiện truy xuất'}</Text>
                </TouchableOpacity>
            </View>
            
            <Spacer  height={10}/>
        </View>
    )
}

const styles = StyleSheet.create({
    statBox: {
        width: '40%',
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        marginBottom: 10,
        borderRadius: 8,
        alignItems: 'center',
  },
  statLabel: { color: '#555', fontSize: 13 },
})