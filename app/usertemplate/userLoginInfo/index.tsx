import { getBearerToken } from "@/app/Auth/Authentication";
import { generateExactRole } from "@/app/constant/Role";
import AppUser from "@/app/model/AppUser";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useState } from "react";
import { Alert, Button, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ChangePassword } from "../auth/changePassword";
import Logout from "../auth/logout";
import AvatarUser from "../avatarUser";
import CoverPhotoUser from "../coverPhotoUser";

export default function UserLoginInfo({userLogin, setUserLogin, setRefreshUserLogin} : {userLogin: AppUser, setUserLogin: any, setRefreshUserLogin: any}) {
    const [name, setName] = useState<string | undefined>(userLogin.name);
    const [email, setEmail] = useState<string | undefined>(userLogin.email);
    const [address, setAddress] = useState<string | undefined>(userLogin.address);
    
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

    const updateUser = async () => {
        if (validate()) {
            const bearerToken = await getBearerToken();

            if (!bearerToken) {
                Alert.alert('Lỗi', 'Lỗi Server. Cập nhật thông tin người dùng thất bại');
            }

            try {   
                const urlUpdateUser = url('api/auth');
                await axios.put(urlUpdateUser, 
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
                setRefreshUserLogin(true);
            }catch {
                Alert.alert('Lỗi', 'Lỗi Server. Cập nhật thông tin người dùng thất bại');
            }
        }
    }

    return(
        <View style={styles.container}>
            <ScrollView
            refreshControl={(
                            <RefreshControl  
                            refreshing={false}
                            onRefresh={() => setRefreshUserLogin(true)} //hành vi khi refresh
                            progressViewOffset={30}/> //kéo mũi tên xuống bao nhiêu thì refresh
                            )}>
                <CoverPhotoUser userId={userLogin.id as string} height={300} canChange= {true}/>
                <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: 1, marginTop: 10}}>
                    <View>
                        <View style={styles.profileHeader}>
                            <AvatarUser userId={userLogin.id} width={64} height={64} canChange={true}/>
                            <View style={styles.nameSection}>
                                <Text style={styles.businessName}>{userLogin.name}</Text>
                                <Text style={styles.businessType}>{`Tài khoản ${generateExactRole(userLogin.role as string)}`}</Text>
                            </View>
                            <ChangePassword />
                        </View>


                        <Text>{'Số điện thoại:'}</Text>
                        <TextInput
                            style={{...styles.input, backgroundColor: 'grey'}}
                            placeholder="Số điện thoại"
                            value={userLogin.phoneNumber}
                            editable={false}
                        />
                        
                        <Text>{'Tên người dùng:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text>{'Email:'}</Text>
                        <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                        />
                        
                        <Text>{'Địa chỉ:'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Địa chỉ"
                            value={address}
                            onChangeText={setAddress} 
                        />

                        <Button title="Cập nhật" onPress={updateUser} color={'green'}/>
                        <View style={{height: 20}}></View>
                        <Logout setUserLogin={setUserLogin}/>
                        <View style={{height: 20}}></View>
                    </View>
                </View> 
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,                     
    backgroundColor: '#fff',
   },
  scrollContainer: { padding: 16 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginTop: -40 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  logoText: { fontSize: 12, color: '#333' },
  nameSection: { marginLeft: 12 },
  businessName: { fontSize: 18, fontWeight: 'bold' },
  businessType: { color: '#888', marginTop: 2 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  followButton: { flex: 1, backgroundColor: '#00b050', marginRight: 8 },
  iconButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#00b050',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  followerText: { marginTop: 8, color: '#777', fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#555', fontSize: 13 },
  section: { marginTop: 16 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressText: { marginLeft: 6, fontSize: 14, color: '#555' },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    marginTop: 'auto'
  },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12, marginTop: 2 },
  input: {
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    height: 44,
    borderRadius: 6,
  },
});

