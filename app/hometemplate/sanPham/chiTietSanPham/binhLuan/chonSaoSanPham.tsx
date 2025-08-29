import getBearerToken from "@/app/helpers/LogicHelper/authHelper";
import BlurLine from "@/app/helpers/ViewHelpers/blurLine";
import { url } from "@/app/server/backend";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Text, TouchableOpacity, View } from "react-native";

export default function ChonSaoSanPham({sP_Id, userId, laySoSaoCuaMotNguoi} : {sP_Id: string, userId: string, laySoSaoCuaMotNguoi: (sP_Id: string, userId: string) => Promise<number>}) {
    const [showModalChonSao, setShowModalChonSao] = useState<boolean | undefined>(false);
    const [soSaoChon, setSoSaoChon] = useState<number>(0);

    useEffect(() => {
        laySoSaoCuaMotNguoi(sP_Id, userId).then((soSao) => {
            setSoSaoChon(soSao)
        })
    }, [])

    const chonSoSao = (soSao: number) => {
        getBearerToken()
        .then((bearerToken: any) => {
            let urlChonSao = url(`api/sanpham/sao-san-pham/${sP_Id}?soSao=${soSao}`)
            axios.post(urlChonSao, null, {headers: {Authorization: bearerToken}})
            .then(() => {
                setSoSaoChon(soSao);
                setShowModalChonSao(false);
            })
            .catch(() => {setShowModalChonSao(false);});
        })
        .catch(() => {setShowModalChonSao(false);})
    }

    return (
        <View>
            <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={() => setShowModalChonSao(true)}>
                    <View style={{flexDirection: 'row', borderWidth: 0.5}}>
                        <Text>{soSaoChon}</Text>
                        <IconSymbol name="star" size={25} color="#FFD700" />
                    </View>
                </TouchableOpacity>

                <Modal
                    visible={showModalChonSao}
                    animationType='slide'
                    presentationStyle='fullScreen'
                    >
                        <View style={{marginTop: 'auto'}}>
                            <BlurLine />
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => chonSoSao(5)}>
                                {Array.from({length: 5}).map((_, index) => {
                                        return (<IconSymbol key={index + '5'} name="star" size={40} color="#FFD700" />)
                                    })}
                            </TouchableOpacity>
                            <BlurLine />
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => chonSoSao(4)}>
                                {Array.from({length: 4}).map((_, index) => {
                                        return (<IconSymbol key={index + '4'} name="star" size={40} color="#FFD700" />)
                                    })}
                            </TouchableOpacity>
                            <BlurLine />
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => chonSoSao(3)}>
                                {Array.from({length: 3}).map((_, index) => {
                                        return (<IconSymbol key={index + '3'} name="star" size={40} color="#FFD700" />)
                                    })}
                            </TouchableOpacity>
                            <BlurLine />
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => chonSoSao(2)}>
                                {Array.from({length: 2}).map((_, index) => {
                                        return (<IconSymbol key={index + '2'} name="star" size={40} color="#FFD700" />)
                                    })}
                            </TouchableOpacity>
                            <BlurLine />
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => chonSoSao(1)}>
                                {Array.from({length: 1}).map((_, index) => {
                                        return (<IconSymbol key={index + '1'} name="star" size={40} color="#FFD700" />)
                                    })}
                            </TouchableOpacity>
                            <View style={{flexDirection:'row', width: '100%', alignItems: 'center'}}>
                                <View style={{width: '50%'}}>
                                    <Button title="Hủy sao" color={'red'} onPress={() => chonSoSao(0)}></Button>
                                </View>
                                <View style={{width: '50%'}}>
                                    <Button title="Đóng" onPress={() => setShowModalChonSao(false)}></Button>
                                </View>
                            </View>
                            
                        </View>
                </Modal>
            </View>
        </View>
    )
}