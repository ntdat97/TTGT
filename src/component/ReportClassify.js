import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
export default class ReportClassify extends Component {
    render() {
        const {onChangeText,onpress,reff,onblur,custom} = this.props
        return (
            <View style={styles.wrapper}>
                <TextInput
                    style={[styles.textInput,custom]}
                    onChangeText={onChangeText}
                    ref={reff}
                    onBlur={onblur}
                />
            </View>
        )
    }
}
InputField.propTypes= {
    onChangeText:  PropTypes.func,
    onpress:  PropTypes.func,
    reff: PropTypes.func,
    onblur: PropTypes.func,
    custom: PropTypes.object,
}
const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',

    },
    textInput: {
        flex: 1,
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 10
    }
})