import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const temp_SaoSanPham : {sP_Id: string, soSao: number}[] = [];

export default function SaoSanPham({sP_Id, sizeSao, fontSize} : {sP_Id : string, sizeSao: number | undefined, fontSize: number | undefined}) {
    const [soSao, setSoSao] = useState<number>(0);
    
    useEffect(() => {
        laySoSaoCuaSanPham();
    });

    const laySoSaoCuaSanPham = async() => {
        const soSaoInTemp = temp_SaoSanPham.find((item) => {
                return item.sP_Id === sP_Id;
        });

        if (!soSaoInTemp) {
            const urlLaySoSao = url(`api/sanpham/sao-san-pham/${sP_Id}`);
            const res = await axios.get(urlLaySoSao);
            const soSao = res.data;
            setSoSao(soSao);
            temp_SaoSanPham.push({
                sP_Id: sP_Id,
                soSao: soSao
            });
        }else {
            setSoSao(soSaoInTemp.soSao);
        }
    }

    let saoArr = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= soSao) {
            saoArr.push(
                <IconSymbol key={i} name="star" size={sizeSao} color="#FFD700" />
            )
        }else if (i - soSao < 1) {
            saoArr.push(
                <IconSymbol key={i} name="star-half" size={sizeSao} color="#FFD700" />
            )
        }else {
            saoArr.push(<IconSymbol key={i} name="star" size={sizeSao} color="grey" />)
        }
    }
    
    return (
        <View style={{flexDirection: 'row'}}>
            {saoArr}
            {fontSize ? (
                <Text style={{ fontSize: fontSize, color: 'green' }}>
                {"\u00A0"} {soSao}{'/5'}
            </Text>) : null}
            
        </View>
    )
}