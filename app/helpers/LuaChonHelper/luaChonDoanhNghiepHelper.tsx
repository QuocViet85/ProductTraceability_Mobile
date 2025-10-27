import { LIMIT_DOANHNGHIEP } from "@/app/constant/Limit";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { paginate } from "../LogicHelper/helper";
import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loading from "../ViewHelpers/loading";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function LuaChonDoanhNghiepHelper({showLuaChon, setShowLuaChon, setChonDoanhNghiep}: {showLuaChon: boolean, setShowLuaChon: Function, setChonDoanhNghiep: Function}) 
{
    const [listDoanhNghieps, setListDoanhNghieps] = useState<DoanhNghiep[]>([]);
    const [tongSoDoanhNghiep, setTongSoDoanhNghiep] = useState<number>(0);
    const [textTimKiemDoanhNghiep, setTextTimKiemDoanhNghiep] = useState<string>('');
    const [modeTimKiem, setModeTimKiem] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [reRender, setReRender] = useState<number>(0);
    const [descending, setDescending] = useState<boolean>(true);

    useEffect(() => {
        if (showLuaChon) {
            layCacDoanhNghieps();
        }
    }, [pageNumber, reRender, showLuaChon, descending]);

    const layCacDoanhNghieps = async() => {
        setLoading(true);
        const newListDoanhNghieps: DoanhNghiep[] = [];
            let urlDoanhNghiep = url(`api/doanhnghiep/co-ban?pageNumber=${pageNumber}&limit=${LIMIT_DOANHNGHIEP}&descending=${descending}`);
            if (modeTimKiem) {
                if (textTimKiemDoanhNghiep) {
                    urlDoanhNghiep += `&search=${encodeURIComponent(textTimKiemDoanhNghiep)}`
                }
            }

            try {
                const res = await axios.get(urlDoanhNghiep);
                if (res.data.tongSo) {
                    setTongSoDoanhNghiep(res.data.tongSo);
                }

                if (res.data.listDoanhNghieps) {
                    const listDoanhNghiepsTuBackEnd: DoanhNghiep[] = res.data.listDoanhNghieps;

                    if (pageNumber > 1) {
                        newListDoanhNghieps.push(...listDoanhNghieps, ...listDoanhNghiepsTuBackEnd);
                    }else {
                        newListDoanhNghieps.push(...listDoanhNghiepsTuBackEnd);
                    }
                    setListDoanhNghieps(newListDoanhNghieps);
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

    const tongSoTrang : number = Math.ceil(tongSoDoanhNghiep / LIMIT_DOANHNGHIEP);

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        setPageNumber(pageNumber + 1);
      }
    };

    const handleTextInputSearch = (text: string) => {
      setTextTimKiemDoanhNghiep(text);
      if (!text) {
        setModeTimKiem(false);
        layCacDoanhNghiepTuDau();
      }
    }

    const handleTouchSearch = () => {
      if (textTimKiemDoanhNghiep) {
        setModeTimKiem(true);
        layCacDoanhNghiepTuDau(); 
      }
    }

    const handleTouchDestroySearch = () => {
      if (textTimKiemDoanhNghiep) {
        setTextTimKiemDoanhNghiep('');
        setModeTimKiem(false);
        layCacDoanhNghiepTuDau();
      }
    }

    return (
        <Modal
        visible={showLuaChon}
        animationType="slide">
          <View style={{width: '100%', flexDirection: 'row'}}>
              <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm' value={textTimKiemDoanhNghiep} onChangeText={handleTextInputSearch}></TextInput>
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
            
            <TouchableOpacity style={{borderRadius: 8, borderWidth: 1, width: '100%', padding: 10}} onPress={() => setChonDoanhNghiep(undefined)}>
                <Text style={{fontSize: 16}}>{'Không chọn'}</Text>
            </TouchableOpacity>
            <FlatList
                data={listDoanhNghieps}
                keyExtractor={(item: DoanhNghiep, index) => `${item.dN_Id}-${index}`}
                renderItem={({item}: {item: DoanhNghiep}) => {
                    return (
                        <TouchableOpacity style={{borderRadius: 8, borderWidth: 1, width: '100%', padding: 10}} onPress={() => setChonDoanhNghiep(item)}>
                            <Text style={{fontSize: 16}}>{item.dN_Ten}</Text>
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