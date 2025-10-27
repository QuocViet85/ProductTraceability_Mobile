import { PADDING_DEFAULT } from "@/app/constant/Style";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getBearerToken } from "../../Auth/Authentication";
import { makePhoneCall } from "../../helpers/LogicHelper/helper";
import { url } from "../../server/backend";

export const temp_ThongTinTheoDoiDoanhNghiep : ThongTinTheoDoiDoanhNghiepTrongTemp[] = [];

type ThongTinTheoDoiDoanhNghiepTrongTemp = {
    dangTheoDoi: boolean, //có được theo dõi bởi user đang Login hay không
    soTheoDoi: number,
    dN_Id: string,
}

export default function TuongTacDoanhNghiep({dN_Id, dN_SoDienThoai}: {dN_Id: string, dN_SoDienThoai: string | undefined}) {
    const [dangTheoDoi, setDangTheoDoi] = useState<boolean | undefined>(false);
    const [soTheoDoi, setSoTheoDoi] = useState<number>(0);

    useEffect(() => {
        layTheoDoi();
    }, [])

    const layTheoDoi = async() => {
        try {
            const thongTinTheoDoiDoanhNghiepTrongTemp = temp_ThongTinTheoDoiDoanhNghiep.find((item) => {
                return item.dN_Id === dN_Id;
            });

            if (!thongTinTheoDoiDoanhNghiepTrongTemp) {
                //lấy số theo dõi của doanh nghiệp
                const urlSoTheoDoi = url(`api/doanhnghiep/so-luong-theo-doi/${dN_Id}`);
                const resSoTheoDoi = await axios.get(urlSoTheoDoi);
                setSoTheoDoi(resSoTheoDoi.data);

                const thongTinTheoDoiDoanhNghiepPushTemp = {
                    dangTheoDoi: false,
                    soTheoDoi: resSoTheoDoi.data,
                    dN_Id: dN_Id
                }

                //lấy trạng thái theo dõi doanh nghiệp của user đang login
                const urlKiemTraDangTheoDoi = url(`api/doanhnghiep/kiem-tra-theo-doi/${dN_Id}`);
                const bearerToken = await getBearerToken();

                if (!bearerToken) {
                    setDangTheoDoi(false)
                }else {
                    const resDangTheoDoi = await axios.get(urlKiemTraDangTheoDoi, {
                        headers: {
                            Authorization: bearerToken
                        }
                    });
                    setDangTheoDoi(resDangTheoDoi.data);
                    thongTinTheoDoiDoanhNghiepPushTemp.dangTheoDoi = resDangTheoDoi.data;
                }
                //push temp
                temp_ThongTinTheoDoiDoanhNghiep.push(thongTinTheoDoiDoanhNghiepPushTemp);
            }else {
                setSoTheoDoi(thongTinTheoDoiDoanhNghiepTrongTemp.soTheoDoi);
                setDangTheoDoi(thongTinTheoDoiDoanhNghiepTrongTemp.dangTheoDoi);
            }
            
        }catch {}
    }

    const theoDoiHoacHuyTheoDoi = async() => {
        const urlTheoDoi = url(`api/doanhnghiep/theo-doi/${dN_Id}`);
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
            return;
        }
        await axios.get(urlTheoDoi, {
            headers: {
                Authorization: bearerToken
            }
        });
        const thongTinTheoDoiDoanhNghiepTrongTemp = temp_ThongTinTheoDoiDoanhNghiep.find((item) => {
            return item.dN_Id === dN_Id;
        });

        if (thongTinTheoDoiDoanhNghiepTrongTemp) {
            thongTinTheoDoiDoanhNghiepTrongTemp.dangTheoDoi = !thongTinTheoDoiDoanhNghiepTrongTemp.dangTheoDoi;

            if (thongTinTheoDoiDoanhNghiepTrongTemp.dangTheoDoi) {
                thongTinTheoDoiDoanhNghiepTrongTemp.soTheoDoi += 1;
            }else {
                thongTinTheoDoiDoanhNghiepTrongTemp.soTheoDoi -= 1;
            }
        }
        layTheoDoi();
    }

    return (
        <View>
            <View style={styles.actionRow}>
                <View style={{width: '70%'}}>
                    <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: '#00b050', borderRadius: 8, width: '100%', alignItems: 'center', paddingTop: PADDING_DEFAULT}} 
                    onPress={theoDoiHoacHuyTheoDoi}>
                        <Text style={{color: 'white', fontWeight: 'bold'}}>{!dangTheoDoi ? '+Theo dõi' : '-Hủy theo dõi'}</Text>
                    </TouchableOpacity>        
                </View>
                <TouchableOpacity style={styles.iconButton} onPress={() => makePhoneCall(dN_SoDienThoai)}>
                    <IconSymbol name="call" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <IconSymbol name="more-horiz" size={24} color="green" />
                </TouchableOpacity>
            </View>
            <Text style={styles.followerText}>{soTheoDoi}{' người đang theo dõi trang này'}</Text>
        </View>
        
    )
}

const styles = StyleSheet.create({
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
});
