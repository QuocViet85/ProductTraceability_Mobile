import { IMAGE } from "@/app/constant/KieuFile";
import { SAN_PHAM } from "@/app/constant/KieuTaiNguyen";
import { getFileAsync, getUriFile } from "@/app/helpers/LogicHelper/fileHelper";
import File from "@/app/model/File";
import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

const temp_ListFileAnhSanPhams : [{sP_Id: string, listFileAnhSanPhams: File[]} | undefined] = [undefined];

const { width } = Dimensions.get('window');
const height = 400;
export default function AnhSanPham({sP_Id} : {sP_Id : string}) 
{
    const [listFileAnhSanPhams, setListFileAnhSanPhams] = useState<File[]>([]);

    useEffect(() => {
      layAnhSanPham();
    }, []);

    const layAnhSanPham = async() => {
      const listFilesInTemp = temp_ListFileAnhSanPhams.find((item) => {
        return item?.sP_Id === sP_Id;
      });

      if (!listFilesInTemp) {
        const listFiles = await getFileAsync(SAN_PHAM, sP_Id, IMAGE);
        if (listFiles) {
          setListFileAnhSanPhams(listFiles);
          temp_ListFileAnhSanPhams.push({
            sP_Id: sP_Id,
            listFileAnhSanPhams: listFiles
          });
        }
      }else {
        setListFileAnhSanPhams(listFilesInTemp.listFileAnhSanPhams);
      }
      
    }

    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    return (
        <View style={{height: height}}>
                <FlatList
                  data={listFileAnhSanPhams}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  onScroll={onScroll}
                  renderItem={({ item }) => (
                  <View>
                      <Image source={{ uri: getUriFile(item) }} style={styles.image} />
                      <View style={styles.indicatorContainer}>
                          {listFileAnhSanPhams.map((_, i) => (
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