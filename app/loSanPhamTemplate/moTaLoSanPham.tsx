import { Button, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Updating } from "../helpers/ViewHelpers/updating";
import { useState } from "react";

export default function MoTaLoSanPham({moTa}: {moTa: string | undefined}) {
    const [showModalMoTa, setShowModalMoTa] = useState<boolean | undefined>(false);

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>{'Mô tả lô sản phẩm: '}</Text>
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