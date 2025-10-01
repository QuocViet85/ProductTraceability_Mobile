import AvatarDoanhNghiep from "@/app/doanhNghiepTemplate/avatarDoanhNghiep";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import DoanhNghiep from "@/app/model/DoanhNghiep";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function DoanhNghiepSanPham({doanhNghiep, vaiTro} : {doanhNghiep: DoanhNghiep | undefined, vaiTro : string}) 
{
    return (
        <View>
            {doanhNghiep ? (
            <Link href={{pathname: '/doanhNghiepTemplate/chiTietDoanhNghiep', params: {dN_Id: doanhNghiep.dN_Id} }} withAnchor asChild>
                <TouchableOpacity>
                    <View style={{height: 80, backgroundColor: 'white', flexDirection: 'row'}}>
                        <View>
                            <AvatarDoanhNghiep dN_Id={doanhNghiep?.dN_Id as string} width={40} height={40} canChange={false}/>
                        </View>
                        <View>
                            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>{doanhNghiep.dN_Ten}</Text>
                            <Text style={{color: 'black', fontSize: 20}}>{`Doanh nghiệp ${vaiTro}`}</Text>
                        </View>
                    </View>
                    <Spacer height= {10} />
                </TouchableOpacity>
             </Link>
            ) : (<View></View>)}
       </View>
    )
}