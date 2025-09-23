import { getUserLogin } from "../Authentication";
import { isUserAdmin, isUserDoanhNghiep } from "./AuthRole";

const PREFIX_ADMIN_NHAMAY = "nm.admin.";

const PREFIX_SUA_NHAMAY = "nm.sua.";

const PREFIX_XOA_NHAMAY = "nm.xoa.";

export async function quyenThemNhaMay() {
  const userLogin = await getUserLogin();

  if (!userLogin) {
    return false;
  }

  if (isUserAdmin(userLogin) || isUserDoanhNghiep(userLogin)) {
    return true;
  }

  return false;
}

export async function quyenSuaNhaMay(
  nM_Id: string | undefined
): Promise<boolean> {
  if (!nM_Id) {
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
    if (isAdminNhaMay(permission, nM_Id)) {
      return true;
    } else if (permission.startsWith(PREFIX_SUA_NHAMAY)) {
      const dn_Id_Permission = permission.slice(PREFIX_SUA_NHAMAY.length);
      if (dn_Id_Permission.toLowerCase() === nM_Id.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

export async function quyenXoaNhaMay(
  nM_Id: string | undefined
): Promise<boolean> {
  if (!nM_Id) {
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
    if (isAdminNhaMay(permission, nM_Id)) {
      return true;
    } else if (permission.startsWith(PREFIX_XOA_NHAMAY)) {
      const dn_Id_Permission = permission.slice(PREFIX_XOA_NHAMAY.length);
      if (dn_Id_Permission.toLowerCase() === nM_Id.toLowerCase()) {
        return true;
      }
    }
  }
  return false;
}

function isAdminNhaMay(permission: string, nM_Id: string): boolean {
  if (permission.startsWith(PREFIX_ADMIN_NHAMAY)) {
    const dn_Id_Permission = permission.slice(PREFIX_ADMIN_NHAMAY.length);
    if (dn_Id_Permission.toLowerCase() === nM_Id.toLowerCase()) {
      return true;
    }
  }
  return false;
}
