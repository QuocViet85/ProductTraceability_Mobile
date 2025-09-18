import { getUserLogin } from "../Authentication";
import { isUserAdmin, isUserDoanhNghiep } from "./AuthRole";

const PREFIX_ADMIN_DOANHNGHIEP = "dn.admin.";

const PREFIX_SUA_DOANHNGHIEP = "dn.sua.";

const PREFIX_XOA_DOANHNGHIEP = "dn.xoa.";

export async function quyenThemDoanhNghiep() {
  const userLogin = await getUserLogin();

  if (!userLogin) {
    return false;
  }

  if (isUserAdmin(userLogin) || isUserDoanhNghiep(userLogin)) {
    return true;
  }

  return false;
}

export async function quyenSuaDoanhNghiep(
  dN_Id: string | undefined
): Promise<boolean> {
  if (!dN_Id) {
    return false;
  }

  const userLogin = await getUserLogin();

  if (!userLogin) {
    return false;
  }

  if (isUserAdmin(userLogin)) {
    return true;
  }

  for (const permission of userLogin.permissions as string[]) {
    if (isAdminDoanhNghiep(permission, dN_Id)) {
      return true;
    } else if (permission.startsWith(PREFIX_SUA_DOANHNGHIEP)) {
      const dn_Id_Permission = permission.slice(PREFIX_SUA_DOANHNGHIEP.length);
      if (dn_Id_Permission.toLowerCase() === dN_Id.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

export async function quyenXoaDoanhNghiep(
  dN_Id: string | undefined
): Promise<boolean> {
  if (!dN_Id) {
    return false;
  }

  const userLogin = await getUserLogin();

  if (!userLogin) {
    return false;
  }

  if (isUserAdmin(userLogin)) {
    return true;
  }

  for (const permission of userLogin.permissions as string[]) {
    if (isAdminDoanhNghiep(permission, dN_Id)) {
      return true;
    } else if (permission.startsWith(PREFIX_XOA_DOANHNGHIEP)) {
      const dn_Id_Permission = permission.slice(PREFIX_XOA_DOANHNGHIEP.length);
      if (dn_Id_Permission.toLowerCase() === dN_Id.toLowerCase()) {
        return true;
      }
    }
  }
  return false;
}

function isAdminDoanhNghiep(permission: string, dN_Id: string): boolean {
  if (permission.startsWith(PREFIX_ADMIN_DOANHNGHIEP)) {
    const dn_Id_Permission = permission.slice(PREFIX_ADMIN_DOANHNGHIEP.length);
    if (dn_Id_Permission.toLowerCase() === dN_Id.toLowerCase()) {
      return true;
    }
  }
  return false;
}
