import getBearerToken from "@/app/Auth/Authentication";
import { quyenXoaNhaMay } from "@/app/Auth/Authorization/AuthNhaMay";
import NhaMay from "@/app/model/NhaMay";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, View } from "react-native";
import { temp_NhaMay } from "..";
import { TouchableOpacity } from "react-native";

export default function XoaNhaMay({nhaMay, setNhaMay}: {nhaMay: NhaMay, setNhaMay: Function}) {
    const [quyenXoa, setQuyenXoa] = useState<boolean>(false);
    const [showModalXoa, setShowModalXoa] = useState<boolean | undefined>(false);
    
    useEffect(() => {
        layQuyenXoa();
    }, [])

    const layQuyenXoa = async() => {
        const quyenXoa = await quyenXoaNhaMay(nhaMay.nM_Id);

        setQuyenXoa(quyenXoa);
    }

    const xoaNhaMay = async() => {
        try {
            const urlXoaNhaMay = url(`api/nhamay/${nhaMay.nM_Id}`);

            await axios.delete(urlXoaNhaMay, {headers: {Authorization: await getBearerToken()}});

            const indexNhaMayBiXoa = temp_NhaMay.findIndex((nhaMayInTemp: NhaMay) => {
                return nhaMayInTemp.nM_Id === nhaMay.nM_Id;
            });

            if (indexNhaMayBiXoa !== -1) {
                temp_NhaMay.splice(indexNhaMayBiXoa);
            }

            setNhaMay(null);
            setShowModalXoa(false);
        }catch {
            Alert.alert('Lỗi', 'Xóa nhà máy thất bại');
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
                        <Text>{'Chắc chắn xóa nhà máy ?'}</Text>
                        <View style={{width: 50}}>
                            <Button title="Xóa" color={'red'} onPress={xoaNhaMay}></Button>
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