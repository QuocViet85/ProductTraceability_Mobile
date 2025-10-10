import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SuKienTruyXuat from "../model/SuKienTruyXuat";
import { Updating } from "../helpers/ViewHelpers/updating";
import Spacer from "../helpers/ViewHelpers/spacer";
import AnhSuKienTruyXuat from "./anhSuKienTruyXuat";
import LoSanPhamCuaSuKienTruyXuat from "./loSanPhamCuaSuKienTruyXuat";
import { useRouter } from "expo-router";
import MoTaSuKienTruyXuat from "./moTaSuKienTruyXuat";
import SuaSuKienTruyXuat from "./thaoTacTheoAuth/suaSuKienTruyXuat";
import XoaSuKienTruyXuat from "./thaoTacTheoAuth/xoaSuKienTruyXuat";

export default function SuKienTruyXuatRender({suKien, listSuKiensHienThi, setTongSoSuKiens, pageNumber, setReRenderSuKien}: {suKien: SuKienTruyXuat, listSuKiensHienThi: SuKienTruyXuat[], setTongSoSuKiens: Function, pageNumber: number, setReRenderSuKien: Function}) {
    const router = useRouter();
    return (
        <View>
            <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>{'Tên lô sự kiện:'}</Text>
            {suKien.sK_Ten ? <Text>{suKien.sK_Ten}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Mã lô sự kiện:'}</Text>
                <Text>{suKien.sK_MaSK}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Địa điểm:'}</Text>
                {suKien.sK_DiaDiem ? <Text>{suKien.sK_DiaDiem}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Ngày thực hiện:'}</Text>
                {suKien.sK_ThoiGian ? (<Text>{suKien.sK_ThoiGian.toLocaleString()}</Text>) : (<Updating />)}
            </View>
            <MoTaSuKienTruyXuat moTa={suKien.sK_MoTa}/>
            <LoSanPhamCuaSuKienTruyXuat loSanPham={suKien.sK_LSP}/>
            <AnhSuKienTruyXuat suKien={suKien} />
            <View style={{height: 10}}></View>
            <View style={{flexDirection: 'row'}}>
                <SuaSuKienTruyXuat suKien={suKien} listSuKiensHienThi={listSuKiensHienThi} setReRenderSuKien={setReRenderSuKien} width={40} height={30} paddingVertical={5} fontSize={12}/>
                <View style={{width: 10}}></View>
                <XoaSuKienTruyXuat suKien={suKien} listSuKiensHienThi={listSuKiensHienThi} setTongSoSuKiens={setTongSoSuKiens} pageNumber={pageNumber} setReRenderSuKien={setReRenderSuKien} width={40} height={30} paddingVertical={5} fontSize={12}/>
            </View>
            <View style={{height: 10}}></View>
            <Spacer height={10}/>
        </View>
    )
}
