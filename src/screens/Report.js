import React, { useState, useRef } from 'react';
import {
  StyleSheet, NativeModules,
  Image, Text, View,
  SafeAreaView, TouchableOpacity, Alert,
  BackHandler
} from 'react-native';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import NextArrowButton from '../component/NextArrowButton'
import { del_state, updatePic } from '../actions/report';
import { useFocusEffect } from '@react-navigation/native';
var ImagePicker = NativeModules.ImageCropPicker;
function Report({ pics, updatePic, del_state, navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        {
          Alert.alert(
            "Bạn có muốn trở lại",
            "",
            [
              {
                text: "Đồng ý",
                onPress: () => {
                  del_state()
                  navigation.goBack()
                }
              },
              {
                text: "Hủy bỏ",
                onPress: () => {
                }
              }
            ]
          )
          return true

        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  const pickMultiple = () => {
    let data1 = pics
    let length1 = data1.length
    if (length1 <= 4) {
      ImagePicker.openPicker({
        multiple: true,
        waitAnimationEnd: false,
        includeExif: true,
        forceJpg: true,
        includeBase64: true,
        compressImageQuality: 0.2
      }).then(images => {
        let data = pics
        let temp = Object.assign([], data)
        images.map(i => {
          let imageTem = { uri: i.path, width: i.width, height: i.height, mime: i.mime, base64: i.data };
          temp.push(imageTem)
        })
        let length = temp.length
        if (length <= 5) {
          data = temp
          updatePic(data)
          length = data.length
          setUpdate(length)
          setTimeout(() => {
            carouselRef.current.snapToItem(length - 1, true)
          }, 50
          );
        } else {
          alert("Tối đa 5 ảnh")
        }
      });
    } else {
      alert('Tối đa 5 ảnh')
    }
  }
  const takePic = () => {
    let data1 = pics
    let length1 = data1.length

    if (length1 <= 4) {
      ImagePicker.openCamera({
        cropping: false,
        width: 300,
        height: 400,
        includeBase64: true,
        compressImageQuality: 0.2
      }).then(image => {

        let imageTem = {
          uri: image.path, width: image.width, height: image.height,
          mime: image.mime, base64: image.data
        }
        let data = pics
        data.push(imageTem)
        updatePic(data)
        let length = data.length
        setUpdate(length)
        setTimeout(() => {
          carouselRef.current.snapToItem(length - 1, true);
        }, 50
        );
      });
    } else {
      alert("Tối đa 5 ảnh")
    }
  }
  const _renderItem = ({ item, index }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height / 2.3
    const del = () => {
      const updatedItems = pics.filter((_item, itemIndex) => itemIndex !== index)
      updatePic(updatedItems)
      carouselRef.current.snapToItem(index - 1);
    }
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cfcfcf',
      }}>

        <Icon name="delete" size={24} style={styles.delIcon} onPress={del} />
        <Image style={{ width: windowWidth, height: windowHeight, resizeMode: 'contain' }} source={item} />
      </View>
    )
  }
  const pagination = ({ pics, index }) => {
    return (
      <Pagination
        dotsLength={pics.length}
        activeDotIndex={index}
        containerStyle={{ backgroundColor: 'transparent', paddingVertical: 20, marginTop: -40 }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'red'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  const windowHeight = Dimensions.get('window').height;
  const windowWidthSlider = Dimensions.get('window').width;
  const windowHeightText = windowHeight / 13
  const [index, setIndex] = useState(0)
  const [update, setUpdate] = useState(0)
  const carouselRef = useRef(null)
  return (
    <View style={styles.contaner}>
      <View style={styles.wrapStep}>
        <Text style={styles.textStep}>Bước 1: Chọn hình ảnh liên quan</Text>
      </View>
      <View style={styles.wrapMain}>
        <Text style={styles.textMain}>Vui lòng chọn và gửi hình ảnh liên quan.</Text>
        <Text style={styles.textMain}>Bạn có thể chụp hình trực tiếp từ ứng dụng; chọn hình từ thư viện ảnh; hoặc bỏ qua bước này</Text>
      </View>
      <View style={styles.btWrapper}>
        <TouchableOpacity
          onPress={takePic}
          style={[styles.takePic, { paddingHorizontal: windowHeightText }]}
        >
          <Text style={{ color: 'white' }}>CHỤP HÌNH</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickMultiple}
          style={[styles.takePic, { paddingHorizontal: windowHeightText }]}
        >
          <Text style={{ color: 'white' }}>THƯ VIỆN</Text>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{ flex: 1, }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
          <Carousel
            layout={"default"}
            ref={carouselRef}
            data={pics}
            sliderWidth={50}
            itemWidth={windowWidthSlider}
            renderItem={_renderItem}
            onSnapToItem={(index) => setIndex(index)}
          />
        </View>
        <View>
          {pagination({ index, pics })}
        </View>
      </SafeAreaView>
      <View >
        <NextArrowButton
          iconName='arrow-right-bold'
          custom={styles.nextBtRight}
          onPress={() => {
            navigation.navigate("Report2")
          }}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  contaner: {
    flex: 1
  },
  wrapStep: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 10 + "%"
  },
  wrapMain: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStep: {
    fontSize: 20,
    color: 'rgb(51, 153, 255)'
  },
  textMain: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  btWrapper: {
    flexDirection: 'row',
    height: 15 + "%",
    width: 100 + "%",
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  takePic: {
    backgroundColor: 'green',

    paddingVertical: 8,
    borderRadius: 20
  },
  delIcon: {
    position: 'absolute',
    zIndex: 9999,
    right: 10,
    top: 10,
    color: '#e39696',
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,

    elevation: 22,
  },
  nextBtRight: {
    bottom: 15,
    right: 20,
    position: 'absolute'
  },
});
const mapStateToProps = (state) => {
  return {
    pics: state.reportReducer.picList
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    updatePic: (data) => dispatch(updatePic(data)),
    del_state: () => dispatch(del_state())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Report)