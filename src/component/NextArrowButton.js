import React, { Component } from 'react'
import {
    TouchableHighlight,
    StyleSheet,
    View
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PropTypes } from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default class NextArrowButton extends Component {
    render() {
        const { iconName, onPress,custom,disabled } = this.props;
        return (
            <View style={[styles.buttonWrapper,custom]}>
                <TouchableOpacity
                    style={ styles.button}
                    onPress={onPress}
                    disabled={disabled}
                >
                    <Icon
                        name={iconName}
                        color='blue'
                        size={40}
                        styles={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}
NextArrowButton.propTypes = {
    iconName: PropTypes.string,
    onPress: PropTypes.func,
    custom: PropTypes.object,
    disabled: PropTypes.bool
}
const styles = StyleSheet.create({
    buttonWrapper: {
        alignItems: 'flex-end',
        flex:1
    },
    button: {
        alignItems: 'center',
        justifyContent: "center",

    },

    icon: {
        marginRight: -2,
        marginTop: -2,
    }
})
