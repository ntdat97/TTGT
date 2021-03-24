import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, ScrollView, Image } from 'react-native';
import { getSubmitTime, updateUserInfo } from '../actions/report'
import GetIcon from './GetIcon'
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { height, width } = Dimensions.get('window');
function MainConent({ item, admin, status }) {
    const _renderItem = ({ item }) => {
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
    const [index, setIndex] = useState(0)
    var t = new Date(item.submitTime * 1000)
    const min = t.getMinutes() < 9 ? '0' + t.getMinutes() : t.getMinutes()
    var formatted = 'Lúc ' + t.getHours() + ':' + min + ' ngày ' + ('0' + t.getDate()).slice(-2)
        + '/' + ('0' + (t.getMonth() + 1)).slice(-2)
        + '/' + (t.getFullYear())
    const displayName = () => {
        if (admin)
            return formatted
        else
            return item.userInfo.name + ' | ' + formatted
    }
    const pics = item.picList
    const pagination = ({ pics, index }) => {
        return (
            <Pagination
                dotsLength={pics.length}
                activeDotIndex={index}
                containerStyle={{ backgroundColor: 'transparent', paddingVertical: 20, marginTop: -40 }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: 'red'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
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
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                            <Carousel
                                layout={"default"}
                                ref={carouselRef}
                                data={item.picList}
                                sliderWidth={50}
                                itemWidth={width - 20}
                                renderItem={_renderItem}
                                onSnapToItem={(index) => setIndex(index)}
                            />
                        </View>
                        <View>
                            {pagination({ index, pics })}
                        </View>
                    </View>}
                <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                    <Text>
                        {item.content}
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-end', justifyContent: 'center', marginTop: 15, paddingRight: 15, paddingBottom: 10 }}>
                    {admin ? null : <Text style={{ fontSize: 13, color: 'blue', }}>{status}</Text>}
                </View>
            </View>
        </View>
    )
}
function DetailReport({ id, status }) {
    const [reportData, setReportData] = useState()
    const [responseData, setResponseData] = useState()
    const [adminInfo, setAdminInfo] = useState(null)
    const [load, setLoad] = useState(false)
    const [empty, setEmpty] = useState(false)
    const sub = async () => {
        const key = id
        const fire = await firestore()
            .collection('ReportDetail').doc(key)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    const data = documentSnapshot.data()
                    setReportData(data)
                }
            })
        const Response = await firestore()
            .collection('ReportResponse').where("idReport", "==", id)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.empty) {
                    setEmpty(true)
                    return setLoad(true)
                }
                documentSnapshot.forEach(async (doc) => {
                    const array = []
                    const gmail = doc.data().responseGmail
                    firestore().collection('AdminAccount')
                        .doc(gmail)
                        .get()
                        .then(documentSnapshot => {
                            if (documentSnapshot.exists) {
                                const data = documentSnapshot.data()
                                setAdminInfo(data)
                            }
                        })
                    firestore()
                        .collection('ReportResponse').doc(doc.id).collection('status').get().then(documentT => {

                            documentT.forEach((doc1) => {
                                array.push(doc1.data())
                            })
                            const lastElement = array[array.length - 1]
                            setResponseData(lastElement)
                        }).then(() => setLoad(true))
                });
            })
    }
    useEffect(() => {
        sub()
    }, [])
    const _renderItem = ({ item }) => {
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
    const MainConentResponse = ({ item, admin, adminInfo }) => {
        var t = new Date(item.addedTime)

        const min = t.getMinutes() < 9 ? '0' + t.getMinutes() : t.getMinutes()
        var formatted = 'Lúc ' + t.getHours() + ':' + min + ' ngày ' + ('0' + t.getDate()).slice(-2)
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
                        <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={{ uri: 'data:image/png;base64,' + adminInfo.Avatar }} />
                    </View>
                    <View style={{ flex: 33, paddingRight: 10 }}>
                        <Text style={{ fontSize: 17, marginBottom: 5, textAlign: 'justify' }} numberOfLines={5}>{adminInfo.displayName}</Text>
                        <Text style={{ fontSize: 12 }}>{displayName()}</Text>
                    </View>
                </View>
                <View >
                    {item.picListResponse &&
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                                <Carousel
                                    layout={"default"}
                                    ref={carouselRef}
                                    data={item.picListResponse}
                                    sliderWidth={50}
                                    itemWidth={width - 20}
                                    renderItem={_renderItem}

                                />
                            </View>
                        </View>}
                    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                        <Text>
                            {item.responseContent}
                        </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', justifyContent: 'center', marginTop: 15, paddingRight: 15, paddingBottom: 10 }}>
                        {/* {<Text style={{ fontSize: 13, color: 'blue', }}>{item.status}</Text> */}
                    </View>
                </View>
            </View>
        )
    }
    const Response = ({ response }) => {
        return (
            adminInfo && <MainConentResponse item={response} admin={true} adminInfo={adminInfo} />
        )
    }
    if (!load) {
        return <View style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10
        }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'rgb(242, 242, 242)' }}>
            <ScrollView >
                <View style={{ marginTop: 10 }}>
                    {reportData ?
                        <MainConent item={reportData} admin={false} check={reportData.check} status={status} /> :
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            padding: 10
                        }}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    }
                </View>
                <View style={{ marginBottom: 20, marginTop: 40, justifyContent: 'center', alignItems: 'center' }}>
                    {responseData && <Text style={{ fontSize: 17, color: '#2436ff' }}>Phản hồi</Text>}
                </View>
                <View style={{ marginBottom: 10 }}>
                    {responseData ?
                        <Response response={responseData} /> : empty ? null : <View style={{
                            flex: 1,
                            justifyContent: "center",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            padding: 10
                        }}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    }
                </View>
            </ScrollView>
        </View>
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
        backgroundColor: 'white', marginBottom: 5
    },
    cardContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 0,
        marginBottom: 10
    }
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.reportReducer.userInfo,
        thisState: state.reportReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateUserInfo: (info) => dispatch(updateUserInfo(info)),
        getSubmitTime: (submitTime) => dispatch(getSubmitTime(submitTime))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailReport)