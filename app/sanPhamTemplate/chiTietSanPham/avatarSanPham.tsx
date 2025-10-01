import { useEffect, useState } from "react";
import { DimensionValue, Image } from "react-native";
import { getUriAvatarSanPham } from "../../helpers/LogicHelper/fileHelper";

export const temp_AvatarSanPham : {
    sP_Id: string,
    uriAvatar: string | undefined
}[] = [];

export default function AvatarSanPham({sP_Id, width, height, marginBottom}: {sP_Id: string, width: DimensionValue | undefined, height: DimensionValue | undefined, marginBottom: DimensionValue | undefined}) {
    const [uriAvatar, setUriAvatar] = useState<string | undefined>(undefined);

    useEffect(() => {
        layUriAvatar();
    }, [sP_Id]);

    const layUriAvatar = async() => {
        const uriInTemp = temp_AvatarSanPham.find((item) => {
            return item?.sP_Id === sP_Id;
        });

        if (!uriInTemp) {
            const uri = await getUriAvatarSanPham(sP_Id);
            setUriAvatar(uri);
            temp_AvatarSanPham.push({
                sP_Id: sP_Id,
                uriAvatar: uri
            })
        }else {
            setUriAvatar(uriInTemp.uriAvatar);
        }
    }

    return (
        <Image source={{ uri: uriAvatar }} style={{borderRadius: 8, width: width, height: height, marginBottom: marginBottom}} />
    )
}