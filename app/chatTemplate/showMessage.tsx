import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { Button, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { PADDING_DEFAULT } from "../constant/Style";
import { handleCopy } from "../helpers/LogicHelper/helper";
import {Message } from "../model/Message";
import { listMessagesGlobalInOneChat, setReRenderOneChat } from "./oneChat";
import { deleteOneMessage } from "../services/signalr";
import AppUser from "../model/AppUser";
import { MESSAGE_IMAGE, MESSAGE_TEXT } from "../constant/TypeMessage";
import { IMAGE } from "../constant/KieuFile";
import File from "../model/File";
import { getUriFile } from "../helpers/LogicHelper/fileHelper";

export default function ShowMessage({message, userLogin} : {message: Message, userLogin: AppUser}) {
    const [showDate, setShowDate] = useState<boolean>(false);

    const [showMenuMessage, setShowMenuMessage] = useState<boolean>(false);

    const [showModalMessageImage, setShowModalMessageImage] = useState<boolean>(false);

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

    let showMessage =  (<View></View>)

    if (message.typeMessage === MESSAGE_TEXT) {
        showMessage = (
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
                </View>
            )
    }else {
        const fileImg = new File();
        fileImg.f_KieuFile = IMAGE;
        fileImg.f_KieuTaiNguyen = MESSAGE_IMAGE;
        fileImg.f_TaiNguyen_Id = message.sendUserId;
        fileImg.f_Ten = message.content;

        showMessage = (
                    <View>
                        <TouchableOpacity style={{
                            marginLeft: message.sendUserId === userLogin.id ? 'auto' : undefined, 
                            marginRight: message.sendUserId === userLogin.id ? undefined : 'auto'}}
                            onPress={() => setShowModalMessageImage(true)}
                            onLongPress={() => setShowMenuMessage(true)}>
                            <Image
                                source={{ uri: getUriFile(fileImg)}}
                                resizeMode={undefined}
                                style={{width: 80, height: 80, marginRight: 10, borderRadius: 8}}
                                />
                        </TouchableOpacity>

                        <Modal
                            visible={showModalMessageImage}
                            animationType={'slide'}
                            style={{width: '100%', height: '100%'}}
                            >
                            <View>
                                <Image source={{ uri: getUriFile(fileImg) }} 
                                        style={{width: '100%',
                                                height: '90%',
                                                resizeMode: 'cover',}} />
                                <View style={{height: 10}}></View>
                                <View style={{alignItems: 'center'}}>
                                    <Text style={{fontStyle: 'italic', fontSize: 15}}>{message.timeSend.toLocaleString('vi-VN')}</Text>
                                </View>
                            </View>
                            <View style={{marginTop: 'auto'}}>
                                <Button title="Đóng" onPress={() => setShowModalMessageImage(false)}></Button>
                            </View>
                        </Modal>
                    </View>
                )
    }

    return (
        <View>
            {
                showMessage
            }
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

