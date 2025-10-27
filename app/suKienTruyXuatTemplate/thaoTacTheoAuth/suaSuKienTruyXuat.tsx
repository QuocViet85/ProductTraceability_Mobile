import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import LuaChonLoSanPhamHelper from "@/app/helpers/LuaChonHelper/luaChonLoSanPhamHelper";
import LoSanPham from "@/app/model/LoSanPham";
import SuKienTruyXuat from "@/app/model/SuKienTruyXuat";
import { url } from "@/app/server/backend";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { temp_ListSuKienTruyXuats } from "..";

export default function SuaSuKienTruyXuat({suKien, listSuKiensHienThi, setReRenderSuKien, width, height, paddingVertical, fontSize}: {suKien: SuKienTruyXuat, listSuKiensHienThi: SuKienTruyXuat[], setReRenderSuKien: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenSua, setQuyenSua] = useState<boolean>(false);
    const [showModalSua, setShowModalSua] = useState<boolean | undefined>(false);
    const [showChonThoiGian, setShowChonThoiGian] = useState<boolean>(false);

    const [ten, setTen] = useState<string | undefined>(suKien.sK_Ten);
    const [maSK, setMaSK] = useState<string | undefined>(suKien.sK_MaSK);
    const [moTa, setMoTa] = useState<string | undefined>(suKien.sK_MoTa);
    const [diaDiem, setDiaDiem] = useState<string | undefined>(suKien.sK_DiaDiem);
    const [thoiGian, setThoiGian] = useState<Date | undefined>(suKien.sK_ThoiGian);

    const [showLuaChonLoSanPham, setShowLuaChonLoSanPham] = useState<boolean>(false);
    const [loSanPham, setLoSanPham] = useState<LoSanPham | undefined>(suKien.sK_LSP);

    useEffect(() => {
        layQuyenSua();
    }, [])

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaSanPham(suKien.sK_DoanhNghiepSoHuu_Id);
        setQuyenSua(quyenSua);
    }

    const suaSuKienTruyXuat = async() => {
        try {
            if (validate()) {
                const urlSuaSuKien = url(`api/sukientruyxuat/${suKien.sK_Id}`);

                await axios.put(urlSuaSuKien, {
                    sK_Ten: ten,
                    sK_MaSK: maSK,
                    sK_MoTa: moTa,
                    sK_DiaDiem: diaDiem,
                    sK_ThoiGian: thoiGian,
                    sK_LSP_Id: loSanPham?.lsP_Id
                } as SuKienTruyXuat, {headers: {Authorization: await getBearerToken()}});

                Alert.alert('Thông báo', 'Sửa sự kiện truy xuất thành công');


                const suKienInTemp = temp_ListSuKienTruyXuats.find((suKienInTemp: SuKienTruyXuat) => {
                    return suKienInTemp.sK_Id === suKien.sK_Id;
                });

                if (suKienInTemp) {
                    suKien.sK_Ten = ten;
                    suKien.sK_MaSK = maSK;
                    suKien.sK_ThoiGian = thoiGian;
                    suKien.sK_MoTa = moTa;
                    suKien.sK_DiaDiem = diaDiem;
                    suKien.sK_LSP_Id = loSanPham?.lsP_Id;
                    suKien.sK_LSP = loSanPham;
                }

                const suKienHienThi = listSuKiensHienThi.find((suKienHienThi: SuKienTruyXuat) => {
                    return suKienHienThi.sK_Id === suKien.sK_Id;
                });

                if (suKienHienThi) {
                    suKienHienThi.sK_Ten = ten;
                    suKienHienThi.sK_MaSK = maSK;
                    suKienHienThi.sK_ThoiGian = thoiGian;
                    suKienHienThi.sK_MoTa = moTa;
                    suKienHienThi.sK_DiaDiem = diaDiem;
                    suKienHienThi.sK_LSP_Id = loSanPham?.lsP_Id;
                    suKienHienThi.sK_LSP = loSanPham;
                }

                setReRenderSuKien((value: number) => value + 1);
                setShowModalSua(false);
            }
        }catch {
            Alert.alert('Lỗi', 'Sửa sự kiện truy xuất thất bại')
        }
    }

    const chonThoiGian = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        if (event.type === 'set' && selectedDate) {
            setThoiGian(selectedDate);
        }
        setShowChonThoiGian(false);
    }

    const setChonLoSanPham= async (loSanPham: LoSanPham) => {
        if (quyenSua) {
            setLoSanPham(loSanPham);
            setShowLuaChonLoSanPham(false);
        }else {
            Alert.alert('Lỗi', 'Bạn không có quyền sửa lô sản phẩm của nhật ký truy xuất này');
        }
    }

    const validate = () => {
        let alert = '';
        if (!ten) {
            alert += 'Vui lòng nhập tên \n';
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
        <TouchableOpacity style={{backgroundColor: 'yellow', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}} onPress={() => setShowModalSua(true)}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize}}>{'Sửa'}</Text>
        </TouchableOpacity>

        <Modal
        visible={showModalSua}
        animationType={'slide'}>
            <View style={{height: '90%', padding: 10}}>
                <ScrollView>
                    <Text>{'Tên:'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tên sự kiện"
                        value={ten}
                        onChangeText={setTen}
                    />

                    <Text>{'Mã sự kiện:'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mã truy xuất"
                        value={maSK}
                        onChangeText={setMaSK}
                    />

                    <Text>{'Địa điểm:'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Địa điểm"
                        value={diaDiem}
                        onChangeText={setDiaDiem}
                    />

                    <Text>{'Thời gian:'}</Text>
                    <TouchableOpacity onPress={() => {
                        setShowChonThoiGian(true);
                    }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Thời gian"
                            value={thoiGian ? (thoiGian instanceof Date ? thoiGian.toLocaleDateString() : thoiGian) : undefined}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showChonThoiGian ? (
                        <DateTimePicker
                            value={thoiGian ? (thoiGian instanceof Date ? thoiGian : new Date(thoiGian)) : new Date()}
                            mode="date" 
                            display="default" 
                            onChange={chonThoiGian}
                            />
                    ) : null}

                    <Text>{'Mô tả:'}</Text>
                    <TextInput
                        multiline={true}
                        style={styles.inputMoTa}
                        placeholder="Mô tả"
                        value={moTa}
                        onChangeText={setMoTa}
                    />

                    <Text>{'Lô sản phẩm:'}</Text>
                    <TouchableOpacity onPress={() => setShowLuaChonLoSanPham(true)}>
                            <TextInput
                            style={styles.input}
                            placeholder="Nhà máy"
                            editable={false}
                            value={loSanPham?.lsP_MaLSP + `${loSanPham?.lsP_Ten ? loSanPham.lsP_Ten : null}`}
                        />
                    </TouchableOpacity>
                    <LuaChonLoSanPhamHelper sP_Id={suKien.sK_SP_Id as string} showLuaChon={showLuaChonLoSanPham} setShowLuaChon={setShowLuaChonLoSanPham} setChonLoSanPham={setChonLoSanPham}/>
                </ScrollView>
            </View>
            
            <View style={{flexDirection:'row', width: '100%', alignItems: 'center', marginTop: 'auto'}}>
                <View style={{width: '50%'}}>
                    <Button title="Sửa" color={'red'} onPress={suaSuKienTruyXuat}></Button>
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