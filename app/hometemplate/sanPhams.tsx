import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../server/backend";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SanPham({danhMucHienTai} : {danhMucHienTai: any}) {
    const [listSanPhams, setListSanPham] = useState<Array<any>>([]);
    const [sanPhamHienTai, setSanPhamHienTai] = useState();

    const [timKiemSanPham, setTimKiemSanPham] = useState('');
    
    useEffect(() => {
    let urlSanPham = url('api/sanpham');
    if (danhMucHienTai.dM_Id) {
        urlSanPham += `/danh-muc/${danhMucHienTai.dM_Id}`;
    }

    axios.get(urlSanPham).then((res: any) => {
        const listSanPhams = res.data.listSanPhams;
        setListSanPham(listSanPhams);
    });
    }, [danhMucHienTai]);

    const filterSanPhams = listSanPhams.filter((sanPham: any) => {
        if (sanPham.sP_Ten) {
            return sanPham.sP_Ten.toLowerCase().includes(timKiemSanPham.toLowerCase());
        }
    })

    const renderItem = ({ item } : {item: any}) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.text}>{item.sP_Ten}</Text>
    </TouchableOpacity>
  );

    return (
        <View>
            <View style={{width: '100%', flexDirection: 'row'}}>
                <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={timKiemSanPham} onChangeText={setTimKiemSanPham}></TextInput>
            </View>
            <FlatList
                data={filterSanPhams}
                keyExtractor={(item) => item.sP_Id}
                renderItem={renderItem}
                numColumns={2} // 👉 Mỗi dòng 2 cột
                contentContainerStyle={styles.container}
                />
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
  },
  container: {
    padding: 10,
  },
  card: {
    flex: 1, // 👉 để 2 item chia đều 1 hàng
    margin: 5,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
