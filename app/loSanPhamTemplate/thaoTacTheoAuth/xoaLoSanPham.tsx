import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { LIMIT_LO_SANPHAM } from "@/app/constant/Limit";
import LoSanPham from "@/app/model/LoSanPham";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, Text, TouchableOpacity, View } from "react-native";
import { temp_ListLoSanPhams } from "..";

export default function XoaLoSanPham({loSanPham, listLoSanPhamsHienThi, setTongSo, pageNumber, doanhNghiepSoHuuId, setReRenderLoSanPham, width, height, paddingVertical, fontSize}: {loSanPham: LoSanPham, listLoSanPhamsHienThi: LoSanPham[], setTongSo: Function, pageNumber: number, doanhNghiepSoHuuId: string, setReRenderLoSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenXoa, setQuyenXoa] = useState<boolean>(false);
    const [showModalXoa, setShowModalXoa] = useState<boolean | undefined>(false);

    useEffect(() => {
        layQuyenXoa();
    }, [])

    const layQuyenXoa = async() => {
        const quyenSua = await quyenSuaSanPham(doanhNghiepSoHuuId);

        setQuyenXoa(quyenSua);
    }

    const xoaLoSanPham = async() => {
        try {
            const urlXoaSanPham = url(`api/losanpham/${loSanPham.lsP_Id}`);

            await axios.delete(urlXoaSanPham, {headers: {Authorization: await getBearerToken()}});

            Alert.alert('Thông báo', 'Xóa lô sản phẩm thành công');

            const indexLoSanPhamBiXoaInTemp = temp_ListLoSanPhams.findIndex((loSanPhamInTemp: LoSanPham) => {
                return loSanPhamInTemp.lsP_Id === loSanPham.lsP_Id;
            });

            if (indexLoSanPhamBiXoaInTemp !== -1) {
                temp_ListLoSanPhams.splice(indexLoSanPhamBiXoaInTemp, 1);
            }

            const indexLoSanPhamHienThiBiXoa = listLoSanPhamsHienThi.findIndex((loSanPhamHienThi: LoSanPham) => {
                return loSanPhamHienThi.lsP_Id === loSanPham.lsP_Id;
            });

            if (indexLoSanPhamHienThiBiXoa !== -1) {
                listLoSanPhamsHienThi.splice(indexLoSanPhamBiXoaInTemp, 1);
            }

            const res = await axios.get(url(`api/losanpham/san-pham/${loSanPham.lsP_SP_Id}?pageNumber=${pageNumber}&limit=${LIMIT_LO_SANPHAM}`));
            const listLoSanPhamsTrangCuoiHienTai: LoSanPham[] = res.data;
            if (listLoSanPhamsTrangCuoiHienTai.length > 0) {
                const loSanPhamCuoiCuaTrangCuoiHienTai: LoSanPham = listLoSanPhamsTrangCuoiHienTai[listLoSanPhamsTrangCuoiHienTai.length - 1];
                if (loSanPhamCuoiCuaTrangCuoiHienTai.lsP_Id !== listLoSanPhamsHienThi[listLoSanPhamsHienThi.length - 1]?.lsP_Id) {
                    listLoSanPhamsHienThi.push(loSanPhamCuoiCuaTrangCuoiHienTai);
                }
                if (loSanPhamCuoiCuaTrangCuoiHienTai.lsP_Id !== temp_ListLoSanPhams[temp_ListLoSanPhams.length - 1]?.lsP_Id) {
                    temp_ListLoSanPhams.push(loSanPhamCuoiCuaTrangCuoiHienTai);
                }
            }

            setReRenderLoSanPham((value: number) => value + 1);
            for (const loSanPham of temp_ListLoSanPhams) {
                if (loSanPham.temp_TongSoVoiSanPham) {
                    temp_ListLoSanPhams[0].temp_TongSoVoiSanPham = loSanPham.temp_TongSoVoiSanPham - 1;
                    loSanPham.temp_TongSoVoiSanPham -= 1;
                }
            }
            setTongSo((value: number) => value - 1);
            setShowModalXoa(false);
        }catch {
            Alert.alert('Lỗi', 'Xóa lô sản phẩm thất bại');
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
        transparent={true}>
            <View style={{ marginTop: '80%', alignItems: 'center' }}>
                <View style={{ width: '50%', backgroundColor: '#f2f2f2', borderRadius: 8 }}>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity onPress={xoaLoSanPham}>
                            <IconSymbol name={'delete'} size={50} color={'red'}/>
                        </TouchableOpacity>
                        <Text>{'Xóa lô sản phẩm '}<Text style={{fontWeight: 'bold'}}>{loSanPham.lsP_MaLSP}</Text></Text>
                    </View>
                    <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
                </View>
            </View>
        </Modal>
    </View>) 
    : (<View></View>)
}