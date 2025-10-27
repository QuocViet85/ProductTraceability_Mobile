import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import { PADDING_DEFAULT } from "../constant/Style";

export default function MenuChat({ deleteThisChat}: { deleteThisChat: Function}) 
{
    const [showModalMenu, setShowModalMenu] = useState<boolean>(false);
    const [showModalXoa, setShowModalXoa] = useState<boolean>(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setShowModalMenu(true)}>
                <IconSymbol name={'settings'} color={'grey'} />
            </TouchableOpacity>

            <Modal
            visible={showModalMenu}
            animationType={'slide'}>
                <View style={{marginTop: 'auto'}}>
                    <View style={{padding: PADDING_DEFAULT + 10}}>
                        <TouchableOpacity onPress={() => setShowModalXoa(true)} style={{flexDirection: 'row'}}>
                            <IconSymbol name={'delete'} size={30} color={'red'}/> 
                            <View style={{padding: 5}}>
                                <Text>{'Xóa hội thoại'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Button title="Đóng" onPress={() => setShowModalMenu(false)}></Button>
                </View>
            </Modal>

            <Modal
            visible={showModalXoa}
            animationType={'slide'}
            transparent= {true}>
                <View style={{ marginTop: '80%', alignItems: 'center' }}>
                    <View style={{ width: '50%', backgroundColor: '#f2f2f2', borderRadius: 8 }}>
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => {deleteThisChat(); setShowModalXoa(false); setShowModalMenu(false)}}>
                                <IconSymbol name={'delete'} size={50} color={'red'}/>
                            </TouchableOpacity>
                            <Text>{'Xác nhận xóa hội thoại'}</Text>
                        </View>
                        <Button title="Đóng" onPress={() => setShowModalXoa(false)}></Button>
                    </View>
                </View>
            </Modal>
        </View>
    )
}