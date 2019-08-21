import React, {Component, Fragment} from "react";
import {StyleSheet, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {KEYS} from "../constants/key-constants";

import {NavigationBar, DropDownMenu, Title, Button, View, Icon} from "@shoutem/ui";

import {sendClick, discoverDevices} from "../helpers/api/roku-api";

import AntIcon from "react-native-vector-icons/AntDesign";

AntIcon.loadFont();

const DEVICES = {
  "http://192.168.0.107:8060/": "Bedroom Roku",
  "http://192.168.0.113:8060/": "SHARP ROKU TV"
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#323232",
  },
  spinner: {
    flex: 1,
    alignSelf:'center'
  },
  navigation: {
    color: "#515151",
  },
  button: {
    height: 60,
    width: 60,
    borderRadius: 60/2,
    margin: 10,
    color: "#7F31BA",
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 2,
    borderStyle: "solid"

  },
  backBtn: {
    height: 40,
    width: 70,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 15
  },
  powerBtn: {
    height: 40,
    width: 40,
    borderRadius: 40/2,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default class Remote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      device: null,
      rokus: [],
      selectedDevice: null
    }
  }

  async componentDidMount() {
    const res = await discoverDevices();
    console.log("THIS IS RES", res)
    const rokus = res.map((ip => ({deviceName: DEVICES[ip] || ip, ip})))
  
    this.setState({
      isLoading: false,
      selectedDevice: rokus[0],
      rokus,
    })
  }

  renderSpinner() {
    const {isLoading} = this.state;
    if (!isLoading) return null;
    return (
      <ActivityIndicator style={styles.spinner} size="large" color="#7F31BA" />
    )
  }

  handleKeyPress = (key) => {
    const {selectedDevice} = this.props;
    console.log("SELECTED : ", selectedDevice)
    if (!selectedDevice) return;
    return sendClick(selectedDevice.ip, key);
  }

  renderDeviceDropdown() {
    const {rokus, selectedDevice} = this.state;
    console.log("ROKUS", rokus)
    if(!rokus.length) return null;

    return (
      <DropDownMenu
        styleName="horizontal"
        options={rokus}
        onOptionSelected={(device) => this.setState({ selectedDevice: device })}
        selectedOption={selectedDevice ? selectedDevice : rokus[0]}
        titleProperty="deviceName"
        valueProperty="roku.ip"
        />
    )
}

  renderRemote() {
    return (
      <View styleName="vertical v-center" style={styles.main}>
        <View styleName="horizontal v-center" style={{height: 100, width: 175, justifyContent: "space-between", marginTop: 50, marginBottom: 30 }}>
        <Button
          style={styles.backBtn}
          styleName="secondary"
          onPress={() => this.handleKeyPress(KEYS.BACK)}>
          <Icon name="back" />
        </Button>
        <TouchableOpacity
          onPress={() => this.handleKeyPress(KEYS.POWER)}
        >
          <View style={styles.powerBtn}>
            <AntIcon
              color="red"
              name="poweroff"
              type="clear"
              size={15}>
            </AntIcon>
          </View>
        </TouchableOpacity>
        </View>
        <Button
            style={styles.button}
            onPress={() => this.handleKeyPress(KEYS.UP)}
          >
          <Icon name="up-arrow" style={{color: "#fff"}} />
          </Button>
        <View styleName="horizontal h-center">
          <Button
            style={styles.button}
            onPress={() => this.handleKeyPress(KEYS.LEFT)}
          >
          <Icon name="left-arrow" style={{color: "#fff"}} />
          </Button>
          <Button
            style={styles.button}
            styleName="stacked tight"
            onPress={() => this.handleKeyPress(KEYS.SELECT)}>
              <Text style={{color: "#fff", fontWeight: "bold"}}>OK</Text>
          </Button>
          <Button
            style={styles.button}
            onPress={() => this.handleKeyPress(KEYS.RIGHT)}>
              < Icon name="right-arrow" style={{color: "#fff"}} />
          </Button>
          </View>
          <Button
            style={styles.button}
            onPress={() => this.handleKeyPress(KEYS.DOWN)}>
              <Icon name="down-arrow" style={{color: "#fff"}} />
          </Button>
      </View>
    )
  }

  render() {
    if(!this.state.selectedDevice) return null;
    return (
      <View styleName="fill-parent" style={styles.main}>
        <NavigationBar
              styleName="inline"
              style={styles.navigation}
              centerComponent={<Title styleName="h-center" style={{color: "black"}}>My Roku Remote</Title>}
            />
            {this.renderSpinner()}
            {this.renderDeviceDropdown()}
            {this.renderRemote()}
      </View>
    )
  }
}