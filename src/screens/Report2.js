import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CheckBox } from 'react-native-elements'
import { connect } from 'react-redux'
import { updateType } from '../actions/report';
import NextArrowButton from '../component/NextArrowButton'
function Report2({ navigation, updateType, check }) {
    const windowHeight = Dimensions.get('window').height;
    const windowHeightText = windowHeight * 0.6
    const checked = (id) => {
        updateType(id)
    }
    return (
        <View style={styles.contaner}>
            <View style={styles.wrapStep}>
                <Text style={styles.textStep}>Bước 2: Chọn loại phản ánh</Text>
            </View>
            <View style={styles.wrapMain}>
                <Text style={styles.textMain}>Vui lòng chọn loại phản ảnh.</Text>
                <Text style={styles.textMain}>Nếu không chắc, bạn có thể chọn [Khác]</Text>
            </View>
            <View style={{ flexDirection: 'row', height: windowHeightText, paddingTop: 30 }}>
                <View style={{ flex: 3, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9 }}>

                    <Icon name="dots-horizontal" size={40} color="white" style={{ backgroundColor: '#bdbdbd', borderRadius: 20 }} />
                    <Icon name="bridge" size={40} color='white' style={{ backgroundColor: '#2436ff', borderRadius: 20 }} />
                    <Icon name="road-variant" size={40} color='white' style={{ backgroundColor: 'red', borderRadius: 20 }} />
                    <Icon name="lightbulb-outline" size={40} color='white' style={{ backgroundColor: 'yellow', borderRadius: 20 }} />
                    <Icon name="tree" size={40} color='white' style={{ backgroundColor: 'green', borderRadius: 20 }} />
                    <Icon name="pipe-leak" size={40} color='white' style={{ backgroundColor: '#917a70', borderRadius: 20 }} />
                    <Icon name="anchor" size={40} color='white' style={{ backgroundColor: '#0c0a8a', borderRadius: 40 }} />
                </View>
                <View style={{ flex: 17, justifyContent: 'space-between' }}>
                    <CheckBox
                        title="Khác"
                        checked={check == 1 ? true : false}
                        iconRight={true}
                        checkedIcon={<Icon name="check" size={24} />}
                        right={true}
                        textStyle={styles.textCheck}
                        containerStyle={styles.containerCheck}
                        uncheckedIcon={<Icon name="check" size={24} style={{ opacity: 0 }} />}
                        onPress={() => checked(1)}
                    />
                    <CheckBox
                        title="Cầu"
                        checked={check == 2 ? true : false}
                        iconRight={true}
                        checkedIcon={<Icon name="check" size={24} />}
                        right={true}
                        textStyle={styles.textCheck}
                        containerStyle={styles.containerCheck}
                        uncheckedIcon={<Icon name="check" size={24} style={{ opacity: 0 }} />}
                        onPress={() => checked(2)}
                    />
                    <CheckBox
                        title="Đường bộ"
                        checked={check == 3 ? true : false}
                        iconRight={true}
                        checkedIcon={<Icon name="check" size={24} />}
                        right={true}
                        textStyle={styles.textCheck}
                        containerStyle={styles.containerCheck}
                        uncheckedIcon={<Icon name="check" size={24} style={{ opacity: 0 }} />}
                        onPress={() => checked(3)}
                    />
                    <CheckBox
                        title="Chiếu sáng"
                        checked={check == 4 ? true : false}
                        iconRight={true}
                        checkedIcon={<Icon name="check" size={24} />}
                        right={true}
                        textStyle={styles.textCheck}
                        containerStyle={styles.containerCheck}
                        uncheckedIcon={<Icon name="check" size={24} style={{ opacity: 0 }} />}
                        onPress={() => checked(4)}
                    />
                    <CheckBox
                        title="Cây xanh"
                        checked={check == 5 ? true : false}
                        iconRight={true}
                        checkedIcon={<Icon name="check" size={24} />}
                        right={true}
                        textStyle={styles.textCheck}
                        containerStyle={styles.containerCheck}
                        uncheckedIcon={<Icon name="check" size={24} style={{ opacity: 0 }} />}
                        onPress={() => checked(5)}
                    />
                    <CheckBox
                        title="Thoát nước"
                        checked={check == 6 ? true : false}
                        iconRight={true}
                        checkedIcon={<Icon name="check" size={24} />}
                        right={true}
                        textStyle={styles.textCheck}
                        containerStyle={styles.containerCheck}
                        uncheckedIcon={<Icon name="check" size={24} style={{ opacity: 0 }} />}
                        onPress={() => checked(6)}
                    />
                    <CheckBox
                        title="Đường thủy"
                        checked={check == 7 ? true : false}
                        iconRight={true}
                        checkedIcon={<Icon name="check" size={24} />}
                        right={true}
                        textStyle={styles.textCheck}
                        containerStyle={styles.containerCheck}
                        uncheckedIcon={<Icon name="check" size={24} style={{ opacity: 0 }} />}
                        onPress={() => checked(7)}
                    />
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', position: 'absolute', bottom: 15 }}>
                <NextArrowButton
                    iconName='arrow-left-bold'
                    custom={styles.nextBtLeft}
                    onPress={() => navigation.navigate('Report')}
                />
                <NextArrowButton
                    iconName='arrow-right-bold'
                    custom={styles.nextBtRight}
                    onPress={() => navigation.navigate("Report3Home")}
                />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    contaner: {
        backgroundColor: '#fff',
        flex: 1
    },
    wrapStep: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 10 + "%"
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
    },
    textCheck: {
        left: -15,
        position: 'absolute',
        justifyContent: 'center',
        color: 'blue'
    },
    containerCheck: {
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderWidth: 0,
        left: 0
    },
    nextBtRight: {
        marginTop: 20,
        marginRight: 20
    },
    nextBtLeft: {
        marginTop: 20,
        marginLeft: 20,
        alignItems: 'flex-start'
    }
});
const mapStateToProps = (state) => {
    return {
        check: state.reportReducer.check
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateType: (check) => dispatch(updateType(check)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Report2)