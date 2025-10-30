import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenAdminSanPham, quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { PADDING_DEFAULT } from "@/app/constant/Style";
import DanhMucs, { khongChonDanhMuc } from "@/app/danhMucTemplate/danhMucs";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import LuaChonDoanhNghiepHelper from "@/app/helpers/LuaChonHelper/luaChonDoanhNghiepHelper";
import LuaChonNhaMayHelper from "@/app/helpers/LuaChonHelper/luaChonNhaMayHelper";
import DanhMuc from "@/app/model/DanhMuc";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import NhaMay from "@/app/model/NhaMay";
import SanPham from "@/app/model/SanPham";
import { listSanPhamsHienThiTrangChu, reRenderTrangChuListSanPhams } from "@/app/sanPhamTemplate/danhSachSanPham/danhSachSanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { temp_SanPham } from "..";

export default function SuaSanPham({sanPham, setReRenderSanPham, width, height, paddingVertical, fontSize}: {sanPham: SanPham, setReRenderSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenSua, setQuyenSua] = useState<boolean>(false);
    const [showModalSua, setShowModalSua] = useState<boolean | undefined>(false);

    const [ten, setTen] = useState<string | undefined>(sanPham.sP_Ten);
    const [maTruyXuat, setMaTruyXuat] = useState<string | undefined>(sanPham.sP_MaTruyXuat);
    const [maVach, setMaVach] = useState<string | undefined>(sanPham.sP_MaVach);
    const [moTa, setMoTa] = useState<string | undefined>(sanPham.sP_MoTa);
    const [website, setWebsite] = useState<string | undefined>(sanPham.sP_Website);
    const [gia, setGia] = useState<string | undefined>(sanPham.sP_Gia?.toString());
    const [hangSanXuat, setHangSanXuat] = useState<string | undefined>(sanPham.sP_HangSanXuat)
    const [maQuocGia, setMaQuocGia] = useState<string | undefined>(sanPham.sP_MaQuocGia);

    const [showLuaChonDoanhNghiepSoHuu, setShowLuaChonDoanhNghiepSoHuu] = useState<boolean>(false);
    const [doanhNghiepSoHuu, setDoanhNghiepSoHuu] = useState<DoanhNghiep | undefined>(sanPham.sP_DN_SoHuu);

    const [showLuaChonDoanhNghiepSanXuat, setShowLuaChonDoanhNghiepSanXuat] = useState<boolean>(false);
    const [doanhNghiepSanXuat, setDoanhNghiepSanXuat] = useState<DoanhNghiep | undefined>(sanPham.sP_DN_SanXuat);

    const [showLuaChonDoanhNghiepVanTai, setShowLuaChonDoanhNghiepVanTai] = useState<boolean>(false);
    const [doanhNghiepVanTai, setDoanhNghiepVanTai] = useState<DoanhNghiep | undefined>(sanPham.sP_DN_VanTai);

    const [showLuaChonNhaMay, setShowLuaChonNhaMay] = useState<boolean>(false);
    const [nhaMay, setNhaMay] = useState<NhaMay | undefined>(sanPham.sP_NM);

    const [danhMuc, setDanhMuc] = useState<DanhMuc>(sanPham.sP_DM ? sanPham.sP_DM : khongChonDanhMuc as DanhMuc);

    const setChonDoanhNghiepSoHuu = async(doanhNghiep: DoanhNghiep) => {
        if (!doanhNghiep) {
            Alert.alert('Lỗi', 'Sản phẩm phải có doanh nghiệp sở hữu');
            return;
        }
        const quyenAdmin = await quyenAdminSanPham(sanPham.sP_DN_SoHuu_Id);

        if (!quyenAdmin) {
            Alert.alert('Lỗi', 'Bạn không có quyền sửa doanh nghiệp sở hữu cho sản phẩm này');
        }
        setDoanhNghiepSoHuu(doanhNghiep);
        setShowLuaChonDoanhNghiepSoHuu(false);
    }

    const setChonDoanhNghiepSanXuat = async (doanhNghiep: DoanhNghiep) => {
        if (quyenSua) {
            setDoanhNghiepSanXuat(doanhNghiep);
            setShowLuaChonDoanhNghiepSanXuat(false);
        }else {
            Alert.alert('Lỗi', 'Bạn không có quyền sửa doanh nghiệp sản xuất cho sản phẩm này');
        }
    }

    const setChonDoanhNghiepVanTai= async (doanhNghiep: DoanhNghiep) => {
        if (quyenSua) {
            setDoanhNghiepVanTai(doanhNghiep);
            setShowLuaChonDoanhNghiepVanTai(false);
        }else {
            Alert.alert('Lỗi', 'Bạn không có quyền sửa doanh nghiệp vận tải cho sản phẩm này');
        }
    }

    const setChonNhaMay= async (nhaMay: NhaMay) => {
        if (quyenSua) {
            setNhaMay(nhaMay);
            setShowLuaChonNhaMay(false);
        }else {
            Alert.alert('Lỗi', 'Bạn không có quyền sửa nhà máy cho sản phẩm này');
        }
    }

    useEffect(() => {
        layQuyenSua();
    }, [])

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaSanPham(sanPham.sP_DN_SoHuu_Id);
        setQuyenSua(quyenSua);
    }

    const suaSanPham = async() => {
        try {
            if (validate()) {
                const urlSuaSanPham = url(`api/sanpham/${sanPham.sP_Id}`);

                await axios.put(urlSuaSanPham, {
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

                Alert.alert('Thông báo', 'Sửa sản phẩm thành công');

                const sanPhamInTemp = temp_SanPham.find((sanPhamInTemp: SanPham) => {
                    return sanPhamInTemp.sP_MaTruyXuat === sanPham.sP_MaTruyXuat;
                });

                if (sanPhamInTemp) {
                    sanPhamInTemp.sP_Ten = ten;
                    sanPhamInTemp.sP_MaTruyXuat = maTruyXuat;
                    sanPhamInTemp.sP_MaVach = maVach;
                    sanPhamInTemp.sP_MoTa = moTa;
                    sanPhamInTemp.sP_Website = website;
                    sanPhamInTemp.sP_Gia = Number.parseFloat(gia as string);
                    sanPhamInTemp.sP_MaQuocGia = maQuocGia;
                    sanPhamInTemp.sP_HangSanXuat = hangSanXuat;
                    sanPhamInTemp.sP_DN_SoHuu_Id = doanhNghiepSoHuu?.dN_Id;
                    sanPhamInTemp.sP_DN_SoHuu = doanhNghiepSoHuu;
                    sanPhamInTemp.sP_DN_SanXuat_Id = doanhNghiepSanXuat?.dN_Id;
                    sanPhamInTemp.sP_DN_SanXuat = doanhNghiepSanXuat;
                    sanPhamInTemp.sP_DN_VanTai_Id = doanhNghiepVanTai?.dN_Id;
                    sanPhamInTemp.sP_DN_VanTai = doanhNghiepVanTai;
                    sanPhamInTemp.sP_NM_Id = nhaMay?.nM_Id;
                    sanPhamInTemp.sP_NM = nhaMay;
                    sanPhamInTemp.sP_DM_Id = danhMuc?.dM_Id ? danhMuc.dM_Id : undefined;
                    sanPhamInTemp.sP_DM = danhMuc.dM_Id ? danhMuc : undefined; 
                }

                const sanPhamInTrangChu = listSanPhamsHienThiTrangChu.find((sanPhamInTrangChu: SanPham) => {
                    return sanPhamInTrangChu.sP_MaTruyXuat === sanPham.sP_MaTruyXuat;
                });

                if (sanPhamInTrangChu) {
                    sanPhamInTrangChu.sP_Ten = ten;
                    sanPhamInTrangChu.sP_MaTruyXuat = maTruyXuat;
                }
                reRenderTrangChuListSanPhams((value: number) => value + 1);
                
                setReRenderSanPham((value: number) => value + 1);
                setShowModalSua(false);
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

    return quyenSua 
    ? (
    <View>
        <TouchableOpacity style={{backgroundColor: 'yellow', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center', padding: PADDING_DEFAULT}} onPress={() => setShowModalSua(true)}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize}}>{'Sửa'}</Text>
        </TouchableOpacity>

        <Modal
        visible={showModalSua}
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
                    <Button title="Sửa" color={'red'} onPress={suaSanPham}></Button>
                </View>
                <View style={{width: '50%'}}>
                    <Button title="Đóng" onPress={() => setShowModalSua(false)}></Button>
                </View>
            </View>
        </Modal>
        
    </View>) 
    : (<View></View>)
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