import { LIMIT_TAINGUYEN_LIENQUAN } from "@/app/constant/Limit";
import SanPham from "@/app/model/SanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RenderDanhSachSanPhams } from "@/app/constant/Render";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SanPhamsCungDoanhNghiepSoHuu({sanPham}: {sanPham: SanPham}) {
    const [listSanPhamsCungDoanhNghiepSoHuu, setListSanPhamsCungDoanhNghiepSoHuu] = useState<SanPham[]>([]);

    const router = useRouter();

    useEffect(() => {
        laySanPhamsCungDoanhNghiepSoHuu();
    }, [])

    const laySanPhamsCungDoanhNghiepSoHuu = async() => {
        const urlSanPhamsCungDNSoHuu = url(`api/sanpham/doanh-nghiep-so-huu/${sanPham.sP_DN_SoHuu_Id}?pageNumber=1&limit=${LIMIT_TAINGUYEN_LIENQUAN}`);

        const res = await axios.get(urlSanPhamsCungDNSoHuu);

        if (res.data.listSanPhams) {
            const listSanPhamsCungDoanhNghiepSoHuu : SanPham[] = res.data.listSanPhams;

            const indexSanPhamHienTai = listSanPhamsCungDoanhNghiepSoHuu.findIndex((item: SanPham) => {
                return item.sP_Id === sanPham.sP_Id;
            })
            
            if (indexSanPhamHienTai !== -1) {
                listSanPhamsCungDoanhNghiepSoHuu.splice(indexSanPhamHienTai, 1);
            }

            setListSanPhamsCungDoanhNghiepSoHuu(listSanPhamsCungDoanhNghiepSoHuu);
        }
    }

      return (
        <View>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>{'Sản phẩm cùng doanh nghiệp'}</Text>
            <View style={{height: 10}}></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {listSanPhamsCungDoanhNghiepSoHuu.map((item, key) => {
                    return (<View key={key}>
                        {RenderDanhSachSanPhams({item})}
                    </View>)
                })}
            <View style={{flex: 1, 
            justifyContent: 'center',
            padding: 30,
            borderWidth: 0.3}}>
                <TouchableOpacity
                onPress={() => router.push({pathname: '/sanPhamTemplate/danhSachSanPham/danhSachSanPham', params: {dN_Id: sanPham.sP_DN_SoHuu_Id, dN_Ten: sanPham.sP_DN_SoHuu?.dN_Ten}})}>
                    <Ionicons name="arrow-forward-circle-outline" size={50} color="blue" />
                    <Text style={{fontSize: 15, color: 'blue'}}>{'Xem thêm'}</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
      )
}