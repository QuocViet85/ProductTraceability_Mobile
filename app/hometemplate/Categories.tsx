import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Categories({categories, setCategories, setCategoryNow, setShowModal} : {categories: any, setCategories: any, setCategoryNow: any, setShowModal: any}){
    return (
        <FlatList
            style={{width: '100%'}}
            data={categories}
            renderItem={({item} : {item: any}) => 
            (
            <View>
                <TouchableOpacity
                style={{borderBlockColor:'black', borderWidth: 1, width: '100%', borderRadius: 5, padding: 10}}
                onPress={() => {
                setCategoryNow(item)
                setShowModal(false);
                }}>
                <View style={{flexDirection: 'row'}}>
                    {!item.isParent ? (<Text>- -</Text>) : (<View></View>)}<Text style={{fontSize: 16}}>{item.name}</Text>
                </View>
                </TouchableOpacity>
                {item.isParent && item.childCategories ? (
                <View>
                    <Categories categories={item.childCategories} setCategories={setCategories} setCategoryNow={setCategoryNow} setShowModal={setShowModal} />
                </View>) : 
                (<View></View>)}
            </View>
            )
        } />
    );
}