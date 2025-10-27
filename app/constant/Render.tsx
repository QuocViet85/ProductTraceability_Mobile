import { Text, TouchableOpacity } from "react-native"
import SanPham from "../model/SanPham"
import { useRouter } from "expo-router";
import AvatarSanPham from "../sanPhamTemplate/chiTietSanPham/avatarSanPham";
import SaoSanPham from "../sanPhamTemplate/chiTietSanPham/saoSanPham";
import { formatCurrency } from "../helpers/LogicHelper/helper";
import { Updating } from "../helpers/ViewHelpers/updating";
import { View } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";

export const RenderDanhSachSanPhams = ({ item } : {item: SanPham}) => {
    const router = useRouter();

    return (
      <TouchableOpacity 
      style={{
          flex: 1, 
          justifyContent: 'center',
          padding: 10,
          borderWidth: 0.3
        }}
      onPress={() => router.push({pathname: '/sanPhamTemplate/chiTietSanPham', params: {sP_MaTruyXuat: item.sP_MaTruyXuat} })}>
        <AvatarSanPham sP_Id={item.sP_Id as string} height={200} width={'100%'} marginBottom={8}/>
        <Text style={{fontSize: 16, fontWeight: 'bold',}}>{item.sP_Ten}</Text>
        <SaoSanPham sP_Id={item.sP_Id as string} sizeSao={12} fontSize={undefined}/>
        <Text style={{fontSize: 12, fontStyle: 'italic',}}>{'Giá: '}{item.sP_Gia ? formatCurrency(item.sP_Gia as number) : (<Updating />)}</Text>
        {item.sP_Verified ? (
          <View style={{flexDirection: 'row'}}>
            <IconSymbol name={'verified'} color={'green'}/>
            <Text style={{color: 'green', fontWeight: 'bold', fontStyle: 'italic'}}>{'Verified'}</Text>
          </View>
          ) :  undefined}
      </TouchableOpacity>
    )
}