import AvatarDoanhNghiep from "@/app/doanhNghiepTemplate/avatar";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import { Updating } from "@/app/helpers/ViewHelpers/updating";
import { Entypo } from '@expo/vector-icons';
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function DoanhNghiepSanPham({doanhNghiep, vaiTro} : {doanhNghiep: any, vaiTro : string}) 
{
    return (
        <View>
            {doanhNghiep ? (
            <Link href={{pathname: '/doanhNghiepTemplate', params: {dN_Id: doanhNghiep.dN_Id} }} withAnchor asChild>
                <TouchableOpacity>
                    <View style={{height: 80, backgroundColor: 'white', flexDirection: 'row'}}>
                        <View>
                            <AvatarDoanhNghiep dN_Id={doanhNghiep.dN_Id} width={40} height={40}/>
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