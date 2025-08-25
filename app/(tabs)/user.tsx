import { StyleSheet, View } from 'react-native';
import Header from '../general/header';
import Login from '../usertemplate/login';
import { useState } from 'react';
import Register from '../usertemplate/register';


export default function User() {
  const [formDangNhap, setFormDangNhap] = useState<Boolean>(true);


  let formDangNhapDangKi = (<View></View>)
  if (formDangNhap) {
    formDangNhapDangKi = (<Login setFormDangNhap={setFormDangNhap}/>)
  }else {
    formDangNhapDangKi = (<Register setFormDangNhap={setFormDangNhap}/>)
  }
  return (
     <View style={styles.container}>
            <Header title={"Người dùng"}></Header>
            {formDangNhapDangKi}
      </View>
  );
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
