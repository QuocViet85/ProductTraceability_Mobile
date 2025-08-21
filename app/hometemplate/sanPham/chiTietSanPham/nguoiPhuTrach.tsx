import getUserInfo from "@/app/helpers/getUserInfo";
import Spacer from "@/app/helpers/spacer";
import { Updating } from "@/app/helpers/updating";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function NguoiPhuTrach({userId} : {userId : string}) {
    const [nguoiPhuTrach, setNguoiPhuTrach] = useState<any>();

    useEffect(() => {
        getUserInfo(userId).then((user) => {
            if (user) {
                setNguoiPhuTrach(user);
            }
        })
    }, [])

    return (
        <View>
            {nguoiPhuTrach ? (
            <View>
                <View style={{height: 80, backgroundColor: 'grey', flexDirection: 'row'}}>
                    <View>
                        <Image />
                    </View>
                    <View>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 25}}>{nguoiPhuTrach.name}</Text>
                        <Text style={{color: 'white', fontSize: 20}}>{`Người phụ trách`}</Text>
                    </View>
                </View>

                <View>
                    <Text>
                        <Entypo name="chevron-right" size={15} color="green" /> Số điện thoại: {nguoiPhuTrach.phoneNumber ? nguoiPhuTrach.phoneNumber : (<Updating/>) }
                    </Text>
                    <Text>
                        <Entypo name="chevron-right" size={15} color="green" /> Địa chỉ: {nguoiPhuTrach.address ? nguoiPhuTrach.address : (<Updating/>) }
                    </Text>
                    <Text>
                        <Entypo name="chevron-right" size={15} color="green" /> Email: {nguoiPhuTrach.email ? nguoiPhuTrach.email : (<Updating/>) }
                    </Text>
                </View>
                <Spacer height= {10} />
            </View>
            ) : (<View><Spacer height= {10} /></View>)}
        </View>
    );
}