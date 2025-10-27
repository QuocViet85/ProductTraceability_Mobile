// import { useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { getAccessToken, getUserLogin } from "../Auth/Authentication";
// import { PADDING_DEFAULT } from "../constant/Style";
// import { getUserById } from "../helpers/LogicHelper/userHelper";
// import BlurLine from "../helpers/ViewHelpers/blurLine";
// import Header from "../helpers/ViewHelpers/header";
// import AppUser from "../model/AppUser";
// import { Message } from "../model/Message";
// import { connectToSignalR } from "../services/signalr";
// import AvatarUser from "../usertemplate/avatarUser";

// export default function DanhSachChat() 
// {
//     const [listMessagesCuoi, setListMessagesCuoi] = useState<Message[] | undefined>([]);

//     const [userLogin, setUserLogin] = useState<AppUser | null>(null);

//     const [reRender, setReRender] = useState<number>(0);

//     const [forceReRender, setForceReRender] = useState<number>(0);

//     const [connectChat, setConnectChat] = useState<boolean>(true);

//     const router = useRouter();

//     useEffect(() => {
//         layListChats();
//     }, [forceReRender]);

//     const layListChats = async() => {
//         const userLogin : AppUser | null = await getUserLogin();
//         setUserLogin(userLogin);
//         if (!userLogin) {
//             return;
//         }

//         const allListChats = await getListChatsFromStorage();

//         const listChatsOfUser = allListChats.filter((chat: Chat) => {
//             return chat.userId === userLogin.id;
//         });

//         setListChats(listChatsOfUser);
//         listChatsGlobalInDanhSachChat = listChatsOfUser;

//         if (connectChat) {
//             setTimeout(async() => {
//                 //ngắt kết nối với server nếu đã kết nối trước đó để không bị chồng chập hàm nhận tin nhắn dẫn đến nhận 1 tin nhắn nhiều lần
//                 await disconnectToSignalR();

//                 const accessToken = await getAccessToken();
//                 if (!accessToken) {
//                     return
//                 }

//                 //kết nối với server để lấy tin nhắn mới
//                 connectToSignalR(accessToken as string, async(from: string, message: string) => {
//                         const newMessage = new Message();
//                         newMessage.content = message;
//                         newMessage.timeSend = new Date();
//                         newMessage.me = false;

//                         let chatOfUserWithUserSend = listChatsGlobalInDanhSachChat.find((chat: Chat) => {
//                             return from === chat.userChatWithId;
//                         });

//                         if (!chatOfUserWithUserSend) {
//                             chatOfUserWithUserSend = new Chat();
//                             chatOfUserWithUserSend.userId = userLogin.id;
//                             chatOfUserWithUserSend.userChatWithId = from;
//                             try {
//                                 chatOfUserWithUserSend.userChatWithName = (await getUserById(from))?.name
//                             }catch {}
//                             listChatsGlobalInDanhSachChat.push(chatOfUserWithUserSend);
//                         }
//                         chatOfUserWithUserSend.messages.push(newMessage);

//                         await setListChatsFromStorage(listChatsGlobalInDanhSachChat as Chat[]);
//                         setReRender((value: number) => value + 1);
//                 });
//             }, 0);
//             setConnectChat(false);
//         } 
//     }

//     const showChat = ({lastMessage}: {lastMessage: Message}) => {
//         if (lastMessage) {
//             let contentLastMessageShow = lastMessage.content;

//             if (contentLastMessageShow && contentLastMessageShow.length > 40) {
//                 contentLastMessageShow = contentLastMessageShow.slice(0, 40) + '...';
//             }
//             return (
//                 <TouchableOpacity onPress={() => router.push({ 
//                     pathname: '/chatTemplate/oneChat', 
//                     params: { userChatWithId: lastMessage.sendUserId === userLogin?.id ? lastMessage.receiveUserId : lastMessage.sendUserId } })}
//                 >
//                     <View style={{flexDirection: 'row'}}>
//                         <AvatarUser userId={lastMessage.sendUserId === userLogin?.id ? lastMessage.receiveUserId : lastMessage.sendUserId} width={60} height={60} canChange={false} />
//                         <View style={{width: 10}}></View>
//                         <View style={{paddingTop: PADDING_DEFAULT}}>
//                             <Text style={{fontWeight: 'bold', fontSize: 17}}>{item.userChatWithName}</Text>
//                             <Text style={{fontStyle: 'italic', fontSize: 13}}>{lastMessage.sendUserId === userLogin?.id ? 'Bạn:' : undefined} {contentLastMessageShow}</Text>
//                         </View>
//                     </View>
//                     <BlurLine />
//                 </TouchableOpacity>
//             )
//         }else {
//             return (<View></View>);
//         }
//     }

//     return (
//         <View style={styles.container}>
//             <Header title="Danh sách hội thoại" fontSize={30} resource={null}></Header>
//             <View style={{padding: PADDING_DEFAULT}}>
//                 {userLogin ? (
//                     <FlatList  
//                         data={listChats}
//                         keyExtractor={(item, index) => index.toString()}
//                         renderItem={showChat}
//                         refreshControl={(
//                             <RefreshControl 
//                             refreshing={false}
//                             onRefresh={superForceReRenderDanhSachChat} //hành vi khi refresh
//                             progressViewOffset={30}/> //kéo mũi tên xuống bao nhiêu thì refresh
//                         )}/>
//             ) : (
//                 <FlatList  
//                     data={[1]}
//                     renderItem={() => (
//                         <View style={{ height: 1000}}>
//                             <Text>{'Vui lòng đăng nhập để thực hiện tính năng Chat'}</Text>
//                         </View>
//                     )}
//                     refreshControl={(
//                         <RefreshControl 
//                         refreshing={false}
//                         onRefresh={superForceReRenderDanhSachChat} //hành vi khi refresh
//                         progressViewOffset={30}/> //kéo mũi tên xuống bao nhiêu thì refresh
//                     )}/>
//             )}
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     textInputSearch: {
//     flex: 1,
//     height: 40,
//     borderColor: 'black',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     width: '60%',
//     borderRadius: 8
//   },
//   touchSearch: {
//     borderWidth: 1,
//     borderColor: 'black',
//     borderRadius: 8,
//     width: '10%',
//     backgroundColor: 'blue',
//     alignItems: 'center',
//     paddingVertical: 6,
//   },
//   touchDestroySearch: {
//     position: 'absolute',
//     marginLeft: '85%',
//     paddingVertical: 10
//   },
//   card: {
//     flex: 1, // 👉 để 2 item chia đều 1 hàng
//     margin: 5,
//     backgroundColor: '#f2f2f2',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     padding: 10,
//   },
//   image: {
//     width: '100%',
//     height: 80,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   container: {
//     flex: 1,                     // cho phép chiếm toàn màn hình
//     flexDirection: 'column',     // mặc định
//     justifyContent: 'flex-start',// bắt đầu từ trên xuống
//     backgroundColor: '#fff',
//   },
// });