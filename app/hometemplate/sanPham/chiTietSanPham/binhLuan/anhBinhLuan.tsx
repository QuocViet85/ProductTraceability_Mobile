import { IMAGE } from "@/app/constant/KieuFile";
import { BINH_LUAN } from "@/app/constant/KieuTaiNguyen";
import { getFileAsync, getUriFile } from "@/app/helpers/LogicHelper/fileHelper";
import { useEffect, useState } from "react";
import { Button, Dimensions, FlatList, Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');
export default function AnhBinhLuan({bL_Id}: {bL_Id: string}) {
    const [listAnhBinhLuan, setListAnhBinhLuan] = useState<any[]>([]);
    const [showModalAnhBinhLuan, setShowModalAnhBinhLuan] = useState<boolean | undefined>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        getFileAsync(BINH_LUAN, bL_Id, IMAGE).then((data) => {
            if(data) {
                setListAnhBinhLuan(data);
            }
            })
    }, [bL_Id]);

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
        <View>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setShowModalAnhBinhLuan(true)}>
                {listAnhBinhLuan.map((item, key) => {
                    if (key <= 2) {
                        return (<Image key={key} source={{ uri: getUriFile(item) }} style={{width: 80, height: 80, marginRight: 10}} />)
                    }else {
                        return (<View key={key}></View>)
                    }
                })}
            </TouchableOpacity>

            <Modal
            visible={showModalAnhBinhLuan}
            animationType={'slide'}
            style={{width: '100%', height: '100%'}}
            >
                <View>
                    <FlatList
                        data={listAnhBinhLuan}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                        <View>
                            <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                            <View style={styles.indicatorContainer}>
                                {listAnhBinhLuan.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                    styles.dot,
                                        { backgroundColor: i === activeIndex ? '#333' : '#aaa' },
                                    ]}
                                />
                                ))}
                            </View>
                        </View>
                                )}
                    />
                </View>
                <View style={{marginTop: 'auto'}}>
                    <Button title="Đóng" onPress={() => setShowModalAnhBinhLuan(false)}></Button>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: '90%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5,
  },
});