import React, { useState } from 'react'
import { View, ActivityIndicator, ScrollView, RefreshControl, Dimensions } from 'react-native'
const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
const { height, width } = Dimensions.get('window');
function LoadingScreen() {
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: 'center',
                padding: 10,
                marginTop: height / 2
            }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </ScrollView>
    )
}
function LoadingScreenModal() {
    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10
        }}
        >
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}
export { LoadingScreen, LoadingScreenModal }
