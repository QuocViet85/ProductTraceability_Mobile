import { Updating } from "@/app/helpers/ViewHelpers/updating";
import SanPham from "@/app/model/SanPham";
import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { useState } from "react";

export default function MaVach({sanPham}: {sanPham: SanPham}) {
    const [showModalMaVach, setShowModalMaVach] = useState<boolean | undefined>(false);

    return (
        <View style={{flexDirection: 'row'}}>
            {sanPham.sP_MaVach ? (
                <TouchableOpacity onPress={() => setShowModalMaVach(true)}>
                    <Barcode
                        value={sanPham.sP_MaVach}
                        format="CODE128"
                        width={1}
                        height={50}
                        lineColor="#000"
                        background="#fff"
                        text={<Text style={{ fontSize: 11 }}>{sanPham.sP_MaVach}</Text>}
                        textStyle={{ marginTop: 4 }}
                        />

                    <Modal
                    visible={showModalMaVach}
                    animationType='slide'
                    presentationStyle='fullScreen'
                    >
                        <View style={{marginTop: 'auto'}}>
                            <View style={{alignItems: 'center'}}>
                                    <Barcode
                                        value={sanPham.sP_MaVach}
                                        format="CODE128"
                                        width={3}
                                        height={200}
                                        lineColor="#000"
                                        background="#fff"
                                        text={<Text style={{ fontSize: 20 }}>{sanPham.sP_MaVach}</Text>}
                                        textStyle={{ marginTop: 4 }}
                                    />
                            </View>

                            <View>
                                <Button title="Đóng" onPress={() => setShowModalMaVach(false)}></Button>
                            </View>

                        </View>
                    </Modal>
                </TouchableOpacity>
            ) : (
                <Text>{'Mã vạch: '} <Updating /></Text>
            )}
        </View>
    )
}