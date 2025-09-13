import { Fontisto } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function Header({title, fontSize, resource}: {title: string, fontSize: number, resource: string | undefined | null}) 
{
    return (
        <View style={styles.topOverlay}>
            <Text style={{...styles.text, fontSize: fontSize}}>{title}</Text>
            {resource ? (<Text style={{color: 'white', fontSize: fontSize}}>{resource}</Text>) : (<View></View>)}
        </View>
    )
}

const styles = StyleSheet.create({
    topOverlay: {
        top: 0,
        left: 0,
        right: 0,
        height: "10%", // Chiều cao nền xanh
        backgroundColor: 'green',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    text: {
        flex: 1,
        color: 'white',
        marginTop: "5%"
    }
})