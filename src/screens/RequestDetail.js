import React, { useState } from 'react';
import {
    StyleSheet, Text, View,
    Alert, Dimensions, ScrollView,
    BackHandler, TouchableOpacity
} from 'react-native';
import { getSubmitTime, updateUserInfo, setResponsePic, setResponseContent, delSegmentState } from '../actions/report'
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore';
import RequestDetailFooter from './RequestDetailFooter'
import RequestDetailHeader from './RequestDetailHeader'
import { useFocusEffect } from '@react-navigation/native';
import { LoadingScreenModal } from './LoadingScreen'
function RequestDetail({ thisState, navigation, adminAccount, delSegmentState, id, status }) {
    const [loading, setLoading] = useState(true)
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                {
                    Alert.alert(
                        "Bạn có muốn trở lại",
                        "",
                        [
                            {
                                text: "Đồng ý",
                                onPress: () => {
                                    delSegmentState()
                                    navigation.goBack()
                                }
                            },
                            {
                                text: "Hủy bỏ",
                                onPress: () => {
                                }
                            }
                        ]
                    )
                    return true

                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => add()}
                    style={{ padding: 15 }}
                >
                    <Text style={{ fontSize: 17, color: "#3bb2ed" }}>Trả lời</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, thisState]);
    const key = id

    const add = async () => {
        setLoading(false)
        const status = thisState.status

        var batch = firestore().batch()
        const timeS = new Date().getTime()
        await firestore()
            .collection('ReportResponse').where("idReport", "==", key)
            .get()
            .then(function (querySnapshot) {
                var idRe = ''
                querySnapshot.forEach(function (doc) {
                    idRe = doc.id
                });
                var docRef = firestore().collection("ReportResponse").doc(idRe)
                var i

                for (i = 0; i <= thisState.statusLengthBeforeEdit; i++) {
                    var subRef0 = firestore().collection("ReportResponse").doc(docRef.id).collection('status').doc('' + i)
                    batch.delete(subRef0)
                }
                batch.set(docRef, { idReport: key, responseGmail: adminAccount.gmail })
                if (status.length === 0) {
                    return batch.commit().then(() => {
                        delSegmentState()
                        navigation.navigate("TabNavigateResponse")
                        setLoading(true)
                    })
                }
                status.forEach((item, i) => {

                    var subRef = firestore().collection("ReportResponse").doc(docRef.id).collection('status').doc('' + i)
                    batch.set(subRef, { addedTime: item.addedTime, isAccept: true, picListResponse: item.picListResponse, responseContent: item.responseContent, selectedIndex: item.selectedIndex, status: item.status })
                })
                var length = firestore().collection("Report").doc(key)
                batch.update(length, { status: status[status.length - 1].status, statusNumber: status.length })
                if (status.length >= 2) {
                    batch.update(length, { isApproved: true })
                } else {
                    batch.update(length, { isApproved: false })
                }
                batch.commit()
                    .then(() => {
                        delSegmentState()
                        navigation.navigate("TabNavigateResponse")
                        setLoading(true)
                    })
            })
    }
    if (!loading) {
        return <LoadingScreenModal />
    }
    return (

        <View style={{ flex: 1, backgroundColor: 'rgb(242, 242, 242)' }}>
            <ScrollView >
                <RequestDetailHeader id={key} navigation={navigation} status={status} />
                <RequestDetailFooter id={key} />
            </ScrollView>
        </View >
    )
}
const mapStateToProps = (state) => {
    return {
        userInfo: state.reportReducer.userInfo,
        thisState: state.reportReducer,
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
        setResponseContent: (responseContetn) => dispatch(setResponseContent(responseContetn)),
        delSegmentState: () => dispatch(delSegmentState())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RequestDetail)