import { StyleSheet, Text, View } from "react-native";

export default function Header({title}: {title: string}) 
{
    return (
        <View style={styles.topOverlay}>
            <Text style={styles.text}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: "10%", // Chiều cao nền xanh
        backgroundColor: 'green',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        flex: 1,
        fontSize: 30,
        color: 'white',
        marginTop: "5%"
    }
})