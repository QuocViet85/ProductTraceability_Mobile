import { Button, FlatList, Modal, Platform, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import Header from '../general/header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../server/backend';
import Categories from '../hometemplate/Categories';


export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false)
  const [categories, setCategories] = useState([]);
  const categoryAll = {id: 0, name: 'Tất cả', isParent: true};
  const [categoryNow, setCategoryNow] = useState(categoryAll);
  const [searchCategories, setSearchCategories] = useState('');

  const filterCategories = categories.filter((category : any) => {
    return category.name.toLowerCase().includes(searchCategories.toLowerCase());
    }
  );

  useEffect(() => {
    console.log(url('api/Category'));
    axios.get(url('api/Category')).then((res: any) => {
      const categories = res.data.categories;
      categories.unshift(categoryAll);
      setCategories(categories)
    })
    .catch((err) => {
      console.log(err);
    })
  }, [])
  
  return (
    <View style={styles.container}>
      <Header title={"Sản phẩm"}></Header>

      <View style={styles.content}>

      <Modal
        visible={showModal}
        animationType='slide'
        presentationStyle='fullScreen'
        >
        <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Chọn danh mục</Text>
            <TextInput style={{borderWidth: 1, width: '80%', margin: 10, height: 40}} placeholder='Tìm kiếm' value={searchCategories} onChangeText={setSearchCategories}></TextInput>
            <Categories categories={filterCategories} setCategories={setCategories} setCategoryNow={setCategoryNow} setShowModal={setShowModal} />
        </View>
        <Button title='Đóng' onPress={() => setShowModal(false)}></Button>    
      </Modal>

        <View style={{width: '100%', flexDirection: 'row'}}>
          <TextInput style={styles.textInputSearch} placeholder='Tìm kiếm'></TextInput>
          <Button title={categoryNow.name === 'Tất cả' ? 'Danh mục' : categoryNow.name} onPress={() => setShowModal(true)}></Button>
        </View>
      </View>
    
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
  content: {
    marginTop: 80,
    width: '100%'
  },
  textInputSearch: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '60%',
  }
});
