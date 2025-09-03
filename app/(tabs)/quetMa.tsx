import { StyleSheet, View } from "react-native";
import Header from "../general/header";
import QuetMaQRBangCamera from "../quetMaTemplate/quetMaQRBangCamera";

export default function QuetMa() {
    return (
            <QuetMaQRBangCamera />
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                     // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    paddingTop: 20,              // tránh dính sát trên cùng
    backgroundColor: '#black',
    alignItems: 'center'
  },
});