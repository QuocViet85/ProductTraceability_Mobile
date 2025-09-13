import { ColorValue, View } from "react-native";

export default function Footer({backgroundColor}: {backgroundColor: ColorValue | undefined}) {
    return (
        <View style={{height: '6%', backgroundColor: backgroundColor, marginTop: 'auto'}}></View>
    )
}