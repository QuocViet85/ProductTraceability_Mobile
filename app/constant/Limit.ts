import { getHeightScreen, getWidthScreen } from "../helpers/LogicHelper/helper";
import { HEIGHT_SMARTPHONE } from "./SizeScreen";

export const LIMIT_BAIVIET = 10;

export const LIMIT_BINHLUAN = 5;

export const LIMIT_DOANHNGHIEP = getHeightScreen() <= HEIGHT_SMARTPHONE ? 15 : 30;

export const LIMIT_NHAMAY = getHeightScreen() <= HEIGHT_SMARTPHONE ? 15 : 30;

//FLAT LIST LIMIT

export const LIMIT_SANPHAM = 12; 

export const LIMIT_LO_SANPHAM = 8; 

export const LIMIT_SU_KIEN_TRUY_XUAT = 8;

export const LIMIT_TAINGUYEN_LIENQUAN = 8;

// LIMIT FILE
export const LIMIT_FILE_SIZE = 5000000;

export const LIMIT_IMAGE_WIDTH = 1000;


/*
    LIMIT tài nguyên render bằng FlatList (để vừa cuộn vừa render) phải set = số tài nguyên đủ để chiều cao nội dung render của FlatList vượt quá chiều cao hiển thị của FlatList thì mới cuộn được.
*/