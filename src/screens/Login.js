import React, { useEffect, useState } from 'react';
import { FlatList, TouchableHighlight, TouchableOpacity, StyleSheet, Text, View, Button, Alert, ActivityIndicator, TextInput, Dimensions, KeyboardAvoidingView, Image } from 'react-native';
import { connect } from 'react-redux'
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import auth from "@react-native-firebase/auth"
import { firebase } from '../firebase/config'
import { isLogged } from '../actions/report';
function Login({ navigation, isLogged }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const onLoginPress = () => {
        firebase
            .auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(() => {
                        firebase.auth().onAuthStateChanged((user) => {
                            
                        })
                        isLogged(true)
                        navigation.navigate("Navigate")
                    }).catch(error => {
                        error == "Error: The password is invalid or the user does not have a password." ? Alert.alert("Sai tên email hoặc mật khẩu") : alert(error)
                    })
            })
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always"
                behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
                <Image
                    style={styles.logo}
                    source={require('../../assets/pic/ctu.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text.replace(/\s+$/, ''))}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>

                </View>
            </KeyboardAvoidingView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(242, 242, 242)'
    },
    logo: {
        flex: 1,
        height: "62%",
        width: '60%',
        alignSelf: "center",
        margin: 30
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
});
const mapStateToProps = (state) => {
    return {
        logged: state.reportReducer.logged
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        isLogged: (logged) => dispatch(isLogged(logged))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)