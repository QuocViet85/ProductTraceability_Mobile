import { StyleSheet, View } from "react-native";
import Header from "../general/header";

export default function BangTin() 
{
    return (
        <View style={styles.container}>
            <Header title="Bản tin"></Header>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                     // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    paddingTop: 20,              // tránh dính sát trên cùng
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});