import AppUser from "@/app/model/AppUser";
import { Button, Text, TouchableOpacity, View } from "react-native";

export default function XoaBinhLuan({userLogin, binhLuan} : {userLogin: AppUser | null, binhLuan: any}) {

    return (
        <View>
            <TouchableOpacity>
                <Text style={{backgroundColor: 'red', width: '8%'}}>Xóa</Text>
            </TouchableOpacity>
        </View>
    )
}