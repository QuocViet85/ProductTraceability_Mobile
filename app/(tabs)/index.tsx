import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DanhMucs, { khongChonDanhMuc } from '../danhMucTemplate/danhMucs';
import Header from '../helpers/ViewHelpers/header';
import DanhMuc from '../model/DanhMuc';
import DanhSachSanPham from '../sanPhamTemplate/danhSachSanPham/danhSachSanPham';


export default function HomeScreen() {
  const [danhMucHienTai, setDanhMucHienTai] = useState<DanhMuc>(khongChonDanhMuc as DanhMuc);
  
  return (
    <View style={styles.container}>
      <Header title={"Sản phẩm"} fontSize={30} resource={null}></Header>
      <View style={{height: 10}}></View>
      <DanhMucs danhMucHienTai={danhMucHienTai} setDanhMucHienTai={setDanhMucHienTai} height={undefined} alignItems='center'/>
      <DanhSachSanPham danhMucHienTai={danhMucHienTai} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                     // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    backgroundColor: '#fff',
  },
});
