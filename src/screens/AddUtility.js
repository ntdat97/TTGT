import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity , StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { getAddress, getTime } from './getAddress'
import NextArrowButton from '../component/NextArrowButton'
import firestore from '@react-native-firebase/firestore';
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
function AddUtility({ navigation }) {
    const [reload, setReload] = useState(false)
    const [marker, setMarker] = useState(false)
    const [loadingAddress, setLoadingAddress] = useState(true)
    const [loadingAddUtility, setLoadingAddUtility] = useState(false)
    const [traffic, setTraffic] = useState(true)
    const [showList, setShowList] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [wc, setWc] = useState(false)
    const [disableAddButton, setDisableAddButton] = useState(true)
    const [trafficLatlng, setTrafficLatlng] = useState([
        { latitude: 0, longitude: 0 },
    ])
    const [wcLatlng, setWclatlng] = useState([
        { latitude: 0, longitude: 0 },
    ])
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false)
    const mapRef = useRef(null)
    const currentPosition = {
        latitude: 10.0431256,
        longitude: 105.7734232,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    }
    const onMapReady = () => {
        if (!ready) {
            setReady(true)
        }
    }
    const retrieveData = () => {
        firestore()
            .collection('TrafficSign')
            .get()
            .then((querySnapShot) => {
                const trafficArray = []
                querySnapShot.forEach((doc) => {
                    var data = doc.data()
                    var send = { latitude: data.latitude, longitude: data.longitude, addedTime: data.addedTime }
                    trafficArray.push({
                        data: send,
                        key: doc.id
                    })
                });
                setTrafficLatlng(trafficArray)
            })
        firestore()
            .collection('WCSign')
            .get()
            .then((querySnapShot) => {
                const wcArray = []
                querySnapShot.forEach((doc) => {
                    var data = doc.data()
                    var send = { latitude: data.latitude, longitude: data.longitude, addedTime: data.addedTime }
                    wcArray.push({
                        data: send,
                        key: doc.id
                    })
                });
                setWclatlng(wcArray)
                setLoading(true)
            })
    }
    const check = async (e) => {
        setShowAddress(true)
        setLoadingAddress(false)
        const latitude = e.nativeEvent.coordinate.latitude
        const longitude = e.nativeEvent.coordinate.longitude
        const address = await getAddress(latitude, longitude)
        disableAddButton && setDisableAddButton(false)
        const markerSeleted = { latlng: { latitude: latitude, longitude: longitude }, Address: address }
        setMarker(markerSeleted)
        setLoadingAddress(true)
        mapRef.current.animateToRegion({ latitude: 10.0512118, longitude: 105.790558 }, 2000)
    }
    const addUtility = async () => {
        setLoadingAddUtility(true)
        const addedTime = await getTime()
        if (!disableAddButton) {
            traffic ?
                await firestore().collection("TrafficSign").add({
                    addedTime: addedTime[0].timestamp,
                    latitude: marker.latlng.latitude,
                    longitude: marker.latlng.longitude,
                }).then(() => {
                    setLoadingAddUtility(false)
                }) :
                await firestore().collection("WCSign").add({
                    addedTime: addedTime[0].timestamp,
                    latitude: marker.latlng.latitude,
                    longitude: marker.latlng.longitude,
                }).then(() => {
                    setLoadingAddUtility(false)
                })
        }
        setReload(!reload)
    }
    const deleteMarker = ({ key, type }) => {
        firestore()
            .collection(type).doc(key).delete().then(() => {
                setReload(!reload)
            }).catch(() => {
                alert('Lỗi khi xóa')
            })
    }
    useEffect(() => {
        retrieveData()
    }, [reload])
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
                    onPress={(e) => check(e)}
                    showsMyLocationButton={true}
                >
                    {(loading && showList) &&
                        trafficLatlng.map((item, i) => {
                            const latlng = { latitude: item.data.latitude, longitude: item.data.longitude }
                            return (
                                <Marker coordinate={latlng}
                                    key={item.key}
                                    image={require("../../assets/pic/traffic-jam.png")}
                                >
                                    <Callout onPress={() => deleteMarker({ key: item.key, type: 'TrafficSign' })}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                            <TouchableOpacity
                                                style={{ backgroundColor: 'green', zIndex: 999 }}
                                            >
                                                <Text style={{ fontSize: 20, color: 'white', padding: 4 }}>Xóa</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Callout>
                                </Marker>
                            )
                        })
                    }
                    {(loading && showList) &&
                        wcLatlng.map((item, i) => {
                            const latlng = { latitude: item.data.latitude, longitude: item.data.longitude }
                            return (
                                <Marker coordinate={latlng}
                                    key={item.key}
                                    image={require("../../assets/pic/wc.png")}
                                >
                                    <Callout onPress={() => deleteMarker({ key: item.key, type: 'WCSign' })}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

                                            <TouchableOpacity
                                                style={{ backgroundColor: 'green', zIndex: 999 }}
                                            >
                                                <Text style={{ fontSize: 20, color: 'white', padding: 4 }}>Xóa</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Callout>
                                </Marker>
                            )
                        })
                    }
                    {
                        marker && <Marker coordinate={marker.latlng} />
                    }
                </MapView>
                {showAddress &&
                <View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: 10 }}>
                    <View style={styles.addressContainer}>
                        {loadingAddress ?
                            <Icon name="map-search" size={40} color='black' style={{ flex: 1, padding: 10, paddingVertical: 20 }} /> :
                            <View style={{ width: 40, height: 40, flex: 1, padding: 10, paddingVertical: 40 }}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        }
                        {
                            (marker.Address && loadingAddress) && <Text style={styles.addressText}>{marker.Address}</Text>
                        }
                    </View >
                </View>}
                <View style={{ position: 'absolute', paddingHorizontal: 10, right: 0, zIndex: 99, bottom: 60 }}>
                    {loadingAddUtility ? <View style={{ width: 40, height: 40, flex: 1, padding: 30, backgroundColor: 'lightblue', justifyContent: 'center', alignItems: 'center', borderRadius: 40 }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View> :
                        <NextArrowButton
                            disabled={disableAddButton}
                            iconName='plus'
                            custom={{ backgroundColor: 'lightblue', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 40 }}
                            onPress={() => addUtility()}
                        />}
                </View>
                <View style={{ flexDirection: 'column-reverse', flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch', height: 50, borderTopWidth: 0.5 }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue', flex: 1.5 }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Navigate')}
                            >
                                <Icon name='home' size={24} color='white' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', borderRightWidth: 0.5 }}>
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', width: '100%', height: '100%' }}
                                onPress={() => {
                                    setTraffic(true)
                                    setWc(false)
                                }}
                            >
                                <Icon name='minus-circle' size={24} color={traffic ? '#2897e0' : 'black'} />
                                <Text>Kẹt xe</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', borderRightWidth: 0.5 }}>
                            <TouchableOpacity
                                style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '100%', height: '100%' }}
                                onPress={() => {
                                    setTraffic(false)
                                    setWc(true)
                                }}
                            >
                                <Icon name='human-male-female' size={24} color={wc ? '#2897e0' : 'black'} />
                                <Text>Nhà vệ sinh</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', borderRightWidth: 0.5 }}>
                            <TouchableOpacity
                                style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '100%', height: '100%' }}
                                onPress={() => setShowList(!showList)}
                            >
                                <Icon name='format-list-bulleted' size={24} color={showList ? '#2897e0' : 'black'} />
                                <Text>Hiển thị</Text>
                            </TouchableOpacity>
                        </View>
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
});
export default AddUtility