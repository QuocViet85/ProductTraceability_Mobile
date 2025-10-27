import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenXoaDoanhNghiep } from "@/app/Auth/Authorization/AuthDoanhNghiep";
import { LIMIT_DOANHNGHIEP } from "@/app/constant/Limit";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { temp_DoanhNghiep } from "../";
import { listDoanhNghiepsHienThiTrangChu, modeTimKiemTrangChuListDoanhNghieps, pageNumberTrangChuListDoanhNghieps, reRenderTrangChuListDoanhNghieps, setTongDoanhNghiep, textTimKiemTrangChuListDoanhNghieps } from "../../danhSachDoanhNghiep";

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

            const indexDoanhNghiepBiXoaInTemp = temp_DoanhNghiep.findIndex((doanhNghiepInTemp: {doanhNghiep: DoanhNghiep, soSanPham: number}) => {
                return doanhNghiepInTemp.doanhNghiep.dN_Id === doanhNghiep.dN_Id;
            });

            if (indexDoanhNghiepBiXoaInTemp !== -1) {
                temp_DoanhNghiep.splice(indexDoanhNghiepBiXoaInTemp, 1);
            }

            const indexDoanhNghiepBiXoaInTrangChu = listDoanhNghiepsHienThiTrangChu.findIndex((doanhNghiepInTrangChu: DoanhNghiep) => {
                return doanhNghiepInTrangChu.dN_Id === doanhNghiep.dN_Id;
            });

            if (indexDoanhNghiepBiXoaInTrangChu !== -1) {
                listDoanhNghiepsHienThiTrangChu.splice(indexDoanhNghiepBiXoaInTrangChu, 1);
            }

            setDoanhNghiep(null);
            const res = await axios.get(url(`api/doanhnghiep?pageNumber=${pageNumberTrangChuListDoanhNghieps}&limit=${LIMIT_DOANHNGHIEP}${modeTimKiemTrangChuListDoanhNghieps ? `&search=${textTimKiemTrangChuListDoanhNghieps}` :  ''}`));
            const listDoanhNghiepsTrangCuoiHienTai: DoanhNghiep[] = res.data;
            if (listDoanhNghiepsTrangCuoiHienTai.length > 0) {
                const doanhNghiepCuoiCuaTrangCuoiHienTai: DoanhNghiep = listDoanhNghiepsTrangCuoiHienTai[listDoanhNghiepsTrangCuoiHienTai.length - 1];
                if (doanhNghiepCuoiCuaTrangCuoiHienTai.dN_Id !== listDoanhNghiepsHienThiTrangChu[listDoanhNghiepsHienThiTrangChu.length - 1]?.dN_Id) {
                    listDoanhNghiepsHienThiTrangChu.push(doanhNghiepCuoiCuaTrangCuoiHienTai);
                }
            }

            setTongDoanhNghiep((value: number) =>  value - 1);
            reRenderTrangChuListDoanhNghieps((value: number) => value + 1);
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
                animationType={'slide'}
                transparent={true}>
                    <View style={{ marginTop: '80%', alignItems: 'center' }}>
                        <View style={{ width: '50%', backgroundColor: '#f2f2f2', borderRadius: 8 }}>
                            <View style={{alignItems: 'center'}}>
                                <TouchableOpacity onPress={xoaDoanhNghiep}>
                                    <IconSymbol name={'delete'} size={50} color={'red'}/>
                                </TouchableOpacity>
                                <Text>{'Xóa doanh nghiệp '}<Text style={{fontWeight: 'bold'}}>{doanhNghiep.dN_Ten}</Text></Text>
                            </View>
                            <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
                        </View>
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