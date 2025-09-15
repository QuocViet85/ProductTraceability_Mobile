import { Text, TouchableOpacity, View } from "react-native";
import SuKienTruyXuat from "../model/SuKienTruyXuat";
import { Updating } from "../helpers/ViewHelpers/updating";
import Spacer from "../helpers/ViewHelpers/spacer";
import AnhSuKienTruyXuat from "./anhSuKienTruyXuat";
import LoSanPhamCuaSuKienTruyXuat from "./loSanPhamCuaSuKienTruyXuat";

export default function SuKienTruyXuatRender({suKien, isNotMainScreen}: {suKien: SuKienTruyXuat, isNotMainScreen: Function}) {
    return (
        <View>
            <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>Tên lô sự kiện: </Text>
            {suKien.sK_Ten ? <Text>{suKien.sK_Ten}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Mã lô sự kiện: </Text>
                <Text>{suKien.sK_MaSK}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Địa điểm: </Text>
                {suKien.sK_DiaDiem ? <Text>{suKien.sK_DiaDiem}</Text> : (<Updating />)}
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>Ngày thực hiện: </Text>
                {suKien.sK_ThoiGian ? (<Text>{suKien.sK_ThoiGian.toLocaleString()}</Text>) : (<Updating />)}
            </View>
            {isNotMainScreen() ? (<View></View>) 
            : (
                <LoSanPhamCuaSuKienTruyXuat loSanPham={suKien.sK_LSP}/>
            )}
            <AnhSuKienTruyXuat sK_Id={suKien.sK_Id as string} />
            <Spacer height={10}/>
        </View>
    )
}