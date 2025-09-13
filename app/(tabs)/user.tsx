import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getUserLogin } from '../helpers/LogicHelper/authHelper';
import Header from '../helpers/ViewHelpers/header';
import AppUser from '../model/AppUser';
import Login from '../usertemplate/auth/login';
import Register from '../usertemplate/auth/register';
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
            <Header title={"Người dùng đăng nhập"} fontSize={30} resource={null}></Header>
            {userLogin ? (<UserLoginInfo userLogin={userLogin} setUserLogin={setUserLogin} setRefreshUserLogin={setRefreshUserLogin} />) : formDangNhapDangKi}
      </View>
  );
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
