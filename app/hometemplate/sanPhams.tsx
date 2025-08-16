import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../server/backend";
import { StyleSheet, TextInput, View } from "react-native";

export default function SanPham({danhMucHienTai} : {danhMucHienTai: any}) {
    const [listSanPhams, setListSanPham] = useState([]);
    const [sanPhamHienTai, setSanPhamHienTai] = useState();
    
    useEffect(() => {
    axios.get(url('api/sanpham')).then((res: any) => {
        const listSanPhams = res.data.listItems;
        setListSanPham(listSanPhams);
    });
    }, []);

    return (
        <View>
            <View style={{width: '100%', flexDirection: 'row'}}>
                <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm'></TextInput>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textInputSearch: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '60%',
  }
});
