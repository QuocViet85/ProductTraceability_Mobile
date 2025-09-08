import axios from "axios";
import { url } from "../../server/backend";

export async function getUserInfo(userId: string) {
  let urlGetUser = url(`api/auth/${userId}`);
  return (await axios.get(urlGetUser)).data;
}
