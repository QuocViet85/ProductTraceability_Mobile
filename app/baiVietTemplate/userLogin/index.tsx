import getBearerToken from "@/app/helpers/LogicHelper/authHelper";
import BaiViet from "@/app/model/BaiViet";
import { url } from "@/app/server/backend";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function CacBaiVietUserLogin() {
    const [listBaiViet, setListBaiViet] = useState<BaiViet[]>([]);

    useEffect(() => {
        fetchBaiViet();
    }, [])

    const fetchBaiViet = async() => {
        const bearerToken = await getBearerToken();

        if (!bearerToken) {
            return;
        }

        const uriListBaiViet = url("api/baiviet")

        const response = await axios.get(uriListBaiViet, {headers: {Authorization: bearerToken}});

        if (response.data) {
            setListBaiViet(response.data.listBaiViets);
        }
    }

    return (
        <View style={styles.container}></View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    }
})