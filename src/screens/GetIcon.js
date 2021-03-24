import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { Component } from 'react'
import {Image} from 'react-native'
import { PropTypes } from 'prop-types'

export default function GetIcon({ id, custom }) {
    switch (id) {
        case 1:
            return (
                <Icon name="dots-horizontal" size={40} color="white" style={[{ backgroundColor: '#bdbdbd', borderRadius: 20 }, custom]} />
            )
        case 2:
            return (
                <Icon name="bridge" size={40} color='white' style={[{ backgroundColor: '#2436ff', borderRadius: 20 }, custom]} />
            )
        case 3:
            return (
                <Icon name="road-variant" size={40} color='white' style={[{ backgroundColor: 'red', borderRadius: 20 }, custom]} />
            )
        case 4:
            return (
                <Icon name="lightbulb-outline" size={40} color='white' style={[{ backgroundColor: 'yellow', borderRadius: 20 }, custom]} />
            )
        case 5:
            return (
                <Icon name="tree" size={40} color='white' style={[{ backgroundColor: 'green', borderRadius: 20 }, custom]} />
            )
        case 6:
            return (
                <Icon name="pipe-leak" size={40} color='white' style={[{ backgroundColor: '#917a70', borderRadius: 20 }, custom]} />
            )
        case 7:
            return (
                <Icon name="anchor" size={40} color='white' style={[{ backgroundColor: '#0c0a8a', borderRadius: 40 }, custom]} />
            )
        case 8:
            return (
                <Image source={require('../../assets/pic/ctu.png')} style={{ width: 40, height: 40 }} />
            )

        default: return (
            <Icon name="loading" size={40} color='white' style={[{ backgroundColor: '#0c0a8a', borderRadius: 40 }, custom]} />
        )
    }
}
GetIcon.propTypes = {
    id: PropTypes.number,
    custom: PropTypes.object,
}