import getBearerToken from "@/app/Auth/Authentication";
import { quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import LoSanPham from "@/app/model/LoSanPham";
import SanPham from "@/app/model/SanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Alert } from "react-native";
import { temp_ListLoSanPhams } from "..";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function SuaLoSanPham({loSanPham, setReRenderLoSanPham, width, height, paddingVertical, fontSize}: {loSanPham: LoSanPham, setReRenderLoSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [quyenSua, setQuyenSua] = useState<boolean>(false);
    const [showModalSua, setShowModalSua] = useState<boolean | undefined>(false);

    const [showChonNgay, setShowChonNgay] = useState<boolean>(false);
    const [modeChonNgaySanXuat, setModeChonNgaySanXuat] = useState<boolean>(false);
    const [modeChonNgayHetHan, setModeChonNgayHetHan] = useState<boolean>(false);

    const [ten, setTen] = useState<string | undefined>(loSanPham.lsP_Ten);
    const [maLSP, setMaLSP] = useState<string | undefined>(loSanPham.lsP_MaLSP);
    const [ngaySanXuat, setNgaySanXuat] = useState<Date | undefined>(loSanPham.lsP_NgaySanXuat);
    const [ngayHetHan, setNgayHetHan] = useState<Date | undefined>(loSanPham.lsP_NgayHetHan);
    const [soLuong, setSoLuong] = useState<string | undefined>(loSanPham.lsP_SoLuong?.toString());
    const [moTa, setMoTa] = useState<string | undefined>(loSanPham.lsP_MoTa);

    useEffect(() => {
        layQuyenSua();
    }, [])

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaSanPham(loSanPham.lsp_DoanhNghiepSoHuu_Id);
        setQuyenSua(quyenSua);
    }

    const suaLoSanPham = async() => {
        try {
            const urlSuaSanPham = url(`api/losanpham/${loSanPham.lsP_Id}`);

            await axios.put(urlSuaSanPham, {
                lsP_Ten: ten,
                lsP_MaLSP: maLSP,
                lsP_NgaySanXuat: ngaySanXuat,
                lsP_NgayHetHan: ngayHetHan,
                lsP_SoLuong: soLuong,
                lsP_MoTa: moTa
            }, {headers: {Authorization: await getBearerToken()}});

            const loSanPhamInTemp = temp_ListLoSanPhams.listLoSanPhams.find((loSanPhamInTemp: LoSanPham) => {
                return loSanPhamInTemp.lsP_Id === loSanPham.lsP_Id;
            });

            if (loSanPhamInTemp) {
                loSanPhamInTemp.lsP_Ten = ten;
                loSanPhamInTemp.lsP_MaLSP = maLSP;
                loSanPhamInTemp.lsP_NgaySanXuat = ngaySanXuat;
                loSanPhamInTemp.lsP_NgayHetHan = ngayHetHan;
                loSanPhamInTemp.lsP_SoLuong = +(soLuong as string);
                loSanPhamInTemp.lsP_MoTa = moTa;
            }

            setReRenderLoSanPham((value: number) => value + 1);
            setShowModalSua(false);
        }catch {
            Alert.alert('Lỗi', 'Sửa lô sản phẩm thất bại')
        }
    }

    const chonNgay = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        if (event.type === 'set' && selectedDate) {
            if (modeChonNgaySanXuat) {
                setNgaySanXuat(selectedDate);
            }else if (modeChonNgayHetHan) {
                setNgayHetHan(selectedDate);
            }
        }
        setShowChonNgay(false);
    }

    return quyenSua 
    ? (
    <View>
        <TouchableOpacity style={{backgroundColor: 'yellow', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}} onPress={() => setShowModalSua(true)}>
            <Text style={{fontWeight: 'bold', fontSize: fontSize}}>Sửa</Text>
        </TouchableOpacity>

        <Modal
        visible={showModalSua}
        animationType={'slide'}>
            <View style={{height: '90%'}}>
                <ScrollView>
                    <Text>{'Tên:'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tên lô sản phẩm"
                        value={ten}
                        onChangeText={setTen}
                    />

                    <Text>{'Mã lô sản phẩm:'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mã lô sản phẩm"
                        value={maLSP}
                        onChangeText={setMaLSP}
                    />

                    <Text>{'Ngày sản xuất:'}</Text>
                    <TouchableOpacity onPress={() => {
                        setModeChonNgaySanXuat(true);
                        setModeChonNgayHetHan(false);
                        setShowChonNgay(true);
                    }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ngày sản xuất"
                            value={ngaySanXuat?.toLocaleDateString()}
                            editable={false}
                        />
                    </TouchableOpacity>


                    <Text>{'Ngày hết hạn:'}</Text>
                    <TouchableOpacity onPress={() => {
                        setModeChonNgayHetHan(true);
                        setModeChonNgaySanXuat(false);
                        setShowChonNgay(true);
                    }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ngày hết hạn"
                            value={ngayHetHan?.toLocaleDateString()}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showChonNgay ? (
                        <DateTimePicker
                            value={modeChonNgaySanXuat ? (ngaySanXuat ? ngaySanXuat : new Date()) : (ngayHetHan ? ngayHetHan : new Date())}
                            mode="date" 
                            display="default" 
                            onChange={chonNgay}
                            />
                    ) : null}


                    <Text>{'Số lượng:'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Số lượng"
                        value={soLuong}
                        onChangeText={(value) => {handleInputNumber(value, setSoLuong)}}
                    />

                    <Text>{'Mô tả:'}</Text>
                    <TextInput
                        multiline={true}
                        style={styles.inputMoTa}
                        placeholder="Mô tả"
                        value={moTa}
                        onChangeText={setMoTa}
                    />

                </ScrollView>
            </View>
            
            <View style={{flexDirection:'row', width: '100%', alignItems: 'center', marginTop: 'auto'}}>
                <View style={{width: '50%'}}>
                    <Button title="Sửa" color={'red'} onPress={suaLoSanPham}></Button>
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