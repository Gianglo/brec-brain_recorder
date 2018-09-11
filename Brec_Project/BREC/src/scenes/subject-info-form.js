import React, { Component } from "react";
import { Text, View, ImageBackground, TextInput, TouchableOpacity, Alert, BackHandler } from "react-native";
import { connect } from "react-redux";
import { MediaQueryStyleSheet } from "react-native-responsive";
import { bindActionCreators } from "redux";
import { setGraphViewDimensions } from "../redux/actions";
import * as colors from "../styles/colors";
import Database from '../native/Database';
import Button from "../components/Button";
import LinkButton from "../components/LinkButton";
import WhiteButton from "../components/WhiteButton";
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';




function mapStateToProps(state) {
    return {
        connectionStatus: state.connectionStatus
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



class SubjectInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        nameText: '',
        surnameText: '',
        dateText: '',
        dateHolder: null,
        dataSaved: false
    };
  }

    CheckTextInputIsNotEmpty = () => {

        const {nameText} = this.state;
        const {surnameText} = this.state;
        const {dateText} = this.state;

        if (nameText === '' || surnameText === '' || dateText === '') {
            Alert.alert("Attenzione", "Inserisci tutti i valori!");
            return false;
        }else return true;
    };

    renderButton() {
        if (this.state.dataSaved) {

            return (
                <LinkButton path="/sandbox">
                    FATTO
                </LinkButton>
            );
        } else return (
            <WhiteButton onPress={() => null} disabled={true}>
                FATTO
            </WhiteButton>
        );
    }

    DatePickerMainFunctionCall = () => {

        let dateHolder = this.state.dateHolder;

        if(!dateHolder || dateHolder == null){

            dateHolder = new Date();
            this.setState({
                dateHolder: dateHolder
            });
        }

        //To open the dialog
        this.refs.DatePickerDialog.open({

            date: dateHolder,

        });

    };

    onDatePickedFunction = (date) => {
        this.setState({
            dobDate: date,
            dateText: moment(date).format('DD-MMM-YYYY')
        });
    };


    render() {
        return (
            <ImageBackground
                style={styles.container}
                resizeMode="stretch"
            >

                    <Text style={styles.title}>
                        Inserisci dati soggetto
                    </Text>


                    <View style={styles.containerRowInputs}>

                        <View style={styles.containerTextInput}>
                            <Text style={styles.label}>
                                Nome
                            </Text>
                            <TextInput

                                style={styles.textInput}
                                underlineColorAndroid={colors.modalTransparent}
                                selectionColor={colors.white}
                                onChangeText={(nameText) => this.setState({nameText})}
                                value={this.state.nameText}
                            />
                        </View>

                        <View style={styles.containerTextInput}>
                            <Text style={styles.label}>
                                Cognome
                            </Text>
                            <TextInput
                                style={styles.textInput}
                                underlineColorAndroid={colors.modalTransparent}
                                selectionColor={colors.white}
                                onChangeText={(surnameText) => this.setState({surnameText})}
                                value={this.state.surnameText}
                            />
                        </View>


                    </View>

                    <View style={styles.containerRowInputs}>

                        <View style={styles.containerTextInput}>

                            <Text style={styles.label}>
                                Data Nascita
                            </Text>

                            <TouchableOpacity onPress={this.DatePickerMainFunctionCall.bind(this)} >

                                <View style={styles.datePickerBox}>

                                    <Text style={styles.textInput}>{this.state.dateText}</Text>

                                </View>

                            </TouchableOpacity>


                            {/* Place the dialog component at end of your views and assign the references, event handlers to it.*/}
                            <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePickedFunction.bind(this)} />

                        </View>

                    </View>

                <View style={styles.buttonContainer}>

                    <Button
                        onPress={() => {

                            if (this.CheckTextInputIsNotEmpty()) {
                                Database.setSubject(this.state.nameText, this.state.surnameText, this.state.dateText);
                                this.setState({
                                    dataSaved: true
                                });
                            }
                        }}
                    >
                        SALVA DATI
                    </Button>
                    
                    {this.renderButton()}

                </View>
            </ImageBackground>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SubjectInfoForm);

const styles = MediaQueryStyleSheet.create(
    {
        // Base styles
        body: {
            fontFamily: "Roboto-Light",
            fontSize: 17,
            margin: 20,
            color: colors.white,
            textAlign: "center"
        },

        container: {
            flex: 1,
            justifyContent: "center",
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
            fontSize: 35
        },

        titleBox: {
            flex: 3,
            alignItems: "center",
            justifyContent: "center"
        },

        label: {
            fontFamily: "Roboto-Light",
            fontSize: 20,
            margin: 0,
            padding: 0,
            color: colors.white,
            textAlign: "center"
        },

        textInput: {
            textAlign: "center",
            margin: 0,
            padding: 5,
            color: colors.white,
            fontFamily: "Roboto-Black",
            fontSize: 18,
            height: 40,
            width: 140
        },

        containerRowInputs: {
            flex:1,
            flexDirection:'row'
        },

        containerTextInput: {
            alignItems: "center",
            flex:1,
            margin:20
        },

        datePickerBox:{
            margin: 0,
            padding: 5,
            borderColor: colors.modalTransparent,
            borderBottomWidth: 1,
            height: 40,
            width: 140
        }
    },
    // Responsive styles
    {
        "@media (min-device-height: 700)": {
            body: {
                fontSize: 20,
                marginLeft: 50,
                marginRight: 50
            }
        }
    }
);
