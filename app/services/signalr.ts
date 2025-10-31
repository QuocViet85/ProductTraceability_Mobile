// services/signalr.ts
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { url } from '../server/backend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken, getBearerToken, getUserLogin } from '../Auth/Authentication';
import { Message } from '../model/Message';
import { ListMessages } from '../constant/KeyStorage';
import { MESSAGE_IMAGE, MESSAGE_TEXT } from '../constant/TypeMessage';
import { getUriImagesFromCamera, getUriImagesPickInDevice } from '../helpers/LogicHelper/fileHelper';
import axios from 'axios';
import { Alert } from 'react-native';

let connection: HubConnection;

const ReceiveMessage = "ReceiveMessage";

export let state_SetMessagesInStorage = false;

export const connectToSignalR = async (onReceive: Function | undefined = undefined) => {
  if (!connection || connection?.state === "Disconnected") {
      const accessToken = await getAccessToken();
      connection = new HubConnectionBuilder()
      .withUrl(url(`chatHub?access_token=${accessToken}`)) // 👈 token truyền qua query string
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

      // Khởi động kết nối
      await connection.start();
      console.log("✅ SignalR connected");
  }

  if (onReceive) {
    connection.off(ReceiveMessage);
    connection.on(ReceiveMessage, async(userSendId: string, userSendName: string | undefined, message: string, typeMessage: string, timeSend: Date) => {
      const newMessage = await receiveMessage(userSendId, userSendName, message, typeMessage, timeSend);
      onReceive(newMessage);
    })
  }else {
    connection.off(ReceiveMessage);
    connection.on(ReceiveMessage, receiveMessage)
  }
};

export const disconnectToSignalR = async () => {
  if (connection) await connection.stop();
};

export async function getListMessagesFromStorage(sort: boolean = false) : Promise<Message[]> {
    const listMessageStrings = await AsyncStorage.getItem(ListMessages);
    const listMessages: Message[] = JSON.parse(listMessageStrings as string);
    if (!listMessages) {
        return [];
    }

    if (sort) {
      listMessages.sort((a: Message, b: Message) => {
        a.timeSend = new Date(a.timeSend);
        b.timeSend = new Date(b.timeSend);

        if (a.timeSend > b.timeSend) {
          return -1;
        }else if (a.timeSend > b.timeSend) {
          return 1;
        }
        return 0;
      })
    }
    return listMessages;
}

export async function setListMessagesFromStorage(listMessages: Message[]) {
    await AsyncStorage.setItem(ListMessages, JSON.stringify(listMessages));
}

export async function saveMessageToStorage(message: Message) {
    if (state_SetMessagesInStorage) {
      setTimeout(() => saveMessageToStorage(message), 0);
    }else {
      state_SetMessagesInStorage = true;

      const listMessagesInStorage : Message[] = await getListMessagesFromStorage();
      listMessagesInStorage.push(message);
      await setListMessagesFromStorage(listMessagesInStorage);

      state_SetMessagesInStorage = false;
    }
}

export async function deleteOneMessage(message: Message) {
  if (state_SetMessagesInStorage) {
    setTimeout(() => deleteOneMessage(message), 0);
  }else {
    state_SetMessagesInStorage = true;

    const listMessages: Message[] = await getListMessagesFromStorage();

    const indexMessage: number = listMessages.findIndex((item: Message) => {
      return item.id === message.id;
    });

    if (indexMessage !== -1) {
      listMessages.splice(indexMessage, 1);
      await setListMessagesFromStorage(listMessages);
    }

    if (message.typeMessage === MESSAGE_IMAGE) {
      const urlDeleteMessageImage = url(`api/chat/message-image/${message.sendUserId}?tenFile=${message.content}`)
      axios.delete(urlDeleteMessageImage, {headers: {Authorization: await getBearerToken() }})
    }

    state_SetMessagesInStorage = false;
  }
}

export async function deleteOneChat(user1Id: string, user2Id: string) {
  if (state_SetMessagesInStorage) {
    setTimeout(() => deleteOneChat(user1Id, user2Id), 0);
  }else {
    state_SetMessagesInStorage = true;
    const listMessages: Message[] = await getListMessagesFromStorage();

    const newListMessage: Message[] = listMessages.filter((item: Message) => {
      return (item.sendUserId !== user1Id && item.receiveUserId !== user2Id) || (item.receiveUserId !== user1Id && item.sendUserId !== user2Id);
    });

    await setListMessagesFromStorage(newListMessage);
    state_SetMessagesInStorage = false;
  }
}

export async function deleteAllChats() {
  if (state_SetMessagesInStorage) {
    setTimeout(deleteAllChats, 0)
  }else {
    state_SetMessagesInStorage = true;
    await AsyncStorage.setItem(ListMessages, JSON.stringify([]));
    state_SetMessagesInStorage = false;
  }
}

export const sendMessage = async (chatText: string, userChatWithId: string, userChatWithName: string | undefined, typeMessage: string, camera: boolean = false) : Promise<Message | undefined> => {
  const userLogin = await getUserLogin();

  if (!userLogin) {
      return;
  }

  if (typeMessage === MESSAGE_TEXT) {
    if (connection && connection.state === "Connected") {
      const newMessage = new Message();
      newMessage.content = chatText;
      newMessage.timeSend = new Date();
      newMessage.sendUserId = userLogin.id;
      newMessage.receiveUserId = userChatWithId as string;
      newMessage.typeMessage = typeMessage;

      newMessage.sendUserName = userLogin.name;
      newMessage.receiveUserName = userChatWithName;
      

      await saveMessageToStorage(newMessage);

      try {
        await connection.invoke("SendMessage", newMessage.receiveUserId, newMessage.content, newMessage.typeMessage);
        return newMessage;
      }catch {
        await deleteOneMessage(newMessage);
      }
    } else {
      console.warn("SignalR not connected");
    }
  }else if (typeMessage === MESSAGE_IMAGE) {
    let uriImgArr : string[] = [];
    
    if (camera) {
        uriImgArr = await getUriImagesFromCamera();
    }else {
        uriImgArr = await getUriImagesPickInDevice();
    }

    if (uriImgArr.length > 0) {
        const uriImg: string = uriImgArr[0];

        const formData = new FormData();

        formData.append("file", {
                        uri: uriImg,
                        type: "image/jpeg",
                        name: "message.jpg",
                        } as any);

        const uriTaiLenImageMessage = url(`api/chat/message-image/${userChatWithId}`);

        try {
            const res = await axios.post(uriTaiLenImageMessage, formData, { headers : {"Content-Type": "multipart/form-data", Authorization: await getBearerToken()}});
            const tenImg = res.data;

            const newMessage = new Message();
            newMessage.content = tenImg;
            newMessage.timeSend = new Date();
            newMessage.sendUserId = userLogin.id;
            newMessage.receiveUserId = userChatWithId as string;
            newMessage.typeMessage = typeMessage;

            newMessage.sendUserName = userLogin.name;
            newMessage.receiveUserName = userChatWithName;

            await saveMessageToStorage(newMessage);

            return newMessage;
        }catch {
              Alert.alert('Lỗi', 'Gửi ảnh thất bại');
        }
    }
  } 
};

export async function receiveMessage(userSendId: string, userSendName: string | undefined, message: string, typeMessage: string, timeSend: Date) : Promise<Message | undefined> {
    const userLogin = await getUserLogin();

    if (!userLogin) {
      return;
    }

    const newMessage = new Message();
    newMessage.sendUserId = userSendId;
    newMessage.receiveUserId = userLogin.id;
    newMessage.content = message;
    newMessage.typeMessage = typeMessage;

    newMessage.sendUserName = userSendName;
    newMessage.receiveUserName = userLogin.name;

    if (!timeSend) {
      newMessage.timeSend = new Date();
    }else {
      if (typeof timeSend === 'string') {
        timeSend = new Date(timeSend);
      }
      newMessage.timeSend = timeSend;
    }

    await saveMessageToStorage(newMessage);

    return newMessage;
}

