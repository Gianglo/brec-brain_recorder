import React, { Component } from "react";
import { Text, View, PermissionsAndroid } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import LinkButton from "../components/WhiteLinkButton";
import * as colors from "../styles/colors";
import { setOfflineMode, initNativeEventListeners } from "../redux/actions";

function mapStateToProps(state) {
  return {
    connectionStatus: state.connectionStatus,
    isOfflineMode: state.isOfflineMode
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setOfflineMode,
      initNativeEventListeners
    },
    dispatch
  );
}

class ConnectorOne extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.requestLocationPermission()
    this.props.initNativeEventListeners();
  }

  // Checks if user has enabled coarse location permission neceessary for BLE function
  // If not, displays request popup
  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "EEG 101 needs your permission",
          message: "This app requires coarse location permission in order to discover and connect to the 2016 Muse."
        }
      );
    } catch (err) {
      console.warn(err);
    }
  }

  renderButton() {
      return (
        <LinkButton path="/ConnectorTwo"> FATTO </LinkButton>
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Prima di iniziare</Text>

          <Text style={styles.instructions}>
              Assicurati che:{"\n"}
              Il dispositivo MUSE sia acceso,
              i BLUETOOTH e il GEOLOCALIZZATORE siano attivi su questo dispositivo.
          </Text>
        </View>
        <View style={styles.buttonContainer}>{this.renderButton()}</View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectorOne);

const styles = MediaQueryStyleSheet.create(
  {
    // Base styles
    body: {
      fontFamily: "Roboto-Light",
      fontSize: 15,
      marginLeft: 40,
      marginRight: 40,
      color: colors.white,
      textAlign: "center"
    },

    instructions: {
      fontFamily: "Roboto-Light",
      fontSize: 20,
      margin: 20,
      color: colors.white,
      textAlign: "center"
    },

    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "stretch",
      width: null,
      height: null,
      backgroundColor: colors.teal
    },

    buttonContainer: {
      flex: 1,
      margin: 40,
      justifyContent: "center"
    },

    offlineButtonContainer: {
      flex: 1,
      margin: 10,
      justifyContent: "center",
      alignSelf: "center"
    },

    logo: {
      width: 50,
      height: 50
    },

    title: {
      textAlign: "center",
      margin: 15,
      lineHeight: 50,
      color: colors.white,
      fontFamily: "Roboto-Black",
      fontSize: 48
    },

    titleBox: {
      flex: 3,
      alignItems: "center",
      justifyContent: "center"
    }
  },
  // Responsive styles
  {
    "@media (min-device-height: 700)": {
      body: {
        fontSize: 20,
        marginLeft: 50,
        marginRight: 50
      },

      instructions: {
        fontSize: 30
      }
    }
  }
);
