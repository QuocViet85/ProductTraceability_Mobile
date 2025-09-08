import {getUserInfo} from "@/app/helpers/LogicHelper/userHelper";
import Spacer from "@/app/helpers/ViewHelpers/spacer";
import AvatarUser from "@/app/usertemplate/avatarUser";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
            <Link href={{pathname: '/usertemplate/user', params: {userId: nguoiPhuTrach.id} }} withAnchor asChild>
                <TouchableOpacity style={{height: 80, flexDirection: 'row'}}>
                    <View>
                        <AvatarUser userId={nguoiPhuTrach.id} width={40} height={40} canChange={false} />
                    </View>
                    <View>
                        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>{nguoiPhuTrach.name}</Text>
                        <Text style={{color: 'black', fontSize: 20}}>{`Người phụ trách`}</Text>
                    </View>
                </TouchableOpacity>
            </Link>
            ) : (<View></View>)}
            <Spacer height= {10} />
        </View>
    );
}