import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { isLogged, setAdminAccount } from '../actions/report';
import { connect } from 'react-redux'
import { firebase } from '../firebase/config'
import firestore from '@react-native-firebase/firestore';
import { LoadingScreenModal } from './LoadingScreen'
function Navigate({ navigation, isLogged, logged, setAdminAccount, adminAccount }) {
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const sub = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firestore().collection('AdminAccount').doc(user.email)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert('user dont exist')
                            return
                        }
                        const data = firestoreDocument.data()
                        setAdminAccount({
                            Avatar: data.Avatar,
                            displayName: data.displayName,
                            gmail: data.gmail
                        })
                        setUser(data.displayName)
                        isLogged(true)
                        setLoading(true)
                    })
                    .catch(error => {
                        alert(error)
                    });

            } else {
                isLogged(false)
                setLoading(true)
            }
        })
        return sub
    }, [])
    if (!loading) {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../../assets/pic/backgroud.jpg')}
                    style={styles.backroudPic}
                />
                <View style={{ flexDirection: 'row',marginTop:50,flexWrap: 'wrap', justifyContent: 'space-around', padding: 10 }}>
                   <LoadingScreenModal />          
                   </View>
            </View>

        )


    }
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/pic/backgroud.jpg')}
                style={styles.backroudPic}
            />
            {logged &&
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, flex: 1, alignItems: 'center', borderWidth: 0.5, borderBottomColor: 'grey', }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={{ uri: 'data:image/png;base64,' + adminAccount.Avatar }} />
                        <Text style={{ paddingLeft: 10, fontSize: 20 }}>{user}</Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                firebase.auth().signOut().then(() => {})

                            }}
                            style={{}}
                        >
                            <Icon name="logout" size={30} />

                        </TouchableOpacity>
                    </View>
                </View>}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 10 }}>

                <TouchableOpacity
                    onPress={() => navigation.navigate('ReportNavigate')}
                    style={[styles.content, { borderColor: '#ff2e1f' }]}
                >
                    <Icon name="alert" size={45} color='#ff2e1f' />
                    <Text>Phản ánh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Map')}
                    style={[styles.content, { borderColor: '#1fff39' }]}
                >
                    <Icon name="map" size={45} color='#1fff39' />
                    <Text>Bản đồ tiện ích</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('About')}
                    style={[styles.content, { borderColor: '#76f5e8' }]}
                >
                    <Icon name="creation" size={45} color='#76f5e8' />
                    <Text>Giới thiệu</Text>
                </TouchableOpacity>

                {logged && (<TouchableOpacity
                    onPress={() => {
                        navigation.navigate("RequestNavigate")

                    }}
                    style={[styles.content, { borderColor: '#004ef5' }]}
                >
                    <Icon name="progress-alert" size={45} color='#004ef5' />
                    <Text>Duyệt phản ánh</Text>
                </TouchableOpacity>)}
                {logged &&
                    (<TouchableOpacity
                        onPress={() => {
                            navigation.navigate("AddUtility")

                        }}
                        style={[styles.content, { borderColor: '#d8fa43' }]}
                    >
                        <Icon name="map-plus" size={45} color='#d8fa43' />
                        <Text>Thêm tiện ích</Text>
                    </TouchableOpacity>)}
                {!logged && loading ?
                    (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={[styles.content, { borderColor: '#004ef5' }]}
                        >
                            <Icon name="login" size={45} color='#004ef5' />
                            <Text>Đăng nhập</Text>
                        </TouchableOpacity>) : null
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 0.5,
        padding: 10,
        width: 120,
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: "red",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 1.5,
    },
    backroudPic: {
        width: 100 + "%",
        height: 35 + "%",
    }
});
const mapStateToProps = (state) => {
    return {
        logged: state.reportReducer.logged,
        adminAccount: state.reportReducer.adminAccount
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        isLogged: (logged) => dispatch(isLogged(logged)),
        setAdminAccount: (adminAccount) => dispatch(setAdminAccount(adminAccount))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navigate)