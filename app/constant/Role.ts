export const ROLE_ADMIN = "Admin";
export const ROLE_DOANH_NGHIEP = "Doanh_Nghiep";
export const ROLE_KHACH_HANG = "Khach_Hang";

export function generateExactRole(role: string) {
    if (role === ROLE_ADMIN) {
        return 'Admin';
    }else if (role === ROLE_DOANH_NGHIEP) {
        return 'Doanh Nghiệp';
    }else if (role === ROLE_KHACH_HANG) {
        return 'Khách Hàng';
    }
}