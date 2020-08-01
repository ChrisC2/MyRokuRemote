import React, {Component} from "react"
import {View, Text, TouchableOpacity, Image} from "@shoutem/ui";
import {StyleSheet, FlatList, Dimensions} from "react-native";
import {launchApp} from "../helpers/api/roku-api";

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: "#323232",
  },
  navigation: {
    color: "#515151"
  }
});

export default class ChannelsScreen extends Component {
  constructor(props) {
    super(props);
  }

  renderTitle() {
    return (
      <View stylesName="h-center fill-parent"
        style={{
          paddingTop: 3,
          borderColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#6b6b6b",
          textAlign: "center",
          alignItems: "center",
          alignSelf: "stretch"
        }}>
          <Text style={{paddingTop: 43, paddingBottom: 10, color: "#fff", letterSpacing: 1}}>Channels</Text>
      </View>
    )
  }

  handleAppClick({ip}, appId) {
    launchApp(ip, appId);
    this.props.navigation.navigate("Remote");
  }
  render() {
    const {navigation: {state: {routeName}}, params: {selectedDevice}, route} = this.props;

    const renderApp = ({item: {image, id, ip}}) => {
      return (
        <TouchableOpacity
          onPress={() => this.handleAppClick(selectedDevice, id)}
        >
          <Image
           style={{
             width: windowWidth / 3,
             flex: 1,
             height: windowWidth / 3,
             resizeMode: "stretch"
           }}
           source={{uri: `data:image/jpeg;base64,${image}`}}
           />
        </TouchableOpacity>
      )
    };

    return (
      <View styleName="fill-parent" style={styles.main}>
         {this.renderTitle()}
         {/* {apps} */}
         <FlatList
          data={selectedDevice.apps}
          renderItem={renderApp}
          numColumns={3}
         />
      </View>
    )
  }
}