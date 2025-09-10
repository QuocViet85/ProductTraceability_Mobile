import { Button, StyleSheet, Text, View } from "react-native";
import { url } from "../server/backend";
import getBearerToken from "../helpers/LogicHelper/authHelper";
import axios from "axios";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { makePhoneCall } from "../helpers/LogicHelper/helper";

export default function TuongTacDoanhNghiep({dN_Id, dN_SoDienThoai}: {dN_Id: string, dN_SoDienThoai: string | undefined}) {
    const [dangTheoDoi, setDangTheoDoi] = useState<boolean | undefined>(false);
    const [soTheoDoi, setSoTheoDoi] = useState<number>(0);

    useEffect(() => {
        setTheoDoi();
        laySoTheoDoi();
    }, [])

    const setTheoDoi = async() => {
        const urlKiemTraDangTheoDoi = url(`api/doanhnghiep/kiem-tra-theo-doi/${dN_Id}`);
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
            setDangTheoDoi(false)
        }

        const response = await axios.get(urlKiemTraDangTheoDoi, {
            headers: {
                Authorization: bearerToken
            }
        });
        setDangTheoDoi(response.data);
    }

    const laySoTheoDoi = () => {
            const urlSoTheoDoi = url(`api/doanhnghiep/so-luong-theo-doi/${dN_Id}`);
            axios.get(urlSoTheoDoi)
                .then((res) => {
                    if (res.data) {
                        setSoTheoDoi(res.data);
                    }
                })
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
        setTheoDoi();
        laySoTheoDoi();
    }

    return (
        <View>
            <View style={styles.actionRow}>
                <View style={{width: '70%'}}>
                    {!dangTheoDoi ? 
                    (<Button title="+Theo dõi" color={'green'} onPress={theoDoiHoacHuyTheoDoi}></Button>) : 
                    (<Button title="-Hủy theo dõi" color={'green'} onPress={theoDoiHoacHuyTheoDoi}></Button>)}        
                </View>
                <TouchableOpacity style={styles.iconButton} onPress={() => makePhoneCall(dN_SoDienThoai)}>
                    <IconSymbol name="call" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <IconSymbol name="more-horiz" size={24} color="green" />
                </TouchableOpacity>
            </View>
            <Text style={styles.followerText}>{soTheoDoi} người đang theo dõi trang này</Text>
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
