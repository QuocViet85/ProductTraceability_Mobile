import DanhMuc from "@/app/model/DanhMuc";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PADDING_DEFAULT } from "../constant/Style";
import BlurLine from "../helpers/ViewHelpers/blurLine";

export default function ListDanhMucs({listDanhMucs, setDanhMucHienTai, setShowModal, moListDanhMucCon} : {listDanhMucs: DanhMuc[], setDanhMucHienTai: Function, setShowModal: Function, moListDanhMucCon: Function}) {
    const [timKiemDanhMuc, setTimKiemDanhMuc] = useState<string>('');

    const filterDanhMucs = listDanhMucs.filter((danhMuc : DanhMuc) => {
        if (danhMuc.dM_Ten) {
            return danhMuc.dM_Ten.toLowerCase().includes(timKiemDanhMuc.toLowerCase());
        }
    }
    );
    return (    
    <View>
        <TextInput style={{borderWidth: 1, borderRadius: 8, width: '80%', margin: 10, height: 40}} placeholder='Tìm kiếm' value={timKiemDanhMuc} onChangeText={setTimKiemDanhMuc}></TextInput>
        <FlatList
        style={{width: '100%'}}
        data={filterDanhMucs}
        renderItem={({item} : {item: DanhMuc}) => 
        (
        <View style={{paddingLeft: PADDING_DEFAULT, paddingRight: PADDING_DEFAULT}}>
            <TouchableOpacity
            style={{borderBlockColor:'black', width: '100%', borderRadius: 5}}
            onPress={() => {
            setDanhMucHienTai(item)
            setShowModal(false);
            }}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 16}}>{item.dM_Ten}</Text>
                {item.dM_List_DMCon && item.dM_List_DMCon.length > 0 ? (
                    <TouchableOpacity style={{marginLeft: 'auto'}} onPress={() => moListDanhMucCon(item)}>
                         <IconSymbol name={'arrow-forward'} color={'blue'} size={30}/>
                    </TouchableOpacity>) : (<View></View>)}
                
            </View>
            </TouchableOpacity>
            <BlurLine />
        </View>
            )
        } />
    </View>
    )
    
}