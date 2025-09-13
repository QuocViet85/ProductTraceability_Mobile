import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../helpers/ViewHelpers/header";
import QuetMaBangAnhCoSan from "../quetMaTemplate/quetMaBangAnhCoSan";

export default function QuetMa() {
    return (
        <View style={styles.container}>
          <Header title="Quét Mã" fontSize={30} resource={null}/>
          <View style={styles.content}> 
              <View style={{alignItems: 'center', marginTop: '70%'}}>
                <View>
                    <QuetMaBangAnhCoSan />
                </View>
                <View style={{height: 10}}></View>
                <View>
                    <Link href={{pathname: '/quetMaTemplate/quetMaBangCamera' }} withAnchor asChild>
                      <TouchableOpacity>
                        <IconSymbol name={'camera'} size={50} color={'blue'}/>
                      </TouchableOpacity>
                    </Link>
                    <Text>Camera</Text>
                </View>
              </View>
              
          </View>
        </View>
            
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                     // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    backgroundColor: 'white',
    alignItems: 'center'
  },
  content: {
    marginTop: 60,
    width: '100%'
  },
});