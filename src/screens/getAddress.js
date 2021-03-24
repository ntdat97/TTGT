import Geolocation from '@react-native-community/geolocation';
const getAddress = async (latitude, longitude) => {
    const url = `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=3p72K3LG-cdOIEpRrs_O05dsDoINjcQeMS0ze2QMfmU&mode=retrieveAddresses&prox=${latitude},${longitude}`

    const res = await fetch(url)
    const resJson = await res.json()
    let address

    if (resJson
        && resJson.Response
        && resJson.Response.View
        && resJson.Response.View[0]
        && resJson.Response.View[0].Result
        && resJson.Response.View[0].Result[0]) {

        var Street, Subdistrict, District, City, County = ''
        resJson.Response.View[0].Result[0].Location.Address.Street ? Street = resJson.Response.View[0].Result[0].Location.Address.Street + ' - ' : Street = ''
        resJson.Response.View[0].Result[0].Location.Address.Subdistrict ? Subdistrict = resJson.Response.View[0].Result[0].Location.Address.Subdistrict + ' - ' : Subdistrict = ''
        resJson.Response.View[0].Result[0].Location.Address.District ? District = resJson.Response.View[0].Result[0].Location.Address.District + ' - ' : District = ''
        resJson.Response.View[0].Result[0].Location.Address.County ? County = ' Thành phố ' + resJson.Response.View[0].Result[0].Location.Address.County : County = ''
        resJson.Response.View[0].Result[0].Location.Address.City ?
            resJson.Response.View[0].Result[0].Location.Address.City.localeCompare(resJson.Response.View[0].Result[0].Location.Address.County) ?
                City = resJson.Response.View[0].Result[0].Location.Address.City + ' - '
                : City = ''
            : City = ''
        address = Street + Subdistrict + District + City + County

    }
    return address
}
const getTime = async () => {
    const url = `http://api.timezonedb.com/v2.1/list-time-zone?key=Q5I3LSU5PR0O&format=json&country=CI&fields=timestamp`
    const res = await fetch(url)
    const resJson = await res.json()
    let time
    if(resJson && resJson.zones){
        time = resJson.zones
    }
    return time
}

var getPosition = function (options) {
    return new Promise(function (resolve, reject) {
        Geolocation.getCurrentPosition(resolve, reject, options);
    });
}
const  getAdressByPos = async () => {
    const position = await getPosition()
    
    var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)
            var lat = parseFloat(position.coords.latitude)
            const add = await getAddress(lat,long)

            return add
}
const  getDefaultPosition = async () => {
    const position = await getPosition()

    var lat = parseFloat(position.coords.latitude)
            var long = parseFloat(position.coords.longitude)
            var lat = parseFloat(position.coords.latitude)
            var initialRegion = {
                latitude: lat,
                longitude: long,
            }
           return initialRegion
}
export {getAddress,getAdressByPos,getDefaultPosition,getTime}