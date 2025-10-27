import { Button, ScrollView } from "react-native";
import { Modal, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { Updating } from "../helpers/ViewHelpers/updating";
import { useState } from "react";

export default function MoTaSuKienTruyXuat({moTa}: {moTa: string | undefined}) {
    const [showModalMoTa, setShowModalMoTa] = useState<boolean | undefined>(false);
    
        return (
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>{'Mô tả sự kiện: '}</Text>
                {moTa ? (
                <View>
                    <TouchableOpacity style={{backgroundColor: '#f2f2f2'}} onPress={() => setShowModalMoTa(true)}>
                        <Text>{'Xem mô tả'}</Text>
                    </TouchableOpacity>
    
                    <Modal
                    visible={showModalMoTa}
                    animationType="slide"
                    >
                        <ScrollView>
                            <Text>{moTa}</Text> 
                        </ScrollView>
                        <View style={{marginTop: 'auto'}}>
                            <Button title='Đóng' onPress={() => setShowModalMoTa(false)}></Button>
                        </View>    
                    </Modal>
                </View>) : (<Updating />)}
            </View>
        )
}