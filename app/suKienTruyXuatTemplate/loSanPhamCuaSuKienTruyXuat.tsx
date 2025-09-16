import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import LoSanPham from "../model/LoSanPham";
import { Updating } from "../helpers/ViewHelpers/updating";
import { useState } from "react";
import LoSanPhamRender from "../loSanPhamTemplate/loSanPhamRender";

export default function LoSanPhamCuaSuKienTruyXuat({loSanPham}: {loSanPham: LoSanPham | undefined}) {
    const [showModalLoSanPham, setShowModalLoSanPham] = useState<boolean | undefined>(false);
    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold'}}>Lô sản phẩm: </Text>
            {loSanPham ? (
                <View>
                    <TouchableOpacity style={{backgroundColor: '#f2f2f2'}} onPress={() => setShowModalLoSanPham(true)}>
                        <Text>{'Xem thông tin'}</Text>
                    </TouchableOpacity>
                    <Modal
                    visible={showModalLoSanPham}
                    animationType="slide"
                    >
                        <LoSanPhamRender 
                        loSanPham={loSanPham} 
                        sP_Id={loSanPham.lsP_SP_Id} 
                        sP_MaTruyXuat={loSanPham.lsP_SP?.sP_MaTruyXuat} 
                        sP_Ten={loSanPham.lsP_SP?.sP_Ten}/>
                        
                        <View style={{marginTop: 'auto'}}>
                                <Button title='Đóng' onPress={() => setShowModalLoSanPham(false)}></Button>
                        </View>   
                    </Modal>
                </View>
        ) : (<Updating />)}
        </View>
    )
}