import { getBearerToken } from "@/app/Auth/Authentication";
import { quyenSuaNhaMay } from "@/app/Auth/Authorization/AuthNhaMay";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import LuaChonDoanhNghiepHelper from "@/app/helpers/LuaChonHelper/luaChonDoanhNghiepHelper";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import NhaMay from "@/app/model/NhaMay";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { temp_NhaMay } from "..";

export default function SuaNhaMay({nhaMay, setReRenderNhaMay}: {nhaMay: NhaMay, setReRenderNhaMay: Function}) {
    const [quyenSua, setQuyenSua] = useState<boolean>(false);
    const [showModalSua, setShowModalSua] = useState<boolean | undefined>(false);

    const [ten, setTen] = useState<string | undefined>(nhaMay.nM_Ten);
    const [maNhaMay, setMaNhaMay] = useState<string | undefined>(nhaMay.nM_MaNM);
    const [soDienThoai, setSoDienThoai] = useState<string | undefined>(nhaMay.nM_SoDienThoai);
    const [email, setEmail] = useState<string | undefined>(nhaMay.nM_Email);
    const [diaChi, setDiaChi] = useState<string | undefined>(nhaMay.nM_DiaChi);

    const [showLuaChonDoanhNghiep, setShowLuaChonDoanhNghiep] = useState<boolean>(false);
    const [doanhNghiep, setDoanhNghiep] = useState<DoanhNghiep | undefined>(nhaMay.nM_DN);

    useEffect(() => {
        layQuyenSua();
    });

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaNhaMay(nhaMay.nM_Id);
        setQuyenSua(quyenSua);
    }

    const suaNhaMay = async() => {
        try {
            if (validate()) {
                const urlSuaNhaMay = url(`api/nhamay/${nhaMay.nM_Id}`);

                await axios.put(urlSuaNhaMay, {
                    nM_Ten: ten,
                    nM_MaNM: maNhaMay,
                    nM_SoDienThoai: soDienThoai,
                    nM_Email: email,
                    nM_DiaChi: diaChi,
                    nM_DN_Id: doanhNghiep?.dN_Id
                } as NhaMay, {headers: {Authorization: await getBearerToken()}});

                Alert.alert('Thông báo', 'Sửa nhà máy thành công');

                const nhaMayInTemp = temp_NhaMay.find((nhaMayInTemp: NhaMay) => {
                    return nhaMayInTemp.nM_Id === nhaMay.nM_Id;
                });

                if (nhaMayInTemp) {
                    nhaMayInTemp.nM_Ten = ten;
                    nhaMayInTemp.nM_MaNM = maNhaMay;
                    nhaMayInTemp.nM_SoDienThoai = soDienThoai;
                    nhaMayInTemp.nM_Email = email;
                    nhaMayInTemp.nM_DiaChi = diaChi;
                    nhaMayInTemp.nM_DN_Id = doanhNghiep?.dN_Id;
                    nhaMayInTemp.nM_DN = doanhNghiep;
                }

                setReRenderNhaMay((value: number) => value + 1);
                setShowModalSua(false);
            }
        }catch {
            Alert.alert('Lỗi', 'Sửa doanh nghiệp thất bại');
        }
    }

    const setChonDoanhNghiep = async (doanhNghiep: DoanhNghiep) => {
        if (quyenSua) {
            setDoanhNghiep(doanhNghiep);
            setShowLuaChonDoanhNghiep(false);
        }else {
            Alert.alert('Lỗi', 'Bạn không có quyền sửa doanh nghiệp cho nhà máy này');
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
                        <View style={{height: '90%'}}>
                            <ScrollView>
                                <Text>{'Tên:'}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Tên doanh nghiệp"
                                    value={ten}
                                    onChangeText={setTen}
                                />
            
                                <Text>{'Mã nhà máy:'}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mã nhà máy"
                                    value={maNhaMay}
                                    onChangeText={setMaNhaMay}
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
            
                                <Text>{'Địa chỉ:'}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Giá"
                                    value={diaChi}
                                    onChangeText={setDiaChi}
                                />

                                <Text>{'Doanh nghiệp:'}</Text>
                                <TouchableOpacity onPress={() => setShowLuaChonDoanhNghiep(true)}>
                                        <TextInput
                                        style={styles.input}
                                        placeholder="Doanh nghiệp sản xuất"
                                        editable={false}
                                        value={doanhNghiep?.dN_Ten}
                                    />
                                </TouchableOpacity>
                                <LuaChonDoanhNghiepHelper showLuaChon={showLuaChonDoanhNghiep} setShowLuaChon={setShowLuaChonDoanhNghiep} setChonDoanhNghiep={setChonDoanhNghiep}/>
                            </ScrollView>
                        </View>
                        
                        <View style={{flexDirection:'row', width: '100%', alignItems: 'center', marginTop: 'auto'}}>
                            <View style={{width: '50%'}}>
                                <Button title="Sửa" color={'red'} onPress={suaNhaMay}></Button>
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