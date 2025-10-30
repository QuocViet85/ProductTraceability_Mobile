import Header from "@/app/helpers/ViewHelpers/header";
import axios from "axios";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { getUserLogin, setAccessAndRefreshToken } from "../../Auth/Authentication";
import { url } from "../../server/backend";
import { setForceReRenderDanhSachChat } from "@/app/chatTemplate/danhSachChat";

export default function Login({setFormDangNhap, setUserLogin} : {setFormDangNhap : any, setUserLogin: any}) {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onLogin = async () => {
        if (phoneNumber === '' || password === '') {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        let urlDangNhap = url('api/auth/login');

        try {
            const res = await axios.post(urlDangNhap, {
              phoneNumber: phoneNumber,
              passWord: password
          });

          const token = res.data;
          await setAccessAndRefreshToken(token.accessToken, token.refreshToken);
          const userLogin = await getUserLogin();
          setUserLogin(userLogin);
          setForceReRenderDanhSachChat((value: number) => value + 1);
        }catch {
          Alert.alert("Lỗi","Tên đăng nhập hoặc mật khẩu không hợp lệ")
        }
    };

    return (
    <View style={styles.container}>
      <Header title={"Đăng nhập"} fontSize={30} resource={null}></Header>
      <View style={{marginTop: '10%'}}>
          <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      
        <Button title="Đăng nhập" onPress={onLogin} />
        <View style={{marginBottom: 20}}></View>
        <Button title="Chưa có tài khoản? Đăng kí" onPress={() => setFormDangNhap(false)} color={'green'}/>
      </View>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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