import axios from "axios";
import { url } from "../server/backend";

export default async function getUserInfo(userId: string) {
    let urlGetUser = url(`api/auth/${userId}`);
    return (await axios.get(urlGetUser)).data;
}