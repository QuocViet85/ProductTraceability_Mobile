import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../general/header';
import { getUserLogin } from '../helpers/LogicHelper/authHelper';
import Login from '../usertemplate/auth/login';
import Register from '../usertemplate/auth/register';
import AppUser from '../model/AppUser';
import UserLoginInfo from '../usertemplate/userLoginInfo';


export default function UserInApp() {
  const [formDangNhap, setFormDangNhap] = useState<boolean>(true);
  const [userLogin, setUserLogin] = useState<AppUser | null>(null);
  const [refreshUserLogin, setRefreshUserLogin] = useState<Boolean>(false);

  useEffect(() => {
      getUserLogin(refreshUserLogin).then((userLogin) => {
      if (userLogin) {
        setUserLogin(userLogin);
      }
      if (refreshUserLogin) {
        setRefreshUserLogin(false);
      }
    })
  }, [refreshUserLogin]);

  let formDangNhapDangKi = (<View></View>)
  if (formDangNhap) {
    formDangNhapDangKi = (<Login setFormDangNhap={setFormDangNhap} setUserLogin={setUserLogin}/>)
  }else {
    formDangNhapDangKi = (<Register setFormDangNhap={setFormDangNhap}/>)
  }
  return (
     <View style={styles.container}>
            <Header title={"Người dùng"}></Header>
            {userLogin ? (<UserLoginInfo userLogin={userLogin} setUserLogin={setUserLogin} setRefreshUserLogin={setRefreshUserLogin} />) : formDangNhapDangKi}
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
