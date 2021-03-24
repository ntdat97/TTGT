import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { getDefaultPosition } from './getAddress'
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
function RequestShowMap({ navigation, route }) {
    const [currentPosition, setCurrentPosition] = useState({
        latitude: 10.0431256,
        longitude: 105.7734232,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    })
    const [ready, setReady] = useState(false)
    const mapRef = useRef(null)
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
        getCurrentPosition()
    }, [])
    const onMapReady = () => {
        if (!ready) {
            setReady(true)
        }
    }
    return (
        <View>
            <View style={[styles.container], { height: '100%', width: '100%' }}>
                <MapView
                    showsUserLocation
                    ref={mapRef}
                    onMapReady={onMapReady}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={currentPosition}
                    showsMyLocationButton={true}
                >{
                        route.params.latlng &&

                        <Marker coordinate={route.params.latlng.latlng} />
                    }
                </MapView>
                <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: 10 }}>
                    <View style={styles.addressContainer}>
                        <Icon name="map-search" size={40} color='black' style={{ flex: 1, padding: 10, paddingVertical: 20 }} />
                        {route.params.latlng.Address &&
                            <Text style={styles.addressText}>{route.params.latlng.Address}</Text>
                        }
                    </View >
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("RequestDetail")}
                            style={[styles.bottomBt, { width: width * 0.45 }]}
                        >
                            <Text style={styles.bottomBtText}>Quay Lại</Text>
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
export default RequestShowMap