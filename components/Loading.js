import React, {Component, Fragment} from "react";
import {StyleSheet, ActivityIndicator} from "react-native"
import {Text, NavigationBar, View, TouchableOpacity} from "@shoutem/ui";

import AsyncStorage from '@react-native-community/async-storage';
import {onLoad} from "../helpers/api/roku-api";

import AntIcon from "react-native-vector-icons/AntDesign";

AntIcon.loadFont();

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#323232"
  },
  spinner: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center"
    // position: "absolute"
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center"
  }
})

export default class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devicesFound: false,
      rokuDevices: []
    }
  }

  
  async componentDidMount() {
    try {
      await this.onLoad();
    } catch (e) {
      console.warn("No Devices Found...", e)
    }
  }

  onLoad = async () => {
    this.setState({isLoading: true});
    const {rokuDevices} = await onLoad();
      if (!rokuDevices.length) {
        return this.setState({
          isLoading: false,
          devicesFound: false
        })
      }
      this.setState({isLoading: false});
      this.props.navigation.navigate("App", {rokuDevices, selectedDevice: rokuDevices[0], deviceIndex: 0})
  }

  renderSpinner() {
    const {isLoading} = this.state;
    if (!isLoading) return null;
    return (
      <ActivityIndicator style={styles.spinner} size="large" color="#fff" />
    )
  }

  handleRetry = () => {
    this.onLoad();
  }

  renderRetry() {
    const {devicesFound, isLoading} = this.state;

    return (
      !devicesFound && !isLoading && 
      <Fragment>
        <TouchableOpacity
            onPress={this.handleRetry}
          >
            <View style={styles.centerContent}>
              <AntIcon
                color="white"
                name="sync"
                type="clear"
                size={35}>
              </AntIcon>
              <Text style={{textAlign: "center", color: "#fff", marginTop: 10}}>Scan Network Again</Text>
            </View>
          </TouchableOpacity>
        </Fragment>
    )
  }

  renderTitle() {
    const {rokuDevices} = this.state;
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
           <Text
            style={{
              paddingTop: 43,
              paddingBottom: 10,
              color: "#fff",
              letterSpacing: 1
              }}>
               {rokuDevices.length ? `Connected to ${rokuDevices[0].deviceName}` : "Looking for Roku Devices..."}
            </Text>
          </View>   
    )
  }

  render() {
    return (
      <View style={styles.main}>
        {this.renderTitle()}
        <View styleName="vertical v-center">
          {this.renderSpinner()}
          {this.renderRetry()}
        </View>
      </View>
    )
  }
}
