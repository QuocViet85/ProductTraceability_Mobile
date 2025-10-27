import { getBearerToken } from "@/app/Auth/Authentication";
import { LIMIT_DOANHNGHIEP } from "@/app/constant/Limit";
import { PADDING_DEFAULT } from "@/app/constant/Style";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useState } from "react";
import { Alert, Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { listDoanhNghiepsHienThiTrangChu, modeTimKiemTrangChuListDoanhNghieps, reRenderTrangChuListDoanhNghieps, setTongDoanhNghiep, textTimKiemTrangChuListDoanhNghieps } from "../../danhSachDoanhNghiep";

export default function ThemDoanhNghiep({width, height, paddingVertical, fontSize}: { width: DimensionValue | undefined, height: DimensionValue | undefined, paddingVertical: DimensionValue | undefined, fontSize: number | undefined}) {
    const [showModalThem, setShowModalThem] = useState<boolean | undefined>(false);

    const [ten, setTen] = useState<string | undefined>(undefined);
    const [maSoThue, setMaSoThue] = useState<string | undefined>(undefined);
    const [maGLN, setMaGLN] = useState<string | undefined>(undefined);
    const [diaChi, setDiaChi] = useState<string | undefined>(undefined);
    const [soDienThoai, setSoDienThoai] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [maGS1, setMaGS1] = useState<string | undefined>(undefined);

    const [hoKinhDoanhCaNhan, setHoKinhDoanhCaNhan] = useState<boolean>(false);

    const themDoanhNghiep = async() => {
        try {
            if(validate()) {
                const urlThemDoanhNghiep = url(`api/doanhnghiep`);

                const res = await axios.post(urlThemDoanhNghiep, {
                    dN_Ten: ten,
                    dN_MaSoThue: maSoThue,
                    dN_MaGLN: maGLN,
                    dN_DiaChi: diaChi,
                    dN_SoDienThoai: soDienThoai,
                    dN_Email: email,
                    dN_KieuDN: hoKinhDoanhCaNhan ? 1 : 2,
                    dN_MaGS1: maGS1
                } as DoanhNghiep, {headers: {Authorization: await getBearerToken()}});

                Alert.alert('Thông báo', 'Thêm doanh nghiệp thành công');

                const daonhNghiepNew: DoanhNghiep = res.data;
                if (modeTimKiemTrangChuListDoanhNghieps) {
                    if (daonhNghiepNew.dN_Ten?.includes(textTimKiemTrangChuListDoanhNghieps) || daonhNghiepNew.dN_MaSoThue?.includes(textTimKiemTrangChuListDoanhNghieps)) {
                        listDoanhNghiepsHienThiTrangChu.unshift(daonhNghiepNew);
                        if (listDoanhNghiepsHienThiTrangChu.length % LIMIT_DOANHNGHIEP === 0) {
                            listDoanhNghiepsHienThiTrangChu.pop();
                        }
                    }
                }else {
                    listDoanhNghiepsHienThiTrangChu.unshift(daonhNghiepNew);
                    if (listDoanhNghiepsHienThiTrangChu.length % LIMIT_DOANHNGHIEP === 0) {
                        listDoanhNghiepsHienThiTrangChu.pop();
                    }
                }
                
                setTongDoanhNghiep((value: number) =>  value + 1);
                reRenderTrangChuListDoanhNghieps((value: number) => value + 1);
                resetState();
            }
            
        }catch {
            Alert.alert('Lỗi', 'Thêm doanh nghiệp thất bại');
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

    const resetState = () => {
            setTen(undefined);
            setMaSoThue(undefined);
            setMaGLN(undefined);
            setDiaChi(undefined);
            setSoDienThoai(undefined);
            setEmail(undefined);
            setEmail(undefined);
            setMaGS1(undefined);
        }

    return (
        <View>
            <TouchableOpacity style={{backgroundColor: 'blue', width: width, height: height, borderRadius: 8, paddingVertical: paddingVertical, alignItems: 'center'}} onPress={() => setShowModalThem(true)}>
                <Text style={{fontWeight: 'bold', fontSize: fontSize, color: 'white'}}>{'Thêm doanh nghiệp'}</Text>
            </TouchableOpacity>

            <Modal
                visible={showModalThem}
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
                            
                            <View style={{flexDirection: 'row'}}>
                                <Text>{'Hộ kinh doanh cá nhân:'}</Text>
                                <TouchableOpacity onPress={() => setHoKinhDoanhCaNhan(true)}>
                                    <IconSymbol name={hoKinhDoanhCaNhan ? 'check-box' : 'check-box-outline-blank'} color={'black'}></IconSymbol>
                                </TouchableOpacity>
                                <View style={{width: 10}}></View>
                                <Text>{'Doanh Nghiệp:'}</Text>
                                <TouchableOpacity onPress={() => setHoKinhDoanhCaNhan(false)}>
                                    <IconSymbol name={!hoKinhDoanhCaNhan ? 'check-box' : 'check-box-outline-blank'} color={'black'}></IconSymbol>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                    
                    <View style={{flexDirection:'row', width: '100%', alignItems: 'center', marginTop: 'auto'}}>
                        <View style={{width: '50%'}}>
                            <Button title="Thêm" color={'blue'} onPress={themDoanhNghiep}></Button>
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
    statBox: {
    width: '48%',
    backgroundColor: 'blue',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontWeight: 'bold', fontSize: 16, color: 'white' },
  input: {
        borderColor: '#999',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        height: 44,
        borderRadius: 6,
  },
})