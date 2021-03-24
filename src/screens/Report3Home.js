import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, Text, View, KeyboardAvoidingView, Dimensions, TextInput, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import { getAdressByPos, getDefaultPosition } from './getAddress'
import NextArrowButton from '../component/NextArrowButton'
import { updateContent, setFinalPosition, updateTitle } from '../actions/report';
function Report3Home({ navigation, finalPosition, content, updateContent, setFinalPosition, markerState, updateTitle, title }) {
    const [checkText, setCheckText] = useState('red')
    const [checkTitle, setCheckTitle] = useState('red')
    const [position, setPosition] = useState(null)
    const [contentSize, setcontentSize] = useState(0)
    const onBlurFun = () => {
        content ? setCheckText('blue') : setCheckText('red')
    }
    const onBlurFunTitle = () => {
        title ? setCheckTitle('blue') : setCheckTitle('red')
    }
    const getAdressByPosFun = async () => {
        const add = await getAdressByPos()
        const defaultPos = await getDefaultPosition()
        const markerSeleted = { latlng: { latitude: defaultPos.latitude, longitude: defaultPos.longitude }, Address: add }
        Object.keys(markerState).length === 0 ? setFinalPosition(markerSeleted) : null
        setPosition(add)
    }
    const onChangeText = (e) => {
        updateContent(e)
    }
    const changeTitle = (e) => {
        updateTitle(e)
    }
    useEffect(() => {
        let mounted = true
        content ? setCheckText('blue') : null
        title ? setCheckTitle('blue') : null
        mounted && getAdressByPosFun()
        return () => mounted = false
    }, [])
    const next = content && title ? false : true
    const windowHeight = Dimensions.get('window').height;
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: '#fff', }}
        >
            <View style={styles.contaner}>
                <View style={[styles.wrapStep, { height: windowHeight * 0.08 }]}>
                    <Text style={styles.textStep}>Bước 3: Điền thông tin phản ánh</Text>
                </View>
                <View style={styles.wrapMain}>
                    <Text style={styles.textMain}>Vui lòng điền các thông tin cần phản ánh và chọn vị trí trên bản đồ.</Text>
                </View>
                <View style={{ paddingBottom: 10 }}>

                </View>
                <View style={{ maxHeight: windowHeight * 0.8 }}>
                    <Text style={styles.textContent}>Tựa đề (*)</Text>
                    <ScrollView style={{ borderColor: 'blue', marginLeft: 10, borderColor: checkTitle, borderBottomWidth: 2, marginBottom: 10 }}>
                        <TextInput
                            style={[styles.content, { fontSize: 17, height: windowHeight * 0.06, }]}
                            onChangeText={(e) => changeTitle(e)}
                            onFocus={() => setCheckTitle('blue')}
                            onBlur={() => onBlurFunTitle()}
                            defaultValue={title ? title : ''}
                        />
                    </ScrollView>
                    <Text style={styles.textContent}>Nội dung (*)</Text>
                    <ScrollView style={{ maxHeight: windowHeight * 0.32, marginBottom: 10, borderColor: checkText, borderBottomWidth: 2, marginLeft: 10 }}

                        keyboardShouldPersistTaps='never'
                    >
                        <TextInput
                            onChangeText={(e) => onChangeText(e)}
                            style={[styles.content, { height: Math.max(60, contentSize), fontSize: 17, minHeight: windowHeight * 0.08 }]}
                            onFocus={() => setCheckText('blue')}
                            onBlur={() => onBlurFun()}
                            multiline={true}
                            onContentSizeChange={(e) => setcontentSize(e.nativeEvent.contentSize.height)}
                            defaultValue={content ? content : ''}
                        />
                    </ScrollView>
                    <Text style={styles.textContent}>Chọn vị trí, mặc định là vị trí hiện tại (*)</Text>
                    <ScrollView style={{ borderColor: 'blue', marginLeft: 10, borderColor: 'blue', borderBottomWidth: 2 }}>
                        <TextInput
                            style={[styles.content, { fontSize: 17, height: windowHeight * 0.08, }]}
                            multiline={true}
                            editable={false}
                            defaultValue={finalPosition ? finalPosition.Address : position}
                        />
                    </ScrollView>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Report3")}
                        style={styles.selectMap}
                    >
                        <Icon name="map-search" size={24} />
                        <Text style={{ fontSize: 24, marginLeft: 10 }}>Chọn vị trí trên bản đồ</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', bottom: 15, position: 'absolute', paddingHorizontal: 10 }}>
                <NextArrowButton
                    iconName='arrow-left-bold'
                    custom={styles.nextBtLeft}
                    onPress={() => navigation.navigate('Report2')}
                />
                <NextArrowButton
                    disabled={next}
                    iconName='arrow-right-bold'
                    custom={{ opacity: next ? 0.2 : 1 }}
                    onPress={() => navigation.navigate("Report4")}
                />
            </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    contaner: {

    },
    wrapStep: {
        justifyContent: 'center',
        alignItems: 'center',


    },
    textStep: {
        fontSize: 20,
        color: 'rgb(51, 153, 255)'
    },
    wrapMain: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textMain: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 20
    },
    textContent: {
        fontSize: 17,
        marginLeft: 10
    },
    nextBtLeft: {
        alignItems: 'flex-start'
    },
    selectMap: {
        borderColor: 'grey',
        marginHorizontal: 30,
        marginTop: 20,
        borderRadius: 8,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    content: {
        flex: 1, paddingBottom: 10
    }
})
const mapStateToProps = (state) => {
    return {
        markerState: state.reportReducer.marker,
        finalPosition: state.reportReducer.finalPosition,
        content: state.reportReducer.content,
        title: state.reportReducer.title
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateContent: (content) => dispatch(updateContent(content)),
        setFinalPosition: (finalPosition) => dispatch(setFinalPosition(finalPosition)),
        updateTitle: (title) => dispatch(updateTitle(title))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Report3Home)