import { LIMIT_NHAMAY } from "@/app/constant/Limit";
import NhaMay from "@/app/model/NhaMay";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loading from "../ViewHelpers/loading";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function LuaChonNhaMayHelper({showLuaChon, setShowLuaChon, setChonNhaMay}: {showLuaChon: boolean, setShowLuaChon: Function, setChonNhaMay: Function}) 
{
    const [listNhaMays, setListNhaMays] = useState<NhaMay[]>([]);
    const [tongSoNhaMay, setTongSoNhaMay] = useState<number>(0);
    const [textTimKiemNhaMay, setTextTimKiemNhaMay] = useState<string>('');
    const [modeTimKiem, setModeTimKiem] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [reRender, setReRender] = useState<number>(0);
    const [descending, setDescending] = useState<boolean>(true);

    useEffect(() => {
        if (showLuaChon) {
            layCacNhaMays();
        }
    }, [pageNumber, reRender, showLuaChon, descending]);

    const layCacNhaMays = async() => {
        setLoading(true);
        const newListNhaMays: NhaMay[] = [];
            let urlNhaMay = url(`api/NhaMay/co-ban?pageNumber=${pageNumber}&limit=${LIMIT_NHAMAY}&descending=${descending}`);
            if (modeTimKiem) {
                if (textTimKiemNhaMay) {
                    urlNhaMay += `&search=${encodeURIComponent(textTimKiemNhaMay)}`
                }
            }

            try {
                const res = await axios.get(urlNhaMay);
                if (res.data.tongSo) {
                    setTongSoNhaMay(res.data.tongSo);
                }

                if (res.data.listNhaMays) {
                    const listNhaMaysTuBackEnd: NhaMay[] = res.data.listNhaMays;

                    if (pageNumber > 1) {
                        newListNhaMays.push(...listNhaMays, ...listNhaMaysTuBackEnd);
                    }else {
                        newListNhaMays.push(...listNhaMaysTuBackEnd);
                    }
                    setListNhaMays(newListNhaMays);
                }
            }catch {}
            setLoading(false);
        }
    

    const layCacNhaMayTuDau = () => {
      if (pageNumber !== 1) {
        setPageNumber(1); 
      }else {
        setReRender((value) => value + 1);
      }
    }

    const tongSoTrang : number = Math.ceil(tongSoNhaMay / LIMIT_NHAMAY);

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        setPageNumber(pageNumber + 1);
      }
    };

    const handleTextInputSearch = (text: string) => {
      setTextTimKiemNhaMay(text);
      if (!text) {
        setModeTimKiem(false);
        layCacNhaMayTuDau();
      }
    }

    const handleTouchSearch = () => {
      if (textTimKiemNhaMay) {
        setModeTimKiem(true);
        layCacNhaMayTuDau(); 
      }
    }

    const handleTouchDestroySearch = () => {
      if (textTimKiemNhaMay) {
        setTextTimKiemNhaMay('');
        setModeTimKiem(false);
        layCacNhaMayTuDau();
      }
    }

    return (
        <Modal
        visible={showLuaChon}
        animationType="slide">
          <View style={{width: '100%', flexDirection: 'row'}}>
              <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={textTimKiemNhaMay} onChangeText={handleTextInputSearch}></TextInput>
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
            
            <TouchableOpacity style={{borderRadius: 8, borderWidth: 1, width: '100%', padding: 10}} onPress={() => setChonNhaMay(undefined)}>
                <Text style={{fontSize: 16}}>{'Không chọn'}</Text>
            </TouchableOpacity>

            <FlatList
                data={listNhaMays}
                keyExtractor={(item: NhaMay, index) => `${item.nM_Id}-${index}`}
                renderItem={({item}: {item: NhaMay}) => {
                    return (
                        <TouchableOpacity style={{borderRadius: 8, borderWidth: 1, width: '100%', padding: 10}} onPress={() => setChonNhaMay(item)}>
                            <Text style={{fontSize: 16}}>{item.nM_Ten}</Text>
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