import { Image, Text, View } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { Updating } from "@/app/helpers/updating";

export default function DoanhNghiepSanPham({doanhNghiep, vaiTro} : {doanhNghiep: any, vaiTro : string}) 
{
    return (
        <View>
            <View style={{height: 80, backgroundColor: 'grey', flexDirection: 'row'}}>
                <View>
                    <Image />
                </View>
                <View>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 25}}>{doanhNghiep.dN_Ten}</Text>
                    <Text style={{color: 'white', fontSize: 20}}>{`Doanh nghiệp ${vaiTro}`}</Text>
                </View>
            </View>

            <View>
                <Text>
                    <Entypo name="chevron-right" size={15} color="green" /> Số điện thoại: {doanhNghiep.dN_SoDienThoai ? doanhNghiep.dN_SoDienThoai : (<Updating/>) }
                </Text>
                <Text>
                    <Entypo name="chevron-right" size={15} color="green" /> Địa chỉ: {doanhNghiep.dN_DiaChi ? doanhNghiep.dN_SoDienThoai : (<Updating/>) }
                </Text>
                <Text>
                    <Entypo name="chevron-right" size={15} color="green" /> Mã số thuế: {doanhNghiep.dN_MaSoThue ? doanhNghiep.dN_MaSoThue : (<Updating/>) }
                </Text>
            </View>
        </View>
    )
}