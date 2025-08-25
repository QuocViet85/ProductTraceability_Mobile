import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { url } from "../server/backend";
import axios from "axios";
import { TextInput } from "react-native";
import { ROLE_ADMIN, ROLE_DOANH_NGHIEP, ROLE_KHACH_HANG } from "../constant/Role";
import { Picker } from '@react-native-picker/picker';

export default function Register({setFormDangNhap} : {setFormDangNhap : any}) {
    const [soDienThoai, setSoDienThoai] = useState<string>('');
    const [matKhau, setMatKhau] = useState<string>('');
    const [ten, setTen] = useState<string>('');
    const [lapLaiMatKhau, setLapLaiMatKhau] = useState<string>('');
    const [vaiTro, setVaiTro] = useState<string>(ROLE_KHACH_HANG);
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    const onRegister = () => {
        if (validate()) {
            let urlDangKi = url('api/auth/register');

            const user : any = {
                name: ten,
                phoneNumber: soDienThoai,
                password: matKhau,
                role: vaiTro,
                address: address
            };

            if (email !== '') {
                user.email = email;
            }

            axios.post(urlDangKi, user).then((response) => {
                console.log(response.data)
            }).catch((error) => {
                console.log(error.response.data);
            })
        }
    };

    const validate : () => Boolean = () => {
        let alert = '';
        if (soDienThoai === '') {
            alert += 'Vui lòng nhập số điện thoại \n';
        }
        if (matKhau === '') {
            alert += 'Vui lòng nhập mật khẩu \n';
        }
        if (matKhau !== lapLaiMatKhau) {
            alert += 'Lặp lại mật khẩu không đúng \n';
        }
        if (ten === '') {
            alert += 'Vui lòng nhập tên \n'
        }
        if (vaiTro === '') {
            alert += 'Vui lòng nhập vai trò \n'
        }

        if (email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert += 'Email không đúng định dạng'
            }
        }

        if (alert !== '') {
            Alert.alert('Lỗi', alert);
            return false;
        }

        return true;
    }

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Kí</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={ten}
        onChangeText={setTen}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Lặp lại mật khẩu"
        value={lapLaiMatKhau}
        onChangeText={setLapLaiMatKhau}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={address}
        onChangeText={setAddress}
      />
    
    <View style={{...styles.input, height: 50}}>
        <Picker
            selectedValue={vaiTro}
            onValueChange={(itemValue) => setVaiTro(itemValue)}
            style={{ height: 55, width: '100%' }}
            >
                <Picker.Item label="Vai trò: Admin" value={ROLE_ADMIN} />
                <Picker.Item label="Vai trò: Doanh Nghiệp" value={ROLE_DOANH_NGHIEP} />
                <Picker.Item label="Vai trò: Khách Hàng" value={ROLE_KHACH_HANG} />
        </Picker>
    </View>
    
      
    
      <Button title="Đăng kí" onPress={onRegister} color={'green'}/>
      <View style={{marginBottom: 20}}></View>
      <Button title="Đã có tài khoản? Đăng nhập" onPress={() => setFormDangNhap(true)} />
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
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