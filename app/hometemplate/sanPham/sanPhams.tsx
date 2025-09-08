import { getFileAsync, getUriFile } from "@/app/helpers/LogicHelper/fileHelper";
import axios from "axios";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { url } from "../../server/backend";
import Header from "@/app/general/header";

export default function SanPham({danhMucHienTai} : {danhMucHienTai: any}) {
    const params = useLocalSearchParams();
    const dN_Id = params.dN_Id;
    const dN_Ten = params.dN_Ten

    const [listSanPhams, setListSanPham] = useState<any[]>([]);
    const [listSanPhamsRender, setListSanPhamRender] = useState<any[]>([]);
    const [timKiemSanPham, setTimKiemSanPham] = useState('');
    
    useEffect(() => {
      let urlSanPham = url('api/sanpham');
      if (!dN_Id) {
        if (danhMucHienTai.dM_Id) {
          urlSanPham += `/danh-muc/${danhMucHienTai.dM_Id}`;
        }
      }else {
        urlSanPham +=`/doanh-nghiep-so-huu/${dN_Id}`;
      }
    
      if (timKiemSanPham) {
        const listSanPhamsTimKiem = listSanPhams.filter((sanPham: any) => {
          return sanPham.sP_Ten.toLowerCase().includes(timKiemSanPham.toLowerCase()) || sanPham.sP_MaTruyXuat.toLowerCase().includes(timKiemSanPham.toLowerCase());
        });

        if (listSanPhamsTimKiem) {
          if (listSanPhamsTimKiem.length > 0) {
            setListSanPhamRender(listSanPhamsTimKiem);
            return;
          }
        }
        urlSanPham += `?search=${timKiemSanPham}`
      }

      axios.get(urlSanPham).then((res: any) => {
        const listSanPhams = res.data.listSanPhams;

        const listPromiseGetUriAnhDaiDiens : any[] = [];

       listSanPhams.forEach((sanPham : any) => {
        sanPham.uriAnhDaiDien = null;
        try {
            let promiseGetUriAnhDaiDien = getFileAsync('SP', sanPham.sP_Id, 'image', 1).then((file) => {
              if (file) {
                sanPham.uriAnhDaiDien = getUriFile(file[0]);
              }
            });
            listPromiseGetUriAnhDaiDiens.push(promiseGetUriAnhDaiDien);
        }catch {
          listPromiseGetUriAnhDaiDiens.push(Promise.resolve(1));
        }
       });

       Promise.all(listPromiseGetUriAnhDaiDiens).finally(() => {
            setListSanPham(listSanPhams);
            setListSanPhamRender(listSanPhams)
       });
    });
    }, [danhMucHienTai, timKiemSanPham]);

    const renderItem = ({ item } : {item: any}) => (
        <Link href={{pathname: '/hometemplate/sanPham/chiTietSanPham', params: {sP_MaTruyXuat: item.sP_MaTruyXuat} }} withAnchor asChild>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.uriAnhDaiDien }} style={styles.image} />
            <Text style={styles.text}>{item.sP_Ten}</Text>
          </TouchableOpacity>
        </Link>
       
  );

    return (
      <View style={dN_Id ? styles.container : {}}>
          {dN_Id ? (<Header title={`Sản phẩm doanh nghiệp`} resource={dN_Ten as string | undefined | null} fontSize={20}/>) : (<View></View>)}
        <View style={dN_Id ? styles.content : {}}>
            <ScrollView >
              <View style={{width: '100%', flexDirection: 'row'}}>
                  <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={timKiemSanPham} onChangeText={setTimKiemSanPham}></TextInput>
              </View>
              <FlatList
                  data={listSanPhamsRender}
                  keyExtractor={(item) => item.sP_Id}
                  renderItem={renderItem}
                  numColumns={2} // 👉 Mỗi dòng 2 cột
                  contentContainerStyle={{padding: 10}}
                  />
          </ScrollView>
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
  container: {
    flex: 1,                     // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    paddingTop: 20,              // tránh dính sát trên cùng
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%'
  },
  content: {
    marginTop: 60,
    width: '100%',
    height: '100%'
  },
});
