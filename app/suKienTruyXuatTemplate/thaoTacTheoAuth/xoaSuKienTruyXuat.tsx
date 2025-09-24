import getBearerToken from "@/app/Auth/Authentication";
import { quyenSuaSanPham, quyenXoaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import SuKienTruyXuat from "@/app/model/SuKienTruyXuat";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { temp_ListSuKienTruyXuats } from "..";

export default function XoaSuKienTruyXuat({suKien, setReRenderSuKien, width, height, paddingVertical, fontSize}: {suKien: SuKienTruyXuat, setReRenderSuKien: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenXoa, setQuyenXoa] = useState<boolean>(false);
    const [showModalXoa, setShowModalXoa] = useState<boolean | undefined>(false);

    useEffect(() => {
        layQuyenXoa();
    }, [])

    const layQuyenXoa = async() => {
        const quyenSua = await quyenSuaSanPham(suKien.sK_DoanhNghiepSoHuu_Id);

        setQuyenXoa(quyenSua);
    }

    const xoaSuKienTruyXuat = async() => {
        try {
            const urlXoaSuKien = url(`api/sukientruyxuat/${suKien.sK_Id}`);

            await axios.delete(urlXoaSuKien, {headers: {Authorization: await getBearerToken()}});

            const indexSuKienInTemp = temp_ListSuKienTruyXuats.findIndex((suKienInTemp: SuKienTruyXuat) => {
                return suKienInTemp.sK_Id === suKien.sK_Id;
            });

            if (indexSuKienInTemp !== -1) {
                temp_ListSuKienTruyXuats.splice(indexSuKienInTemp, 1);
            }

            setReRenderSuKien((value: number) => value + 1);
            setShowModalXoa(false);
            Alert.alert('Thông báo', 'Xóa sự kiện truy xuất thành công');
        }catch {
            Alert.alert('Lỗi', 'Xóa sự kiện truy xuất thất bại');
        }
    }

    return quyenXoa 
    ? (
    <View>
        <TouchableOpacity style={{backgroundColor: 'red', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}} onPress={() => setShowModalXoa(true)}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize}}>{'Xóa'}</Text>
        </TouchableOpacity>

        <Modal
            visible={showModalXoa}
            animationType={'slide'}>

            <View style={{marginTop: '90%', alignItems: 'center', borderRadius: 8}}>
                <Text>{'Chắc chắn xóa sự kiện truy xuất ?'}</Text>
                <View style={{width: 50}}>
                    <Button title="Xóa" color={'red'} onPress={xoaSuKienTruyXuat}></Button>
                </View>
            </View>

            <View style={{ marginTop: 'auto'}}>
                <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
            </View>
        </Modal>
    </View>) 
    : (<View></View>)
}