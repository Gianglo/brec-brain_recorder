import React, { Component } from "react";
import {Text, TouchableOpacity, View, Image} from "react-native";
import { Link } from "react-router-native";
import { connect } from "react-redux";
import config from "../redux/config";
import { bindActionCreators } from "redux";
import { setGraphViewDimensions } from "../redux/actions";
import PopUp from "../components/PopUp";
import LinkButton from "../components/LinkButton";
import RecorderButton from "../components/RecorderButton";
import SandboxButton from "../components/SandboxButton";
import { MediaQueryStyleSheet } from "react-native-responsive";
import SandboxGraph from "../components/SandboxGraph";
import ElectrodeSelector from "../components/ElectrodeSelector";
import * as colors from "../styles/colors";
import Database from '../native/Database';




// Sets isVisible prop by comparing state.scene.key (active scene) to the key of the wrapped scene
function mapStateToProps(state) {
    return {
        connectionStatus: state.connectionStatus,
        dimensions: state.graphViewDimensions,
        notchFrequency: state.notchFrequency
    };
}

// Binds actions to component's props
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setGraphViewDimensions
        },
        dispatch
    );
}

class Sandbox extends Component {
    constructor(props) {
        super(props);

        // Initialize States
        this.state = {
            graphType: config.graphType.EEG,
            channelOfInterest: 1,
            isRecording: false,
            filterType: config.filterType.LOWPASS
        };
    }

    renderInfoView() {
        let text = "";
        switch (this.state.graphType) {
            case config.graphType.EEG:
                return (
                    <Text style={styles.body}>
                        EEG a canale singolo grezzo (non elaborato), dati non trattati da un elettrodo.
                        Usa l'icona in alto a destra per cambiare elettrodo.

                    </Text>
                );

            case config.graphType.FILTER:
                switch (this.state.filterType) {
                    case config.filterType.LOWPASS:
                        text = "< 35hz low-pass";
                        break;
                    case config.filterType.HIGHPASS:
                        text = "> 2hz high-pass";
                        break;
                    case config.filterType.BANDPASS:
                        text = "2-35hz band-pass";
                        break;
                }
                return (
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterText}>
                            {text}
                        </Text>
                        <View style={styles.filterButtonContainer}>
                            <SandboxButton
                                onPress={() =>
                                    this.setState({
                                        filterType: config.filterType.LOWPASS,
                                        isRecording: false
                                    })}
                                active={this.state.filterType === config.filterType.LOWPASS}
                            >
                                LOW
                            </SandboxButton>
                            <SandboxButton
                                onPress={() =>
                                    this.setState({
                                        filterType: config.filterType.HIGHPASS,
                                        isRecording: false
                                    })}
                                active={this.state.filterType === config.filterType.HIGHPASS}
                            >
                                HIGH
                            </SandboxButton>
                            <SandboxButton
                                onPress={() =>
                                    this.setState({
                                        filterType: config.filterType.BANDPASS,
                                        isRecording: false
                                    })}
                                active={this.state.filterType === config.filterType.BANDPASS}
                            >
                                BAND
                            </SandboxButton>
                        </View>
                    </View>
                );

            case config.graphType.WAVES:
                return (
                    <Text style={styles.body}>
                        La curva PSD rappresenta la forza delle diverse frequenze nell'EEG
                    </Text>
                );
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.topBar}>

                    <View style={styles.buttonContainer}>
                        <SandboxButton
                            onPress={() =>
                                this.setState({
                                    graphType: config.graphType.EEG,
                                    isRecording: false
                                })}
                            active={this.state.graphType === config.graphType.EEG}
                        >
                            GREZZO
                        </SandboxButton>
                        <SandboxButton
                            onPress={() =>
                                this.setState({
                                    graphType: config.graphType.FILTER,
                                    isRecording: false
                                })}
                            active={this.state.graphType === config.graphType.FILTER}
                        >
                            FILTRATO
                        </SandboxButton>
                        <SandboxButton
                            onPress={() =>
                                this.setState({
                                    graphType: config.graphType.WAVES,
                                    isRecording: false
                                })}
                            active={this.state.graphType === config.graphType.WAVES}
                        >
                            PSD
                        </SandboxButton>
                    </View>

                    <ElectrodeSelector
                        style={styles.electrodeSelector}
                        channelOfInterest={channel =>
                            this.setState({ channelOfInterest: channel })}
                    />
                </View>


                <View
                    style={styles.graphContainer}
                    onLayout={event => {
                        // Captures the width and height of the graphContainer to determine overlay positioning properties in PSDGraph
                        let { x, y, width, height } = event.nativeEvent.layout;
                        this.props.setGraphViewDimensions({
                            x: x,
                            y: y,
                            width: width,
                            height: height
                        });
                    }}
                >
                    <SandboxGraph
                        style={styles.graphView}
                        channelOfInterest={this.state.channelOfInterest}
                        graphType={this.state.graphType}
                        dimensions={this.props.dimensions}
                        isRecording={this.state.isRecording}
                        filterType={this.state.filterType}
                        notchFrequency={this.props.notchFrequency}
                    />
                </View>


                <View style={styles.lowerBar}>


                    <View style={styles.textContainer}>
                        {this.renderInfoView()}
                    </View>

                    <View>

                        <Link
                            to="/subjectInfoForm"
                            component={TouchableOpacity}
                        >
                            <View>
                                <Image source={require('../assets/user.png')} style={{width: 50, height: 50}} resizeMode='contain'/>
                            </View>
                        </Link>

                    </View>
                </View>


                <View style={styles.recorderButtonContainer}>
                    <RecorderButton
                        isRecording={this.state.isRecording}
                        onPress={() => {
			                if(!this.state.isRecording){
			                    var type = this.state.graphType;
			                    if(this.state.graphType === config.graphType.FILTER) type += " " + this.state.filterType;
                                Database.saveRecording(type);
                            }
                            this.setState({ isRecording: !this.state.isRecording });
                        }}
                    />
                </View>

                <PopUp
                    onClose={() => this.props.history.push("/connectorOne")}
                    visible={
                        this.props.connectionStatus === config.connectionStatus.DISCONNECTED
                    }
                    title="Muse Disconnesso"
                >
                    Riconnetti per continuare
                </PopUp>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sandbox);

const styles = MediaQueryStyleSheet.create(
    // Base styles
    {
        container: {
            backgroundColor: colors.white,
            flex: 1,
            justifyContent: "space-around",
            alignItems: "stretch"
        },

        graphContainer: {
            flex: 5,
            justifyContent: "center",
            alignItems: "stretch"
        },

        graphView: { flex: 1 },

        electrodeSelector: {
            alignSelf: "center"
        },

        currentTitle: {
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
            fontSize: 13,
            fontFamily: "Roboto-Medium",
            color: colors.teal
        },

        buttonContainer: {
            paddingTop: 10,
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between"
        },

        body: {
            padding: 5,
            fontFamily: "Roboto-Light",
            color: colors.black,
            fontSize: 13
        },

        filterContainer: {
            flex: 1,
            alignItems: "center"
        },

        filterButtonContainer: {
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between"
        },

        filterText: {
            fontFamily: "Roboto-Light",
            color: colors.black,
            fontSize: 16
        },


        topBar: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: 10
        },

        lowerBar: {
            flex: 1,
            margin: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },

        textContainer: {
            justifyContent: "center",
            flex: 2
        },

        recorderButtonContainer:  {
            flex: 1,
            flexDirection: "column",
            alignItems: "center"
        }
    },
    // Responsive styles
    {
        "@media (min-device-height: 700)": {
            currentTitle: {
                fontSize: 20
            },

            body: {
                fontSize: 25
            }
        }
    }
);
