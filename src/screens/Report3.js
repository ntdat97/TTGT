import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { connect } from 'react-redux'
import { setFinalPosition, setMarker } from '../actions/report';
import { getAddress, getAdressByPos, getDefaultPosition } from './getAddress'
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
function Report3({ markerState, setMarker, navigation, finalPosition, setFinalPosition }) {
    const [loadingAddress, setLoadingAddress] = useState(true)
    const [position, setPosition] = useState(null)
    const [initAddress, setInitAddress] = useState(null)
    const [currentPosition, setCurrentPosition] = useState({
        latitude: 10.0431256,
        longitude: 105.7734232,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    })
    const [ready, setReady] = useState(false)
    const mapRef = useRef(null)
    const getAdressByPosFun = async () => {
        const add = await getDefaultPosition()
        const Address = await getAdressByPos()
        setPosition(add)
        setInitAddress(Address)
    }
    const getCurrentPosition = async () => {
        const add = await getDefaultPosition()
        const add1 = {
            latitude: add.latitude,
            longitude: add.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }
        setCurrentPosition(add1)
        animateToRegion()
    }
    const animateToRegion = () => {
        if (ready) {
            setTimeout(() => mapRef.current.animateToRegion(currentPosition, 1000), 10)
        }
    }
    useEffect(() => {
        getAdressByPosFun()
        getCurrentPosition()
    }, [])

    const check = async (e) => {
        setLoadingAddress(false)
        const latitude = e.nativeEvent.coordinate.latitude
        const longitude = e.nativeEvent.coordinate.longitude
        const address = await getAddress(latitude, longitude)
        const markerSeleted = { latlng: { latitude: latitude, longitude: longitude }, Address: address }
        setMarker(markerSeleted)
        setLoadingAddress(true)
        mapRef.current.animateToRegion({ latitude: 10.0512118, longitude: 105.790558 }, 2000)
    }

    const onMapReady = () => {
        if (!ready) {
            setReady(true)
        }
    }
    const okBt = () => {
        const selectedWithoutChoosing = { latlng: { latitude: currentPosition.latitude, longitude: currentPosition.latitudeDelta }, Address: initAddress }
        Object.keys(markerState).length === 0 ? setFinalPosition(selectedWithoutChoosing) : setFinalPosition(markerState)
        navigation.navigate('Report3Home')
    }
    return (
        <View>
            <View style={[styles.container], { height: '100%', width: '100%' }}>
                <MapView
                    showsUserLocation
                    ref={mapRef}
                    onMapReady={onMapReady}
                    style={styles.map}
                    onPress={(e) => check(e)}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={currentPosition}
                    showsMyLocationButton={true}
                >{
                        markerState.latlng ?
                            <Marker coordinate={markerState.latlng} /> :
                            position &&
                            <Marker coordinate={position} />
                    }
                </MapView>
                <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: 10 }}>
                    <View style={styles.addressContainer}>
                        {loadingAddress ?
                            <Icon name="map-search" size={40} color='black' style={{ flex: 1, padding: 10, paddingVertical: 20 }} /> :
                            <View style={{ width: 40, height: 40, flex: 1, padding: 10, paddingVertical: 40 }}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>}
                        {markerState.Address ?
                            <Text style={styles.addressText}>{markerState.Address}</Text> :
                            initAddress && <Text style={styles.addressText}>{initAddress}</Text>
                        }

                    </View >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Report3Home')}
                            style={[styles.bottomBt, { width: width * 0.45 }]}
                        >
                            <Text style={styles.bottomBtText}>Quay Lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={okBt}
                            style={[styles.bottomBt, { width: width * 0.45, backgroundColor: 'green' }]}
                        >
                            <Text style={styles.bottomBtText}>Đồng Ý</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    addressContainer: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    addressText: {
        flex: 8,
        justifyContent: 'center',
        fontSize: 16
    },
    bottomBt: {
        backgroundColor: 'grey',
        padding: 5,
        alignItems: 'center'
    },
    bottomBtText: {
        color: 'white',
        fontSize: 19
    }
});
const mapStateToProps = (state) => {
    return {
        markerState: state.reportReducer.marker,
        finalPosition: state.reportReducer.finalPosition
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setMarker: (marker) => dispatch(setMarker(marker)),
        setFinalPosition: (finalPosition) => dispatch(setFinalPosition(finalPosition))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Report3)