import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { LIMIT_SU_KIEN_TRUY_XUAT } from "@/app/constant/Limit";
import SuKienTruyXuat from "@/app/model/SuKienTruyXuat";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, Text, TouchableOpacity, View } from "react-native";
import { temp_ListSuKienTruyXuats } from "..";

export default function XoaSuKienTruyXuat({suKien, listSuKiensHienThi, pageNumber, setTongSoSuKiens, setReRenderSuKien, width, height, paddingVertical, fontSize}: {suKien: SuKienTruyXuat, setTongSoSuKiens: Function, listSuKiensHienThi: SuKienTruyXuat[], pageNumber: number, setReRenderSuKien: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
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

            Alert.alert('Thông báo', 'Xóa sự kiện truy xuất thành công');

            const indexSuKienBiXoaInTemp = temp_ListSuKienTruyXuats.findIndex((suKienInTemp: SuKienTruyXuat) => {
                return suKienInTemp.sK_Id === suKien.sK_Id;
            });

            if (indexSuKienBiXoaInTemp !== -1) {
                temp_ListSuKienTruyXuats.splice(indexSuKienBiXoaInTemp, 1);
            }

            const indexSuKienBiXoaTrongListHienThi= listSuKiensHienThi.findIndex((suKienHienThi: SuKienTruyXuat) => {
                return suKienHienThi.sK_Id === suKien.sK_Id;
            });

            if (indexSuKienBiXoaTrongListHienThi !== -1) {
                listSuKiensHienThi.splice(indexSuKienBiXoaTrongListHienThi, 1);
            }

            const res = await axios.get(url(`api/sukientruyxuat/san-pham/${suKien.sK_SP_Id}?pageNumber=${pageNumber}&limit=${LIMIT_SU_KIEN_TRUY_XUAT}`));
            const listSuKiensTrangCuoiHienTai: SuKienTruyXuat[] = res.data;
            if (listSuKiensTrangCuoiHienTai.length > 0) {
                const suKienCuoiCuaTrangCuoiHienTai: SuKienTruyXuat = listSuKiensTrangCuoiHienTai[listSuKiensTrangCuoiHienTai.length - 1];
                if (suKienCuoiCuaTrangCuoiHienTai.sK_Id !== listSuKiensHienThi[listSuKiensHienThi.length - 1]?.sK_Id) {
                    listSuKiensHienThi.push(suKienCuoiCuaTrangCuoiHienTai);
                }
                if (suKienCuoiCuaTrangCuoiHienTai.sK_Id !== temp_ListSuKienTruyXuats[temp_ListSuKienTruyXuats.length - 1]?.sK_Id) {
                    temp_ListSuKienTruyXuats.push(suKienCuoiCuaTrangCuoiHienTai);
                }
            }

            setReRenderSuKien((value: number) => value + 1);
            for (const suKien of temp_ListSuKienTruyXuats) {
                if (suKien.temp_TongSoVoiSanPham) {
                    temp_ListSuKienTruyXuats[0].temp_TongSoVoiSanPham = suKien.temp_TongSoVoiSanPham - 1;
                    suKien.temp_TongSoVoiSanPham -= 1;
                }
            }
            setTongSoSuKiens((value: number) => value - 1);
            
            setShowModalXoa(false);
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
        animationType={'slide'}
        transparent= {true}>
            <View style={{ marginTop: '80%', alignItems: 'center' }}>
                <View style={{ width: '50%', backgroundColor: '#f2f2f2', borderRadius: 8 }}>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity onPress={xoaSuKienTruyXuat}>
                            <IconSymbol name={'delete'} size={50} color={'red'}/>
                        </TouchableOpacity>
                        <Text>{'Xóa sự kiện '}<Text style={{fontWeight: 'bold'}}>{suKien.sK_Ten}</Text></Text>
                    </View>
                    <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
                </View>
            </View>
        </Modal>
    </View>) 
    : (<View></View>)
}