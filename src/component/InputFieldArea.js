import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
export default class InputFieldArea extends Component {
    render() {
        const {onChangeText,
            onpress,
            reff,
            onblur,
            custom,
            onFocus,
            autoFocus,
            multiline,
            onContentSizeChange,
            value,
            selection,
            editable,
            defaultValue} = this.props
        return (
            <View style={styles.wrapper}>
                <TextInput
                    onFocus={onFocus}
                    value={value}
                    autoFocus={autoFocus}
                    multiline={multiline}
                    editable
                    onContentSizeChange={onContentSizeChange}
                    numberOfLines={4}
                    style={[styles.textInput,custom]}
                    onChangeText={onChangeText}
                    ref={reff}
                    onBlur={onblur}
                    editable={editable}
                    defaultValue={defaultValue}
                />
            </View>
        )
    }
}
InputFieldArea.propTypes= {
    onChangeText:  PropTypes.func,
    onpress:  PropTypes.func,
    reff: PropTypes.func,
    onblur: PropTypes.func,
    custom: PropTypes.object,
    onFocus: PropTypes.func,
    autoFocus: PropTypes.bool,
    multiline: PropTypes.bool,
    editable: PropTypes.bool,
    onContentSizeChange: PropTypes.func,
    value: PropTypes.string,
    selection: PropTypes.object
}
const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
    },
    textInput: {
        flex: 1,
        
        borderBottomWidth: 2,
        borderRadius: 10
    }
})