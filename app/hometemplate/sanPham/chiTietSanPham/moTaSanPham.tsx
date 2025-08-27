import Spacer from "@/app/helpers/ViewHelpers/spacer";
import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export default function MoTaSanPham({moTa} : {moTa: string}) {
    return (
        <View>
            {moTa ? (
                <View>
                    <Text style={{fontSize: 20}}>
                        {moTa.substring(0, 100)}
                    </Text>
                    <Link href={{pathname: '/hometemplate/sanPham/chiTietSanPham/moTaSanPhamChiTiet', params: {moTa}}} asChild>
                        <Button title={"Chi Tiết"} color={'green'}></Button>
                    </Link>
                    <Spacer height={10} />
                </View>
            ) : (
                <View></View>
            )}
            
        </View>
    );
}