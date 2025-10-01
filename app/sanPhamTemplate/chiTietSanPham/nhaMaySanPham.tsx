import AvatarDoanhNghiep from "@/app/doanhNghiepTemplate/avatarDoanhNghiep";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import NhaMay from "@/app/model/NhaMay";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function NhaMaySanPham({nhaMay} : {nhaMay: NhaMay | undefined}) 
{
    return (
        <View>
            {nhaMay ? (
            <Link href={{pathname: '/nhaMayTemplate', params: {nM_Id: nhaMay.nM_Id} }} withAnchor asChild>
                <TouchableOpacity>
                    <View style={{height: 80, backgroundColor: 'white', flexDirection: 'row'}}>
                        <View style={{width: 40, height: 40}}>
                        </View>
                        <View>
                            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>{nhaMay.nM_Ten}</Text>
                            <Text style={{color: 'black', fontSize: 20}}>{`Nhà máy`}</Text>
                        </View>
                    </View>
                    <Spacer height= {10} />
                </TouchableOpacity>
             </Link>
            ) : (<View></View>)}
       </View>
    )
}