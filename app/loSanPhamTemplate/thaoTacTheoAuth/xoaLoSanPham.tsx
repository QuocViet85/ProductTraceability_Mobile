import getBearerToken from "@/app/Auth/Authentication";
import { quyenSuaSanPham, quyenXoaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import LoSanPham from "@/app/model/LoSanPham";
import SanPham from "@/app/model/SanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { temp_ListLoSanPhams } from "..";

export default function XoaLoSanPham({loSanPham, setReRenderLoSanPham, width, height, paddingVertical, fontSize}: {loSanPham: LoSanPham, setReRenderLoSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenXoa, setQuyenXoa] = useState<boolean>(false);
    const [showModalXoa, setShowModalXoa] = useState<boolean | undefined>(false);

    useEffect(() => {
        layQuyenXoa();
    }, [])

    const layQuyenXoa = async() => {
        const quyenSua = await quyenSuaSanPham(loSanPham.lsp_DoanhNghiepSoHuu_Id);

        setQuyenXoa(quyenSua);
    }

    const xoaLoSanPham = async() => {
        try {
            const urlXoaSanPham = url(`api/losanpham/${loSanPham.lsP_Id}`);

            await axios.delete(urlXoaSanPham, {headers: {Authorization: await getBearerToken()}});

            const indexLoSanPhamBiXoaInTemp = temp_ListLoSanPhams.listLoSanPhams.findIndex((loSanPhamInTemp: LoSanPham) => {
                return loSanPhamInTemp.lsP_Id === loSanPham.lsP_Id;
            });

            if (indexLoSanPhamBiXoaInTemp !== -1) {
                temp_ListLoSanPhams.listLoSanPhams.splice(indexLoSanPhamBiXoaInTemp);
            }

            setReRenderLoSanPham((value: number) => value + 1);
            setShowModalXoa(false);
        }catch {
            Alert.alert('Lỗi', 'Xóa lô sản phẩm thất bại');
        }
    }

    return quyenXoa 
    ? (
    <View>
        <TouchableOpacity style={{backgroundColor: 'red', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}} onPress={() => setShowModalXoa(true)}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize}}>Xóa</Text>
        </TouchableOpacity>

        <Modal
            visible={showModalXoa}
            animationType={'slide'}>

            <View style={{marginTop: '90%', alignItems: 'center', borderRadius: 8}}>
                <Text>{'Chắc chắn xóa lô sản phẩm ?'}</Text>
                <View style={{width: 50}}>
                    <Button title="Xóa" color={'red'} onPress={xoaLoSanPham}></Button>
                </View>
            </View>

            <View style={{ marginTop: 'auto'}}>
                <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
            </View>
        </Modal>
    </View>) 
    : (<View></View>)
}