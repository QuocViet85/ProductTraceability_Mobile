import { useEffect, useState } from "react";
import { getFileAsync, getUriFile } from "../helpers/LogicHelper/fileHelper";
import { NHA_MAY } from "../constant/KieuTaiNguyen";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { IMAGE } from "../constant/KieuFile";

const { width } = Dimensions.get('window');
const height = 400
export default function AnhNhaMay({nM_Id}: {nM_Id: string}) {
    const [listAnhNhaMays, setListAnhNhaMays] = useState<any[]>(['']);
    
    useEffect(() => {
        getFileAsync(NHA_MAY, nM_Id, IMAGE).then((data) => {
        if(data) {
            setListAnhNhaMays(data);
        }
        })
    }, [])

    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
            <View style={{height: height}}>
                    <FlatList
                      data={listAnhNhaMays}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      onScroll={onScroll}
                      renderItem={({ item }) => (
                      <View>
                          <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                          <View style={styles.indicatorContainer}>
                              {listAnhNhaMays.map((_, i) => (
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
        );
}

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height,
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