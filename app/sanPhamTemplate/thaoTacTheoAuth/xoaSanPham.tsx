import getBearerToken from "@/app/Auth/Authentication";
import { quyenXoaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import SanPham from "@/app/model/SanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { temp_SanPham } from "..";

export default function XoaSanPham({sanPham, setSanPham, width, height, paddingVertical, fontSize}: {sanPham: SanPham, setSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenXoa, setQuyenXoa] = useState<boolean>(false);
    const [showModalXoa, setShowModalXoa] = useState<boolean | undefined>(false);

    useEffect(() => {
        layQuyenXoa();
    }, [])

    const layQuyenXoa = async() => {
        const quyenSua = await quyenXoaSanPham(sanPham.sP_DN_SoHuu_Id);

        setQuyenXoa(quyenSua);
    }

    const xoaSanPham = async() => {
        try {
            const urlXoaSanPham = url(`api/sanpham/${sanPham.sP_Id}`);

            await axios.delete(urlXoaSanPham, {headers: {Authorization: await getBearerToken()}});

            const indexSanPhamBiXoaInTemp = temp_SanPham.findIndex((sanPhamInTemp: SanPham) => {
                return sanPhamInTemp.sP_MaTruyXuat === sanPham.sP_MaTruyXuat;
            });

            if (indexSanPhamBiXoaInTemp !== -1) {
                temp_SanPham.splice(indexSanPhamBiXoaInTemp);
            }

            setSanPham(null);
            setShowModalXoa(false);
        }catch {
            Alert.alert('Lỗi', 'Xóa sản phẩm thất bại');
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
                <Text>{'Chắc chắn xóa sản phẩm ?'}</Text>
                <View style={{width: 50}}>
                    <Button title="Xóa" color={'red'} onPress={xoaSanPham}></Button>
                </View>
            </View>

            <View style={{ marginTop: 'auto'}}>
                <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
            </View>
        </Modal>
    </View>) 
    : (<View></View>)
}