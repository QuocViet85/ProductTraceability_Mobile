import { useEffect, useState } from "react";
import { Image } from "react-native";
import { getUriAvatarDoanhNghiep } from "../helpers/LogicHelper/fileHelper";

export default function AvatarDoanhNghiep({dN_Id, width, height}: {dN_Id: string, width: number, height: number}) {
    const [uri, setUri] = useState<string | null>(null);

    useEffect(() => {
        getUriAvatarDoanhNghiep(dN_Id)
        .then((uri) => {
            if (uri) {
                setUri(uri);
            }
        })
    }, []);

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