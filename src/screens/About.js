import React from 'react'
import { View, Text } from 'react-native'
function About() {
    return (
        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center', padding: 10 }}>
            <Text style={{ textAlign: 'justify', fontSize: 24, paddingVertical: 10 }}>Đồ án môn Niên Luận CNTT. Do thầy Trần Công Án hướng dẫn</Text>
            <Text style={{ textAlign: 'justify', fontSize: 24, paddingVertical: 10 }}>Chủ đề: Ứng dụng Phản Ánh Tình Trạng Giao Thông TP. Cần Thơ</Text>
            <Text style={{ textAlign: 'justify', fontSize: 24, paddingVertical: 10 }}>Người thực hiện: </Text>
            <Text style={{ textAlign: 'justify', fontSize: 24, paddingVertical: 10 }}>- Nguyễn Tấn Đạt, MSSV: C1800005</Text>
            <Text style={{ textAlign: 'justify', fontSize: 24, paddingVertical: 10 }}>- Trần Phước Hậu, MSSV: C1800007</Text>
        </View>
    )
}

export default About
