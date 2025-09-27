import getBearerToken from "@/app/Auth/Authentication";
import { quyenXoaDoanhNghiep } from "@/app/Auth/Authorization/AuthDoanhNghiep";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { temp_DoanhNghiep } from "..";

export default function XoaDoanhNghiep({doanhNghiep, setDoanhNghiep}: {doanhNghiep: DoanhNghiep, setDoanhNghiep: Function}) {
    const [quyenXoa, setQuyenXoa] = useState<boolean>(false);
    const [showModalXoa, setShowModalXoa] = useState<boolean | undefined>(false);
    
    useEffect(() => {
        layQuyenXoa();
    }, [])

    const layQuyenXoa = async() => {
        const quyenXoa = await quyenXoaDoanhNghiep(doanhNghiep.dN_Id);

        setQuyenXoa(quyenXoa);
    }

    const xoaDoanhNghiep = async() => {
        try {
            const urlXoaDoanhNghiep = url(`api/doanhnghiep/${doanhNghiep.dN_Id}`);

            await axios.delete(urlXoaDoanhNghiep, {headers: {Authorization: await getBearerToken()}});

            Alert.alert('Thông báo', 'Xóa doanh nghiệp thành công');

            const indexDoanhNghiepBiXoa = temp_DoanhNghiep.findIndex((doanhNghiepInTemp: {doanhNghiep: DoanhNghiep, soSanPham: number}) => {
                return doanhNghiepInTemp.doanhNghiep.dN_Id === doanhNghiep.dN_Id;
            });

            if (indexDoanhNghiepBiXoa !== -1) {
                temp_DoanhNghiep.splice(indexDoanhNghiepBiXoa);
            }

            setDoanhNghiep(null);
            setShowModalXoa(false);
        }catch {
            Alert.alert('Lỗi', 'Xóa doanh nghiệp thất bại');
        }
    }
    return quyenXoa ? (
            <View style={styles.statBox}>
                <TouchableOpacity style={{width: '100%', alignItems: 'center'}} onPress={() => setShowModalXoa(true)}>
                    <Text style={styles.statValue}>{'Xóa'}</Text>
                </TouchableOpacity>

                <Modal
                    visible={showModalXoa}
                    animationType={'slide'}>
        
                    <View style={{marginTop: '90%', alignItems: 'center', borderRadius: 8}}>
                        <Text>{'Chắc chắn xóa sản phẩm ?'}</Text>
                        <View style={{width: 50}}>
                            <Button title="Xóa" color={'red'} onPress={xoaDoanhNghiep}></Button>
                        </View>
                    </View>
        
                    <View style={{ marginTop: 'auto'}}>
                        <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
                    </View>
                </Modal>
            </View>
        ) : (<View></View>)
}

const styles = StyleSheet.create({
    statBox: {
    width: '48%',
    backgroundColor: 'red',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontWeight: 'bold', fontSize: 16, color: 'black' }
})