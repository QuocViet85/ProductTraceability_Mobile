import { url } from "@/app/server/backend";
import axios from "axios";
import { useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TextInput, View } from "react-native";

export function ChangePassword() {
    const [modalChangePassword, setModalChangePassword] = useState<boolean | undefined>(false);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [repeatNewPassword, setRepeatNewPassword] = useState<string>('');

    const changePassword = () => {
        let urlChangePassword = url('api/auth/change-password');

        axios.put(urlChangePassword, {

        });
    }

    const validate : () => boolean = () => {
            if (newPassword !== repeatNewPassword) {
                Alert.alert('Lỗi', 'Lặp lại mật khẩu mới không đúng');
                return false;
            }
            return true;
        }
    
    return (
        <View>
            <Button title="Đổi mật khẩu" onPress={() => setModalChangePassword(true)}/>

                <Modal
                visible={modalChangePassword}
                animationType='slide'
                presentationStyle='formSheet'
                >
                <View style={styles.container}>
                    <Text style={styles.title}>Đổi mật khẩu</Text>

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

                    <Button title="Đổi mật khẩu" color={'green'} onPress={() => setModalChangePassword(false)}/>
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
});