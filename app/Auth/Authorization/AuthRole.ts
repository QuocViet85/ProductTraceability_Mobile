import { ROLE_ADMIN, ROLE_DOANH_NGHIEP, ROLE_KHACH_HANG } from "@/app/constant/Role";
import AppUser from "@/app/model/AppUser";

export function isUserAdmin(user: AppUser) : boolean {
    return user.role === ROLE_ADMIN;
}

export function isUserDoanhNghiep(user: AppUser) : boolean {
    return user.role === ROLE_DOANH_NGHIEP;
}

export function isUserKhachHang(user: AppUser) : boolean {
    return user.role === ROLE_KHACH_HANG;
}