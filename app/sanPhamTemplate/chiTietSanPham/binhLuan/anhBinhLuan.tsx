import { IMAGE } from "@/app/constant/KieuFile";
import { BINH_LUAN } from "@/app/constant/KieuTaiNguyen";
import { getFileAsync, getUriFile } from "@/app/helpers/LogicHelper/fileHelper";
import File from "@/app/model/File";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useState } from "react";
import { Button, Dimensions, FlatList, Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";

const temp_ListFilesAnhBinhLuan : {
    bL_Id: string,
    listFilesAnhBinhLuan: File[]
}[] = []


const { width } = Dimensions.get('window');
export default function AnhBinhLuan({bL_Id}: {bL_Id: string}) {
    const [listFilesAnhBinhLuan, setListFilesAnhBinhLuan] = useState<File[]>([]);
    const [showModalAnhBinhLuan, setShowModalAnhBinhLuan] = useState<boolean | undefined>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        layFilesAnhBinhLuan();
    }, [bL_Id]);

    const layFilesAnhBinhLuan = async() => {
        const listFilesInTemp = temp_ListFilesAnhBinhLuan.find((item) => {
            return item.bL_Id === bL_Id;
        });

        if (!listFilesInTemp) {
            const listFiles = await getFileAsync(BINH_LUAN, bL_Id, IMAGE);
            setListFilesAnhBinhLuan(listFiles);
            temp_ListFilesAnhBinhLuan.push({
                bL_Id: bL_Id,
                listFilesAnhBinhLuan: listFiles
            })
        }else {
            setListFilesAnhBinhLuan(listFilesInTemp.listFilesAnhBinhLuan);
        }
    }

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
        <View>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setShowModalAnhBinhLuan(true)}>
                {listFilesAnhBinhLuan.map((item, key) => {
                    if (key <= 2) {
                        return (<Image key={key} source={{ uri: getUriFile(item) }} style={{width: 80, height: 80, marginRight: 10, borderRadius: 8}} />)
                    }else if (key === 3) {
                        return (
                            <View key={key} style={{backgroundColor: 'grey', borderRadius: 8}}>
                                <IconSymbol key={key} name="more-horiz" size={80} color="white" />
                            </View>
                    )
                    }
                    else {
                        return (<View key={key}></View>)
                    }
                })}
            </TouchableOpacity>

            <Modal
            visible={showModalAnhBinhLuan}
            animationType={'slide'}
            style={{width: '100%', height: '100%'}}
            >
                <View style={{flex: 1}}>
                    <FlatList
                        data={listFilesAnhBinhLuan}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View>
                                <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                                <View style={styles.indicatorContainer}>
                                    {listFilesAnhBinhLuan.map((_, i) => (
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
                        <View style={{marginTop: 'auto'}}>
                            <Button title="Đóng" onPress={() => setShowModalAnhBinhLuan(false)}></Button>
                        </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: '100%',
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