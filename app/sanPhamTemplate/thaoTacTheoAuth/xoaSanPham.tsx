import { quyenXoaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import SanPham from "@/app/model/SanPham";
import { useEffect, useState } from "react";
import { DimensionValue, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";

export default function XoaSanPham({sanPham, setSanPham, width, height, paddingVertical, fontSize}: {sanPham: SanPham, setSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenXoa, setQuyenXoa] = useState<boolean>(false);

    useEffect(() => {
        layQuyenXoa();
    }, [])

    const layQuyenXoa = async() => {
        const quyenSua = await quyenXoaSanPham(sanPham.sP_DN_SoHuu_Id);

        setQuyenXoa(quyenSua);
    }

    return quyenXoa 
    ? (
    <View>
        <TouchableOpacity style={{backgroundColor: 'red', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize}}>Xóa</Text>
        </TouchableOpacity>
    </View>) 
    : (<View></View>)
}