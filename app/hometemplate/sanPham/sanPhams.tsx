import axios from "axios";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { url } from "../../server/backend";
import { getFileAsync, getUriFile } from "@/app/helpers/fileHelper";

export default function SanPham({danhMucHienTai} : {danhMucHienTai: any}) {
    const [listSanPhams, setListSanPham] = useState<any[]>([]);
    const [timKiemSanPham, setTimKiemSanPham] = useState('');
    
    useEffect(() => {
    let urlSanPham = url('api/sanpham');
    if (danhMucHienTai.dM_Id) {
        urlSanPham += `/danh-muc/${danhMucHienTai.dM_Id}`;
    }

    if (timKiemSanPham) {
      urlSanPham += `?search=${timKiemSanPham}`
    }

    axios.get(urlSanPham).then((res: any) => {
        const listSanPhams = res.data.listSanPhams;

        async function setUriSanPham() {
            for (const sanPham of listSanPhams) {
            sanPham.uriAnhDaiDien = null;
            try {
                let file = await getFileAsync('SP', sanPham.sP_Id, 'image', 1);
                if (file) {
                  sanPham.uriSanPham = getUriFile(file[0]);
                  console.log(sanPham.uriSanPham)
                }
            }catch {}
          }
          setListSanPham(listSanPhams);
        }

        setUriSanPham();
    });
    }, [danhMucHienTai, timKiemSanPham]);

    const renderItem = ({ item } : {item: any}) => (
      <Link href={{pathname: '/hometemplate/sanPham/chiTietSanPham', params: {sP_Id: item.sP_Id} }} asChild>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.uriSanPham }} style={styles.image} />
            <Text style={styles.text}>{item.sP_Ten}</Text>
          </TouchableOpacity>
      </Link> 
  );

    return (
        <ScrollView>
            <View style={{width: '100%', flexDirection: 'row'}}>
                <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={timKiemSanPham} onChangeText={setTimKiemSanPham}></TextInput>
            </View>
            <FlatList
                data={listSanPhams}
                keyExtractor={(item) => item.sP_Id}
                renderItem={renderItem}
                numColumns={2} // 👉 Mỗi dòng 2 cột
                contentContainerStyle={styles.container}
                />
        </ScrollView>
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
    width: '100%',
    height: 80,
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
