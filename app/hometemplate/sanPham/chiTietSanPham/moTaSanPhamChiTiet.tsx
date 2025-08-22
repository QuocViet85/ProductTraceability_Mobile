import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function MoTaSanPhamChiTiet() {
    const params = useLocalSearchParams();
    const moTa = params.moTa;
    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <Text style={{fontSize: 20}}>
                {moTa}
            </Text>
        </View>
    )
}