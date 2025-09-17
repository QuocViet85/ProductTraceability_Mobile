import { useEffect, useState } from "react";
import { DimensionValue, Image, View } from "react-native";
import { getFileAsync, getUriFile } from "../helpers/LogicHelper/fileHelper";
import { DOANH_NGHIEP } from "../constant/KieuTaiNguyen";
import { COVER_PHOTO } from "../constant/KieuFile";

const temp_UriCoverPhotoDoanhNghiep : {
    dN_Id: string,
    uri: string | undefined
}[] = [];

export default function CoverPhotoDoanhNghiep({dN_Id, height}:{dN_Id: string, height: DimensionValue | undefined}) {
    const [uriCoverPhoto, setUriCoverPhoto] = useState<string | undefined>(undefined);

    useEffect(() => {
        layUriCoverPhoto();
    }, [])

    const layUriCoverPhoto = async() => {
            const uriCoverPhotoInTemp = temp_UriCoverPhotoDoanhNghiep.find((item) => {
                return item.dN_Id === dN_Id
            });

            if (!uriCoverPhotoInTemp) {
                const listFilesCoverPhoto = await getFileAsync(DOANH_NGHIEP, dN_Id, COVER_PHOTO);

                if (listFilesCoverPhoto.length > 0) {
                    const uri = getUriFile(listFilesCoverPhoto[0]);
                    setUriCoverPhoto(uri);
                    temp_UriCoverPhotoDoanhNghiep.push({
                        dN_Id: dN_Id as string,
                        uri: uri
                    })
                }
            }else {
                setUriCoverPhoto(uriCoverPhotoInTemp.uri);
            }
    }

    return (
        <View>
            {uriCoverPhoto ? (<Image
            source={{ uri: uriCoverPhoto }}
            style={{width: '100%', height: height}}
            resizeMode="cover"
        />) : (<View></View>)}
        </View>
        
        
    )
}