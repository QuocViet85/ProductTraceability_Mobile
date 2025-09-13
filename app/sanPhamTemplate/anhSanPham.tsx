import { IMAGE } from "@/app/constant/KieuFile";
import { SAN_PHAM } from "@/app/constant/KieuTaiNguyen";
import { getFileAsync, getUriFile } from "@/app/helpers/LogicHelper/fileHelper";
import File from "@/app/model/File";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get('window');
const height = 400
export default function AnhSanPham({sP_Id} : {sP_Id : string}) 
{
    const [listAnhSanPhams, setListAnhSanPhams] = useState<File[]>([]);

    useEffect(() => {
      getFileAsync(SAN_PHAM, sP_Id, IMAGE).then((data) => {
        if(data) {
          setListAnhSanPhams(data);
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
                  data={listAnhSanPhams}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  onScroll={onScroll}
                  renderItem={({ item }) => (
                  <View>
                      <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                      <View style={styles.indicatorContainer}>
                          {listAnhSanPhams.map((_, i) => (
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