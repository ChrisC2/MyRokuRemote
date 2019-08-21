import React, {Fragment} from 'react'
import {createBottomTabNavigator, createAppContainer} from "react-navigation";


import Remote from "./components/Remote";
import Channels from "./components/Channels";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FontistoIcon from "react-native-vector-icons/Fontisto";

MaterialIcon.loadFont();
FontistoIcon.loadFont();

const TABS = {
  REMOTE: "Remote",
  CHANNELS: "Channels"
};

const getTabBarIcon = (navigation, tintColor) => {
  const {routeName} = navigation.state;

  let IconComponent = MaterialIcon;
  let iconName;

  if(routeName === TABS.REMOTE) {
    iconName = "settings-remote";
  } else if(routeName === TABS.CHANNELS) {
    iconName = "nav-icon-grid";
    IconComponent = FontistoIcon;
  }
  return <IconComponent name={iconName} size={20} color={tintColor} />;
}

export default createAppContainer(
  createBottomTabNavigator({
    Remote,
    Channels
  }, {
    initialRouteName: "Remote",
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) =>
        getTabBarIcon(navigation, tintColor),
    }),
    tabBarOptions: {
      activeTintColor: "#fff",
      inactiveTintColor: "#939393",
      labelStyle: {
        bottom: 0
      },
      style: {
        backgroundColor: "#323232",
        borderTopColor: "#fff",
        borderWidth: 4
      }
    },
  })
)