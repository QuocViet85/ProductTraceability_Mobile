import { IconSymbol } from "@/components/ui/IconSymbol";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Button, ScrollView, Text, TouchableOpacity } from "react-native";
import { Image, StyleSheet, View } from "react-native";
import DoanhNghiep from "../model/DoanhNghiep";
import { useEffect, useState } from "react";
import { url } from "../server/backend";
import axios from "axios";
import CoverPhotoDoanhNghiep from "./coverPhoto";
import { Updating } from "../helpers/ViewHelpers/updating";
import AvatarDoanhNghiep from "./avatar";
import TheoDoiDoanhNghiep from "./theoDoi";

export default function Index() 
{
    const params = useLocalSearchParams();
    const dN_Id = params.dN_Id;

    const [doanhNghiep, setDoanhNghiep] = useState<DoanhNghiep | null>(null);
    const [soTheoDoi, setSoTheoDoi] = useState<number>(0);

    useEffect(() => {
        const urlDoanhNghiep = url(`api/doanhnghiep/${dN_Id}`);

        axios.get(urlDoanhNghiep)
            .then((res) => {
                if (res.data) {
                    setDoanhNghiep(res.data as DoanhNghiep);
                }
            })

        
    }, []);

    const laySoTheoDoi = () => {
        const urlSoTheoDoi = url(`api/doanhnghiep/so-luong-theo-doi/${dN_Id}`);
        axios.get(urlSoTheoDoi)
            .then((res) => {
                if (res.data) {
                    setSoTheoDoi(res.data);
                }
            })
    }

    return (
        <View style={styles.container}>
            {doanhNghiep ? (
                <View>
                    {/* Banner */}
                <CoverPhotoDoanhNghiep dN_Id={doanhNghiep.dN_Id as string} />

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Logo + Name */}
                    <View style={styles.profileHeader}>
                    <AvatarDoanhNghiep dN_Id={doanhNghiep.dN_Id as string} width={64} height={64}/>
                    <View style={styles.nameSection}>
                        <Text style={styles.businessName}>{doanhNghiep.dN_Ten}</Text>
                        <Text style={styles.businessType}>Doanh nghiệp</Text>
                    </View>
                    </View>

                    {/* Follow + Call */}
                    <View style={styles.actionRow}>
                        <TheoDoiDoanhNghiep dN_Id={dN_Id as string} />
                    <TouchableOpacity style={styles.iconButton}>
                        <IconSymbol name="call" size={24} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <IconSymbol name="more-horiz" size={24} color="green" />
                    </TouchableOpacity>
                    </View>

                    <Text style={styles.followerText}>{soTheoDoi} người đang theo dõi trang này</Text>
                   
                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <StatBox label="Sản phẩm" value="1211" />
                        <StatBox label="Đánh giá" value="4.59/5" />
                        <StatBox label="Lượt quét" value="390.422" />
                        <StatBox label="Xem sản phẩm" value="388.995" />
                    </View>

                    {/* Giới thiệu */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Giới thiệu</Text>
                        <View style={styles.addressRow}>
                            <MaterialIcons name="location-on" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                Số điện thoại: {doanhNghiep.dN_SoDienThoai ? doanhNghiep.dN_SoDienThoai : (<Updating />)}
                            </Text>
                        </View>

                        <View style={styles.addressRow}>
                            <MaterialIcons name="email" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                Email: {doanhNghiep.dN_Email ? doanhNghiep.dN_Email : (<Updating />)}
                            </Text>
                        </View>

                        <View style={styles.addressRow}>
                            <MaterialIcons name="code" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                Mã số thuế: {doanhNghiep.dN_MaSoThue ? doanhNghiep.dN_MaSoThue : (<Updating />)}
                            </Text>
                        </View>

                        <View style={styles.addressRow}>
                            <MaterialIcons name="location-on" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                Địa chỉ: {doanhNghiep.dN_DiaChi ? doanhNghiep.dN_DiaChi : (<Updating />)}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Tabs */}

            </View>
        ) : (
            <View>
                <Text>Không tồn tại doanh nghiệp</Text>
            </View>)}
            
        </View>
  );
}

const StatBox = ({ label, value }: {label: any, value: any}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TabItem = ({ label, icon, active }: { label: any, icon: any, active: any }) => (
  <View style={styles.tabItem}>
    <Ionicons name={icon} size={20} color={active ? '#00b050' : '#999'} />
    <Text style={[styles.tabLabel, { color: active ? '#00b050' : '#999' }]}>{label}</Text>
  </View>
);


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

                // <View style={styles.bottomTabs}>
                //     <TabItem label="Tổng quan" icon="document-text-outline" active />
                //     <TabItem label="Bài viết" icon="create-outline" active={false} />
                //     <TabItem label="Sản phẩm" icon="storefront-outline" active={false} />
                // </View>