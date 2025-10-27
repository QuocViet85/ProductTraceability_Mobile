import { View } from "react-native";

export default function BlurLine() {
    return (
        <View
        style={{
        height: 1,
        backgroundColor: 'black',
        opacity: 0.2, // mờ
        marginVertical: 10,
        }}
    />
    )
}