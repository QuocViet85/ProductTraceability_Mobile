import getBearerToken from "@/app/Auth/Authentication";
import { quyenSuaSanPham, quyenThemSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import SanPham from "@/app/model/SanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Alert } from "react-native";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import LuaChonDoanhNghiepHelper from "@/app/helpers/LuaChonHelper/luaChonDoanhNghiepHelper";

export default function ThemSanPham({setReRenderSanPham, width, height, paddingVertical, fontSize}: { setReRenderSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
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

    const setChonDoanhNghiepSoHuu = async(doanhNghiep: DoanhNghiep) => {
        const quyenThem = await quyenThemSanPham(doanhNghiepSoHuu?.dN_Id);

        if (!quyenThem) {
            Alert.alert('Lỗi', 'Bạn không có quyền thêm sản phẩm cho doanh nghiệp này');
        }
        setDoanhNghiepSoHuu(doanhNghiep);
        setShowLuaChonDoanhNghiepSoHuu(false);
    }

    const themSanPham = async() => {
        try {
            if (validate()) {
                const urlThemSanPham = url(`api/sanpham`);

                await axios.post(urlThemSanPham, {
                    sP_Ten: ten,
                    sP_MaTruyXuat: maTruyXuat,
                    sP_MaVach: maVach,
                    sP_MoTa: moTa,
                    sP_Website: website,
                    sP_Gia: gia,
                    sP_MaQuocGia: maQuocGia,
                    sP_HangSanXuat: hangSanXuat,
                    sP_DN_SoHuu_Id: doanhNghiepSoHuu?.dN_Id
                }, {headers: {Authorization: await getBearerToken()}});

                setReRenderSanPham((value: number) => value + 1);
                setShowModalThem(false);
                resetState();
            }
        }catch {
            Alert.alert('Lỗi', 'Sửa sản phẩm thất bại')
        }
    }

    const validate = () : boolean => {
        if (!ten) {
            Alert.alert('Lỗi', 'Tên không được để trống');
            return false;
        }

        if (!doanhNghiepSoHuu) {
            Alert.alert('Lỗi', 'Phải có doanh nghiệp sở hữu');
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
    }

    return (
        <View>
            <TouchableOpacity style={{backgroundColor: 'blue', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}} onPress={() => setShowModalThem(true)}>
                <Text style={{fontWeight: 'bold', fontSize: fontSize, color: 'white'}}>{'Thêm sản phẩm'}</Text>
            </TouchableOpacity>

            <Modal
            visible={showModalThem}
            animationType={'slide'}>
                <View style={{height: '90%'}}>
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
                    </ScrollView>
                </View>
                
                <View style={{flexDirection:'row', width: '100%', alignItems: 'center', marginTop: 'auto'}}>
                    <View style={{width: '50%'}}>
                        <Button title="Thêm" color={'red'} onPress={themSanPham}></Button>
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