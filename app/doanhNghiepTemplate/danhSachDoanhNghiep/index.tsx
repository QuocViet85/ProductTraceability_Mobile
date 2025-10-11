import { LIMIT_DOANHNGHIEP } from "@/app/constant/Limit";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import { url } from "@/app/server/backend";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AvatarDoanhNghiep from "../avatarDoanhNghiep";
import Loading from "@/app/helpers/ViewHelpers/loading";
import Header from "@/app/helpers/ViewHelpers/header";
import { IconSymbol } from "@/components/ui/IconSymbol";
import ThemDoanhNghiep from "../chiTietDoanhNghiep/thaoTacTheoAuth/themDoanhNghiep";
import { PADDING_DEFAULT } from "@/app/constant/Style";

export let listDoanhNghiepsHienThiTrangChu: DoanhNghiep[] = [];
export let reRenderTrangChuListDoanhNghieps: Function = () => {}
export let pageNumberTrangChuListDoanhNghieps: number = 1;
export let modeTimKiemTrangChuListDoanhNghieps: boolean = false;
export let textTimKiemTrangChuListDoanhNghieps: string = '';
export let setTongDoanhNghiep: Function = () => {};

export default function DanhSachDoanhNghiep() {
    const [listDoanhNghieps, setListDoanhNghieps] = useState<DoanhNghiep[]>([]);
    const [listDoanhNghiepsTemp, setListDoanhNghiepsTemp] = useState<DoanhNghiep[]>([]);
    const [tongSoDoanhNghiep, setTongSoDoanhNghiep] = useState<number>(0);
    const [textTimKiemDoanhNghiep, setTextTimKiemDoanhNghiep] = useState<string>('');
    const [modeTimKiem, setModeTimKiem] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [reRender, setReRender]  = useState<number>(0);
    
    const [forceReRender, setForceReRender]  = useState<number>(0);

    const router = useRouter();

    listDoanhNghiepsHienThiTrangChu = listDoanhNghieps;
    pageNumberTrangChuListDoanhNghieps = pageNumber;
    reRenderTrangChuListDoanhNghieps = setReRender;
    modeTimKiemTrangChuListDoanhNghieps = modeTimKiem;
    textTimKiemTrangChuListDoanhNghieps = textTimKiemDoanhNghiep;
    setTongDoanhNghiep = setTongSoDoanhNghiep;

    useEffect(() => {
      layCacDoanhNghieps();
    }, [pageNumber, forceReRender]);

    const tongSoTrang : number = Math.ceil(tongSoDoanhNghiep / LIMIT_DOANHNGHIEP);

    const layCacDoanhNghieps = async() => {
        setLoading(true);
        let urlDoanhNghiep = url(`api/doanhnghiep?pageNumber=${pageNumber}&limit=${LIMIT_DOANHNGHIEP}&descending=true`);

        if (modeTimKiem) {
          if (textTimKiemDoanhNghiep) {
            urlDoanhNghiep += `&search=${encodeURIComponent(textTimKiemDoanhNghiep)}`
          }
        }

        try {
          const res = await axios.get(urlDoanhNghiep);

          if (res.data.listDoanhNghieps) {
            const listDoanhNghiepsTuBackEnd: DoanhNghiep[] = res.data.listDoanhNghieps;
            const newListDoanhNghieps = [];
            if (pageNumber > 1) {
              newListDoanhNghieps.push(...listDoanhNghieps, ...listDoanhNghiepsTuBackEnd);
            }else {
              newListDoanhNghieps.push(...listDoanhNghiepsTuBackEnd);
            }

            setListDoanhNghieps(newListDoanhNghieps);
            setListDoanhNghiepsTemp(newListDoanhNghieps);
            setLoading(false);
          }

          if (res.data.tongSo) {
            setTongSoDoanhNghiep(res.data.tongSo);
          }
        }catch {}
    }

    const layCacDoanhNghiepsTuDau = () => {
      if (pageNumber !== 1) {
        setPageNumber(1); // thay đổi khác thì chắc chắn re-render và gọi lại layLaiDoanhNghieps() nên không cần gọi ở đây
      }else {
        setForceReRender(forceReRender + 1);
      }
    }

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        if (!modeTimKiem && textTimKiemDoanhNghiep) {
          return;
        }
        setPageNumber(pageNumber + 1);
      }
    };

    const handleTextInputSearch = (text: string) => {
      setTextTimKiemDoanhNghiep(text);

      if (!modeTimKiem) {
        //Nếu không ở chế độ tìm kiếm thì chỉ tìm kiếm trong các phần tử đã tải về client, không tìm trên server
          const listDoanhNghiepsTimKiem = listDoanhNghiepsTemp.filter((item: DoanhNghiep) => {
            return item.dN_Ten?.toLocaleLowerCase().includes(text.toLocaleLowerCase()) || item.dN_MaSoThue?.toLocaleLowerCase().includes(text.toLocaleLowerCase());
        });
        setListDoanhNghieps(listDoanhNghiepsTimKiem);
      }
          
      if (!text) {
        if (modeTimKiem) {
          setModeTimKiem(false);
          layCacDoanhNghiepsTuDau();
        }else {
          setListDoanhNghieps(listDoanhNghiepsTemp);
        }
      }
    }

    const handleTouchSearch = () => {
      if (textTimKiemDoanhNghiep) {
        setModeTimKiem(true);
        layCacDoanhNghiepsTuDau(); 
      }
    }

    const handleTouchDestroySearch = () => {
      if (textTimKiemDoanhNghiep) {
        setTextTimKiemDoanhNghiep('');
        if (modeTimKiem) {
          setModeTimKiem(false);
          layCacDoanhNghiepsTuDau();
        }else {
          setListDoanhNghieps(listDoanhNghiepsTemp);
        }
      }
    }

    const renderItem = ({ item } : {item: DoanhNghiep}) => (
          <TouchableOpacity style={{borderWidth: 0.3, padding: 10}} onPress={() => router.push({pathname: '/doanhNghiepTemplate/chiTietDoanhNghiep', params: {dN_Id: item.dN_Id}})}>
            <View style={{flexDirection: 'row'}}>
                <View>
                    <AvatarDoanhNghiep dN_Id={item.dN_Id as string} width={40} height={40} canChange={false}/>
                </View>
                <View style={{width: 10}}></View>
                <View>
                    <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>{item.dN_Ten}</Text>
                </View>
            </View>
            <Text>{'Thể loại: '}
              <Text style={{fontWeight: 'bold'}}>{item.dN_KieuDN === 1 ? 'Hộ Kinh Doanh Cá Nhân' : 'Doanh Nghiệp'}</Text>
            </Text>
            <Text>{'Mã số thuế: '}
              <Text style={{fontWeight: 'bold'}}>{item.dN_MaSoThue}</Text>
            </Text>
        </TouchableOpacity>
  );

    return (
      <View style={styles.container}>
          <Header title={`Danh sách doanh nghiệp`} fontSize={30} resource={undefined}/>
          <View style={{padding: PADDING_DEFAULT}}>
              <View style={{width: '100%', flexDirection: 'row'}}>
                <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={textTimKiemDoanhNghiep} onChangeText={handleTextInputSearch}></TextInput>
                <TouchableOpacity style={styles.touchDestroySearch} onPress={handleTouchDestroySearch}>
                    <Text>{'X'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchSearch} onPress={handleTouchSearch}>
                  <IconSymbol name={'search'} color={'white'}/>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row'}}>
                {modeTimKiem ? (<Text>{'Kết quả tìm kiếm với từ khóa: '}<Text style={{fontWeight: 'bold'}}>{textTimKiemDoanhNghiep}</Text></Text>) : (<View></View>)}
            </View>
            <View style={{marginTop: 10}}>
              <ThemDoanhNghiep width={150} height={30} paddingVertical={5} fontSize={12}/>
            </View>
          </View>
          <FlatList
                data={listDoanhNghieps}
                keyExtractor={(item: DoanhNghiep, index) => `${item.dN_Id}-${index}`}
                renderItem={renderItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0}
                refreshControl={(
                                <RefreshControl  
                                refreshing={false}
                                onRefresh={layCacDoanhNghiepsTuDau} //hành vi khi refresh
                                progressViewOffset={30}/> //kéo mũi tên xuống bao nhiêu thì refresh
                              )}
                />
            {loading ? (<Loading />) : (<View></View>)}
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