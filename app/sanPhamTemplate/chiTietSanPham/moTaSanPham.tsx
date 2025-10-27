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
                    <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 20}}>{'Mô tả sản phẩm'}</Text>
                    <ScrollView style={{backgroundColor: '#fff', height: 120}} nestedScrollEnabled={true}>
                        <Text style={{fontSize: 20}}>
                            {moTa}
                        </Text>
                    </ScrollView>
                    <View style={{height: 5}}></View>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {setShowModalMoTa(true)}}>
                        <Text style={{ color: 'grey', marginTop: 5, fontSize: 15}}>
                            {'Xem toàn màn hình'}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        visible={showModalMoTa}
                        animationType='slide'
                        >
                            <ScrollView>
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