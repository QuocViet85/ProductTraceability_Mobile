import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { PADDING_DEFAULT } from "@/app/constant/Style";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import LuaChonNhaMayHelper from "@/app/helpers/LuaChonHelper/luaChonNhaMayHelper";
import LoSanPham from "@/app/model/LoSanPham";
import NhaMay from "@/app/model/NhaMay";
import { url } from "@/app/server/backend";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { temp_ListLoSanPhams } from "..";

export default function SuaLoSanPham({loSanPham, listLoSanPhamsHienThi, doanhNghiepSoHuuId, setReRenderLoSanPham, width, height, paddingVertical, fontSize}: {loSanPham: LoSanPham, listLoSanPhamsHienThi: LoSanPham[], doanhNghiepSoHuuId: string, setReRenderLoSanPham: Function, width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
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

    const [showLuaChonNhaMay, setShowLuaChonNhaMay] = useState<boolean>(false);
    const [nhaMay, setNhaMay] = useState<NhaMay | undefined>(loSanPham.lsP_NM);

    useEffect(() => {
        layQuyenSua();
    }, [])

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaSanPham(doanhNghiepSoHuuId);
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
                lsP_MoTa: moTa,
                lsP_NM_Id: nhaMay?.nM_Id
            } as LoSanPham, {headers: {Authorization: await getBearerToken()}});

            Alert.alert('Thông báo', 'Sửa lô sản phẩm thành công');

            const loSanPhamInTemp = temp_ListLoSanPhams.find((loSanPhamInTemp: LoSanPham) => {
                return loSanPhamInTemp.lsP_Id === loSanPham.lsP_Id;
            });

            if (loSanPhamInTemp) {
                loSanPhamInTemp.lsP_Ten = ten;
                loSanPhamInTemp.lsP_MaLSP = maLSP;
                loSanPhamInTemp.lsP_NgaySanXuat = ngaySanXuat;
                loSanPhamInTemp.lsP_NgayHetHan = ngayHetHan;
                loSanPhamInTemp.lsP_SoLuong = +(soLuong as string);
                loSanPhamInTemp.lsP_MoTa = moTa;
                loSanPhamInTemp.lsP_NM_Id = nhaMay?.nM_Id;
                loSanPhamInTemp.lsP_NM = nhaMay;
            }

            const loSanPhamHienThi = listLoSanPhamsHienThi.find((loSanPhamHienThi: LoSanPham) => {
                return loSanPhamHienThi.lsP_Id === loSanPham.lsP_Id;
            });

            if (loSanPhamHienThi) {
                loSanPhamHienThi.lsP_Ten = ten;
                loSanPhamHienThi.lsP_MaLSP = maLSP;
                loSanPhamHienThi.lsP_NgaySanXuat = ngaySanXuat;
                loSanPhamHienThi.lsP_NgayHetHan = ngayHetHan;
                loSanPhamHienThi.lsP_SoLuong = +(soLuong as string);
                loSanPhamHienThi.lsP_MoTa = moTa;
                loSanPhamHienThi.lsP_NM_Id = nhaMay?.nM_Id;
                loSanPhamHienThi.lsP_NM = nhaMay;
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

    const setChonNhaMay= async (nhaMay: NhaMay) => {
        if (quyenSua) {
            setNhaMay(nhaMay);
            setShowLuaChonNhaMay(false);
        }else {
            Alert.alert('Lỗi', 'Bạn không có quyền sửa nhà máy cho lô sản phẩm này');
        }
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
            <View style={{height: '90%', padding: PADDING_DEFAULT}}>
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
                            value={ngaySanXuat ? (ngaySanXuat instanceof Date ? ngaySanXuat.toLocaleDateString() : ngaySanXuat) : undefined}
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
                            value={ngayHetHan ? (ngayHetHan instanceof Date ? ngayHetHan.toLocaleDateString() : ngayHetHan) : undefined}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showChonNgay ? (
                        <DateTimePicker
                            value={
                                modeChonNgaySanXuat ? 
                                (ngaySanXuat ? (ngaySanXuat instanceof Date ? ngaySanXuat : new Date(ngaySanXuat)) : new Date()) :                                                              (ngayHetHan ? (ngayHetHan instanceof Date ? ngayHetHan : new Date(ngayHetHan)) : new Date())
                            }
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