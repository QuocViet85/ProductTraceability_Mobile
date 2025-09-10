import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { getFileAsync, getUriFile } from "../helpers/LogicHelper/fileHelper";
import { DOANH_NGHIEP } from "../constant/KieuTaiNguyen";
import { COVER_PHOTO } from "../constant/KieuFile";

export default function CoverPhotoDoanhNghiep({dN_Id}:{dN_Id: string}) {
    const [uri, setUri] = useState<string | null>(null);

    useEffect(() => {
        getFileAsync(DOANH_NGHIEP, dN_Id, COVER_PHOTO)
        .then((file: any) => {
            const uri = getUriFile(file[0]);
            if (uri) {
                setUri(uri);
            }
        })
    }, [])

    return (
        <View>
            {uri ? (<Image
            source={{ uri: uri }}
            style={{width: '100%', height: 140}}
            resizeMode="cover"
        />) : (<View></View>)}
        </View>
        
        
    )
}