import getBearerToken, { deleteToken, getAccessToken } from "@/app/helpers/LogicHelper/authHelper";
import AppUser from "@/app/model/AppUser";
import { url } from "@/app/server/backend";
import axios, { AxiosHeaderValue } from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Image, ImageSourcePropType, StyleSheet, Text, TextInput, View } from "react-native";
import Logout from "../auth/logout";
import { ChangePassword } from "../auth/changePassword";
import AvatarUser from "../avatarUser";
import { generateExactRole } from "@/app/constant/Role";

export default function UserLoginInfo({userLogin, setUserLogin, setRefreshUserLogin} : {userLogin: AppUser, setUserLogin: any, setRefreshUserLogin: any}) {
    const [name, setName] = useState<string | undefined>(userLogin.name);
    const [email, setEmail] = useState<string | undefined>(userLogin.email);
    const [address, setAddress] = useState<string | undefined>(userLogin.address);
    

    const updateUser = () => {
        if (validate()) {
            let urlUpdateUser = url('api/auth');

            getBearerToken()
            .then((bearerToken : AxiosHeaderValue | undefined) => {
                axios.put(urlUpdateUser, 
                {
                name: name,
                email: email,
                address: address
                }, 
                {
                    headers: {
                        Authorization: bearerToken
                    }
                })
                .then(() => {
                    setRefreshUserLogin(true);
                })
                .catch(() => {
                    Alert.alert('Lỗi', 'Lỗi Server. Cập nhật thông tin người dùng thất bại');
                })
            })
            .catch(() => {
                Alert.alert('Lỗi', 'Lỗi Server. Cập nhật thông tin người dùng thất bại');
            })
        }
    }

    const validate = () => {
        let alert = '';

        if (name === '') {
            alert += 'Vui lòng nhập tên \n'
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

    return(
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <AvatarUser userId={userLogin.id} width={64} height={64} canChange={true}/>
                    <View>
                        <Text style={{fontWeight: 'bold'}}>{userLogin.name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{backgroundColor: 'grey', marginLeft: 10, marginRight: 10, borderRadius: 6}}>{generateExactRole(userLogin.role as string)}</Text>
                            <ChangePassword />
                        </View>
                    </View>
            </View>

            <Text>Số điện thoại:</Text>
            <TextInput
                style={{...styles.input, backgroundColor: 'grey'}}
                placeholder="Số điện thoại"
                value={userLogin.phoneNumber}
                editable={false}
            />
            
            <Text>Tên người dùng:</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên"
                value={name}
                onChangeText={setName}
            />

            <Text>Email:</Text>
            <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
            />
            
            <Text>Địa chỉ:</Text>
            <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={address}
                onChangeText={setAddress} 
            />

            <Button title="Cập nhật" onPress={updateUser} color={'green'}/>
            <View style={{marginBottom: 20}}></View>
            <Logout setUserLogin={setUserLogin}/>
            
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