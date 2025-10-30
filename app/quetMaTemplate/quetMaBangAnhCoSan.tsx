import { IconSymbol } from '@/components/ui/IconSymbol';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { giaiMaCode, layMaTruyXuatTuUrl } from '../helpers/LogicHelper/helper';
import axios from 'axios';
import { url } from '../server/backend';
import { getBase64ImagesPickInDevice } from '../helpers/LogicHelper/fileHelper';

export default function QuetMaBangAnhCoSan() {
    const router = useRouter();
    const chonVaGiaiMaAnh = async() => {
        try {
            const base64Arr = await getBase64ImagesPickInDevice(false);

            if (base64Arr.length > 0) {
                const base64 = base64Arr[0];
                if (base64) {
                    const code = await giaiMaCode(base64);

                    let res = await axios.get(url(`api/sanpham/ma-truy-xuat/ton-tai/${code}`));

                    if (res.data) {
                        router.push({
                        pathname: '/sanPhamTemplate/chiTietSanPham', 
                        params: {sP_MaTruyXuat: code}
                        });

                        return;
                    }

                    res = await axios.get(url(`api/sanpham/ma-vach/ton-tai/${code}`));
                    if (res.data) {
                        router.push({
                        pathname: '/sanPhamTemplate/chiTietSanPham', 
                        params: {sP_MaVach: code}
                        });

                        return;
                    }

                    const noiDungCoTheLaGS1 = code.slice(3, 7);
                    res = await axios.get((url(`api/doanhnghiep/ma-gs1/ton-tai/${noiDungCoTheLaGS1}`)));

                    if (res.data) {
                        router.push({
                        pathname: '/doanhNghiepTemplate/chiTietDoanhNghiep', 
                        params: {dN_MaGS1: noiDungCoTheLaGS1, thongBao: 'Tìm được doanh nghiệp từ mã nhưng không tìm được sản phẩm'}
                        });

                        return;
                    }
                }
            }
        }catch {
            Alert.alert("Lỗi", "Không có dữ liệu phù hợp");
        }
        
    }

    return (
        <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={chonVaGiaiMaAnh}>
                <IconSymbol name={'photo-album'} size={50} color={'blue'}/>
            </TouchableOpacity>
            <Text>{'Ảnh có sẵn'}</Text>
        </View>
    )
}