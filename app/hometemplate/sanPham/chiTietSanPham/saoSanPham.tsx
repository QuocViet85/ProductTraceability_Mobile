import Spacer from "@/app/helpers/spacer";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function SaoSanPham({sP_Id} : {sP_Id : string}) {
    const [soSao, setSoSao] = useState<any>(0);

    const sizeSao = 20;

    useEffect(() => {
        let urlLaySoSao = url(`api/sanpham/sao-san-pham/${sP_Id}`);
        axios.get(urlLaySoSao).then((res) => {
            if (res.data) {
                setSoSao(res.data);
            }
        })
    })
    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={{ fontSize: 24, color: 'gold' }}>
                {'★'.repeat(soSao) + '☆'.repeat(5 - soSao)} {"\u00A0"}
            </Text>
            <Text style={{ fontSize: 24, color: 'green' }}>
                {soSao}/5
            </Text>
        </View>
    )
}