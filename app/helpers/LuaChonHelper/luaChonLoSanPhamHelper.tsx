import { LIMIT_DOANHNGHIEP } from "@/app/constant/Limit";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loading from "../ViewHelpers/loading";
import { IconSymbol } from "@/components/ui/IconSymbol";
import LoSanPham from "@/app/model/LoSanPham";

export default function LuaChonLoSanPhamHelper({sP_Id, showLuaChon, setShowLuaChon, setChonLoSanPham}: {sP_Id: string, showLuaChon: boolean, setShowLuaChon: Function, setChonLoSanPham: Function}) 
{
    const [listLoSanPhams, setListLoSanPhams] = useState<LoSanPham[]>([]);
    const [tongSoLoSanPham, setTongSoLoSanPham] = useState<number>(0);
    const [textTimKiemLoSanPham, setTextTimKiemLoSanPham] = useState<string>('');
    const [modeTimKiem, setModeTimKiem] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [reRender, setReRender] = useState<number>(0);
    const [descending, setDescending] = useState<boolean>(true);

    useEffect(() => {
        if (showLuaChon) {
            layCacLoSanPhams();
        }
    }, [pageNumber, reRender, showLuaChon, descending]);

    const layCacLoSanPhams = async() => {
        setLoading(true);
        const newListDoanhNghieps: LoSanPham[] = [];
            let urlLoSanPham = url(`api/losanpham/san-pham/co-ban/${sP_Id}?pageNumber=${pageNumber}&limit=${LIMIT_DOANHNGHIEP}&descending=${descending}`);
            if (modeTimKiem) {
                if (textTimKiemLoSanPham) {
                    urlLoSanPham += `&search=${encodeURIComponent(textTimKiemLoSanPham)}`
                }
            }

            try {
                const res = await axios.get(urlLoSanPham);
                if (res.data.tongSo) {
                    setTongSoLoSanPham(res.data.tongSo);
                }

                if (res.data.listLoSanPhams) {
                    const listLoSanPhamsTuBackEnd: LoSanPham[] = res.data.listLoSanPhams;

                    if (pageNumber > 1) {
                        newListDoanhNghieps.push(...listLoSanPhams, ...listLoSanPhamsTuBackEnd);
                    }else {
                        newListDoanhNghieps.push(...listLoSanPhamsTuBackEnd);
                    }
                    setListLoSanPhams(newListDoanhNghieps);
                }
            }catch {}
            setLoading(false);
        }
    

    const layCacDoanhNghiepTuDau = () => {
      if (pageNumber !== 1) {
        setPageNumber(1); 
      }else {
        setReRender((value) => value + 1);
      }
    }

    const tongSoTrang : number = Math.ceil(tongSoLoSanPham / LIMIT_DOANHNGHIEP);

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        setPageNumber(pageNumber + 1);
      }
    };

    const handleTextInputSearch = (text: string) => {
      setTextTimKiemLoSanPham(text);
      if (!text) {
        setModeTimKiem(false);
        layCacDoanhNghiepTuDau();
      }
    }

    const handleTouchSearch = () => {
      if (textTimKiemLoSanPham) {
        setModeTimKiem(true);
        layCacDoanhNghiepTuDau(); 
      }
    }

    const handleTouchDestroySearch = () => {
      if (textTimKiemLoSanPham) {
        setTextTimKiemLoSanPham('');
        setModeTimKiem(false);
        layCacDoanhNghiepTuDau();
      }
    }

    return (
        <Modal
        visible={showLuaChon}
        animationType="slide">
          <View style={{width: '100%', flexDirection: 'row'}}>
              <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={textTimKiemLoSanPham} onChangeText={handleTextInputSearch}></TextInput>
              <TouchableOpacity style={styles.touchDestroySearch} onPress={handleTouchDestroySearch}>
                  <Text>{'X'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.touchSearch} onPress={handleTouchSearch}>
                  <IconSymbol name={'search'} color={'white'}/>
              </TouchableOpacity>
          </View>

          <View style={{height: 45, marginLeft: 'auto'}}>
              {descending ? (
                <TouchableOpacity onPress={() => setDescending(false)}>
                  <IconSymbol name={'arrow-downward'} color={'blue'} size={40}/>
              </TouchableOpacity>) : (
                <TouchableOpacity onPress={() => setDescending(true)}>
                  <IconSymbol name={'arrow-upward'} color={'blue'} size={40}/>
              </TouchableOpacity>)}
          </View>
            
            <TouchableOpacity style={{borderRadius: 8, borderWidth: 1, width: '100%', padding: 10}} onPress={() => setChonLoSanPham(undefined)}>
                <Text style={{fontSize: 16}}>{'Không chọn'}</Text>
            </TouchableOpacity>
            <FlatList
                data={listLoSanPhams}
                keyExtractor={(item: LoSanPham, index) => `${item.lsP_Id}-${index}`}
                renderItem={({item}: {item: LoSanPham}) => {
                    return (
                        <TouchableOpacity style={{borderRadius: 8, borderWidth: 1, width: '100%', padding: 10}} onPress={() => setChonLoSanPham(item)}>
                            <Text style={{fontSize: 16}}>{item.lsP_MaLSP}</Text>
                            <Text style={{fontSize: 16}}>{item.lsP_Ten}</Text>
                        </TouchableOpacity>
                    )
                }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0}
                />
            {loading ? (<Loading />) : null}
            <View style={{ marginTop: 'auto'}}>
                <Button title="Đóng" onPress={() => setShowLuaChon(false)}></Button>
            </View>
        </Modal>
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
  }
})