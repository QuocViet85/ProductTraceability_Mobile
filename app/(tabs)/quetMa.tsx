import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../helpers/ViewHelpers/header";
import QuetMaBangAnhCoSan from "../quetMaTemplate/quetMaBangAnhCoSan";

export default function QuetMa() {
    const router = useRouter();
    return (
        <View style={styles.container}>
          <Header title="Quét Mã" fontSize={30} resource={null}/>
          <View style={styles.content}> 
              <View style={{flexDirection: 'row'}}>
                <View>
                    <QuetMaBangAnhCoSan />
                </View>
                <View style={{width: 30}}></View>
                <View>
                    <TouchableOpacity onPress={() => router.push({pathname: '/quetMaTemplate/quetMaBangCamera' })}>
                      <IconSymbol name={'camera'} size={50} color={'blue'}/>
                    </TouchableOpacity>
                    <Text>{'Camera'}</Text>
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
    marginTop: 'auto',
    width: '100%',
    alignItems: 'center'
  },
});