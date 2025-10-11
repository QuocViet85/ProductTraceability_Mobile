import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { LIMIT_LO_SANPHAM } from "../constant/Limit";
import Header from "../helpers/ViewHelpers/header";
import LoSanPham from "../model/LoSanPham";
import { url } from "../server/backend";
import LoSanPhamRender from "./loSanPhamRender";
import Footer from "../helpers/ViewHelpers/footer";
import Loading from "../helpers/ViewHelpers/loading";
import { paginate } from "../helpers/LogicHelper/helper";
import ThemLoSanPham from "./thaoTacTheoAuth/themLoSanPham";
import BlurLine from "../helpers/ViewHelpers/blurLine";
import { PADDING_DEFAULT } from "../constant/Style";

export const temp_ListLoSanPhams : LoSanPham[] = [];

export default function DanhSachLoSanPham() {
    const params = useLocalSearchParams();
    const sP_Id: string = params.sP_Id as string;
    const sP_Ten: string = params.sP_Ten as string;
    const sP_DN_SoHuu_Id: string = params.sP_DN_SoHuu_Id as string;

    const [listLoSanPhams, setListLoSanPhams] = useState<LoSanPham[]>([]);
    const [tongSoLoSanPham, setTongSoLoSanPham] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [reRender, setReRender] = useState<number>(0);

    const tongSoTrang : number = Math.ceil(tongSoLoSanPham / LIMIT_LO_SANPHAM);

    useEffect(() => {
        layListLoSanPhams();
    }, [pageNumber]);

    const layListLoSanPhams = async() => {
        setLoading(true);

        const listLoSanPhamsTrongTemp = temp_ListLoSanPhams.filter((item) => {
            return item.lsP_SP_Id === sP_Id;
        });

        const listLoSanPhamsTrongTempCanLay = paginate(listLoSanPhamsTrongTemp, pageNumber, LIMIT_LO_SANPHAM) as LoSanPham[];

        const newListLoSanPhams = [];

        if (listLoSanPhamsTrongTempCanLay.length < 1) {
            const urlLoSanPham = url(`api/losanpham/san-pham/${sP_Id}?pageNumber=${pageNumber}&limit=${LIMIT_LO_SANPHAM}`);

            try {
                const res = await axios.get(urlLoSanPham);
                if (res.data.tongSo) {
                    setTongSoLoSanPham(res.data.tongSo);
                }   

                if (res.data.listLoSanPhams) {
                    const listLoSanPhamsTuBackEnd : LoSanPham[] = res.data.listLoSanPhams;

                    if (pageNumber > 1) {
                        newListLoSanPhams.push(...listLoSanPhams, ...listLoSanPhamsTuBackEnd);
                    }else {
                        newListLoSanPhams.push(...listLoSanPhamsTuBackEnd);
                    }
                    setListLoSanPhams(newListLoSanPhams);
                    temp_ListLoSanPhams.push(...listLoSanPhamsTuBackEnd);

                    listLoSanPhamsTuBackEnd[0].temp_TongSoVoiSanPham = res.data.tongSo ? res.data.tongSo : 0;
                }
            }catch {}
        }else {
            if (pageNumber > 1) {
                newListLoSanPhams.push(...listLoSanPhams, ...listLoSanPhamsTrongTempCanLay);
            }else {
                newListLoSanPhams.push(...listLoSanPhamsTrongTempCanLay);
            }
            setListLoSanPhams(newListLoSanPhams);
            setTongSoLoSanPham(temp_ListLoSanPhams[0].temp_TongSoVoiSanPham);
        }
        setLoading(false);
    }

    const handleLoadMore = () => {
      if (pageNumber < tongSoTrang) {
        setPageNumber(pageNumber + 1);
      }
    };

    const layListLoSanPhamsTuDau = async() => {
        temp_ListLoSanPhams.forEach((item: LoSanPham, key: number) => {
            if (item.lsP_SP_Id === sP_Id) {
                temp_ListLoSanPhams[key] = new LoSanPham();
            }
        })
        if (pageNumber !== 1) {
            setPageNumber(1)
        }else {
            layListLoSanPhams();
        }
    }

    
    return (
        <View style={styles.container}>
            <Header title={'Lô sản phẩm'} fontSize={20} resource={sP_Ten}/>
            <View style={{flex: 1, padding: PADDING_DEFAULT}}>
                <View style={{marginTop: 10}}>
                    <ThemLoSanPham sanPhamId={sP_Id} doanhNghiepSoHuuId={sP_DN_SoHuu_Id} listLoSanPhamsHienThi={listLoSanPhams} setTongSo={setTongSoLoSanPham} setReRender={setReRender} width={250} height={30} paddingVertical={5} fontSize={12}/>
                </View>
                <BlurLine />
                <FlatList
                    data={listLoSanPhams}
                    keyExtractor={(item: LoSanPham, index) => `${item.lsP_Id}-${index}`}
                    renderItem={({item}: {item: LoSanPham}) => {
                        return (
                            <LoSanPhamRender loSanPham={item} listLoSanPhamsHienThi={listLoSanPhams} setTongSo={setTongSoLoSanPham} pageNumber={pageNumber} sP_DN_SoHuu_Id={sP_DN_SoHuu_Id} setReRenderLoSanPham={setReRender}/>
                        )
                    }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0}
                    refreshControl={(
                                    <RefreshControl  
                                    refreshing={false}
                                    onRefresh={layListLoSanPhamsTuDau} //hành vi khi refresh
                                    progressViewOffset={30}/> //kéo mũi tên xuống bao nhiêu thì refresh
                                    )}
                    />
                {loading ? (<Loading />) : (<View></View>)}
            </View>
            
            <Footer backgroundColor={'black'} height={'6%'}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,                     // cho phép chiếm toàn màn hình
        flexDirection: 'column',     // mặc định
        justifyContent: 'flex-start',// bắt đầu từ trên xuống
        backgroundColor: '#fff',
        height: '100%'
  },
})