import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Dimensions,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
const { height, width } = Dimensions.get('window');
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
function Map({ navigation }) {
  const [traffic, setTraffic] = useState(false)
  const [wc, setWc] = useState(false)
  const [trafficLatlng, setTrafficLatlng] = useState([
    { latitude: 0, longitude: 0 },
  ])
  const [wcLatlng, setWclatlng] = useState([
    { latitude: 0, longitude: 0 },
  ])
  const [loading, setLoading] = useState(false)
  const currentPosition = {
    latitude: 10.0431256,
    longitude: 105.7734232,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  }
  const [ready, setReady] = useState(false)
  const mapRef = useRef(null)
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
  useEffect(() => {
    retrieveData()
  }, [])
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
        >
          {(loading && traffic) &&
            trafficLatlng.map((item, i) => {
              const latlng = { latitude: item.data.latitude, longitude: item.data.longitude }
              return (
                <Marker coordinate={latlng} key={item.key}
                  image={require("../../assets/pic/traffic-jam.png")} />
              )
            })
          }
          {(loading && wc) &&
            wcLatlng.map((item, i) => {
              const latlng = { latitude: item.data.latitude, longitude: item.data.longitude }
              return (
                <Marker coordinate={latlng} 
                key={item.key}
                image={require("../../assets/pic/wc.png")}
                />
              )
            })
          }
        </MapView>
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
                onPress={() => setTraffic(!traffic)}
              >
                <Icon name='minus-circle' size={24} color={traffic ? '#2897e0' : 'black'} />
                <Text>Kẹt xe</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 4, justifyContent: 'center', borderRightWidth: 0.5 }}>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '100%', height: '100%' }}
                onPress={() => setWc(!wc)}
              >
                <Icon name='human-male-female' size={24} color={wc ? '#2897e0' : 'black'} />
                <Text>Nhà vệ sinh</Text>
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
  }
});

export default Map