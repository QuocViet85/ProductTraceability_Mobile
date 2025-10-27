import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { Button, Modal, Text, TouchableOpacity, View } from "react-native";
import { PADDING_DEFAULT } from "../constant/Style";
import { handleCopy } from "../helpers/LogicHelper/helper";
import {Message } from "../model/Message";
import { listMessagesGlobalInOneChat, setReRenderOneChat } from "./oneChat";
import { deleteOneMessage } from "../services/signalr";
import AppUser from "../model/AppUser";

export default function ShowMessage({message, userLogin} : {message: Message, userLogin: AppUser}) {
    const [showDate, setShowDate] = useState<boolean>(false);

    const [showMenuMessage, setShowMenuMessage] = useState<boolean>(false);

    if (typeof message.timeSend === 'string') {
        message.timeSend = new Date(message.timeSend)
    }

    const showAndHideDate = () => {
        if (showDate) {
            setShowDate(false);
        }else {
            setShowDate(true);
        }
    }

    const handleDeleteMessage = async() => {
        await deleteOneMessage(message);
        const indexThisMessageInChatCurrent = listMessagesGlobalInOneChat.findIndex((item: Message) => {
            return item === message;
        });
        if (indexThisMessageInChatCurrent !== -1) {
            listMessagesGlobalInOneChat.splice(indexThisMessageInChatCurrent, 1);
            setReRenderOneChat((value: number) => value + 1);
        };
        setShowMenuMessage(false);
    }

    return (
        <View>
            <TouchableOpacity style={{borderRadius: 8, 
                borderWidth: 0.5, 
                padding: PADDING_DEFAULT, 
                backgroundColor: message.sendUserId === userLogin.id ? '#66FFFF' : 'white', 
                marginLeft: message.sendUserId === userLogin.id ? 'auto' : undefined, 
                marginRight: message.sendUserId === userLogin.id ? undefined : 'auto'}}
                onPress={showAndHideDate}
                onLongPress={() => setShowMenuMessage(true)}>

                <Text style={{color: 'black'}}>{message.content}</Text>
            </TouchableOpacity>

            <Text style={{
                marginLeft: message.sendUserId === userLogin.id ? 'auto' : undefined, 
                marginRight: message.sendUserId === userLogin.id ? undefined : 'auto',
                fontStyle: 'italic',
                fontSize: 10,
                display: showDate ? undefined : 'none'
            }}>
                {message.timeSend.toLocaleString('vi-VN')}
            </Text>

            <Modal
            visible={showMenuMessage}
            animationType="slide"
            transparent={true}>
                <View style={{ marginTop: 'auto', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#f2f2f2', borderRadius: 8 }}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={{alignItems: 'center'}} onPress={ () => handleCopy(message.content as string) }>
                                <IconSymbol name={'content-copy'} size={50} color={'grey'}/>
                                <Text>{'Copy'}</Text>
                            </TouchableOpacity>
                            <View style={{height: 10}}></View>
                            <TouchableOpacity style={{alignItems: 'center'}} onPress={handleDeleteMessage}>
                                <IconSymbol name={'delete'} size={50} color={'red'}/>
                                <Text>{'Xóa'}</Text>
                            </TouchableOpacity>
                        </View>
                        <Button title="Đóng" onPress={() => setShowMenuMessage(false)}></Button>
                    </View>
                </View>

            </Modal>

            <View style={{height: 10}}></View>
        </View>
    )
}

