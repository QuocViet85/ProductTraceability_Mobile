import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function SaoSanPham({sP_Id} : {sP_Id : string}) {
    const [soSao, setSoSao] = useState<any>(0);

    const sizeSao = 30;
    
    useEffect(() => {
        let urlLaySoSao = url(`api/sanpham/sao-san-pham/${sP_Id}`);
        axios.get(urlLaySoSao).then((res) => {
            if (res.data) {
                setSoSao(res.data);
            }
        })
    });

    let saoArr = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= soSao) {
            saoArr.push(
                <IconSymbol name="star" size={sizeSao} color="#FFD700" />
            )
        }else if (i - soSao < 1) {
            saoArr.push(
                <IconSymbol name="star-half" size={sizeSao} color="#FFD700" />
            )
        }else {
            saoArr.push(<IconSymbol name="star" size={sizeSao} color="grey" />)
        }
    }
    
    return (
        <View style={{flexDirection: 'row'}}>
            {saoArr};
            <Text style={{ fontSize: 24, color: 'green' }}>
                {"\u00A0"} {soSao}/5
            </Text>
        </View>
    )
}