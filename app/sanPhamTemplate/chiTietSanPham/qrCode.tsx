import { layMaTruyXuatTuUrl } from "@/app/helpers/LogicHelper/helper";
import { useRef, useState } from "react";
import { Alert, Button, Modal, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import SanPham from "@/app/model/SanPham";

export default function QrCode({sanPham} : {sanPham: SanPham}) {
    const qrRef = useRef<any>(null);
    const [showModalQrCode, setShowModalQrCode] = useState<boolean | undefined>(false);

    const saveQrCode = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Quyền bị từ chối', 'Không thể lưu ảnh nếu không có quyền');
                return;
            }

            if (qrRef.current) {
                const maTruyXuat = sanPham.sP_MaTruyXuat as string;

                qrRef.current.toDataURL(async (dataURL: any) => {
                    try {
                        const fileUri = FileSystem.cacheDirectory + maTruyXuat + '.jpg';
                        // Ghi file từ base64
                        await FileSystem.writeAsStringAsync(fileUri, dataURL, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        
                        // Lưu vào thư viện ảnh
                        const asset = await MediaLibrary.createAssetAsync(fileUri); //lưu vào thư mục Ảnh chung
                        await MediaLibrary.createAlbumAsync('QR Codes', asset, false); // lưu vào thư mục Ảnh riêng theo chỉ định
                        Alert.alert('Thành công', 'QR đã được lưu vào thư viện ảnh!');
                    }catch (e) {
                        Alert.alert('Lỗi', 'Không thể lưu mã QR');
                    }
                });
            }
        }catch {
            Alert.alert('Lỗi', 'Không thể lưu mã QR');
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setShowModalQrCode(true)}>
                <QRCode
                    value={sanPham.sP_MaTruyXuat}
                    size={70}
                    color="black"
                    backgroundColor="white"
                />

                <Modal
                visible={showModalQrCode}
                animationType='slide'
                presentationStyle='fullScreen'
                >
                    <View style={{marginTop: 'auto'}}>
                        <View style={{alignItems: 'center'}}>
                                <QRCode
                                    value={sanPham.sP_MaTruyXuat}
                                    size={300}
                                    color="black"
                                    backgroundColor="white"
                                    getRef={(ref) => (qrRef.current = ref)}
                                />
                        </View>
                        <View style={{height: 10}}>

                        </View>
                        <View style={{flexDirection:'row', width: '100%', alignItems: 'center'}}>
                            <View style={{width: '50%'}}>
                                <Button title="Lưu Mã QR" color={'green'} onPress={saveQrCode}></Button>
                            </View>
                            <View style={{width: '50%'}}>
                                <Button title="Đóng" onPress={() => setShowModalQrCode(false)}></Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
        </View>
    )

    
}