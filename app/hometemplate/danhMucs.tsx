import axios from "axios";
import { useEffect, useState } from "react";
import { Button, FlatList, Modal, Text, TextInput, View } from "react-native";
import { url } from "../server/backend";
import ListDanhMucs from "./listDanhMucs";

export const tatCaDanhMuc = {id: 0, dM_Ten: 'Tất cả'};

export default function DanhMucs({danhMucHienTai, setDanhMucHienTai} : {danhMucHienTai: any, setDanhMucHienTai: any}){
    const [showModal, setShowModal] = useState(false);
    const [listDanhMucs, setListDanhMucs] = useState([]);
    const [timKiemDanhMuc, setTimKiemDanhMuc] = useState('');

    useEffect(() => {
        console.log(url('api/danhmuc'))
            axios.get(url('api/danhmuc')).then((res: any) => {
            const listDanhMucs = res.data.listDanhMucs;
            listDanhMucs.unshift(tatCaDanhMuc);
            setListDanhMucs(listDanhMucs)
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);

    const filterDanhMucs = listDanhMucs.filter((danhMuc : any) => {
        if (danhMuc.dM_Ten) {
            return danhMuc.dM_Ten.toLowerCase().includes(timKiemDanhMuc.toLowerCase());
        }
    }
    );

    return (
        <View style={{width: '100%'}}>
            <View style={{alignItems: 'center', margin: 10}}>
                <Text style={{borderWidth: 1, borderColor: 'grey'}} onPress={() => setShowModal(true)}>{danhMucHienTai.dM_Ten === 'Tất cả' ? 'Danh mục ▼' : danhMucHienTai.dM_Ten + ' ▼'}</Text>
            </View>
                  
            <Modal
            visible={showModal}
            animationType='slide'
            presentationStyle='fullScreen'
            >
            <View style={{alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Chọn danh mục</Text>
                <TextInput style={{borderWidth: 1, width: '80%', margin: 10, height: 40}} placeholder='Tìm kiếm' value={timKiemDanhMuc} onChangeText={setTimKiemDanhMuc}></TextInput>
            </View>
            <ListDanhMucs listDanhMucs={filterDanhMucs} setDanhMucHienTai={setDanhMucHienTai} setShowModal={setShowModal} />
            <Button title='Đóng' onPress={() => setShowModal(false)}></Button>    
            </Modal>
        </View>
    );
}