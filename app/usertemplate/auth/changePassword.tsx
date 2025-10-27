import { getBearerToken } from "@/app/Auth/Authentication";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export function ChangePassword() {
    const [modalChangePassword, setModalChangePassword] = useState<boolean | undefined>(false);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [repeatNewPassword, setRepeatNewPassword] = useState<string>('');

    const changePassword = () => {
        let urlChangePassword = url('api/auth/change-password');

        if (validate()) {
            getBearerToken().then((bearerToken : string | undefined) => {
            axios.put(urlChangePassword, {
              oldPassword: oldPassword,
              newPassword: newPassword
            }, 
            {
              headers: {
                Authorization: bearerToken
              }
            })
            .then(() => {
              Alert.alert('Đổi mật khẩu thành công');
            })
            .catch(() => {
              Alert.alert('Đổi mật khẩu thất bại. Sai mật khẩu cũ');
            });
          });
        }
    }

    const validate : () => boolean = () => {
            let alert = '';
            if (newPassword !== repeatNewPassword) {
                alert += 'Lặp lại mật khẩu mới không đúng \n';
            }

            if (newPassword.length < 6 || newPassword.length > 100) {
              alert += 'Mật khẩu phải có độ dài trong khoảng 6 đến 100 kí tự \n';
            }

            if (alert !== '') {
              Alert.alert('Lỗi', alert);
              return false;
            }
            return true;
        }
    
    return (
        <View style={styles.statBox}>
              <TouchableOpacity onPress={() => setModalChangePassword(true)}>
                        <Text style={styles.statLabel}>{'Đổi mật khẩu'}</Text>
              </TouchableOpacity>
                <Modal
                visible={modalChangePassword}
                animationType='slide'
                presentationStyle='formSheet'
                >
                <View style={styles.container}>
                    <Text style={styles.title}>{'Đổi mật khẩu'}</Text>

                    <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu cũ"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry
                          />
                    
                    <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                          />
                    
                    <TextInput
                    style={styles.input}
                    placeholder="Lặp lại mật khẩu mới"
                    value={repeatNewPassword}
                    onChangeText={setRepeatNewPassword}
                    secureTextEntry
                    />

                    <Button title="Đổi mật khẩu" color={'green'} onPress={() => changePassword()}/>
                </View>
                <View style={{marginTop: 'auto'}}>
                        <Button title="Đóng" onPress={() => setModalChangePassword(false)}/>
                </View>
                </Modal>
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
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '40%',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10
  },
  statValue: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#555', fontSize: 13 },
});