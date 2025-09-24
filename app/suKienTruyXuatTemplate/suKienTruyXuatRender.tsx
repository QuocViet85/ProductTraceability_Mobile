import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SuKienTruyXuat from "../model/SuKienTruyXuat";
import { Updating } from "../helpers/ViewHelpers/updating";
import Spacer from "../helpers/ViewHelpers/spacer";
import AnhSuKienTruyXuat from "./anhSuKienTruyXuat";
import LoSanPhamCuaSuKienTruyXuat from "./loSanPhamCuaSuKienTruyXuat";
import { useRouter } from "expo-router";
import AvatarSanPham from "../sanPhamTemplate/avatarSanPham";
import MoTaSuKienTruyXuat from "./moTaSuKienTruyXuat";
import SuaSuKienTruyXuat from "./thaoTacTheoAuth/suaSuKienTruyXuat";
import XoaSuKienTruyXuat from "./thaoTacTheoAuth/xoaSuKienTruyXuat";

export default function SuKienTruyXuatRender({suKien, isNotMainScreen, setReRenderSuKien}: {suKien: SuKienTruyXuat, isNotMainScreen: Function, setReRenderSuKien: Function}) {
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
            {isNotMainScreen() ? (<View></View>) 
            : (
                <LoSanPhamCuaSuKienTruyXuat loSanPham={suKien.sK_LSP}/>
            )}
            <AnhSuKienTruyXuat suKien={suKien} />
            {isNotMainScreen() ? (<View></View>) 
            : (
                <View>
                    <Text style={{fontWeight: 'bold'}}>{'Thuộc sản phẩm:'}</Text>
                    <View style={styles.viewSanPham}>
                        <TouchableOpacity style={styles.touchAvatarSanPham} onPress={() => router.push({pathname: '/sanPhamTemplate', params: {sP_MaTruyXuat: suKien.sK_LSP?.lsP_SP?.sP_MaTruyXuat as string} })}>
                            <AvatarSanPham sP_Id={suKien.sK_LSP?.lsP_SP_Id as string} width={50} height={50} marginBottom={undefined}/>
                            <View style={{marginLeft: 10}}>
                                <Text style={{fontSize: 17, fontWeight: 'bold'}}>{suKien.sK_LSP?.lsP_SP?.sP_Ten}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <View style={{flexDirection: 'row'}}>
                <SuaSuKienTruyXuat suKien={suKien} setReRenderSuKien={setReRenderSuKien} width={40} height={30} paddingVertical={5} fontSize={12}/>
                <View style={{width: 10}}></View>
                <XoaSuKienTruyXuat suKien={suKien} setReRenderSuKien={setReRenderSuKien} width={40} height={30} paddingVertical={5} fontSize={12}/>
            </View>
            <Spacer height={10}/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewSanPham: {
        flex: 1, 
        margin: 5,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 10
    },
    touchAvatarSanPham: {
        width: '100%',
        height: 40, 
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row'
    },
    avatarSanPham: {
        width: 50,
        height: 50,
        borderRadius: 8
    }
});