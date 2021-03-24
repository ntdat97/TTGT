import React from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import GetIcon from './GetIcon'
function Card({ item, onPress }) {
    var t = new Date(item.submitTime * 1000)
    const min = t.getMinutes() < 9 ? '0' + t.getMinutes() : t.getMinutes()
    var formatted = 'Lúc ' + t.getHours() + ':' + min + ' ngày ' + ('0' + t.getDate()).slice(-2)
        + '/' + ('0' + (t.getMonth() + 1)).slice(-2)
        + '/' + (t.getFullYear())
    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={styles.cardContainer}
                onPress={onPress}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
            >
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{ flex: 7, alignItems: 'flex-start', height: 70, alignItems: 'center' }}>
                        <GetIcon id={item.check} custom={{ width: 40 }} />
                    </View>
                    <View style={{ flex: 33 }}>
                        <Text style={{ fontSize: 17, marginBottom: 5 }} numberOfLines={1}>{item.title}</Text>
                        <Text style={{ fontSize: 12 }}>{formatted}</Text>
                        <View style={{ alignItems: 'flex-end', justifyContent: 'center', marginTop: 15, paddingRight: 15 }}>
                            <Text style={{ fontSize: 13, color: 'blue', }}>{item.status}</Text>
                        </View>

                    </View>
                </View>
            </TouchableHighlight>
        </View>
    )
}
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 2,
        margin: 5,
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 1.5,
        height: 100

    }
});
export default Card