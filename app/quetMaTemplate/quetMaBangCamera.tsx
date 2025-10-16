import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { url } from '../server/backend';

export default function QuetMaBangCamera({navigation} : {navigation: any}) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanned, setIsScanned] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => { 
        if (!permission || !permission.granted) { 
            requestPermission(); 
        }
    }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{'We need your permission to show the camera'}</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function handleBarCodeScanned({data}: {data: string}) {
    try {
      setIsScanned(false); //quét ra dữ liệu rồi thì khóa quét để không bị quét tiếp dẫn đến chuyển trang nhiều lần

      let res = await axios.get(url(`api/sanpham/ma-truy-xuat/ton-tai/${data}`));
      if (res.data) {
        router.push({
          pathname: '/sanPhamTemplate/chiTietSanPham', 
          params: {sP_MaTruyXuat: data}
        });

        return;
      }

      res = await axios.get(url(`api/sanpham/ma-vach/ton-tai/${data}`));
      if (res.data) {
        router.push({
          pathname: '/sanPhamTemplate/chiTietSanPham', 
          params: {sP_MaVach: data}
        });

        return;
      }

      const noiDungCoTheLaGS1 = data.slice(3, 7);
      res = await axios.get((url(`api/doanhnghiep/ma-gs1/ton-tai/${noiDungCoTheLaGS1}`)));

      if (res.data) {
        router.push({
          pathname: '/doanhNghiepTemplate/chiTietDoanhNghiep', 
          params: {dN_MaGS1: noiDungCoTheLaGS1, thongBao: 'Tìm được doanh nghiệp từ mã nhưng không tìm được sản phẩm'}
        });

        return;
      }
    }catch {}
    
    setIsScanned(true); //quét ra dữ liệu nhưng dữ liệu không hợp lệ dẫn đến không chuyển trang được thì cho phép quét tiếp
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        barcodeScannerSettings={{ barcodeTypes: ["qr", "code128"], }}
        onBarcodeScanned={isScanned ? handleBarCodeScanned : undefined}
        />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>{'Đảo Camera'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: '100%', 
    height: '100%'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});