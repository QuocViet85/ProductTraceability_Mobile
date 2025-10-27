import { DimensionValue, View } from "react-native";

export default function Spacer({height} : {height: DimensionValue | undefined}) 
{
    return (
        <View style={{height: height, backgroundColor: '#e0e0e0'}}></View>
    );
}