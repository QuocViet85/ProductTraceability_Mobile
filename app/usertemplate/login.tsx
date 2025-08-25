import { useState } from "react";
import { Alert, Button, TextInput } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { url } from "../server/backend";
import axios from "axios";
import { getAccessToken, setAccessAndRefreshToken } from "../helpers/authCache";

export default function Login({setFormDangNhap} : {setFormDangNhap : any}) {
    const [soDienThoai, setSoDienThoai] = useState<string>('');
    const [matKhau, setMatKhau] = useState<string>('');

    const onLogin = () => {
        if (soDienThoai === '' || matKhau === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        let urlDangNhap = url('api/auth/login');

        axios.post(urlDangNhap, {
            phoneNumber: soDienThoai,
            passWord: matKhau
        }).then((response) => {
            const token = response.data;
            setAccessAndRefreshToken(token.accessToken, token.refreshToken).then(() => {
                getAccessToken().then((accessToken) => {
                    console.log(accessToken)
                })
            });
        }).catch((error) => {
            Alert.alert("Lỗi","Tên đăng nhập hoặc mật khẩu không hợp lệ")
        });
    };

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={soDienThoai}
        onChangeText={setSoDienThoai}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={matKhau}
        onChangeText={setMatKhau}
        secureTextEntry
      />
    
      <Button title="Đăng nhập" onPress={onLogin} />
      <View style={{marginBottom: 20}}></View>
      <Button title="Chưa có tài khoản? Đăng kí" onPress={() => setFormDangNhap(false)} color={'green'}/>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    height: 44,
    borderRadius: 6,
  },
});