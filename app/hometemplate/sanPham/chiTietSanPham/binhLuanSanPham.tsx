import BlurLine from "@/app/helpers/blurLine";
import Spacer from "@/app/helpers/spacer";
import { url } from "@/app/server/backend";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function BinhLuanSanPhan({sP_Id} : {sP_Id : string}) {
    const [listBinhLuans, setListBinhLuans] = useState<any[]>([]);
    const [tongSoBinhLuan, setTongSoBinhLuan] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1);
    const limit = 5;
    let tongSoTrang : number = Math.ceil(tongSoBinhLuan / limit);

    useEffect(() => {
        let urlBinhLuan = url(`api/binhluan/san-pham/${sP_Id}?pageNumber=${pageNumber}&limit=${limit}`);

        axios.get(urlBinhLuan).then((response) => {
            if (response.data.listBinhLuans) {
                setListBinhLuans(response.data.listBinhLuans);
            }

            if (response.data.tongSo) {
                setTongSoBinhLuan(response.data.tongSo);
            }
        });
    }, [pageNumber])

    const backPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }

    const nextPage = () => {
        if (pageNumber < tongSoTrang) {
            setPageNumber(pageNumber + 1);
        }
    }
    return (
        <View>
            <Text style={{marginBottom: 20, fontWeight: 'bold', fontSize: 20}}>Đánh giá sản phẩm ({tongSoBinhLuan})</Text>
            {listBinhLuans.map((item, index) => {
                return (
                    <View key={item.sP_Id}>
                        <Text style={{fontWeight: 'bold'}}>{item.bL_NguoiTao_Client.name}</Text>
                        <Text>{item.bL_NoiDung}</Text>
                        <Text style={{fontStyle: 'italic', fontSize: 10}}>{new Date(item.bL_NgayTao).toLocaleString()}</Text>
                        <BlurLine />
                    </View>
                );
            })}
            <View style={{alignItems: 'center'}}>
                <Text>{pageNumber} / {tongSoTrang}</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={backPage}>
                        <Ionicons name="arrow-back" size={32} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextPage}>
                        <Ionicons name="arrow-forward" size={32} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <Spacer height={10}/>
        </View>
    )
}