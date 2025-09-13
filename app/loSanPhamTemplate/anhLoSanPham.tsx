import { useEffect, useState } from "react";
import { getFileAsync, getUriFile } from "../helpers/LogicHelper/fileHelper";
import { LO_SAN_PHAM } from "../constant/KieuTaiNguyen";
import { IMAGE } from "../constant/KieuFile";
import File from "../model/File";
import { Button, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Updating } from "../helpers/ViewHelpers/updating";

const { width } = Dimensions.get('window');
export default function AnhLoSanPham({lsP_Id}: {lsP_Id: string}) {
    const [listFileAnhLoSanPhams, setListFileAnhLoSanPhams] = useState<File[]>([]);
    const [showModalAnhLoSanPham, setShowModalAnhLoSanPham] = useState<boolean | undefined>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        layListFileAnhLoSanPham();
    }, []);

    const layListFileAnhLoSanPham = async() => {
        const listFileAnhLoSanPhams = await getFileAsync(LO_SAN_PHAM, lsP_Id, IMAGE);

        if (listFileAnhLoSanPhams.length > 0) {
            setListFileAnhLoSanPhams(listFileAnhLoSanPhams);
        }
    }

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
        <View>
            {listFileAnhLoSanPhams.length > 0 ? 
            (<View>
                <Text style={{fontWeight: 'bold'}}>{'Hình ảnh lô sản phẩm: '}</Text>
                <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setShowModalAnhLoSanPham(true)}>
                    {listFileAnhLoSanPhams.map((item, key) => {
                        if (key <= 2) {
                            return (<Image key={key} source={{ uri: getUriFile(item) }} style={{width: 80, height: 80, marginRight: 10}} />)
                        }else if (key === 3) {
                            return (
                                <View key={key} style={{backgroundColor: 'grey'}}>
                                    <IconSymbol key={key} name="more-horiz" size={80} color="white" />
                                </View>
                        )
                        }
                        else {
                            return (<View key={key}></View>)
                        }
                    })}
                </TouchableOpacity>
            </View>)
            : (
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight: 'bold'}}>{'Hình ảnh lô sản phẩm: '}</Text>
                    <Updating />
                </View>
            )}

            <Modal
                visible={showModalAnhLoSanPham}
                animationType={'slide'}
                style={{width: '100%', height: '100%'}}
                >
                    <View>
                        <FlatList
                            data={listFileAnhLoSanPhams}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={onScroll}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                            <View>
                                <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                                <View style={styles.indicatorContainer}>
                                    {listFileAnhLoSanPhams.map((_, i) => (
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
                        <Button title="Đóng" onPress={() => setShowModalAnhLoSanPham(false)}></Button>
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