import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function ListDanhMucs({listDanhMucs, setDanhMucHienTai, setShowModal} : {listDanhMucs: any, setDanhMucHienTai: any, setShowModal: any}) {
    return (    
    <View>
        <FlatList
        style={{width: '100%'}}
        data={listDanhMucs}
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
            </View>
            </TouchableOpacity>
        </View>
            )
        } />
    </View>
    )
    
}