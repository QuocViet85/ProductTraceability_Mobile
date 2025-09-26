import { getUserLogin } from "../Authentication";
import { isUserAdmin } from "./AuthRole";

const PREFIX_ADMIN_SANPHAM = "sp.dn.admin.";

const PREFIX_THEM_SANPHAM = "sp.dn.them.";

const PREFIX_SUA_SANPHAM = "sp.dn.sua.";

const PREFIX_XOA_SANPHAM = "sp.dn.xoa.";

export async function quyenAdminSanPham(
  dN_Id: string | undefined
) {
  const userLogin = await getUserLogin();

  if (!userLogin) {
    return false;
  }

  if (isUserAdmin(userLogin)) {
    return true;
  }

  if (!dN_Id) {
    return false;
  }

  for (const permission of userLogin.permissions as string[]) {
    if (isAdminSanPham(permission, dN_Id)) {
      return true;
    }
  }
}

export async function quyenThemSanPham(
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
    if (isAdminSanPham(permission, dN_Id)) {
      return true;
    } else if (permission.startsWith(PREFIX_THEM_SANPHAM)) {
      const dn_Id_Permission = permission.slice(PREFIX_THEM_SANPHAM.length);
      if (dn_Id_Permission.toLowerCase() === dN_Id.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

export async function quyenSuaSanPham(
  dN_Id: string | undefined
): Promise<boolean> {
  const userLogin = await getUserLogin();

  if (!userLogin) {
    return false;
  }

  if (isUserAdmin(userLogin)) {
    return true;
  }

  if (!dN_Id) {
    return false;
  }

  for (const permission of userLogin.permissions as string[]) {
    if (isAdminSanPham(permission, dN_Id)) {
      return true;
    } else if (permission.startsWith(PREFIX_SUA_SANPHAM)) {
      const dn_Id_Permission = permission.slice(PREFIX_SUA_SANPHAM.length);
      if (dn_Id_Permission.toLowerCase() === dN_Id.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

export async function quyenXoaSanPham(
  dN_Id: string | undefined
): Promise<boolean> {
  const userLogin = await getUserLogin();

  if (!userLogin) {
    return false;
  }

  if (isUserAdmin(userLogin)) {
    return true;
  }

  if (!dN_Id) {
    return false;
  }

  for (const permission of userLogin.permissions as string[]) {
    if (isAdminSanPham(permission, dN_Id)) {
      return true;
    } else if (permission.startsWith(PREFIX_XOA_SANPHAM)) {
      const dn_Id_Permission = permission.slice(PREFIX_XOA_SANPHAM.length);
      if (dn_Id_Permission.toLowerCase() === dN_Id.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

function isAdminSanPham(permission: string, dN_Id: string): boolean {
  if (permission.startsWith(PREFIX_ADMIN_SANPHAM)) {
    const dn_Id_Permission = permission.slice(PREFIX_ADMIN_SANPHAM.length);
    if (dn_Id_Permission.toLowerCase() === dN_Id.toLowerCase()) {
      return true;
    }
  }
  return false;
}
