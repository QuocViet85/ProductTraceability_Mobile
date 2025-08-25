import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { url } from "../server/backend";

const AccessToken = "accessToken";
const RefreshToken = "refreshToken";

export async function getAccessToken() {
    let accessToken = await AsyncStorage.getItem(AccessToken);

    if (!accessToken) {
        return null;
    }

    try {
        const decoded = jwtDecode<any>(accessToken);
        const currentTime = Date.now() / 1000;

        if (currentTime < decoded.exp) {
            return accessToken;
        }else {
            await AsyncStorage.removeItem(AccessToken)
            let refreshToken = await AsyncStorage.getItem(RefreshToken);

            if (!refreshToken) {
                return null;
            }
            
            let urlAccessToken = url('api/auth/access-token');
            accessToken = (await axios.post(urlAccessToken, refreshToken)).data;

            return accessToken;
        }
    }catch {
        return null;
    }
}

export async function setAccessAndRefreshToken(accessToken: string, refreshToken: string) {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
}

export async function deleteToken() {
    await AsyncStorage.removeItem(AccessToken);
    await AsyncStorage.removeItem(RefreshToken);
}