import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Text, View } from "react-native";
import { url } from "../../server/backend";
import ListDanhMucs from "./listDanhMucs";

export const tatCaDanhMuc = {id: 0, dM_Ten: 'Tất cả'};

export default function DanhMucs({danhMucHienTai, setDanhMucHienTai} : {danhMucHienTai: any, setDanhMucHienTai: any}){
    const [showModal, setShowModal] = useState(false);
    const [listDanhMucsCha, setListDanhMucsCha] = useState<any[]>([]);
    const [listDanhMucsHienTai, setListDanhMucsHienTai] = useState<any[]>([]);

    useEffect(() => {
        console.log(url('api/danhmuc'))
            axios.get(url('api/danhmuc')).then((res: any) => {
            const listDanhMucs = res.data.listDanhMucs;
            listDanhMucs.unshift(tatCaDanhMuc);
            setListDanhMucsHienTai(listDanhMucs);
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);

    const moListDanhMucCon = (danhMuc: any) => {
        if (danhMuc.dM_List_DMCon && danhMuc.dM_List_DMCon.length > 0) {
            listDanhMucsCha.push(listDanhMucsHienTai);
            setListDanhMucsCha(listDanhMucsCha);
            setListDanhMucsHienTai(danhMuc.dM_List_DMCon);
        }
    }

    const quayLaiListDanhMucCha = () => {
        setListDanhMucsHienTai(listDanhMucsCha.pop());
    }

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

                {listDanhMucsCha.length > 0 ? (
                <View style={{marginRight: 'auto'}}>
                    <Text style={{borderWidth: 1}} onPress={() => quayLaiListDanhMucCha()}>{'< < <'}</Text>
                </View>) : (<View></View>)}
                
            <View style={{alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Chọn danh mục</Text>
            </View>
                <ListDanhMucs listDanhMucs={listDanhMucsHienTai} setDanhMucHienTai={setDanhMucHienTai} setShowModal={setShowModal} moListDanhMucCon={moListDanhMucCon} />
            <Button title='Đóng' onPress={() => setShowModal(false)}></Button>    
            </Modal>
        </View>
    );
}