import { useEffect, useState } from "react";
import NhaMay from "../model/NhaMay";
import axios from "axios";
import { url } from "../server/backend";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Updating } from "../helpers/ViewHelpers/updating";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import AvatarDoanhNghiep from "../doanhNghiepTemplate/avatarDoanhNghiep";
import AnhNhaMay from "./anhNhaMay";
import Footer from "../helpers/ViewHelpers/footer";
import { getWidthScreen } from "../helpers/LogicHelper/helper";
import { HEIGHT_SMARTPHONE } from "../constant/SizeScreen";
import SuaNhaMay from "./thaoTacTheoAuth/suaNhaMay";
import XoaNhaMay from "./thaoTacTheoAuth/xoaNhaMay";

export const temp_NhaMay: NhaMay[] = [];

export default function NhaMayChiTiet() {
    const params = useLocalSearchParams();
    const nM_Id = params.nM_Id;
    const [nhaMay, setNhaMay] = useState<NhaMay | null>(null);
    const [reRenderNhaMay, setReRenderNhaMay] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        layNhaMay();
    }, [reRenderNhaMay]);

    const layNhaMay = async() => {
        try {
            const nhaMayTrongTemp = temp_NhaMay.find((item: NhaMay) => item.nM_Id === nM_Id);

            if (!nhaMayTrongTemp) {
                const urlNhaMay = url(`api/nhamay/${nM_Id}`);
                const res = await axios.get(urlNhaMay);

                if (res.data) {
                    const nhaMay = res.data;
                    setNhaMay(nhaMay);
                    temp_NhaMay.push(nhaMay);
                }
            }else {
                setNhaMay(nhaMayTrongTemp);
            }
        }catch {}
    }

    const refreshNhaMay = async() => {
        const indexNhaMayInTemp = temp_NhaMay.findIndex((nhaMay: NhaMay) => {
            return nhaMay.nM_Id === nM_Id;
        });

        if (indexNhaMayInTemp !== -1) {
        temp_NhaMay.splice(indexNhaMayInTemp, 1);
        }

        setReRenderNhaMay((value: number) => value + 1);
    }

    return (
        <View style={styles.container}>
            {nhaMay ? (
                <View>
                <ScrollView contentContainerStyle={styles.scrollContainer}
                refreshControl={(
                                <RefreshControl  
                                refreshing={false}
                                onRefresh={refreshNhaMay} //hành vi khi refresh
                                progressViewOffset={30}/> //kéo mũi tên xuống bao nhiêu thì refresh
                                )}>
                    <AnhNhaMay nM_Id={nM_Id as string}/>
                    <View style={{height: 50}}></View>
                    {/* Logo + Name */}
                    <View style={styles.profileHeader}>
                        <View style={styles.nameSection}>
                            <Text style={styles.businessName}>{nhaMay.nM_Ten}</Text>
                            <Text style={styles.businessType}>{'Nhà máy'}</Text>
                        </View>
                    </View>

                    {/* Giới thiệu */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Giới thiệu</Text>
                        <View style={styles.addressRow}>
                            <MaterialIcons name="contact-phone" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                {'Số điện thoại: '}{nhaMay.nM_SoDienThoai ? nhaMay.nM_SoDienThoai: (<Updating />)}
                            </Text>
                        </View>

                        <View style={styles.addressRow}>
                            <MaterialIcons name="email" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                {'Email: '}{nhaMay.nM_Email ? nhaMay.nM_Email: (<Updating />)}
                            </Text>
                        </View>

                        <View style={styles.addressRow}>
                            <MaterialIcons name="location-on" size={20} color="#555" />
                            <Text style={styles.addressText}>
                                {'Địa chỉ: '}{nhaMay.nM_DiaChi ? nhaMay.nM_DiaChi : (<Updating />)}
                            </Text>
                        </View>
                    </View>

                    <View style={{marginTop: 10, alignItems: 'center'}}>
                        <TouchableOpacity style={styles.statBox} onPress={() => router.push({pathname: '/sanPhamTemplate/danhSachSanPham/danhSachSanPham', params: {nM_Id: nhaMay.nM_Id, nM_Ten: nhaMay.nM_Ten
                        }})}>
                            <Text style={styles.statLabel}>{'Sản phẩm được sản xuất tại nhà máy'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.statsRow}>
                        <SuaNhaMay nhaMay={nhaMay} setReRenderNhaMay={setReRenderNhaMay} />
                        <XoaNhaMay nhaMay={nhaMay} setNhaMay={setNhaMay} />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{'Doanh Nghiệp Sở Hữu Nhà Máy'}</Text>
                        {nhaMay.nM_DN ? (<View>
                            <Link href={{pathname: '/doanhNghiepTemplate/chiTietDoanhNghiep', params: {dN_Id: nhaMay.nM_DN?.dN_Id} }} withAnchor asChild>
                            <TouchableOpacity style={{height: 40, flexDirection: 'row'}}>
                                <View>
                                    <AvatarDoanhNghiep dN_Id={nhaMay.nM_DN?.dN_Id as string} width={40} height={40} canChange={false}/>
                                </View>
                                <View style={{marginLeft: 10}}>
                                    <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>{nhaMay.nM_DN?.dN_Ten}</Text>
                                </View>
                            </TouchableOpacity>
                            </Link>
                        </View>) : (<View></View>)}
                        
                    </View>
                </ScrollView>

                {/* Bottom Tabs */}

            </View>
        ) : (
            <View>
                <Text>{'Không tồn tại nhà máy'}</Text>
            </View>)}
            <Footer height={getWidthScreen() <= HEIGHT_SMARTPHONE ? '6%' : '4%'} backgroundColor={'black'} />
        </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { width: '100%' },
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