import getBearerToken from "@/app/Auth/Authentication";
import { quyenSuaSanPham } from "@/app/Auth/Authorization/AuthSanPham";
import { handleInputNumber } from "@/app/helpers/LogicHelper/inputHelper";
import SanPham from "@/app/model/SanPham";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, DimensionValue, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
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

    useEffect(() => {
        layQuyenSua();
    }, [])

    const layQuyenSua = async() => {
        const quyenSua = await quyenSuaSanPham(sanPham.sP_DN_SoHuu_Id);
        setQuyenSua(quyenSua);
    }

    const suaSanPham = async() => {
        try {
            const urlSuaSanPham = url(`api/sanpham/${sanPham.sP_Id}`);

            await axios.put(urlSuaSanPham, {
                sP_Ten: ten,
                sP_MaTruyXuat: maTruyXuat,
                sP_MaVach: maVach,
                sP_MoTa: moTa,
                sP_Website: website,
                sP_Gia: gia,
                sP_MaQuocGia: maQuocGia,
                sP_HangSanXuat: hangSanXuat
            }, {headers: {Authorization: await getBearerToken()}});

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
            }

            setReRenderSanPham((value: number) => value + 1);
            setShowModalSua(false);
        }catch {}
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
                    <Text>Tên:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Số điện thoại"
                        value={ten}
                        onChangeText={setTen}
                    />

                    <Text>Mã truy xuất:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mã truy xuất"
                        value={maTruyXuat}
                        onChangeText={setMaTruyXuat}
                    />

                    <Text>Mã vạch:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mã vạch"
                        value={maVach}
                        onChangeText={setMaVach}
                    />

                    <Text>Giá:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Giá"
                        value={Number(gia).toLocaleString('en-US') !== 'NaN' ? Number(gia).toLocaleString('en-US') : gia}
                        onChangeText={(value) => {handleInputNumber(value, setGia)}}
                    />

                    <Text>Mô tả:</Text>
                    <TextInput
                        multiline={true}
                        style={styles.inputMoTa}
                        placeholder="Mô tả"
                        value={moTa}
                        onChangeText={setMoTa}
                    />

                    <Text>Website:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Website"
                        value={website}
                        onChangeText={setWebsite}
                    />

                    <Text>Hãng sản xuất:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Hãng sản xuất"
                        value={hangSanXuat}
                        onChangeText={setHangSanXuat}
                    />

                    <Text>Mã quốc gia:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mã quốc gia"
                        value={maQuocGia}
                        onChangeText={setMaQuocGia}
                    />
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