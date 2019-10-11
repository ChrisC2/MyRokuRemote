import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {NavigationActions} from "react-navigation";
import {KEYS} from "../constants/key-constants";

import {DropDownMenu, Button, View, Icon, Spinner} from "@shoutem/ui";
import {sendClick} from "../helpers/api/roku-api";

import AntIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

AntIcon.loadFont();
FeatherIcon.loadFont();
MaterialIcon.loadFont();

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#323232",
  },
  spinner: {
    flex: 1,
    alignSelf:'center'
  },
  navigation: {
    color: "#515151",
    backgroundColor: "#323232",
    height: 200
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
  smBoxBtn: {
    height: 50,
    width: 50,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  boxBtn: {
    height: 40,
    width: 70,
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
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

export default class RemoteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDevice: null
    }
  }

  componentDidMount() {
    const {params: {selectedDevice}} = this.props;
  
    this.setState({
      selectedDevice,
    });
  }

  renderSpinner() {
    const {isLoading} = this.state;
    if (!isLoading) return null;
    return (
      <Spinner style={styles.spinner} size="large" color="#7F31BA" />
    )
  }

  handleKeyPress = (key) => {
    const {selectedDevice} = this.state;
    console.log("SELECTED : ", selectedDevice)
    if (!selectedDevice) return;
    return sendClick(selectedDevice.ip, key);
  }

  updateSelectedDevice = (selectedDevice) => {
    const {params, navigation} = this.props;
    this.setState({selectedDevice});
    navigation.dispatch(NavigationActions.setParams({params: selectedDevice, key: "Channels" }))
  }

  renderDeviceDropdown() {
    const {selectedDevice} = this.state;
    const {params: {rokuDevices}} = this.props;
    if(!rokuDevices.length) return null;

    return (
      <DropDownMenu
        styleName="horizontal"
        style={{
          horizontalContainer: {
            backgroundColor: "#323232",
            opacity: 100,
            top: -25,
            paddingTop: 60,
            height: 100
          },
          selectedOption: {
            "shoutem.ui.Text": {
              color: "#fff"
            },
            "shoutem.ui.Icon": {
              color: "#fff"
            }
          }
        }}
        options={rokuDevices}
        onOptionSelected={this.updateSelectedDevice}
        selectedOption={selectedDevice}
        titleProperty="deviceName"
        valueProperty="roku.ip"
        />
    )
}

  renderRemote() {
    return (
      <View styleName="vertical v-center" style={styles.main}>
        <View styleName="horizontal h-center" style={{flex: 1/2, alignItems: "flex-start"}}>
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
        <View styleName="horizontal h-center" style={{flex: 1/2, alignContent: "space-between", alignItems: "center", paddingBottom: 40}}>
          <Button
            style={styles.boxBtn}
            styleName="secondary"
            onPress={() => this.handleKeyPress(KEYS.BACK)}>
            <Icon name="back" />
          </Button>
          <TouchableOpacity
              onPress={() => this.handleKeyPress(KEYS.INFO)}
            >
              <View style={styles.boxBtn}>
                <AntIcon
                  color="white"
                  name="infocirlceo"
                  type="clear"
                  size={20}>
                </AntIcon>
              </View>
            </TouchableOpacity>
          <TouchableOpacity
              onPress={() => this.handleKeyPress(KEYS.HOME)}
            >
              <View style={styles.boxBtn}>
                <AntIcon
                  color="white"
                  name="home"
                  type="clear"
                  size={20}>
                </AntIcon>
              </View>
            </TouchableOpacity>
        </View>
        <View style={{flex: 4}}>
          <View styleName="horizontal h-center">
          <Button
              style={styles.button}
              onPress={() => this.handleKeyPress(KEYS.UP)}
            >
            <Icon name="up-arrow" style={{color: "#fff"}} />
            </Button>
          </View>
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
            <View styleName="horizontal h-center">
            <Button
              style={styles.button}
              onPress={() => this.handleKeyPress(KEYS.DOWN)}>
                <Icon name="down-arrow" style={{color: "#fff"}} />
            </Button>
            </View>
            <View styleName="horizontal h-center" style={{flex: .5, alignItems: "flex-end"}}>
            <TouchableOpacity
              onPress={() => this.handleKeyPress(KEYS.REV)}
            >
              <View style={styles.smBoxBtn}>
                <MaterialIcon
                  color="white"
                  name="rewind-outline"
                  type="clear"
                  size={20}>
                </MaterialIcon>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleKeyPress(KEYS.PLAY)}
            >
              <View style={styles.smBoxBtn}>
                <MaterialIcon
                  color="white"
                  name="play-pause"
                  type="clear"
                  size={20}>
                </MaterialIcon>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleKeyPress(KEYS.FWD)}
            >
              <View style={styles.smBoxBtn}>
                <MaterialIcon
                  color="white"
                  name="fast-forward-outline"
                  type="clear"
                  size={20}>
                </MaterialIcon>
              </View>
            </TouchableOpacity>
            </View>
            <View styleName="horizontal h-center" style={{flex: .5, alignItems: "flex-start"}}>
            <TouchableOpacity
              onPress={() => this.handleKeyPress(KEYS.MUTE)}
            >
              <View style={styles.smBoxBtn}>
                <FeatherIcon
                  color="white"
                  name="volume-x"
                  type="clear"
                  size={20}>
                </FeatherIcon>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleKeyPress(KEYS.VOL_DOWN)}
            >
              <View style={styles.smBoxBtn}>
                <FeatherIcon
                  color="white"
                  name="volume-1"
                  type="clear"
                  size={20}>
                </FeatherIcon>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleKeyPress(KEYS.VOL_UP)}
            >
              <View style={styles.smBoxBtn}>
                <FeatherIcon
                  color="white"
                  name="volume-2"
                  type="clear"
                  size={20}>
                </FeatherIcon>
              </View>
            </TouchableOpacity>
            </View>
        </View>
      </View>
    )
  }

  render() {
    if(!this.state.selectedDevice) return null;
    console.log("THIS IS PROPS!", this.props)
    return (
      <View styleName="fill-parent" style={styles.main}>
            {this.renderDeviceDropdown()}
            {this.renderSpinner()}
            {this.renderRemote()}
      </View>
    )
  }
}