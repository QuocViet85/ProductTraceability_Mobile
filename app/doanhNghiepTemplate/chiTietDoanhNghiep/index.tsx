import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Footer from "../../helpers/ViewHelpers/footer";
import { Updating } from "../../helpers/ViewHelpers/updating";
import DoanhNghiep from "../../model/DoanhNghiep";
import { url } from "../../server/backend";
import AvatarUser from "../../usertemplate/avatarUser";
import AvatarDoanhNghiep from "../avatarDoanhNghiep";
import SuaDoanhNghiep from "./thaoTacTheoAuth/suaDoanhNghiep";
import XoaDoanhNghiep from "./thaoTacTheoAuth/xoaDoanhNghiep";
import TuongTacDoanhNghiep from "./tuongTacDoanhNghiep";
import CoverPhotoDoanhNghiep from "./coverPhotoDoanhNghiep";

export const temp_DoanhNghiep: {doanhNghiep: DoanhNghiep, soSanPham: number}[] = [];

export default function ChiTietDoanhNghiep() 
{
    const params = useLocalSearchParams();
    const dN_Id = params.dN_Id;
    const dN_MaGS1 = params.dN_MaGS1;
    const thongBao = params.thongBao;

    const [doanhNghiep, setDoanhNghiep] = useState<DoanhNghiep | null>(null);
    const [soSanPhamSoHuu, setSoSanPhamSoHuu] = useState<number>(0);
    const [reRenderDoanhNghiep, setReRenderDoanhNghiep] = useState<number>(0);
    const router = useRouter();

    let urlDoanhNghiep = url(`api/doanhnghiep`);

    if (dN_Id) {
      urlDoanhNghiep += `/${dN_Id}`
    }else if (dN_MaGS1) {
      urlDoanhNghiep += `/ma-gs1/${dN_MaGS1}`
    }else {
      urlDoanhNghiep = '';
    }
    

    useEffect(() => {
        layDoanhNghiep();
    }, [reRenderDoanhNghiep]);

    useEffect(() => {
        if (thongBao) {
            Alert.alert('Thông báo', thongBao as string);
        }
    }, [])

    const layDoanhNghiep = async() => {
        const doanhNghiepInTemp = temp_DoanhNghiep.find((dn) => {
            return dn.doanhNghiep.dN_Id === dN_Id || (dN_MaGS1 && dn.doanhNghiep.dN_MaGS1 === dN_MaGS1);
        });

        if (!doanhNghiepInTemp) {
            if (urlDoanhNghiep) {
                const resDN = await axios.get(urlDoanhNghiep);

                if (resDN.data) {
                    const doanhNghiep : DoanhNghiep = resDN.data;
                    setDoanhNghiep(doanhNghiep);
                    const doanhNghiepPushToTemp : {doanhNghiep: DoanhNghiep, soSanPham: number} = {doanhNghiep: doanhNghiep, soSanPham: 0};

                    temp_DoanhNghiep.push(doanhNghiepPushToTemp);

                    const urlSoSanPhamSoHuu = url(`api/sanpham/doanh-nghiep-so-huu/tong-so/${doanhNghiep.dN_Id}`);

                    const resSoSP = await axios.get(urlSoSanPhamSoHuu);

                    if (resSoSP.data) {
                        setSoSanPhamSoHuu(resSoSP.data);
                        doanhNghiepPushToTemp.soSanPham = resSoSP.data;
                    }
                }
            }
            
        }else {
            setDoanhNghiep(doanhNghiepInTemp.doanhNghiep);
            setSoSanPhamSoHuu(doanhNghiepInTemp.soSanPham);
        }   
    }

    const refreshDoanhNghiep = async() => {
        const indexDoanhNghiepInTemp = temp_DoanhNghiep.findIndex((doanhNghiepTrongTemp: {doanhNghiep: DoanhNghiep, soSanPham: number}) => {
            return doanhNghiepTrongTemp.doanhNghiep.dN_Id === dN_Id || (dN_MaGS1 && doanhNghiepTrongTemp.doanhNghiep.dN_MaGS1 === dN_MaGS1);
        });

        if (indexDoanhNghiepInTemp !== -1) {
            temp_DoanhNghiep.splice(indexDoanhNghiepInTemp, 1);
        }

        setReRenderDoanhNghiep((value: number) => value + 1);
    }

    return (
        <View style={styles.container}>
            {doanhNghiep ? (
            <View style={{flex: 1}}>
                <ScrollView refreshControl={(
                                            <RefreshControl 
                                            refreshing={false}
                                            onRefresh={refreshDoanhNghiep} //hành vi khi refresh
                                            progressViewOffset={30}/> //kéo mũi tên xuống bao nhiêu thì refresh
                                            )}>
                    <CoverPhotoDoanhNghiep dN_Id={doanhNghiep.dN_Id as string} height={300} canChange={true} />
                    <View style={styles.scrollContainer}>
                        {/* Logo + Name */}
                        <View style={styles.profileHeader}>
                        <AvatarDoanhNghiep dN_Id={doanhNghiep.dN_Id as string} width={64} height={64} canChange={true}/>
                        <View style={styles.nameSection}>
                            <Text style={styles.businessName}>{doanhNghiep.dN_Ten}</Text>
                            <Text style={styles.businessType}>{doanhNghiep.dN_KieuDN == 1 ? 'Hộ kinh doanh cá nhân' : 'Doanh Nghiệp'}</Text>
                        </View>
                        </View>

                        <TuongTacDoanhNghiep dN_Id={doanhNghiep.dN_Id as string} dN_SoDienThoai={doanhNghiep.dN_SoDienThoai}/>
                    
                        {/* Stats */}
                        <View style={styles.statsRow}>
                            <TouchableOpacity style={styles.statBox} onPress={() => router.push({pathname: '/sanPhamTemplate/danhSachSanPham/danhSachSanPham', params: {dN_Id: doanhNghiep.dN_Id, dN_Ten: doanhNghiep.dN_Ten}})}>
                                <Text style={styles.statValue}>{soSanPhamSoHuu}</Text>
                                <Text style={styles.statLabel}>{'Sản phẩm'}</Text>
                            </TouchableOpacity>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>{'???'}</Text>
                                <Text style={styles.statLabel}>{'Đánh giá'}</Text>
                            </View>
                        </View>

                        <View style={styles.statsRow}>
                            <SuaDoanhNghiep doanhNghiep={doanhNghiep} setReRenderDoanhNghiep={setReRenderDoanhNghiep}/>
                            <XoaDoanhNghiep doanhNghiep={doanhNghiep} setDoanhNghiep={setDoanhNghiep}/>
                        </View>

                        {/* Giới thiệu */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{'Giới thiệu'}</Text>
                            <View style={styles.addressRow}>
                                <MaterialIcons name="contact-phone" size={20} color="#555" />
                                <Text style={styles.addressText}>
                                    {'Số điện thoại: '}{doanhNghiep.dN_SoDienThoai ? doanhNghiep.dN_SoDienThoai : (<Updating />)}
                                </Text>
                            </View>

                            <View style={styles.addressRow}>
                                <MaterialIcons name="email" size={20} color="#555" />
                                <Text style={styles.addressText}>
                                    {'Email: '}{doanhNghiep.dN_Email ? doanhNghiep.dN_Email : (<Updating />)}
                                </Text>
                            </View>

                            <View style={styles.addressRow}>
                                <MaterialIcons name="code" size={20} color="#555" />
                                <Text style={styles.addressText}>
                                    {'Mã số thuế: '}{doanhNghiep.dN_MaSoThue ? doanhNghiep.dN_MaSoThue : (<Updating />)}
                                </Text>
                            </View>

                            <View style={styles.addressRow}>
                                <MaterialIcons name="code" size={20} color="#555" />
                                <Text style={styles.addressText}>
                                    {'Mã GS1: '}{doanhNghiep.dN_MaGS1 ? doanhNghiep.dN_MaGS1 : (<Updating />)}
                                </Text>
                            </View>

                            <View style={styles.addressRow}>
                                <MaterialIcons name="code" size={20} color="#555" />
                                <Text style={styles.addressText}>
                                    {'Mã GLN: '}{doanhNghiep.dN_MaGLN ? doanhNghiep.dN_MaGLN : (<Updating />)}
                                </Text>
                            </View>

                            <View style={styles.addressRow}>
                                <MaterialIcons name="location-on" size={20} color="#555" />
                                <Text style={styles.addressText}>
                                    {'Địa chỉ: '}{doanhNghiep.dN_DiaChi ? doanhNghiep.dN_DiaChi : (<Updating />)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{'Chủ doanh nghiệp'}</Text>
                            {doanhNghiep.dN_List_CDN?.map((item, key) => {
                                return (
                                    <View key={key}>
                                        <Link style={{}} key={key} href={{pathname: '/usertemplate/user', params: {userId: item.cdN_ChuDN.id} }} withAnchor asChild>
                                        <TouchableOpacity style={{height: 40, flexDirection: 'row'}}>
                                            <View>
                                                <AvatarUser userId={item.cdN_ChuDN.id} width={40} height={40} canChange={false} />
                                            </View>
                                            <View style={{marginLeft: 10}}>
                                                <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>{item.cdN_ChuDN.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        </Link>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                    
                </ScrollView>
            </View>
        ) : (
            <View>
                <Text>{'Không tồn tại doanh nghiệp'}</Text>
            </View>)}
            <Footer backgroundColor={'black'} height={'6%'}/>
        </View>
  );
}

const TabItem = ({ label, icon, active }: { label: any, icon: any, active: any }) => (
  <View style={styles.tabItem}>
    <Ionicons name={icon} size={20} color={active ? '#00b050' : '#999'} />
    <Text style={[styles.tabLabel, { color: active ? '#00b050' : '#999' }]}>{label}</Text>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', height: '100%' },
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