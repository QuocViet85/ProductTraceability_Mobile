import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAccessToken, getUserLogin } from "../Auth/Authentication";
import { PADDING_DEFAULT } from "../constant/Style";
import { getUserById, getUserNameById } from "../helpers/LogicHelper/userHelper";
import AppUser from "../model/AppUser";
import { Message } from "../model/Message";
import { connectToSignalR, deleteOneChat, getListMessagesFromStorage, receiveMessage, sendMessage } from "../services/signalr";
import MenuChat from "./menuChat";
import ShowMessage from "./showMessage";

export let listMessagesGlobalInOneChat : Message[] = []
export let setReRenderOneChat: Function = () => {}

export default function OneChat() 
{
    const params = useLocalSearchParams();
    const userChatWithId = params.userChatWithId;

    const [userLogin, setUserLogin] = useState<AppUser | null>();

    const [userChatWithName, setUserChatWithName] = useState<string | undefined>(undefined);

    const [listMessages, setListMessages] = useState<Message[]>([]);

    const [chatText, setChatText] = useState("");

    const [reRender, setReRender] = useState<number>(0);

    setReRenderOneChat = setReRender;

    const flatListRef = useRef<FlatList>(null);

    const router = useRouter();

    useEffect(() => {
        xuLyChat();
    }, []);

    const xuLyChat = async() => {
        try {
            try {
                await connectToSignalR(async (newMessage: Message) => {
                    if (newMessage) {
                        listMessagesGlobalInOneChat.push(newMessage);
                        setReRenderOneChat((value: number) => value + 1);
                    }
                });
            }catch {}
            

            //lấy user đăng nhập
            const userLogin = await getUserLogin();
            if (!userLogin) {
                return;
            }
            setUserLogin(userLogin);

            //lấy user chat cùng
            const userChatWithName = await getUserNameById(userChatWithId as string);
            setUserChatWithName(userChatWithName);

            //lấy tin nhắn lưu sẵn trong máy (nếu có)
            const listMessagesFromStrorage : Message[] = await getListMessagesFromStorage();

            const listMessageWithUserChatWith : Message[] = listMessagesFromStrorage.filter((message: Message, index) => {
                return (message.sendUserId === userLogin.id && message.receiveUserId === userChatWithId) || (message.sendUserId === userChatWithId && message.receiveUserId === userLogin.id)
            });

            setListMessages(listMessageWithUserChatWith)
            listMessagesGlobalInOneChat = listMessageWithUserChatWith;
        }catch {}
    }

    const handleSend = async() => {
        if (chatText) {
            const newMessage = await sendMessage(chatText, userChatWithId as string, userChatWithName);

            if (newMessage) {
                listMessages.push(newMessage);
                setChatText("");
            }
        }
    };

    const deleteThisChat = async() => {
        await deleteOneChat(userLogin?.id as string, userChatWithId as string);
        const listMessageEmpty : Message[] = [];
        setListMessages(listMessageEmpty);
        listMessagesGlobalInOneChat = listMessageEmpty;
    }

    const showMessage = ({item}: {item: Message}) => {
        return (
            <ShowMessage message={item} userLogin={userLogin as AppUser}/>
        )
    }


    return userLogin ? (
        <KeyboardAvoidingView
            style={{ backgroundColor: 'white' }}
            behavior={"height"}
                        >
                <View style={{ width: '100%', height: '100%', backgroundColor: 'white'  }}>
                    <View style={{alignItems: 'center', backgroundColor: '#DDDDDD', padding: PADDING_DEFAULT + 5}}>
                        <View style={{flexDirection: 'row'}}>  
                            <TouchableOpacity onPress={() => router.push({pathname: '/usertemplate/user', params: {userId: userChatWithId}})}>
                                <Text style={{fontWeight: 'bold', color: 'black'}}>{userChatWithName ? userChatWithName : userChatWithId}</Text>
                            </TouchableOpacity>
                            <MenuChat deleteThisChat={deleteThisChat}/>
                        </View> 
                    </View>
                    <View style={{height: 10}}></View>
                    <View style={{flex: 1, padding: PADDING_DEFAULT}}>
                        <FlatList
                        inverted
                        data={listMessages ? [...listMessages].reverse() : undefined}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={showMessage}
                        ref={flatListRef}
                        />
                        <View style={{width: '100%', flexDirection: 'row', marginBottom: 30}}>
                            <TextInput style={styles.textInputChat} placeholder='Nhập tin nhắn' value={chatText} onChangeText={setChatText}>
                            </TextInput>
                            <TouchableOpacity style={styles.touchSend} onPress={handleSend}>
                                <IconSymbol name={'send'} color={'white'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
        </KeyboardAvoidingView>
  ) : (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
        <Text>{'Vui lòng đăng nhập để nhắn tin'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    textInputChat: {
    flex: 1,
    height: 40,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '60%',
    borderRadius: 8
  },
  touchSend: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    width: '10%',
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 6,
  },
  container: {
    flex: 1,                     // cho phép chiếm toàn màn hình
    flexDirection: 'column',     // mặc định
    justifyContent: 'flex-start',// bắt đầu từ trên xuống
    backgroundColor: '#fff',
  },
});