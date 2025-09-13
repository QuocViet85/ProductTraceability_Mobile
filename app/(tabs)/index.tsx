import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../helpers/ViewHelpers/header';
import DanhMucs, { tatCaDanhMuc } from '../hometemplate/danhMuc/danhMucs';
import DanhSachSanPham from '../hometemplate/sanPham/sanPhams';
import DanhMuc from '../model/DanhMuc';


export default function HomeScreen() {
  const [danhMucHienTai, setDanhMucHienTai] = useState<DanhMuc>(tatCaDanhMuc as DanhMuc);
  
  return (
    <View style={styles.container}>
      <Header title={"Sản phẩm"} fontSize={30} resource={null}></Header>
      <DanhMucs danhMucHienTai={danhMucHienTai} setDanhMucHienTai={setDanhMucHienTai} />
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
    width: '100%'
  },
});
