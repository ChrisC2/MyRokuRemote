// import React, {Fragment} from 'react'
// import {StyleSheet, ActivityIndicator, NavigatorIOS} from 'react-native';
// import {createBottomTabNavigator, createAppContainer} from "react-navigation";
// import {NavigationBar, DropDownMenu, Title, View} from "@shoutem/ui";

// import {discoverDevices} from "../helpers/api/roku-api";

// import Remote from "./Remote";
// import Channels from "./Channels";

// import AntIcon from "react-native-vector-icons/AntDesign";
// import MaterialIcon from "react-native-vector-icons/MaterialIcons";
// import FontistoIcon from "react-native-vector-icons/Fontisto";

// AntIcon.loadFont();
// MaterialIcon.loadFont();
// FontistoIcon.loadFont();

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: "#323232",
//   },
//   spinner: {
//     flex: 1,
//     alignSelf:'center'
//   },
//   navigation: {
//     color: "#515151",
//   }
// });

// const DEVICES = {
//   "http://192.168.0.107:8060/": "Bedroom Roku",
//   "http://192.168.0.113:8060/": "SHARP ROKU TV"
// };

// const TABS = {
//   REMOTE: "remote",
//   CHANNELS: "channels"
// };

// class Main extends React.Component {
//     constructor(props, context) {
//         super(props, context);
//         this.state = {
//             isLoading: true,
//             device: null,
//             rokus: [],
//             selectedDevice: null
//         };
//     }

//   async componentDidMount() {
//     const res = await discoverDevices();
//     console.log("THIS IS RES", res)
//     const rokus = res.map((ip => ({deviceName: DEVICES[ip] || ip, ip})))
  
//     this.setState({
//       isLoading: false,
//       selectedDevice: rokus[0],
//       rokus,
//     })
//   }

//     renderSpinner() {
//       const {isLoading} = this.state;
//       if (!isLoading) return null;
//       return (
//         <ActivityIndicator style={styles.spinner} size="large" color="#7F31BA" />
//       )
//     }

//     renderDeviceDropdown() {
//       const {rokus, selectedDevice} = this.state;
//       console.log("ROKUS", rokus)
//       if(!rokus.length) return null;

//       return (
//         <DropDownMenu
//           styleName="horizontal"
//           options={rokus}
//           onOptionSelected={(device) => this.setState({ selectedDevice: device })}
//           selectedOption={selectedDevice ? selectedDevice : rokus[0]}
//           titleProperty="deviceName"
//           valueProperty="roku.ip"
//           />
//       )
//   }

//   renderRemoteView() {

//     return (
//       <View styleName="fill-parent">
//         <Remote selectedDevice={this.state.selectedDevice}/>
//       </View>
//     )
//   }



//   renderTabBars() {
//     const {selectedTab} = this.state;
//     return (
//       <TabBarIOS>
//         <MaterialIcon.TabBarItemIOS
//           iconName={"remote"}
//           iconSize={20}
//           style={{color: "#fff"}}
//           onPress={() => this.setSelectedTab(TABS.REMOTE)}
//           title={"My Roku Remote"}
//           selected={selectedTab === TABS.REMOTE}
//           >
//           {this.renderRemoteView()}
//         </MaterialIcon.TabBarItemIOS>
//         <FontistoIcon.TabBarItemIOS
//           iconName={'nav-icon-grid'}
//           iconSize={20}
//           style={{color: "#fff"}}
//           onPress={() => this.setSelectedTab(TABS.CHANNELS)}
//           title={"Channels"}
//           selected={selectedTab === TABS.CHANNELS}
//         >
//           {this.renderChannelsNavigator()}
//         </FontistoIcon.TabBarItemIOS>
//       </TabBarIOS>
//     )
//   }

//     render(){
//       const {rokus, selectedDevice, selectedTab} = this.state;
//       console.log(rokus)
    
//       return (
//         <Fragment>
//           <View styleName="fill-parent">
//             <NavigationBar
//               styleName="inline"
//               style={styles.navigation}
//               centerComponent={<Title styleName="h-center" style={{color: "black"}}>My Roku Remote</Title>}
//             />
//             {this.renderSpinner()}
//             {this.renderDeviceDropdown()}
            
//           </View>
//         </Fragment>
//         )
//     }
// }

// const getTabBarIcon = (navigation, tintColor) => {
//   const {routeName} = navigation.state;
//   let IconComponent = MaterialIcon;
//   let iconName;
//   if(routeName === TABS.REMOTE) {
//     iconName = "remote";
//   } else if(routeName === TABS.CHANNELS) {
//     iconName = "nav-icon-grid";
//     IconComponent = FontistoIcon;
//   }
//   return <IconComponent name={iconName} size={25} color={tintColor} />;
// }

// export default createAppContainer(
//   createBottomTabNavigator({
//     Remote,
//     Channels
//   }, {
//     defaultNavigationOptions: ({navigation}) => ({
//       tabBarIcon: ({tintColor}) =>
//         getTabBarIcon(navigation, tintColor),
//     }),
//     tabBarOptions: {
//       activeTintColor: "#fff",
//       inactiveTintColor: "#515151"
//     }
//   })
// )