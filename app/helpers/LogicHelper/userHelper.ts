import axios from "axios";
import { url } from "../../server/backend";
import AppUser from "@/app/model/AppUser";
import { getUserInTemp, getUserNameInTemp, setUserNameToTemp, setUserToTemp } from "@/app/temp/tempUser";

export async function getUserInfo(userId: string) {
  let urlGetUser = url(`api/auth/${userId}`);
  return (await axios.get(urlGetUser)).data;
}

export async function getUserById(userId: string) : Promise<AppUser | undefined> {
    const userInTemp = getUserInTemp(userId as string);

    if (!userInTemp) {
        const user: AppUser | undefined = await getUserInfo(userId as string);
        
        if (user) {
          setUserToTemp(user);
        }
        
        return user;
    }else {
        return userInTemp;
    }
}

export async function getUserNameById(userId: string) : Promise<string | undefined> {
  const userNameInTemp = getUserNameInTemp(userId);

  if (!userNameInTemp) {
    const res = await axios.get(url(`api/auth/user-name/${userId}`));
    const userName = res.data as string;

    if (userName) {
      setUserNameToTemp(userId, userName);
    }

    return userName;
  }else {
    return userNameInTemp;
  }
}
