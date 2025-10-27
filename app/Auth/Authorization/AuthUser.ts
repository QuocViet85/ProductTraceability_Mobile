import AppUser from "@/app/model/AppUser";
import { getUserLogin } from "../Authentication";
import { isUserAdmin } from "./AuthRole";

export async function quyenSuaVaXoaUser(userSua: AppUser): Promise<boolean> {
  const userLogin = await getUserLogin();

  if (!userLogin) {
    return false;
  }

  if (isUserAdmin(userLogin)) {
    if (isUserAdmin(userSua) && userSua.id !== userLogin.id) {
      return false;
    }
    return true;
  } else {
    return userLogin.id === userSua.id;
  }
}
