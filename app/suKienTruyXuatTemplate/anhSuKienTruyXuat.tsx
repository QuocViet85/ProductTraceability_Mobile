import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useState } from "react";
import { Button, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Dimensions, Text, View } from "react-native";
import { Updating } from "../helpers/ViewHelpers/updating";
import { Modal } from "react-native";
import { getFileAsync, getUriFile } from "../helpers/LogicHelper/fileHelper";
import { IMAGE } from "../constant/KieuFile";
import { SK_TRUY_XUAT } from "../constant/KieuTaiNguyen";
import File from "../model/File";

const temp_ListFileAnhSuKiens : {sK_Id: string, listFileAnhSuKiens: File[]}[] = [];

const { width } = Dimensions.get('window');
export default function AnhSuKienTruyXuat({sK_Id}: {sK_Id: string}) {
    const [listFileAnhSuKiens, setListFileAnhSuKiens] = useState<File[]>([]);
    const [showModalAnhSuKien, setShowModalAnhSuKien] = useState<boolean | undefined>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        layListFileAnhSuKien();
    }, []);

    const layListFileAnhSuKien = async() => {
        const listFilesInTemp = temp_ListFileAnhSuKiens.find((item) => {
            return item.sK_Id === sK_Id;
        });

        if (!listFilesInTemp) {
            const listFileAnhSuKiens = await getFileAsync(SK_TRUY_XUAT, sK_Id, IMAGE);
            setListFileAnhSuKiens(listFileAnhSuKiens);
            temp_ListFileAnhSuKiens.push({
                sK_Id: sK_Id,
                listFileAnhSuKiens: listFileAnhSuKiens
            })
        }else {
            setListFileAnhSuKiens(listFilesInTemp.listFileAnhSuKiens);
        }
    }

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
            <View>
                {listFileAnhSuKiens.length > 0 ? 
                (<View>
                    <Text style={{fontWeight: 'bold'}}>{'Hình ảnh sự kiện truy xuất: '}</Text>
                    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setShowModalAnhSuKien(true)}>
                        {listFileAnhSuKiens.map((item, key) => {
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
                        <Text style={{fontWeight: 'bold'}}>{'Hình ảnh sự kiện truy xuất: '}</Text>
                        <Updating />
                    </View>
                )}
    
                <Modal
                    visible={showModalAnhSuKien}
                    animationType={'slide'}
                    style={{width: '100%', height: '100%'}}
                    >
                        <View>
                            <FlatList
                                data={listFileAnhSuKiens}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={onScroll}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                <View>
                                    <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                                    <View style={styles.indicatorContainer}>
                                        {listFileAnhSuKiens.map((_, i) => (
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
                            <Button title="Đóng" onPress={() => setShowModalAnhSuKien(false)}></Button>
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