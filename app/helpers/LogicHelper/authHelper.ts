import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { url } from "../../server/backend";
import AppUser from "@/app/model/AppUser";

const AccessToken = "accessToken";
const RefreshToken = "refreshToken";

export async function getAccessToken(resetAccessToken: Boolean = false) {
  let accessToken = await AsyncStorage.getItem(AccessToken);

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwtDecode<any>(accessToken);
    const currentTime = Date.now() / 1000;

    if (currentTime < decoded.exp && !resetAccessToken) {
      return accessToken;
    }else {
      await AsyncStorage.removeItem(AccessToken);
      let refreshToken = await AsyncStorage.getItem(RefreshToken);
      if (!refreshToken) {
        return null;
      }

      let urlAccessToken = url("api/auth/access-token");
      accessToken = (await axios.post(urlAccessToken, refreshToken, {
        headers: {
          "Content-Type": "application/json"
        }
      })).data;

      if (accessToken) {
        await AsyncStorage.setItem("accessToken", accessToken);
      }else {
        return null;
      }

      return accessToken;
    }
  } catch {
    return null;
  }
}

export default async function getBearerToken() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error();
  }

  return `Bearer ${accessToken}`;
}

export async function setAccessAndRefreshToken(
  accessToken: string,
  refreshToken: string
) {
  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);
}

export async function deleteToken(allDevices : Boolean = false) {
  if (allDevices) {
    let urlLogoutAllDevices = url('api/auth/logoutAll');

    getBearerToken().then((bearerToken: any) => {
      axios.post(urlLogoutAllDevices, null, {
        headers: {
          Authorization: bearerToken
        }
      });
    });
  }else {
        AsyncStorage.getItem(RefreshToken).then((refreshToken) => {
        if (refreshToken) {
        let urlLogout = url(`api/auth/logout`);
        axios.post(urlLogout, refreshToken, {
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
    });
  }
  await AsyncStorage.removeItem(AccessToken);
  await AsyncStorage.removeItem(RefreshToken);
}

export async function getUserLogin(resetUserInfo: Boolean = false) : Promise<AppUser | null> {
  const accessToken = await getAccessToken(resetUserInfo);

  if (!accessToken) {
    return null;
  }

  const decoded = jwtDecode<any>(accessToken);

  const user = new AppUser();
  user.id = decoded.sub;
  user.phoneNumber = decoded.PhoneNumber;
  user.name = decoded.Name;
  user.email = decoded.Email;
  user.address = decoded.Address;
  user.role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

  return user;
}
