import { LIMIT_SANPHAM } from "@/app/constant/Limit";
import { getFileAsync, getUriAvatarSanPham, getUriFile } from "@/app/helpers/LogicHelper/fileHelper";
import Header from "@/app/helpers/ViewHelpers/header";
import SanPham from "@/app/model/SanPham";
import axios from "axios";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { url } from "../../server/backend";
import Footer from "@/app/helpers/ViewHelpers/footer";
import Loading from "@/app/helpers/ViewHelpers/loading";
import { IconSymbol } from "@/components/ui/IconSymbol";
import DanhMuc from "@/app/model/DanhMuc";
import AvatarSanPham from "@/app/sanPhamTemplate/avatarSanPham";

export default function DanhSachSanPham({danhMucHienTai} : {danhMucHienTai: DanhMuc}) {
    const params = useLocalSearchParams();
    const dN_Id = params.dN_Id;
    const dN_Ten = params.dN_Ten
    const nM_Id = params.nM_Id;
    const nM_Ten = params.nM_Ten;

    const [listSanPhams, setListSanPham] = useState<SanPham[]>([]);
    const [tongSoSanPham, setTongSoSanPham] = useState<number>(0);
    const [textTimKiemSanPham, setTextTimKiemSanPham] = useState<string>('');
    const [modeTimKiem, setModeTimKiem] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [forceReRender, setForceReRender]  = useState<number>(0);

    const layCacSanPhams = async() => {
        setLoading(true);
        let urlSanPham = url('api/sanpham');

        if (dN_Id) {
          urlSanPham +=`/doanh-nghiep-so-huu/${dN_Id}`;
        }else if (nM_Id) {
          urlSanPham +=`/nha-may/${nM_Id}`;
        }else if (danhMucHienTai.dM_Id){
          urlSanPham += `/danh-muc/${danhMucHienTai.dM_Id}`;
        }

        urlSanPham += `?pageNumber=${pageNumber}&limit=${LIMIT_SANPHAM}`;

        if (modeTimKiem) {
          if (textTimKiemSanPham) {
            urlSanPham += `&search=${encodeURIComponent(textTimKiemSanPham)}`
          }
        }

        try {
          const res = await axios.get(urlSanPham);

          if (res.data.listSanPhams) {
            const listSanPhamsTuBackEnd: SanPham[] = res.data.listSanPhams;
            const newListSanPhams = [];
            if (pageNumber > 1) {
              newListSanPhams.push(...listSanPhams, ...listSanPhamsTuBackEnd);
            }else {
              newListSanPhams.push(...listSanPhamsTuBackEnd);
            }

            setListSanPham(newListSanPhams);
            setLoading(false);
          }

          if (res.data.tongSo) {
            setTongSoSanPham(res.data.tongSo);
          }
        }catch {}
    }

    useEffect(() => {
      layCacSanPhams();
    }, [danhMucHienTai, pageNumber, forceReRender]);

    const tongSoTrang : number = Math.ceil(tongSoSanPham / LIMIT_SANPHAM);

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        setPageNumber(pageNumber + 1);
      }
    };

    const layCacSanPhamsTuDau = () => {
      if (pageNumber !== 1) {
        setPageNumber(1); // thay đổi khác thì chắc chắn re-render và gọi lại layLaiSanPhams() nên không cần gọi ở đây
      }else {
        setForceReRender(forceReRender + 1);
      }
    }

    const handleTextInputSearch = (text: string) => {
      setTextTimKiemSanPham(text);
      if (!text) {
        setModeTimKiem(false);
        layCacSanPhamsTuDau();
      }
    }

    const handleTouchSearch = () => {
      if (textTimKiemSanPham) {
        setModeTimKiem(true);
        layCacSanPhamsTuDau(); 
      }
    }

    const handleTouchDestroySearch = () => {
      if (textTimKiemSanPham) {
        setTextTimKiemSanPham('');
        setModeTimKiem(false);
        layCacSanPhamsTuDau();
      }
    }

    const isNotMainScreen = () => {
      return dN_Id || nM_Id;
    }

    const renderItem = ({ item } : {item: SanPham}) => (
        <Link href={{pathname: '/sanPhamTemplate', params: {sP_MaTruyXuat: item.sP_MaTruyXuat} }} withAnchor asChild>
          <TouchableOpacity style={styles.card}>
            <AvatarSanPham sP_Id={item.sP_Id as string} height={80} width={'100%'} marginBottom={8}/>
            <Text style={styles.text}>{item.sP_Ten}</Text>
          </TouchableOpacity>
        </Link>
  );

    return (
      <View style={styles.container}>
          {dN_Id ? (<Header title={`Sản phẩm doanh nghiệp`} resource={dN_Ten as string | undefined | null} fontSize={20}/>) : (<View></View>)}
          {nM_Id ? (<Header title={`Sản phẩm nhà máy`} resource={nM_Ten as string | undefined | null} fontSize={20}/>) : (<View></View>)}
          <View style={{width: '100%', flexDirection: 'row'}}>
                <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={textTimKiemSanPham} onChangeText={handleTextInputSearch}></TextInput>
                <TouchableOpacity style={styles.touchDestroySearch} onPress={handleTouchDestroySearch}>
                    <Text>{'X'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchSearch} onPress={handleTouchSearch}>
                  <IconSymbol name={'search'} color={'white'}/>
                </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
              {modeTimKiem ? (<Text>Kết quả tìm kiếm với từ khóa: <Text style={{fontWeight: 'bold'}}>{textTimKiemSanPham}</Text></Text>) : (<View></View>)}
          </View>
          <FlatList
              data={listSanPhams}
              keyExtractor={(item: SanPham, index) => `${item.sP_Id}-${index}`}
              renderItem={renderItem}
              numColumns={2} // 👉 Mỗi dòng 2 cột
              contentContainerStyle={{padding: 10}}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0}
              />
          {loading ? (<Loading />) : (<View></View>)}
          {isNotMainScreen() ? (<Footer backgroundColor={'black'}/>) : (<View></View>)}
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
  touchSearch: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    width: '10%',
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 6,
  },
  touchDestroySearch: {
    position: 'absolute',
    marginLeft: '85%',
    paddingVertical: 10
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
    backgroundColor: '#fff',
  },
});
