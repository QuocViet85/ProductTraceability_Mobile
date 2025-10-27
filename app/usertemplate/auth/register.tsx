import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ROLE_ADMIN, ROLE_DOANH_NGHIEP, ROLE_KHACH_HANG } from "../../constant/Role";
import { url } from "../../server/backend";
import Header from '@/app/helpers/ViewHelpers/header';

export default function Register({setFormDangNhap} : {setFormDangNhap : any}) {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [role, setRole] = useState<string>(ROLE_KHACH_HANG);
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    const onRegister = () => {
        if (validate()) {
            let urlDangKi = url('api/auth/register');

            const user : any = {
                name: name,
                phoneNumber: phoneNumber,
                password: password,
                role: role,
                address: address
            };

            if (email !== '') {
                user.email = email;
            }

            axios.post(urlDangKi, user).then((response) => {
                Alert.alert('Thông báo', 'Đăng kí tài khoản thành công. Xin mời đăng nhập');
                setFormDangNhap(true);
            }).catch(() => {
                Alert.alert('Lỗi', 'Đăng kí thất bại');
            })
        }
    };

    const validate : () => boolean = () => {
        let alert = '';
        if (phoneNumber === '') {
            alert += 'Vui lòng nhập số điện thoại \n';
        }
        if (password === '') {
            alert += 'Vui lòng nhập mật khẩu \n';
        }
        if (password.length < 6 || password.length > 100) {
          alert += 'Mật khẩu phải có độ dài trong khoảng 6 đến 100 kí tự \n';
        }
        if (password !== repeatPassword) {
            alert += 'Lặp lại mật khẩu không đúng \n';
        }
        if (name === '') {
            alert += 'Vui lòng nhập tên \n'
        }
        if (role === '') {
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
      <Header title={"Đăng kí"} fontSize={30} resource={null}></Header>
      <ScrollView style={{marginTop: '10%'}}>
          <TextInput
              style={styles.input}
              placeholder="Tên"
              value={name}
              onChangeText={setName}
            />

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

            <TextInput
              style={styles.input}
              placeholder="Lặp lại mật khẩu"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
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
                  selectedValue={role}
                  onValueChange={(itemValue) => setRole(itemValue)}
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
      </ScrollView>

      
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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