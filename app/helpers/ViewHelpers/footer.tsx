import { ColorValue, DimensionValue, View } from "react-native";

export default function Footer({backgroundColor, height}: {backgroundColor: ColorValue | undefined, height: DimensionValue | undefined}) {
    return (
        <View style={{height: height, backgroundColor: backgroundColor, marginTop: 'auto'}}></View>
    )
}