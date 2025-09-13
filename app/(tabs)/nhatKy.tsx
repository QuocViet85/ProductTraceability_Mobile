import { StyleSheet, View } from "react-native";
import Header from "../helpers/ViewHelpers/header";

export default function NhatKy() {
    return (
        <View style={styles.container}>
            <Header title="Nhật ký" fontSize={30} resource={null}></Header>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                     // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});