import { quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import SanPham from "@/app/model/SanPham";
import { useEffect, useState } from "react";
import { DimensionValue, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";

export default function SuaSanPham({sanPham, setSanPham, width, height, paddingVertical, fontSize}: {sanPham: SanPham, setSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenSua, setQuyenSua] = useState<boolean>(false);

    useEffect(() => {
        layQuyenSua();
    }, [])

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaSanPham(sanPham.sP_DN_SoHuu_Id);

        setQuyenSua(quyenSua);
    }

    return quyenSua 
    ? (
    <View>
        <TouchableOpacity style={{backgroundColor: 'yellow', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize}}>Sửa</Text>
        </TouchableOpacity>
    </View>) 
    : (<View></View>)
}