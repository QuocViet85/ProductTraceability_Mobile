import { openWebsite } from "@/app/helpers/LogicHelper/helper";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function WebsiteSanPham({sP_Website}: {sP_Website: string | undefined}) {
    const router = useRouter()
    return (
        <View>
            {sP_Website ? (
                <View>
                    <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 20}}>{'Website sản phẩm'}</Text>
                    
                        <View>
                            <TouchableOpacity style={{height: 40, backgroundColor: 'white', flexDirection: 'row'}} onPress={() => openWebsite(sP_Website)} >
                                <View>
                                    <IconSymbol name={'web'} size={20} color={'grey'}/>
                                </View>
                                <View>
                                    <Text style={{color: 'black', fontSize: 15}}>{sP_Website}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Spacer height= {10} />
                    
                </View>
                
            ) : (<View></View>)}
        </View>
    )
}