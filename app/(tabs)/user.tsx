import { ReactNode, useEffect, useState } from 'react';
import { View } from 'react-native';
import { getUserLogin } from '../Auth/Authentication';
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

  let formDangNhapDangKi : ReactNode= (<View></View>)
  if (formDangNhap) {
    formDangNhapDangKi = (<Login setFormDangNhap={setFormDangNhap} setUserLogin={setUserLogin}/>)
  }else {
    formDangNhapDangKi = (<Register setFormDangNhap={setFormDangNhap}/>)
  }
  return userLogin 
              ? (
              <UserLoginInfo userLogin={userLogin} setUserLogin={setUserLogin} setRefreshUserLogin={setRefreshUserLogin} />
              ) : formDangNhapDangKi;
}

