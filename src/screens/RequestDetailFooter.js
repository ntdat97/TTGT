import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet, NativeModules, Text, View,
    TextInput, Dimensions, Image, TouchableOpacity
} from 'react-native';
import { getSubmitTime, updateUserInfo, setResponsePic, setResponseContent, setSegmentData, addNewSegment, removeSegment, setSegment, setLengthStatusBeforeEdit } from '../actions/report'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { LoadingScreenModal } from './LoadingScreen'
var ImagePicker = NativeModules.ImageCropPicker;
const { height, width } = Dimensions.get('window');
function RequestDetailFooter({ adminAccount, setResponsePic, thisState, removeSegment, setSegmentData, addNewSegment, id, setSegment, setLengthStatusBeforeEdit }) {
    const [selectedIndices, setSelectedIndices] = useState([0]);
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [step, setStep] = useState(['*', 0, 0, 0, 0])
    const status = ['Hệ thống đã nhận', 'Đã duyệt', 'Đang xử lý', 'Đã nhận kết quả xử lý', 'Đã đóng']
    const sub = async () => {
        firestore()
            .collection('ReportResponse').where("idReport", "==", id)
            .get()
            .then(function (querySnapshot) {
                const array = []
                querySnapshot.forEach(async (doc) => {
                    await firestore()
                        .collection('ReportResponse').doc(doc.id).collection('status').get().then(documentT => {
                            documentT.forEach((doc1) => {
                                array.push(doc1.data())
                            })
                        })
                    setSegment(array)
                    setLengthStatusBeforeEdit(array.length)
                    setLoading(true)
                    switch (array.length - 1) {
                        case 0:
                            setSelectedIndex(array.length - 1)
                            setSelectedIndices([0])
                            return setStep(['*', 0, 0, 0, 0])
                        case 1:
                            setSelectedIndex(array.length - 1)
                            setSelectedIndices([0, 1])
                            return setStep([0, '*', 0, 0, 0])
                        case 2:
                            setSelectedIndex(array.length - 1)
                            setSelectedIndices([0, 1, 2])
                            return setStep([0, 0, '*', 0, 0])
                        case 3:
                            setSelectedIndex(array.length - 1)
                            setSelectedIndices([0, 1, 2, 3])
                            return setStep([0, 0, 0, '*', 0])
                        case 4:
                            setSelectedIndex(array.length - 1)
                            setSelectedIndices([0, 1, 2, 3, 4])
                            return setStep([0, 0, 0, 0, '*'])
                        default: return setStep([0, 0, 0, 0, 0])
                    }
                });
                if (querySnapshot.empty) { setLoading(true) }
            }).catch(e => alert(e))

    }
    useEffect(() => {
        sub()
    }, [])
    const onChangeText = (e) => {
        setSegmentData({
            selectedIndex: selectedIndex,
            content: e
        })
    }
    const pushNewSegment = (id) => {
        var submitTimee = new Date().getTime()
        addNewSegment({
            selectedIndex: id,
            status: status[id],
            responseContent: '',
            picListResponse: [],
            addedTime: submitTimee
        })
    }
    const handleCustomIndexSelect = (index) => {
        switch (index) {
            case 0:
                setSelectedIndex(index)
                return setStep(['*', 0, 0, 0, 0])
            case 1:
                setSelectedIndex(index)
                return setStep([0, '*', 0, 0, 0])
            case 2:
                setSelectedIndex(index)
                return setStep([0, 0, '*', 0, 0])
            case 3:
                setSelectedIndex(index)
                return setStep([0, 0, 0, '*', 0])
            case 4:
                setSelectedIndex(index)
                return setStep([0, 0, 0, 0, '*'])
            default: return setStep([0, 0, 0, 0, 0])
        }

    };
    const sta = thisState.status
   
    const lent = sta.length
    const _renderItemRe = ({ item, index }) => {
        const del = () => {
            const updatedItems = thisState.status[selectedIndex].picListResponse.filter((_item, itemIndex) => itemIndex !== index)
            setResponsePic({
                selectedIndex: selectedIndex,
                picListResponse: updatedItems
            })
            carouselRefRe.current.snapToItem(index - 1);
        }
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#cfcfcf',
            }}>

                <Icon name="delete" size={24} style={styles.delIcon} onPress={del} />
                <Image style={{ width: width, height: height / 2.3, resizeMode: 'contain' }} source={{ uri: 'data:image/png;base64,' + item.base64 }} />
            </View>
        )
    }
    const carouselRefRe = useRef(null)
    const pickMultiple = () => {
        let data1 = thisState.status[selectedIndex] ? thisState.status[selectedIndex].picListResponse : []
        let length1 = data1.length
        if (length1 <= 4) {
            ImagePicker.openPicker({
                multiple: true,
                waitAnimationEnd: false,
                includeExif: true,
                forceJpg: true,
                includeBase64: true,
                compressImageQuality: 0.2
            }).then(images => {
                let data = thisState.status[selectedIndex] ? thisState.status[selectedIndex].picListResponse : []
                let temp = Object.assign([], data)
                images.map(i => {
                    let imageTem = { uri: i.path, width: i.width, height: i.height, mime: i.mime, base64: i.data };
                    temp.push(imageTem)
                })
                let length = temp.length
                if (length <= 5) {
                    data = temp
                    setResponsePic({
                        selectedIndex: selectedIndex,
                        picListResponse: data
                    })
                    length = data.length
                    setTimeout(() => {
                        carouselRefRe.current.snapToItem(length - 1, true)
                    }, 50
                    );
                } else {
                    alert("Tối đa 5 ảnh")
                }
            });
        } else {
            alert('Tối đa 5 ảnh')
        }
    }
    const takePic = () => {
        let data1 = thisState.status[selectedIndex] ? thisState.status[selectedIndex].picListResponse : []
        let length1 = data1.length
        if (length1 <= 4) {
            ImagePicker.openCamera({
                cropping: false,
                width: 300,
                height: 400,
                includeBase64: true,
                compressImageQuality: 0.2
            }).then(image => {
                let imageTem = {
                    uri: image.path, width: image.width, height: image.height,
                    mime: image.mime, base64: image.data
                }
                let data = thisState.status[selectedIndex] ? thisState.status[selectedIndex].picListResponse : []
                data.push(imageTem)
                setResponsePic({
                    selectedIndex: selectedIndex,
                    picListResponse: data
                })
                let length = data.length
                setTimeout(() => {
                    carouselRefRe.current.snapToItem(length - 1, true);
                }, 50
                );
            });
        } else {
            alert("Tối đa 5 ảnh")
        }
    }
    const windowHeightText = height * 0.05
    const displayTime = () => {
        var t = new Date(thisState.status[selectedIndex].addedTime)
        const min = t.getMinutes() < 9 ? '0' + t.getMinutes() : t.getMinutes()
        var formatted = 'Lúc ' + t.getHours() + ':' + min + ' ngày ' + ('0' + t.getDate()).slice(-2)
            + '/' + ('0' + (t.getMonth() + 1)).slice(-2)
            + '/' + (t.getFullYear())
        return formatted
    }
    if (!loading) {
        return <LoadingScreenModal />
    }
    return (
        <View>
            <View>
                <View style={{ marginTop: 10 }}>
                    <SegmentedControlTab
                        values={['1', '2', '3', '4', '5']}
                        selectedIndices={selectedIndices}
                        selectedIndex={selectedIndex}
                        badges={step}
                        activeTabBadgeStyle={{}}
                        onTabPress={handleCustomIndexSelect}
                        borderRadius={0}
                        tabsContainerStyle={{ height: 50, backgroundColor: '#F2F2F2' }}
                        activeTabBadgeContainerStyle={{ backgroundColor: 'red' }}
                        multiple
                        tabStyle={{
                            backgroundColor: '#F2F2F2',
                            borderTopColor: 'transparent',
                            borderBottomColor: 'transparent',
                        }}
                        activeTabStyle={{ backgroundColor: 'lightgreen', marginTop: 2 }}
                        tabTextStyle={{ color: '#444444', fontWeight: 'bold' }}
                        activeTabTextStyle={{ color: '#888888' }}
                    />
                </View>
            </View>
            <View>
            </View>
            <View style={{ marginBottom: 20, marginTop: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 17, color: 'blue', paddingVertical: 10 }}>Trạng thái {selectedIndex + 1}: {status[selectedIndex]}</Text>
                {selectedIndex === lent &&
                    <TouchableOpacity style={{ borderColor: 'lightgreen', borderWidth: 1, padding: 5, borderRadius: 5 }}
                        onPress={() => {
                            const data = [...selectedIndices]
                            data.push(lent)
                            setSelectedIndices(data)
                            pushNewSegment(selectedIndex)
                        }}
                    >
                        <Text style={{ paddingVertical: 5 }}> Xác nhận duyệt </Text>
                    </TouchableOpacity>}
                {selectedIndex === lent - 1 && <TouchableOpacity style={{ borderColor: 'lightgreen', borderWidth: 1, padding: 5, borderRadius: 5 }}
                    onPress={() => {
                        const data = [...selectedIndices]
                        data.pop()
                        setSelectedIndices(data)
                        removeSegment(selectedIndex)
                    }}
                >
                    <Text style={{ paddingVertical: 5 }}> Xóa duyệt </Text>
                </TouchableOpacity>}
            </View>
            <View style={{ marginBottom: 10 }}>
                {adminAccount &&
                    <View style={styles.container}>

                        <View
                            style={styles.cardContainer}
                        >
                            <View style={{ flex: 7, alignItems: 'center' }}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={{ uri: 'data:image/png;base64,' + adminAccount.Avatar }} />
                            </View>
                            <View style={{ flex: 33, paddingRight: 10 }}>
                                <Text style={{ fontSize: 17, marginBottom: 5, textAlign: 'justify' }} numberOfLines={5}>{adminAccount.displayName}</Text>
                                <Text>{thisState.status[selectedIndex] ? displayTime() : ''}</Text>
                            </View>
                        </View>
                        <View >
                            <View style={{ marginTop: 5, paddingHorizontal: 10, marginBottom: 30 }}>
                                <TextInput
                                    style={{ borderBottomWidth: 0.5, height: 100, textAlignVertical: "top", justifyContent: 'flex-start' }}
                                    multiline={true}
                                    numberOfLines={7}
                                    placeholder={thisState.status[selectedIndex] ? "Nhập nội dung trả lời" : "Vui lòng nhấn xác nhận duyệt trước khi trả lời"}
                                    onChangeText={(e) => onChangeText(e)}
                                    defaultValue={thisState.status[selectedIndex] ? thisState.status[selectedIndex].responseContent : ''}
                                    editable={thisState.status[selectedIndex] ? true : false}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                                <Carousel
                                    layout={"default"}
                                    ref={carouselRefRe}
                                    data={thisState.status[selectedIndex] ? thisState.status[selectedIndex].picListResponse : []}
                                    sliderWidth={50}
                                    itemWidth={width - 20}
                                    renderItem={_renderItemRe}
                                />
                            </View>
                            <View style={styles.btWrapper}>
                                <TouchableOpacity
                                    onPress={takePic}
                                    style={[styles.takePic, { paddingHorizontal: windowHeightText }]}
                                >
                                    <Text style={{}}>CHỤP HÌNH</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={pickMultiple}
                                    style={[styles.takePic, { paddingHorizontal: windowHeightText }]}
                                >
                                    <Text style={{}}>THƯ VIỆN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </View>
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
    btWrapper: {
        flexDirection: 'row',
        height: 15 + "%",
        width: 100 + "%",
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 20
    },
    takePic: {

        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgreen'
    },
    delIcon: {
        position: 'absolute',
        zIndex: 9999,
        right: 10,
        top: 10,
        color: '#e39696',
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.55,
        shadowRadius: 14.78,

        elevation: 22,
    },
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.reportReducer.userInfo,
        thisState: state.reportReducer,
        adminAccount: state.reportReducer.adminAccount,
        picListResponse: state.reportReducer.picListResponse,
        responseContent: state.reportReducer.responseContent,
        segmentData: state.reportReducer.segmentData
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateUserInfo: (info) => dispatch(updateUserInfo(info)),
        getSubmitTime: (submitTime) => dispatch(getSubmitTime(submitTime)),
        setResponsePic: (picListResponse) => dispatch(setResponsePic(picListResponse)),
        setResponseContent: (responseContent) => dispatch(setResponseContent(responseContent)),
        setSegmentData: (segmentData) => dispatch(setSegmentData(segmentData)),
        addNewSegment: (newItem) => dispatch(addNewSegment(newItem)),
        removeSegment: (index) => dispatch(removeSegment(index)),
        setSegment: (data) => dispatch(setSegment(data)),
        setLengthStatusBeforeEdit: (length) => dispatch(setLengthStatusBeforeEdit(length))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RequestDetailFooter)
