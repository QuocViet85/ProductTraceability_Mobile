import Spacer from "@/app/helpers/ViewHelpers/spacer";
import { Link } from "expo-router";
import { useState } from "react";
import { Button, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MoTaSanPham({moTa} : {moTa: string}) {
    const [showModalMoTa, setShowModalMoTa] = useState<boolean | undefined>(false);
    return (
        <View>
            {moTa ? (
                <View>
                    <Text style={{fontSize: 20}}>
                        {moTa.substring(0, 100)}
                    </Text>
                     <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {setShowModalMoTa(true)}}>
                        <Text style={{ color: 'grey', marginTop: 5, fontSize: 15}}>
                            Xem thêm
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        visible={showModalMoTa}
                        animationType='slide'
                        presentationStyle='fullScreen'
                        >
                            <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
                                <Text style={{fontSize: 20}}>
                                    {moTa}
                                </Text>
                            </ScrollView>
                            <Button title="Đóng" onPress={() => {setShowModalMoTa(false)}}></Button>          
                    </Modal>
                    <Spacer height={10} />
                </View>
            ) : (
                <View></View>
            )}
            
        </View>
    );
}