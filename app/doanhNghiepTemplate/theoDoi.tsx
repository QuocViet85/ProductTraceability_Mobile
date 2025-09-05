import { Button, View } from "react-native";
import { url } from "../server/backend";
import getBearerToken from "../helpers/LogicHelper/authHelper";
import axios from "axios";
import { useEffect, useState } from "react";

export default function TheoDoiDoanhNghiep({dN_Id}: {dN_Id: string}) {
    const [dangTheoDoi, setDangTheoDoi] = useState<boolean | undefined>(false);

    useEffect(() => {
        setTheoDoi()
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
    }

    return (
        <View style={{width: '70%'}}>
            {!dangTheoDoi ? 
            (<Button title="+Theo dõi" color={'green'} onPress={theoDoiHoacHuyTheoDoi}></Button>) : 
            (<Button title="-Hủy theo dõi" color={'green'} onPress={theoDoiHoacHuyTheoDoi}></Button>)}        
        </View>
    )
}