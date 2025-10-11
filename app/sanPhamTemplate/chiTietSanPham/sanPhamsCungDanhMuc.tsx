import { LIMIT_TAINGUYEN_LIENQUAN } from "@/app/constant/Limit";
import SanPham from "@/app/model/SanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RenderDanhSachSanPhams } from "@/app/constant/Render";

export default function SanPhamsCungDanhMuc({sanPham}: {sanPham: SanPham}) {
    const [listSanPhamsCungDanhMuc, setListSanPhamsCungDanhMuc] = useState<SanPham[]>([]);

    useEffect(() => {
        laySanPhamsCungDanhMuc();
    }, [])

    const laySanPhamsCungDanhMuc = async() => {
        const urlSanPhamsCungDanhMuc = url(`api/sanpham/danh-muc/${sanPham.sP_DM_Id}?pageNumber=1&limit=${LIMIT_TAINGUYEN_LIENQUAN}`);

        const res = await axios.get(urlSanPhamsCungDanhMuc);

        if (res.data.listSanPhams) {
            const listSanPhamsCungDanhMuc : SanPham[] = res.data.listSanPhams;
            
            const indexSanPhamHienTai = listSanPhamsCungDanhMuc.findIndex((item: SanPham) => {
                return item.sP_Id === sanPham.sP_Id;
            })
            
            if (indexSanPhamHienTai !== -1) {
                listSanPhamsCungDanhMuc.splice(indexSanPhamHienTai, 1);
            }
            setListSanPhamsCungDanhMuc(listSanPhamsCungDanhMuc);
        }
    }

      return (
        <View>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>{'Một số sản phẩm cùng danh mục'}</Text>
            <View style={{height: 10}}></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {listSanPhamsCungDanhMuc.map((item, key) => {
                    return (<View key={key}>
                        {RenderDanhSachSanPhams({item})}
                    </View>)
                })}
            </ScrollView>
        </View>
      )
}