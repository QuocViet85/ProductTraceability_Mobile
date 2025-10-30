import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenXoaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { LIMIT_SANPHAM } from "@/app/constant/Limit";
import SanPham from "@/app/model/SanPham";
import { listSanPhamsHienThiTrangChu, modeTimKiemTrangChuListSanPhams, pageNumberTrangChuListSanPhams, reRenderTrangChuListSanPhams, setTongSanPham, textTimKiemTrangChuListSanPhams } from "@/app/sanPhamTemplate/danhSachSanPham/danhSachSanPham";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, Text, TouchableOpacity, View } from "react-native";
import { temp_SanPham } from "..";
import { PADDING_DEFAULT } from "@/app/constant/Style";

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

            Alert.alert('Thông báo', 'Xóa sản phẩm thành công');

            const indexSanPhamBiXoaInTemp = temp_SanPham.findIndex((sanPhamInTemp: SanPham) => {
                return sanPhamInTemp.sP_MaTruyXuat === sanPham.sP_MaTruyXuat;
            });

            if (indexSanPhamBiXoaInTemp !== -1) {
                temp_SanPham.splice(indexSanPhamBiXoaInTemp, 1);
            }

            const indexSanPhamBiXoaInTrangChu = listSanPhamsHienThiTrangChu.findIndex((sanPhamInTrangChu: SanPham) => {
                return sanPhamInTrangChu.sP_MaTruyXuat === sanPham.sP_MaTruyXuat;
            });

            if (indexSanPhamBiXoaInTrangChu !== -1) {
                listSanPhamsHienThiTrangChu.splice(indexSanPhamBiXoaInTrangChu, 1);
            }

            setSanPham(null);
            const res = await axios.get(url(`api/sanpham?pageNumber=${pageNumberTrangChuListSanPhams}&limit=${LIMIT_SANPHAM}${modeTimKiemTrangChuListSanPhams ? `&search=${textTimKiemTrangChuListSanPhams}` :  ''}`));
            const listSanPhamsTrangCuoiHienTai: SanPham[] = res.data;
            if (listSanPhamsTrangCuoiHienTai.length > 0) {
                const sanPhamCuoiCuaTrangCuoiHienTai: SanPham = listSanPhamsTrangCuoiHienTai[listSanPhamsTrangCuoiHienTai.length - 1];
                if (sanPhamCuoiCuaTrangCuoiHienTai.sP_Id !== listSanPhamsHienThiTrangChu[listSanPhamsHienThiTrangChu.length - 1]?.sP_Id) {
                    listSanPhamsHienThiTrangChu.push(sanPhamCuoiCuaTrangCuoiHienTai);
                }
            }
            reRenderTrangChuListSanPhams((value: number) => value + 1);
            setTongSanPham((value: number) => value - 1);
            setShowModalXoa(false);
        }catch {
            Alert.alert('Lỗi', 'Xóa sản phẩm thất bại');
        }
    }

    return quyenXoa 
    ? (
    <View>
        <TouchableOpacity style={{backgroundColor: 'red', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center', padding: PADDING_DEFAULT}} onPress={() => setShowModalXoa(true)}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize}}>{'Xóa'}</Text>
        </TouchableOpacity>

        <Modal
            visible={showModalXoa}
            animationType={'slide'}
            transparent= {true}>
            <View style={{ marginTop: '80%', alignItems: 'center' }}>
                <View style={{ width: '50%', backgroundColor: '#f2f2f2', borderRadius: 8 }}>
                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity onPress={xoaSanPham}>
                            <IconSymbol name={'delete'} size={50} color={'red'}/>
                        </TouchableOpacity>
                        <Text>{'Xóa sản phẩm '}<Text style={{fontWeight: 'bold'}}>{sanPham.sP_Ten}</Text></Text>
                    </View>
                    <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
                </View>
            </View>
        </Modal>
    </View>) 
    : (<View></View>)
}