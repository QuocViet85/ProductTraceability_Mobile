import DanhMuc from "@/app/model/DanhMuc";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, DimensionValue, FlexAlignType, Modal, Text, TouchableOpacity, View } from "react-native";
import ListDanhMucs from "./listDanhMucs";
import { url } from "../server/backend";
import { PADDING_DEFAULT } from "../constant/Style";

export const khongChonDanhMuc = {dM_Id: undefined, dM_Ten: 'Không Chọn'};

export default function DanhMucs({danhMucHienTai, setDanhMucHienTai, height, alignItems} : {danhMucHienTai: DanhMuc, setDanhMucHienTai: any, height: DimensionValue | undefined, alignItems: FlexAlignType | undefined}){
    const [showModal, setShowModal] = useState(false);
    const [listDanhMucsCha, setListDanhMucsCha] = useState<(DanhMuc | DanhMuc[])[]>([]);
    const [listDanhMucsHienTai, setListDanhMucsHienTai] = useState<DanhMuc[]>([]);

    useEffect(() => {
            axios.get(url('api/danhmuc')).then((res: any) => {
            const listDanhMucs = res.data.listDanhMucs;
            listDanhMucs.unshift(khongChonDanhMuc);
            setListDanhMucsHienTai(listDanhMucs);
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);

    const moListDanhMucCon = (danhMuc: DanhMuc) => {
        if (danhMuc.dM_List_DMCon && danhMuc.dM_List_DMCon.length > 0) {
            listDanhMucsCha.push(listDanhMucsHienTai);
            setListDanhMucsCha(listDanhMucsCha);
            setListDanhMucsHienTai(danhMuc.dM_List_DMCon);
        }
    }

    const quayLaiListDanhMucCha = () => {
        setListDanhMucsHienTai(listDanhMucsCha.pop() as DanhMuc[]);
    }

    return (
        <View style={{width: '100%'}}>
            <View style={{alignItems: alignItems}}>
                <View>
                    <Text style={{borderWidth: 1, borderColor: 'grey', borderRadius: 8, height: height, paddingLeft: PADDING_DEFAULT, paddingRight: PADDING_DEFAULT, paddingTop: 5, paddingBottom: 5}} onPress={() => setShowModal(true)}>{danhMucHienTai.dM_Id === undefined ? 'Danh mục ▼' : danhMucHienTai.dM_Ten + ' ▼'}</Text>
                </View>
                
            </View>
                  
            <Modal
            visible={showModal}
            animationType='slide'
            presentationStyle='fullScreen'
            >

                {listDanhMucsCha.length > 0 ? (
                <TouchableOpacity style={{marginRight: 'auto'}} onPress={() => quayLaiListDanhMucCha()}>
                    <IconSymbol name={'arrow-back'} color={'blue'} size={30}/>
                </TouchableOpacity>) : (<View></View>)}
                
            <View style={{alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>{'Chọn danh mục'}</Text>
            </View>
            <ListDanhMucs listDanhMucs={listDanhMucsHienTai} setDanhMucHienTai={setDanhMucHienTai} setShowModal={setShowModal} moListDanhMucCon={moListDanhMucCon} />

            <View style={{marginTop: 'auto'}}>
                <Button title='Đóng' onPress={() => setShowModal(false)}></Button>
            </View>    
            </Modal>
        </View>
    );
}