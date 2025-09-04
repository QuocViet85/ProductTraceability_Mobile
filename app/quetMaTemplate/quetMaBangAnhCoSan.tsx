import * as ImagePicker from 'expo-image-picker';
import { giaiMaQrCode, layMaTruyXuatTuUrl } from '../helpers/LogicHelper/helper';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function QuetMaBangAnhCoSan() {
    const router = useRouter();
    const chonVaGiaiMaAnh = async() => {
        const result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
        });

        if (!result.canceled) {
            const base64 = result.assets[0].base64;
            try {
                const urlSanPham = await giaiMaQrCode(base64);
                const maTruyXuat = layMaTruyXuatTuUrl(urlSanPham);
                router.push({
                pathname: '/hometemplate/sanPham/chiTietSanPham', 
                params: {sP_MaTruyXuat: maTruyXuat}
                });
            }catch {
                Alert.alert("Lỗi", "Lỗi quét ảnh");
            }
        }
    }

    return (
        <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={chonVaGiaiMaAnh}>
                <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
            </TouchableOpacity>
            <Text>Ảnh có sẵn</Text>
        </View>
    )
}