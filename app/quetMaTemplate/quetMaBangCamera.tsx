import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { layMaTruyXuatTuUrl } from '../helpers/LogicHelper/helper';
import { useRouter } from 'expo-router';

export default function QuetMaBangCamera({navigation} : {navigation: any}) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
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
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarCodeScanned({type, data}: {type: any, data: any}) {
    setScanned(true);
    console.log(data);
    const maTruyXuat = layMaTruyXuatTuUrl(data);
    router.push({
      pathname: '/hometemplate/sanPham/chiTietSanPham', 
      params: {sP_MaTruyXuat: maTruyXuat}
    });
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        barcodeScannerSettings={{ barcodeTypes: ["qr"], }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Đảo Camera</Text>
        </TouchableOpacity>
        <Button title='Scan' onPress={() => setScanned(false)}></Button>
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