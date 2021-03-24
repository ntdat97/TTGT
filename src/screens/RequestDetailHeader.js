import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet, Text, View, Dimensions, Image, TouchableOpacity
} from 'react-native';
import { getSubmitTime, updateUserInfo, setResponsePic, setResponseContent } from '../actions/report'
import GetIcon from './GetIcon'
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { LoadingScreen } from './LoadingScreen'
const { height, width } = Dimensions.get('window');
function RequestDetailHeader({ id, navigation, status }) {
    const [reportData, setReportData] = useState()
    const [loading, setLoading] = useState(false)
    const key = id
    const sub = async () => {
        firestore()
            .collection('ReportDetail').doc(key)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data()
                    setReportData(data)
                    setLoading(true)
                }
            })
    }
    useEffect(() => {
        sub()
    }, [])
    const _renderItem = ({ item, index }) => {
        const windowHeight = height / 2.3
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#cfcfcf',
            }}>
                <Image style={{ width: width, height: windowHeight, resizeMode: 'contain' }} source={{ uri: 'data:image/png;base64,' + item.base64 }} />
            </View>
        )
    }
    const carouselRef = useRef(null)
    const MainConent = ({ item, admin }) => {
        var t = new Date(item.submitTime * 1000)
        var formatted = 'Lúc ' + t.getHours() + ':' + t.getMinutes() + ' ngày ' + ('0' + t.getDate()).slice(-2)
            + '/' + ('0' + (t.getMonth() + 1)).slice(-2)
            + '/' + (t.getFullYear())
        const displayName = () => {
            if (admin)
                return formatted
            else
                return item.userInfo.name + ' | ' + formatted
        }
        return (
            <View style={styles.container}>
                <View
                    style={styles.cardContainer}
                >
                    <View style={{ flex: 7, alignItems: 'center' }}>
                        <GetIcon id={item.check} custom={{ width: 40 }} />
                    </View>
                    <View style={{ flex: 33, paddingRight: 10 }}>
                        <Text style={{ fontSize: 17, marginBottom: 5, textAlign: 'justify' }} numberOfLines={5}>{item.title}</Text>
                        <Text style={{ fontSize: 12 }}>{displayName()}</Text>
                    </View>
                </View>
                <View >
                    {item.picList &&
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                            <Carousel
                                layout={"default"}
                                ref={carouselRef}
                                data={item.picList}
                                sliderWidth={50}
                                itemWidth={width - 20}
                                renderItem={_renderItem}

                            />
                        </View>}
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text>
                            {item.content}
                        </Text>
                        <Text>
                           Số điện thoại:  {item.userInfo.phone}
                        </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', justifyContent: 'center', marginTop: 15, paddingRight: 15, paddingBottom: 10 }}>
                        {admin ? null : <Text style={{ fontSize: 13, color: 'blue', }}>{status}</Text>}
                    </View>
                </View>
            </View>
        )
    }
    if (!loading) {
        return <LoadingScreen />
    }
    return (

        <View>
            <View style={{ marginTop: 10 }}>
                {reportData &&
                    <MainConent item={reportData} admin={false} />
                }

            </View>
            <View style={styles.mapView}>
                <TouchableOpacity
                    style={{ alignItems: 'center', paddingVertical: 10, }}
                    onPress={() => navigation.navigate("RequestShowMap", { latlng: reportData.finalPosition })}
                >
                    <Text>Hiển thị vị trí</Text>
                </TouchableOpacity>
            </View>
        </View >

    )
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,

        marginHorizontal: 10,
        flex: 1,

        marginBottom: 5,
        backgroundColor: 'white'
    },
    cardContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 0,
    },
    mapView: {
        marginBottom: 10,
        marginTop: 10,
        flex: 1,
        marginHorizontal: 100,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.reportReducer.userInfo,
        adminAccount: state.reportReducer.adminAccount,
        picListResponse: state.reportReducer.picListResponse,
        responseContent: state.reportReducer.responseContent
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateUserInfo: (info) => dispatch(updateUserInfo(info)),
        getSubmitTime: (submitTime) => dispatch(getSubmitTime(submitTime)),
        setResponsePic: (picListResponse) => dispatch(setResponsePic(picListResponse)),
        setResponseContent: (responseContetn) => dispatch(setResponseContent(responseContetn))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RequestDetailHeader)