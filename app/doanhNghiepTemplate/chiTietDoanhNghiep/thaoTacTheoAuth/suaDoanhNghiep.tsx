import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenSuaDoanhNghiep } from "@/app/Auth/Authorization/AuthDoanhNghiep";
import { PADDING_DEFAULT } from "@/app/constant/Style";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { temp_DoanhNghiep } from "..";
import { listDoanhNghiepsHienThiTrangChu, reRenderTrangChuListDoanhNghieps } from "../../danhSachDoanhNghiep";

export default function SuaDoanhNghiep({doanhNghiep, setReRenderDoanhNghiep}: {doanhNghiep: DoanhNghiep, setReRenderDoanhNghiep: Function}) {
    const [quyenSua, setQuyenSua] = useState<boolean>(false);
    const [showModalSua, setShowModalSua] = useState<boolean | undefined>(false);

    const [ten, setTen] = useState<string | undefined>(doanhNghiep.dN_Ten);
    const [maSoThue, setMaSoThue] = useState<string | undefined>(doanhNghiep.dN_MaSoThue);
    const [maGLN, setMaGLN] = useState<string | undefined>(doanhNghiep.dN_MaGLN);
    const [diaChi, setDiaChi] = useState<string | undefined>(doanhNghiep.dN_DiaChi);
    const [soDienThoai, setSoDienThoai] = useState<string | undefined>(doanhNghiep.dN_SoDienThoai);
    const [email, setEmail] = useState<string | undefined>(doanhNghiep.dN_Email);
    const [maGS1, setMaGS1] = useState<string | undefined>(doanhNghiep.dN_MaGS1);

    useEffect(() => {
        layQuyenSua();
    }, []);

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaDoanhNghiep(doanhNghiep.dN_Id);
        setQuyenSua(quyenSua);
    }

    const suaDoanhNghiep = async() => {
        try {
            if (validate()) {
                const urlSuaDoanhNghiep = url(`api/doanhnghiep/${doanhNghiep.dN_Id}`);

                await axios.put(urlSuaDoanhNghiep, {
                    dN_Ten: ten,
                    dN_MaSoThue: maSoThue,
                    dN_MaGLN: maGLN,
                    dN_DiaChi: diaChi,
                    dN_SoDienThoai: soDienThoai,
                    dN_Email: email,
                    dN_MaGS1: maGS1
                } as DoanhNghiep, {headers: {Authorization: await getBearerToken()}});

                Alert.alert('Thông báo', 'Sửa doanh nghiệp thành công');

                const doanhNghiepInTemp = temp_DoanhNghiep.find((doanhNghiepInTemp: {doanhNghiep: DoanhNghiep, soSanPham: number}) => {
                    return doanhNghiepInTemp.doanhNghiep.dN_Id === doanhNghiep.dN_Id;
                });

                if (doanhNghiepInTemp) {
                    doanhNghiepInTemp.doanhNghiep.dN_Ten = ten;
                    doanhNghiepInTemp.doanhNghiep.dN_MaSoThue = maSoThue;
                    doanhNghiepInTemp.doanhNghiep.dN_MaGLN = maGLN;
                    doanhNghiepInTemp.doanhNghiep.dN_DiaChi = diaChi;
                    doanhNghiepInTemp.doanhNghiep.dN_SoDienThoai = soDienThoai;
                    doanhNghiepInTemp.doanhNghiep.dN_Email = email;
                    doanhNghiepInTemp.doanhNghiep.dN_MaGS1 = maGS1;
                }

                const doanhNghiepInTrangChu = listDoanhNghiepsHienThiTrangChu.find((doanhNghiepInTrangChu: DoanhNghiep) => {
                    return doanhNghiepInTrangChu.dN_Id === doanhNghiep.dN_Id;
                });

                if (doanhNghiepInTrangChu) {
                    doanhNghiepInTrangChu.dN_Ten = ten;
                    doanhNghiepInTrangChu.dN_MaSoThue = maSoThue;
                }
                reRenderTrangChuListDoanhNghieps((value: number) => value + 1);

                setReRenderDoanhNghiep((value: number) => value + 1);
                setShowModalSua(false);
            }
        }catch {
            Alert.alert('Lỗi', 'Sửa doanh nghiệp thất bại');
        }
    }

    const validate = () => {
        let alert = '';
        if (!ten) {
            alert += 'Vui lòng nhập tên \n';
        }

        if (email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert += 'Email không đúng định dạng \n';
            }
        }

        if (alert !== '') {
            Alert.alert('Lỗi', alert);
            return false;
        }

        return true;
    }

    return quyenSua ? (
        <View style={styles.statBox}>
            <TouchableOpacity style={{width: '100%', alignItems: 'center'}} onPress={() => setShowModalSua(true)}>
                <Text style={styles.statValue}>{'Sửa'}</Text>
            </TouchableOpacity>

            <Modal
                visible={showModalSua}
                animationType={'slide'}>
                    <View style={{height: '90%', padding: PADDING_DEFAULT}}>
                        <ScrollView>
                            <Text>{'Tên:'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tên doanh nghiệp"
                                value={ten}
                                onChangeText={setTen}
                            />
        
                            <Text>{'Mã số thuế:'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mã số thuế"
                                value={maSoThue}
                                onChangeText={setMaSoThue}
                            />
        
                            <Text>{'Mã GLN:'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mã GLN"
                                value={maGLN}
                                onChangeText={(text: string) => {
                                    if (text.length <= 13) {
                                        setMaGLN(text)
                                    }else {
                                        Alert.alert('Lỗi', 'Mã GLN không được quá 13 ký tự')
                                    }
                                }}
                            />

                            <Text>{'Mã GS1:'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mã GS1"
                                value={maGS1}
                                onChangeText={(text: string) => {
                                    if (text.length <= 7) {
                                        setMaGS1(text)
                                    }else {
                                        Alert.alert('Lỗi', 'Mã GS1 không được quá 7 ký tự')
                                    }
                                }}
                            />
        
                            <Text>{'Địa chỉ:'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Giá"
                                value={diaChi}
                                onChangeText={setDiaChi}
                            />
        
                            <Text>{'Số điện thoại:'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mô tả"
                                value={soDienThoai}
                                onChangeText={(text) => handleInputNumber(text, setSoDienThoai)}
                            />
        
                            <Text>{'Email:'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </ScrollView>
                    </View>
                    
                    <View style={{flexDirection:'row', width: '100%', alignItems: 'center', marginTop: 'auto'}}>
                        <View style={{width: '50%'}}>
                            <Button title="Sửa" color={'red'} onPress={suaDoanhNghiep}></Button>
                        </View>
                        <View style={{width: '50%'}}>
                            <Button title="Đóng" onPress={() => setShowModalSua(false)}></Button>
                        </View>
                    </View>
                </Modal>
        </View>

        
    ) : (<View></View>)
}

const styles = StyleSheet.create({
    statBox: {
    width: '48%',
    backgroundColor: 'yellow',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontWeight: 'bold', fontSize: 16, color: 'black' },
  input: {
        borderColor: '#999',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        height: 44,
        borderRadius: 6,
  },
})