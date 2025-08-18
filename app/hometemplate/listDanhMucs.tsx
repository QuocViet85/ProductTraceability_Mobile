import { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ListDanhMucs({listDanhMucs, setDanhMucHienTai, setShowModal, moListDanhMucCon} : {listDanhMucs: any, setDanhMucHienTai: any, setShowModal: any, moListDanhMucCon: any}) {
    const [timKiemDanhMuc, setTimKiemDanhMuc] = useState('');

    const filterDanhMucs = listDanhMucs.filter((danhMuc : any) => {
        if (danhMuc.dM_Ten) {
            return danhMuc.dM_Ten.toLowerCase().includes(timKiemDanhMuc.toLowerCase());
        }
    }
    );
    return (    
    <View>
        <TextInput style={{borderWidth: 1, width: '80%', margin: 10, height: 40}} placeholder='Tìm kiếm' value={timKiemDanhMuc} onChangeText={setTimKiemDanhMuc}></TextInput>
        <FlatList
        style={{width: '100%'}}
        data={filterDanhMucs}
        renderItem={({item} : {item: any}) => 
        (
        <View>
            <TouchableOpacity
            style={{borderBlockColor:'black', borderWidth: 1, width: '100%', borderRadius: 5, padding: 10}}
            onPress={() => {
            setDanhMucHienTai(item)
            setShowModal(false);
            }}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 16}}>{item.dM_Ten}</Text>
                {item.dM_List_DMCon && item.dM_List_DMCon.length > 0 ? (
                    <View style={{marginLeft: 'auto'}}>
                         <Text style={{borderWidth: 1}} onPress={() => moListDanhMucCon(item)}>{"> > >"}</Text>
                    </View>) : (<View></View>)}
                
            </View>
            </TouchableOpacity>
        </View>
            )
        } />
    </View>
    )
    
}