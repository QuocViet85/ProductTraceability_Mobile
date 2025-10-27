import { temp_ThongTinTheoDoiDoanhNghiep } from "@/app/doanhNghiepTemplate/chiTietDoanhNghiep/tuongTacDoanhNghiep";
import AppUser from "@/app/model/AppUser";
import { temp_ThongTinTheoDoiUser } from "@/app/usertemplate/user/tuongTacUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { url } from "../server/backend";
import { AccessToken, RefreshToken } from "../constant/KeyStorage";


export async function getAccessToken(resetAccessToken: Boolean = false) : Promise<string | null> {
  let accessToken = await AsyncStorage.getItem(AccessToken);

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwtDecode<any>(accessToken);
    const currentTime = Date.now() / 1000;

    if (currentTime < decoded.exp && !resetAccessToken) {
      return accessToken;
    } else {
      await AsyncStorage.removeItem(AccessToken);
      let refreshToken = await AsyncStorage.getItem(RefreshToken);
      if (!refreshToken) {
        return null;
      }

      let urlAccessToken = url("api/auth/access-token");
      accessToken = (
        await axios.post(urlAccessToken, refreshToken, {
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).data;

      if (accessToken) {
        await AsyncStorage.setItem("accessToken", accessToken);
      } else {
        return null;
      }

      return accessToken;
    }
  } catch {
    return null;
  }
}

export async function getBearerToken() {
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

export async function logOut(allDevices: Boolean = false) {
  try {
    if (allDevices) {
      const urlLogoutAllDevices = url("api/auth/logoutAll");
      const bearerToken = await getBearerToken();
      await axios.post(urlLogoutAllDevices, null, {
        headers: {
          Authorization: bearerToken,
        },
      });
    } else {
      const refreshToken = await AsyncStorage.getItem(RefreshToken);
      if (refreshToken) {
        const urlLogout = url(`api/auth/logout`);
        await axios.post(urlLogout, refreshToken, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
    deleteRelatedTempDataAfterLogout();
    await AsyncStorage.removeItem(AccessToken);
    await AsyncStorage.removeItem(RefreshToken);
  } catch {
    throw new Error("Đăng xuất thất bại");
  }
}

const deleteRelatedTempDataAfterLogout = () => {
  temp_ThongTinTheoDoiUser.length = 0;
  temp_ThongTinTheoDoiDoanhNghiep.length = 0;
  resetPermissionsUserLogin();
};

let temp_permissionsUserLogin: string[] | undefined = undefined;

export async function getUserLogin(
  resetUserInfo: Boolean = false
): Promise<AppUser | null> {
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
  user.role =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!temp_permissionsUserLogin) {
    const uriPermissions = url("api/auth/permissions");

    try {
      const res = await axios.get(uriPermissions, {
        headers: { Authorization: await getBearerToken() },
      });
      const permissions: string[] = res.data ? res.data : [];
      temp_permissionsUserLogin = permissions;
      user.permissions = permissions;
    } catch {}
  } else {
    user.permissions = temp_permissionsUserLogin;
  }
  return user;
}

export function resetPermissionsUserLogin() {
  temp_permissionsUserLogin = undefined;
}
