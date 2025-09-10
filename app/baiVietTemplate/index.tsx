import { useEffect, useState } from "react";
import BaiViet from "../model/BaiViet";
import { url } from "../server/backend";
import axios from "axios";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { View } from "react-native";

export default function BaiVietChiTiet() {
    const params = useLocalSearchParams();
    const bV_Id = params.bV_Id;
    const [baiViet, setBaiViet] = useState<BaiViet | null>(null);

    useEffect(() => {
        layBaiViet();
    }, [])

    const layBaiViet = async() => {
        const urlBaiViet = url(`api/baiviet/${bV_Id}`);

        const res = await axios.get(urlBaiViet);
        
        if (res.data) {
            setBaiViet(res.data);
        }
    }

    return (
        <View>

        </View>
    )
}