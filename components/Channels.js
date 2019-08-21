import React, {Component} from "react"
import {View, Text, NavigationBar} from "@shoutem/ui";
import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#323232",
  },
  navigation: {
    color: "#515151"
  }
})

export default class Channels extends Component {

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

  render() {
    const {navigation: {state: {routeName}}} = this.props;
    return (
      <View styleName="fill-parent" style={styles.main}>
         {this.renderTitle()} 
      </View>
    )
  }
}