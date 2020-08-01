import React from 'react';
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";

import RemoteScreen from "./components/Remote";
import ChannelsScreen from "./components/ChannelsScreen";
import LoadingScreen from "./components/Loading";

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

const attachParentParams = (props, Component) => {
  const {state: {params}} = props.navigation.dangerouslyGetParent();
  return <Component {...props} params={params}/>
}

const AppStack = createBottomTabNavigator({
  Remote: props => attachParentParams(props, RemoteScreen),
  Channels: props => attachParentParams(props, ChannelsScreen)
}, {
  initialRouteName: "Remote",
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: ({tintColor}) => getTabBarIcon(navigation, tintColor)
  }),
  tabBarOptions: {
    activeTintColor: "#fff",
    inactiveTintColor: "#939393",
    labelStyle: {
      bottom: 0
    },
    style: {
      backgroundColor: "#323232",
      borderTopColor: "#fff"
    }
  },
})

const LoadingStack = createStackNavigator({Loading: LoadingScreen}, {
  headerMode: "none",
  navigationOptions: {header: null}
});

export default createAppContainer(createSwitchNavigator(
  {
    Discover: LoadingStack,
    App: AppStack
  }, {
    initialRouteName: "Discover"
  }
))