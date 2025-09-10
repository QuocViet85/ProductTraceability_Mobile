import getBearerToken from "@/app/helpers/LogicHelper/authHelper";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Button, View } from "react-native";

export default function TuongTacUser({userId}: {userId: string}) {
    const [dangTheoDoi, setDangTheoDoi] = useState<boolean | undefined>(false);
    const [soTheoDoi, setSoTheoDoi] = useState<number>(0);

    useEffect(() => {
            setTheoDoi();
            laySoTheoDoi();
        }, []);

    const setTheoDoi = async() => {
        const urlKiemTraDangTheoDoi = url(`api/auth/kiem-tra-theo-doi/${userId}`);
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
            const urlSoTheoDoi = url(`api/auth/so-luong-theo-doi/${userId}`);
            axios.get(urlSoTheoDoi)
                .then((res) => {
                    if (res.data) {
                        setSoTheoDoi(res.data);
                    }
                })
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
