import React, { Component } from "react";
import { View, AppRegistry, StatusBar } from "react-native";
import {
  NativeRouter,
  BackButton,
  Route,
  Switch
} from "react-router-native";
import { setMenu } from "./src/redux/actions";
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware, bindActionCreators } from "redux";
import { withRouter } from "react-router";
import Drawer from "react-native-drawer";
import thunk from "redux-thunk";
import { initNativeEventListeners } from "./src/redux/actions";
import * as colors from "./src/styles/colors.js";

// Scenes
import Landing from "./src/scenes/begin-landing";
import ConnectorOne from "./src/scenes/connector-01";
import ConnectorTwo from "./src/scenes/connector-02";
import ConnectorThree from "./src/scenes/connector-03";
import Sandbox from "./src/scenes/sandbox";
import SubjectInfoForm from "./src/scenes/subject-info-form";


// reducer is a function
import reducer from "./src/redux/reducer";

function mapStateToProps(state) {
  return {
    open: state.isMenuOpen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onClose: () => setMenu(false)
    },
    dispatch
  );
}

// Connect SideMenu to Redux
const DrawerWithRedux = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Drawer)
);

// Create store
const store = createStore(reducer, applyMiddleware(thunk));

const mainViewStyle = { flex: 1 };

class BREC extends Component {

  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
            <BackButton>
                <Switch>
                  <Route exact path="/" component={Landing} />
                  <Route path="/connectorOne" component={ConnectorOne} />
                  <Route path="/connectorTwo" component={ConnectorTwo} />
                  <Route path="/connectorThree" component={ConnectorThree} />
                  <Route path="/sandbox" component={Sandbox} />
                  <Route path="/subjectInfoForm" component={SubjectInfoForm} />
                </Switch>
            </BackButton>
        </NativeRouter>
      </Provider>
    );
  }
}

// Defines which component is the root for the whole project
AppRegistry.registerComponent("BREC", () => BREC);
