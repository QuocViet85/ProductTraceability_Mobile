import { useEffect, useState } from "react";
import { Image } from "react-native";
import { getUriAvatarDoanhNghiep } from "../helpers/LogicHelper/fileHelper";

const temp_UriAvatarDoanhNghiep : {
    dN_Id: string,
    uri: string
}[] = []

export default function AvatarDoanhNghiep({dN_Id, width, height}: {dN_Id: string, width: number, height: number}) {
    const [uri, setUri] = useState<string | null>(null);

    useEffect(() => {
        layAvatarDoanhNghiep();
    }, []);

    const layAvatarDoanhNghiep = async() => {
        const uriAvatarInTemp = temp_UriAvatarDoanhNghiep.find((item) => {
            return item.dN_Id === dN_Id
        });

        if (!uriAvatarInTemp) {
            const uri = await getUriAvatarDoanhNghiep(dN_Id);

            if(uri) {
                setUri(uri);
                temp_UriAvatarDoanhNghiep.push({
                    dN_Id: dN_Id,
                    uri: uri
                });
            }
        }else {
            setUri(uriAvatarInTemp.uri);
        }
    }

    return (
        <Image 
            source={{uri: uri ? uri : ''}}
            style={{
                        width: width,
                        height: height,
                        borderRadius: 32,
                        backgroundColor: '#eee',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: '#ccc',
                    }}
        />
    )
}