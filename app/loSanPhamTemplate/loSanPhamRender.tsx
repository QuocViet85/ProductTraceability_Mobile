import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoSanPham from "../model/LoSanPham";
import { Updating } from "../helpers/ViewHelpers/updating";
import Spacer from "../helpers/ViewHelpers/spacer";
import { useRouter } from "expo-router";
import AnhLoSanPham from "./anhLoSanPham";
import MoTaLoSanPham from "./moTaLoSanPham";
import SuaLoSanPham from "./thaoTacTheoAuth/suaLoSanPham";
import XoaLoSanPham from "./thaoTacTheoAuth/xoaLoSanPham";

export default function LoSanPhamRender({loSanPham, listLoSanPhamsHienThi, setTongSo, pageNumber, sP_DN_SoHuu_Id, setReRenderLoSanPham}: {loSanPham: LoSanPham, listLoSanPhamsHienThi: LoSanPham[], setTongSo: Function, pageNumber: number, sP_DN_SoHuu_Id: string | undefined, setReRenderLoSanPham: Function}) {
    const router = useRouter();
    return (
        <View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Tên lô sản phẩm:'}</Text>
                {loSanPham.lsP_Ten ? <Text>{loSanPham.lsP_Ten}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Mã lô sản phẩm:'}</Text>
                <Text>{loSanPham.lsP_MaLSP}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Số lượng:'}</Text>
                {loSanPham.lsP_SoLuong ? <Text>{loSanPham.lsP_SoLuong.toLocaleString()}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Ngày sản xuất:'}</Text>
                {loSanPham.lsP_NgaySanXuat ? <Text>{loSanPham.lsP_NgaySanXuat.toLocaleString()}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Ngày hết hạn:'}</Text>
                {loSanPham.lsP_NgayHetHan ? (<Text>{loSanPham.lsP_NgayHetHan.toLocaleString()}</Text>) : (<Text>{'Không có'}</Text>)}
            </View>
            <MoTaLoSanPham moTa={loSanPham.lsP_MoTa}/>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Nhà máy:'}</Text>
                {loSanPham.lsP_NM ? (
                    <TouchableOpacity style={{backgroundColor: '#f2f2f2'}} onPress={() => router.push({pathname: '/nhaMayTemplate', params: {nM_Id: loSanPham.lsP_NM?.nM_Id} })}>
                        <Text>{loSanPham.lsP_NM.nM_Ten}</Text>
                    </TouchableOpacity>
                    ) : (<Updating />)}
            </View>
            <AnhLoSanPham loSanPham={loSanPham} sP_DN_SoHuu_Id={sP_DN_SoHuu_Id} />
            {sP_DN_SoHuu_Id ? 
            (
                <View>
                    <View style={{height: 10}}></View>
                    <View style={{flexDirection: 'row'}}>
                        <SuaLoSanPham loSanPham={loSanPham} listLoSanPhamsHienThi={listLoSanPhamsHienThi} doanhNghiepSoHuuId={sP_DN_SoHuu_Id} setReRenderLoSanPham={setReRenderLoSanPham} width={40} height={30} paddingVertical={5} fontSize={12}/>
                        <View style={{width: 10}}></View>
                        <XoaLoSanPham loSanPham={loSanPham} listLoSanPhamsHienThi={listLoSanPhamsHienThi} setTongSo={setTongSo} pageNumber={pageNumber} doanhNghiepSoHuuId={sP_DN_SoHuu_Id} setReRenderLoSanPham={setReRenderLoSanPham} width={40} height={30} paddingVertical={5} fontSize={12}/>
                    </View>
                    <View style={{height: 10}}></View>
            </View>
            ) : null}
            
            
            <Spacer height={10}/>
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