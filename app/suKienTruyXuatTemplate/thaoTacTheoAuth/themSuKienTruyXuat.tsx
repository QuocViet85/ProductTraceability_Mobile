import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { LIMIT_SU_KIEN_TRUY_XUAT } from "@/app/constant/Limit";
import LuaChonLoSanPhamHelper from "@/app/helpers/LuaChonHelper/luaChonLoSanPhamHelper";
import LoSanPham from "@/app/model/LoSanPham";
import SuKienTruyXuat from "@/app/model/SuKienTruyXuat";
import { url } from "@/app/server/backend";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { temp_ListSuKienTruyXuats } from "..";

export default function ThemSuKienTruyXuat({sanPhamId, doanhNghiepSoHuuId, listSuKiensHienThi, setTongSoSuKiens, setReRenderSuKien, width, height, paddingVertical, fontSize}: {sanPhamId: string, doanhNghiepSoHuuId: string, listSuKiensHienThi: SuKienTruyXuat[], setTongSoSuKiens: Function, setReRenderSuKien: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenSua, setQuyenSua] = useState<boolean>(false);
    const [showModalSua, setShowModalSua] = useState<boolean | undefined>(false);
    const [showChonThoiGian, setShowChonThoiGian] = useState<boolean>(false);

    const [ten, setTen] = useState<string | undefined>(undefined);
    const [maSK, setMaSK] = useState<string | undefined>(undefined);
    const [moTa, setMoTa] = useState<string | undefined>(undefined);
    const [diaDiem, setDiaDiem] = useState<string | undefined>(undefined);
    const [thoiGian, setThoiGian] = useState<Date | undefined>(new Date());

    const [showLuaChonLoSanPham, setShowLuaChonLoSanPham] = useState<boolean>(false);
    const [loSanPham, setLoSanPham] = useState<LoSanPham | undefined>(undefined);

    useEffect(() => {
        layQuyenSua();
    }, [])

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaSanPham(doanhNghiepSoHuuId);
        setQuyenSua(quyenSua);
    }

    const suaSuKienTruyXuat = async() => {
        try {
            if (validate()) {
                const urlThemSuKien = url(`api/sukientruyxuat`);

                const res = await axios.post(urlThemSuKien, {
                    sK_Ten: ten,
                    sK_SP_Id: sanPhamId,
                    sK_MaSK: maSK,
                    sK_MoTa: moTa,
                    sK_DiaDiem: diaDiem,
                    sK_ThoiGian: thoiGian,
                    sK_LSP_Id: loSanPham?.lsP_Id
                } as SuKienTruyXuat, {headers: {Authorization: await getBearerToken()}});

                Alert.alert('Thông báo', 'Thêm sự kiện truy xuất thành công');
            
                const suKienNew: SuKienTruyXuat = res.data;

                listSuKiensHienThi.unshift(suKienNew);
                temp_ListSuKienTruyXuats.unshift(suKienNew);

                if (listSuKiensHienThi.length % LIMIT_SU_KIEN_TRUY_XUAT === 0) {
                    listSuKiensHienThi.pop();
                }
                if (temp_ListSuKienTruyXuats.length % LIMIT_SU_KIEN_TRUY_XUAT === 0) {
                    temp_ListSuKienTruyXuats.pop();
                }
                
                setReRenderSuKien((value: any) => value + 1);
                for (const suKien of temp_ListSuKienTruyXuats) {
                    if (suKien.temp_TongSoVoiSanPham) {
                        temp_ListSuKienTruyXuats[0].temp_TongSoVoiSanPham = suKien.temp_TongSoVoiSanPham + 1;
                        suKien.temp_TongSoVoiSanPham += 1;
                    }
                } 
                setTongSoSuKiens((value: number) => value + 1);
                
                setShowModalSua(false);
                resetState();
            }
        }catch {
            Alert.alert('Lỗi', 'Thêm sự kiện truy xuất thất bại')
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

    const resetState = () => {
        setTen(undefined);
        setMaSK(undefined);
        setMoTa(undefined);
        setDiaDiem(undefined);
        setThoiGian(undefined);
        setLoSanPham(undefined);
    }

    return quyenSua 
    ? (
    <View>
        <TouchableOpacity style={{backgroundColor: 'blue', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}} onPress={() => setShowModalSua(true)}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize, color: 'white'}}>{'Thêm sự kiện cho sản phẩm hiện tại'}</Text>
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
                            placeholder="Lô sản phẩm"
                            editable={false}
                            value={`${loSanPham?.lsP_MaLSP ? loSanPham.lsP_MaLSP : ''}` + `${loSanPham?.lsP_Ten ? ' - '  + loSanPham.lsP_Ten : ''}`}
                        />
                    </TouchableOpacity>
                    <LuaChonLoSanPhamHelper sP_Id={sanPhamId as string} showLuaChon={showLuaChonLoSanPham} setShowLuaChon={setShowLuaChonLoSanPham} setChonLoSanPham={setChonLoSanPham}/>
                </ScrollView>
            </View>
            
            <View style={{flexDirection:'row', width: '100%', alignItems: 'center', marginTop: 'auto'}}>
                <View style={{width: '50%'}}>
                    <Button title="Thêm" color={'blue'} onPress={suaSuKienTruyXuat}></Button>
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