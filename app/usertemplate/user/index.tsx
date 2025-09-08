import { getUserInfo } from "@/app/helpers/LogicHelper/userHelper";
import AppUser from "@/app/model/AppUser";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarUser from "../avatarUser";
import { MaterialIcons } from "@expo/vector-icons";
import { Updating } from "@/app/helpers/ViewHelpers/updating";
import { generateExactRole } from "@/app/constant/Role";

export default function UserInfo() {
    const params = useLocalSearchParams();
    const userId = params.userId;

    const [user, setUser] = useState<AppUser | null>(null);

    useEffect(() => {
        getUserInfo(userId as string).then((user) => {
                if (user) {
                    setUser(user);
                }
            })
    }, []);

    return (
        <View style={styles.container}>
            {user ? (
                <View>
                    {/* Banner */}
                {/* <CoverPhotoDoanhNghiep dN_Id={doanhNghiep.dN_Id as string} /> */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Logo + Name */}
                    <View style={styles.profileHeader}>
                    <AvatarUser userId={user.id as string} width={64} height={64} canChange={false}/>
                    <View style={styles.nameSection}>
                        <Text style={styles.businessName}>{user.name}</Text>
                        <Text style={styles.businessType}>Tài khoản {generateExactRole(user.role as string)}</Text>
                    </View>
                    </View>

                    {/* <TheoDoiVaLienHeDoanhNghiep dN_Id={doanhNghiep.dN_Id as string} dN_SoDienThoai={doanhNghiep.dN_SoDienThoai}/> */}

                    {/* Giới thiệu */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Giới thiệu</Text>
                        <View style={styles.addressRow}>
                            <MaterialIcons name="location-on" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                Số điện thoại: {user.phoneNumber ? user.phoneNumber : (<Updating />)}
                            </Text>
                        </View>

                        <View style={styles.addressRow}>
                            <MaterialIcons name="email" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                Email: {user.email ? user.email : (<Updating />)}
                            </Text>
                        </View>

                        <View style={styles.addressRow}>
                            <MaterialIcons name="location-on" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                Địa chỉ: {user.address ? user.address : (<Updating />)}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Tabs */}

            </View>
        ) : (
            <View>
                <Text>Không tồn tại người dùng</Text>
            </View>)}
            
        </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 16, marginTop: '10%' },
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
});