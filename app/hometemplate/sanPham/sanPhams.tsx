import { getFileAsync, getUriFile } from "@/app/helpers/LogicHelper/fileHelper";
import axios from "axios";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { url } from "../../server/backend";
import Header from "@/app/general/header";
import { SAN_PHAM } from "@/app/constant/KieuTaiNguyen";
import { IMAGE } from "@/app/constant/KieuFile";
import SanPham from "@/app/model/SanPham";
import { LIMIT_SANPHAM } from "@/app/constant/Limit";
import { Ionicons } from "@expo/vector-icons";

export default function DanhSachSanPham({danhMucHienTai} : {danhMucHienTai: any}) {
    const params = useLocalSearchParams();
    const dN_Id = params.dN_Id;
    const dN_Ten = params.dN_Ten
    const nM_Id = params.nM_Id;
    const nM_Ten = params.nM_Ten;

    const [listSanPhams, setListSanPham] = useState<SanPham[]>([]);
    const [listSanPhamsRender, setListSanPhamRender] = useState<SanPham[]>([]);
    const [tongSoSanPham, setTongSoSanPham] = useState<number>(0);
    const [timKiemSanPham, setTimKiemSanPham] = useState('');
    const [pageNumber, setPageNumber] = useState<number>(1);
    
    useEffect(() => {
      let urlSanPham = url('api/sanpham');

      if (dN_Id) {
        urlSanPham +=`/doanh-nghiep-so-huu/${dN_Id}`;
      }else if (nM_Id) {
        urlSanPham +=`/nha-may/${nM_Id}`;
      }else if (danhMucHienTai.dM_Id){
        urlSanPham += `/danh-muc/${danhMucHienTai.dM_Id}`;
      }

      urlSanPham += `?pageNumber=${pageNumber}&limit=${LIMIT_SANPHAM}`;
    
      if (timKiemSanPham) {
        const listSanPhamsTimKiem = listSanPhams.filter((sanPham: SanPham) : boolean | undefined => {
          return sanPham.sP_Ten?.toLowerCase().includes(timKiemSanPham.toLowerCase()) || sanPham.sP_MaTruyXuat?.toLowerCase().includes(timKiemSanPham.toLowerCase());
        });

        if (listSanPhamsTimKiem) {
          if (listSanPhamsTimKiem.length > 0) {
            setListSanPhamRender(listSanPhamsTimKiem);
            return;
          }
        }
        urlSanPham += `&search=${timKiemSanPham}`
      }

      console.log(urlSanPham);
      axios.get(urlSanPham).then(async (res: any) => {
        const listSanPhams: SanPham[] = res.data.listSanPhams;

        for (const sanPham of listSanPhams) {
            sanPham.uriAvatar = null;
            try {
              const file = await getFileAsync(SAN_PHAM, sanPham.sP_Id as string, IMAGE, 1);

              if (file) {
                  sanPham.uriAvatar = getUriFile(file[0]);
              }
            }catch {}
        }

        setListSanPham(listSanPhams);
        setListSanPhamRender(listSanPhams);
        
        if (res.data.tongSo) {
          setTongSoSanPham(res.data.tongSo);
        }
    });
    }, [danhMucHienTai, timKiemSanPham, pageNumber]);

    const tongSoTrang : number = Math.ceil(tongSoSanPham / LIMIT_SANPHAM);

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

    const renderItem = ({ item } : {item: SanPham}) => (
        <Link href={{pathname: '/hometemplate/sanPham/chiTietSanPham', params: {sP_MaTruyXuat: item.sP_MaTruyXuat} }} withAnchor asChild>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.uriAvatar as string }} style={styles.image} />
            <Text style={styles.text}>{item.sP_Ten}</Text>
          </TouchableOpacity>
        </Link>
       
  );

    return (
      <View style={dN_Id || nM_Id ? styles.container : {}}>
          {dN_Id ? (<Header title={`Sản phẩm doanh nghiệp`} resource={dN_Ten as string | undefined | null} fontSize={20}/>) : (<View></View>)}
          {nM_Id ? (<Header title={`Sản phẩm nhà máy`} resource={nM_Ten as string | undefined | null} fontSize={20}/>) : (<View></View>)}
        <View style={dN_Id  || nM_Id ? styles.content : {}}>
            <ScrollView >
              <View style={{width: '100%', flexDirection: 'row'}}>
                <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={timKiemSanPham} onChangeText={setTimKiemSanPham}></TextInput>
              </View>
              <FlatList
                  data={listSanPhamsRender}
                  keyExtractor={(item) => item.sP_Id as string}
                  renderItem={renderItem}
                  numColumns={2} // 👉 Mỗi dòng 2 cột
                  contentContainerStyle={{padding: 10}}
                  />
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
                <View style={{height: 100}}></View>
            </View>
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
    borderRadius: 8
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
