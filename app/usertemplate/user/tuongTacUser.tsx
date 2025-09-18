import getBearerToken from "@/app/Auth/Authentication";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const temp_ThongTinTheoDoiUser : ThongTinTheoDoiUserTrongTemp[] = [];

type ThongTinTheoDoiUserTrongTemp = {
    dangTheoDoi: boolean, //có được theo dõi bởi user đang Login hay không
    soTheoDoi: number,
    userId: string,
}

export default function TuongTacUser({userId}: {userId: string}) {
    const [dangTheoDoi, setDangTheoDoi] = useState<boolean>(false);
    const [soTheoDoi, setSoTheoDoi] = useState<number>(0);

    useEffect(() => {
            layTheoDoi();
        }, []);

    const layTheoDoi = async() => {
        try {
            const thongTinTheoDoiUserTrongTemp = temp_ThongTinTheoDoiUser.find((item) => {
                return item.userId === userId;
            });

            if (!thongTinTheoDoiUserTrongTemp) {
                //Lấy số người theo dõi user hiện tại
                const urlSoTheoDoi = url(`api/auth/so-luong-theo-doi/${userId}`);
                const resSoTheoDoi = await axios.get(urlSoTheoDoi);
                setSoTheoDoi(resSoTheoDoi.data);

                const thongTinTheoDoiUserPushTemp : ThongTinTheoDoiUserTrongTemp = {
                    dangTheoDoi: false,
                    soTheoDoi: resSoTheoDoi.data,
                    userId: userId
                }

                //Lấy trạng thái theo dõi user hiện tại của user login
                const urlKiemTraDangTheoDoi = url(`api/auth/kiem-tra-theo-doi/${userId}`);
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
                    thongTinTheoDoiUserPushTemp.dangTheoDoi = resDangTheoDoi.data;
                }

                //push temp

                temp_ThongTinTheoDoiUser.push(thongTinTheoDoiUserPushTemp);
            }else {
                setSoTheoDoi(thongTinTheoDoiUserTrongTemp.soTheoDoi);
                setDangTheoDoi(thongTinTheoDoiUserTrongTemp.dangTheoDoi);
            }
        }catch {}
    }

    const theoDoiHoacHuyTheoDoi = async () => {
      const urlTheoDoi = url(`api/auth/theo-doi/${userId}`);
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
            return;
        }
        await axios.get(urlTheoDoi, {
            headers: {
                Authorization: bearerToken
            }
        });

        const thongTinTheoDoiUserTrongTemp = temp_ThongTinTheoDoiUser.find((item) => {
            return item.userId === userId;
        });

        if (thongTinTheoDoiUserTrongTemp) {
            thongTinTheoDoiUserTrongTemp.dangTheoDoi = !thongTinTheoDoiUserTrongTemp.dangTheoDoi;

            if (thongTinTheoDoiUserTrongTemp.dangTheoDoi) {
                thongTinTheoDoiUserTrongTemp.soTheoDoi += 1;
            }else {
                thongTinTheoDoiUserTrongTemp.soTheoDoi -= 1;
            }
        }
        layTheoDoi();
    }

    return (
        <View>
            <View style={styles.actionRow}>
                <View style={{width: '70%'}}>
                    {!dangTheoDoi ? 
                    (<Button title="+Theo dõi" color={'green'} onPress={theoDoiHoacHuyTheoDoi}></Button>) : 
                    (<Button title="-Hủy theo dõi" color={'green'} onPress={theoDoiHoacHuyTheoDoi}></Button>)}        
                </View>
                <TouchableOpacity style={styles.iconButton}>
                        <IconSymbol name="message" size={22} color="green" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <IconSymbol name="factory" size={22} color="business" />
                </TouchableOpacity>
            </View>
            <Text style={styles.followerText}>{soTheoDoi} người đang theo dõi trang này</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
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
