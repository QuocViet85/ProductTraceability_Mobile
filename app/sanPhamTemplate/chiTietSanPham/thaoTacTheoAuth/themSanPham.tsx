import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenThemSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { LIMIT_SANPHAM } from "@/app/constant/Limit";
import { PADDING_DEFAULT } from "@/app/constant/Style";
import DanhMucs, { khongChonDanhMuc } from "@/app/danhMucTemplate/danhMucs";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import LuaChonDoanhNghiepHelper from "@/app/helpers/LuaChonHelper/luaChonDoanhNghiepHelper";
import LuaChonNhaMayHelper from "@/app/helpers/LuaChonHelper/luaChonNhaMayHelper";
import DanhMuc from "@/app/model/DanhMuc";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import NhaMay from "@/app/model/NhaMay";
import SanPham from "@/app/model/SanPham";
import { listSanPhamsHienThiTrangChu, modeTimKiemTrangChuListSanPhams, reRenderTrangChuListSanPhams, setTongSanPham, textTimKiemTrangChuListSanPhams } from "@/app/sanPhamTemplate/danhSachSanPham/danhSachSanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useState } from "react";
import { Alert, Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ThemSanPham({width, height, paddingVertical, fontSize}: { width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [showModalThem, setShowModalThem] = useState<boolean | undefined>(false);

    const [ten, setTen] = useState<string | undefined>(undefined);
    const [maTruyXuat, setMaTruyXuat] = useState<string | undefined>(undefined);
    const [maVach, setMaVach] = useState<string | undefined>(undefined);
    const [moTa, setMoTa] = useState<string | undefined>(undefined);
    const [website, setWebsite] = useState<string | undefined>(undefined);
    const [gia, setGia] = useState<string | undefined>(undefined);
    const [hangSanXuat, setHangSanXuat] = useState<string | undefined>(undefined)
    const [maQuocGia, setMaQuocGia] = useState<string | undefined>(undefined);

    const [showLuaChonDoanhNghiepSoHuu, setShowLuaChonDoanhNghiepSoHuu] = useState<boolean>(false);
    const [doanhNghiepSoHuu, setDoanhNghiepSoHuu] = useState<DoanhNghiep | undefined>(undefined);

    const [showLuaChonDoanhNghiepSanXuat, setShowLuaChonDoanhNghiepSanXuat] = useState<boolean>(false);
    const [doanhNghiepSanXuat, setDoanhNghiepSanXuat] = useState<DoanhNghiep | undefined>(undefined);

    const [showLuaChonDoanhNghiepVanTai, setShowLuaChonDoanhNghiepVanTai] = useState<boolean>(false);
    const [doanhNghiepVanTai, setDoanhNghiepVanTai] = useState<DoanhNghiep | undefined>(undefined);

    const [showLuaChonNhaMay, setShowLuaChonNhaMay] = useState<boolean>(false);
    const [nhaMay, setNhaMay] = useState<NhaMay | undefined>(undefined);

    const [danhMuc, setDanhMuc] = useState<DanhMuc>(khongChonDanhMuc as DanhMuc);

    const setChonDoanhNghiepSoHuu = async(doanhNghiep: DoanhNghiep) => {
        if (!doanhNghiep) {
            Alert.alert('Lỗi', 'Phải có doanh nghiệp sở hữu');
            return;
        }
        const quyenThem = await quyenThemSanPham(doanhNghiep.dN_Id);

        if (!quyenThem) {
            Alert.alert('Lỗi', 'Bạn không có quyền thêm sản phẩm cho doanh nghiệp này');
        }
        setDoanhNghiepSoHuu(doanhNghiep);
        setShowLuaChonDoanhNghiepSoHuu(false);
    }

    const setChonDoanhNghiepSanXuat = (doanhNghiep: DoanhNghiep) => {
        setDoanhNghiepSanXuat(doanhNghiep);
        setShowLuaChonDoanhNghiepSanXuat(false);
    }

    const setChonDoanhNghiepVanTai= (doanhNghiep: DoanhNghiep) => {
        setDoanhNghiepVanTai(doanhNghiep);
        setShowLuaChonDoanhNghiepVanTai(false);
    }

    const setChonNhaMay= (nhaMay: NhaMay) => {
        setNhaMay(nhaMay);
        setShowLuaChonNhaMay(false);
    }

    const themSanPham = async() => {
        try {
            if (validate()) {
                const urlThemSanPham = url(`api/sanpham`);

                const res = await axios.post(urlThemSanPham, {
                    sP_Ten: ten,
                    sP_MaTruyXuat: maTruyXuat,
                    sP_MaVach: maVach,
                    sP_MoTa: moTa,
                    sP_Website: website,
                    sP_Gia: gia,
                    sP_MaQuocGia: maQuocGia,
                    sP_HangSanXuat: hangSanXuat,
                    sP_DN_SoHuu_Id: doanhNghiepSoHuu?.dN_Id,
                    sP_DN_SanXuat_Id: doanhNghiepSanXuat?.dN_Id,
                    sP_DN_VanTai_Id: doanhNghiepVanTai?.dN_Id,
                    sP_NM_Id: nhaMay?.nM_Id,
                    sP_DM_Id: danhMuc.dM_Id ? danhMuc.dM_Id : null
                } as SanPham, {headers: {Authorization: await getBearerToken()}});

                Alert.alert('Thông báo', 'Thêm sản phẩm thành công');

                const sanPhamNew: SanPham = res.data;
                if (modeTimKiemTrangChuListSanPhams) {
                    if (sanPhamNew.sP_Ten?.includes(textTimKiemTrangChuListSanPhams) || sanPhamNew.sP_MaTruyXuat?.includes(textTimKiemTrangChuListSanPhams)) {
                        listSanPhamsHienThiTrangChu.unshift(sanPhamNew);
                        if (listSanPhamsHienThiTrangChu.length % LIMIT_SANPHAM === 0) {
                            listSanPhamsHienThiTrangChu.pop();
                        }
                    }
                }else {
                    listSanPhamsHienThiTrangChu.unshift(sanPhamNew);
                    if (listSanPhamsHienThiTrangChu.length % LIMIT_SANPHAM === 0) {
                        listSanPhamsHienThiTrangChu.pop();
                    }
                }
                  
                reRenderTrangChuListSanPhams((value: number) => value + 1);
                setTongSanPham((value: number) => value + 1);
                setShowModalThem(false);
                resetState();
            }
        }catch {
            Alert.alert('Lỗi', 'Sửa sản phẩm thất bại')
        }
    }

    const validate = () : boolean => {
        let alert = '';
        if (!ten) {
            alert += 'Vui lòng nhập tên \n';
        }

        if (!doanhNghiepSoHuu) {
            alert += 'Vui lòng chọn doanh nghiệp sở hữu';
        }

        if (alert !== '') {
            Alert.alert('Lỗi', alert);
            return false;
        }
        return true;
    }

    const resetState = () => {
        setTen(undefined);
        setMaTruyXuat(undefined);
        setMaVach(undefined);
        setMoTa(undefined);
        setWebsite(undefined);
        setHangSanXuat(undefined);
        setGia(undefined);
        setMaQuocGia(undefined);
        setDoanhNghiepSoHuu(undefined);
        setDoanhNghiepSanXuat(undefined);
        setDoanhNghiepVanTai(undefined);
        setNhaMay(undefined);
        setDanhMuc(khongChonDanhMuc as DanhMuc);
    }

    return (
        <View>
            <TouchableOpacity style={{backgroundColor: 'blue', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center', padding: PADDING_DEFAULT}} onPress={() => setShowModalThem(true)}>
                <Text style={{fontWeight: 'bold', fontSize: fontSize, color: 'white'}}>{'Thêm sản phẩm'}</Text>
            </TouchableOpacity>

            <Modal
            visible={showModalThem}
            animationType={'slide'}>
                <View style={{height: '90%', padding: PADDING_DEFAULT}}>
                    <ScrollView>
                        <Text>{'Tên:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên sản phẩm"
                            value={ten}
                            onChangeText={setTen}
                        />

                        <Text>{'Mã truy xuất:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mã truy xuất"
                            value={maTruyXuat}
                            onChangeText={setMaTruyXuat}
                        />

                        <Text>{'Mã vạch:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mã vạch"
                            value={maVach}
                            onChangeText={setMaVach}
                        />

                        <Text>{'Giá:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Giá"
                            value={Number(gia).toLocaleString('en-US') !== 'NaN' ? Number(gia).toLocaleString('en-US') : gia}
                            onChangeText={(value) => {handleInputNumber(value, setGia)}}
                        />

                        <Text>{'Mô tả:'}</Text>
                        <TextInput
                            multiline={true}
                            style={styles.inputMoTa}
                            placeholder="Mô tả"
                            value={moTa}
                            onChangeText={setMoTa}
                        />

                        <Text>{'Website:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Website"
                            value={website}
                            onChangeText={setWebsite}
                        />

                        <Text>{'Hãng sản xuất:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Hãng sản xuất"
                            value={hangSanXuat}
                            onChangeText={setHangSanXuat}
                        />

                        <Text>{'Mã quốc gia:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mã quốc gia"
                            value={maQuocGia}
                            onChangeText={setMaQuocGia}
                        />

                        <Text>{'Danh mục:'}</Text>
                        <DanhMucs danhMucHienTai={danhMuc} setDanhMucHienTai={setDanhMuc} height={30} alignItems={undefined}/>
                        <View style={{height: 10}}></View>

                        <Text>{'Doanh nghiệp sở hữu:'}</Text>
                            <TouchableOpacity onPress={() => setShowLuaChonDoanhNghiepSoHuu(true)}>
                                <TextInput
                                style={styles.input}
                                placeholder="Doanh nghiệp sở hữu"
                                editable={false}
                                value={doanhNghiepSoHuu?.dN_Ten}
                            />
                        </TouchableOpacity>
                        <LuaChonDoanhNghiepHelper showLuaChon={showLuaChonDoanhNghiepSoHuu} setShowLuaChon={setShowLuaChonDoanhNghiepSoHuu} setChonDoanhNghiep={setChonDoanhNghiepSoHuu}/>

                        <Text>{'Doanh nghiệp sản xuất:'}</Text>
                            <TouchableOpacity onPress={() => setShowLuaChonDoanhNghiepSanXuat(true)}>
                                <TextInput
                                style={styles.input}
                                placeholder="Doanh nghiệp sản xuất"
                                editable={false}
                                value={doanhNghiepSanXuat?.dN_Ten}
                            />
                        </TouchableOpacity>
                        <LuaChonDoanhNghiepHelper showLuaChon={showLuaChonDoanhNghiepSanXuat} setShowLuaChon={setShowLuaChonDoanhNghiepSanXuat} setChonDoanhNghiep={setChonDoanhNghiepSanXuat}/>

                        <Text>{'Doanh nghiệp vận tải:'}</Text>
                            <TouchableOpacity onPress={() => setShowLuaChonDoanhNghiepVanTai(true)}>
                                <TextInput
                                style={styles.input}
                                placeholder="Doanh nghiệp vận tải"
                                editable={false}
                                value={doanhNghiepVanTai?.dN_Ten}
                            />
                        </TouchableOpacity>
                        <LuaChonDoanhNghiepHelper showLuaChon={showLuaChonDoanhNghiepVanTai} setShowLuaChon={setShowLuaChonDoanhNghiepVanTai} setChonDoanhNghiep={setChonDoanhNghiepVanTai}/>

                        <Text>{'Nhà máy:'}</Text>
                            <TouchableOpacity onPress={() => setShowLuaChonNhaMay(true)}>
                                <TextInput
                                style={styles.input}
                                placeholder="Nhà máy"
                                editable={false}
                                value={nhaMay?.nM_Ten}
                            />
                        </TouchableOpacity>
                        <LuaChonNhaMayHelper showLuaChon={showLuaChonNhaMay} setShowLuaChon={setShowLuaChonNhaMay} setChonNhaMay={setChonNhaMay}/>
                    </ScrollView>
                </View>
                
                <View style={{flexDirection:'row', width: '100%', alignItems: 'center', marginTop: 'auto'}}>
                    <View style={{width: '50%'}}>
                        <Button title="Thêm" color={'blue'} onPress={themSanPham}></Button>
                    </View>
                    <View style={{width: '50%'}}>
                        <Button title="Đóng" onPress={() => setShowModalThem(false)}></Button>
                    </View>
                </View>
            </Modal>
    </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderColor: '#999',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        height: 44,
        borderRadius: 6,
  },
  inputMoTa: {
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 12,
    height: 100,
    borderRadius: 6,
    textAlignVertical: 'top'
  }
})