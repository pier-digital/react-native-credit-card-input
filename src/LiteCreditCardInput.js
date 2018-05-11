import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
  ViewPropTypes,
} from "react-native";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const INFINITE_WIDTH = 1000;
const COLOR_DARK_SNOW = "#E8E8EE";
const COLOR_GREY = "#A1A1B3";

const s = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLOR_DARK_SNOW,
    borderRadius: 4,
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: "contain",
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: "hidden",
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
  },
  last4: {
    flex: 1,
    justifyContent: "center",
  },
  numberInput: {
    width: INFINITE_WIDTH,
  },
  expiryInput: {
    width: 80,
  },
  cvcInput: {
    width: 80,
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  input: {
    height: 40,
    color: "black",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "Número do cartão",
      expiry: "MM/YY",
      cvc: "CVC",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = field => {
    const {
      inputStyle, validColor, invalidColor, placeholderColor,
      placeholders, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    if (focused === "cvc") return "cvc";
    if (type) return type;
    return "placeholder";
  }

  _maxLength = () => {
    const { focused, values: { type } } = this.props;
    return (type === "american-express") ? 17 : 19;
  }

  render() {
    const { focused, values: { number }, inputStyle, status: { number: numberStatus } } = this.props;
    const showRightPart = focused && focused !== "number";

    return (
      <View style={[s.container, this.props.inputContainerStyle]}>
        <View style={[
          s.leftPart,
          showRightPart ? s.hidden : s.expanded,
        ]}>
          <CCInput {...this._inputProps("number")}
            maxLength={this._maxLength()}
            placeholderColor={COLOR_GREY}
            keyboardType="numeric"
            containerStyle={s.numberInput} />
        </View>
        <TouchableOpacity onPress={showRightPart ? this._focusNumber : this._focusExpiry }>
          <Image style={s.icon} source={Icons[this._iconToShow()]} />
        </TouchableOpacity>
        <View style={[
          s.rightPart,
          showRightPart ? s.expanded : s.hidden,
        ]}>
          <TouchableOpacity onPress={this._focusNumber}
            style={s.last4}>
            <View pointerEvents={"none"}>
              <CCInput
                field="last4"
                placeholderColor={COLOR_GREY}
                keyboardType="numeric"
                value={ numberStatus === "valid" ? number.substr(number.length - 4, 4) : "" }
                inputStyle={[s.input, inputStyle]}
                containerStyle={[s.last4Input]} />
            </View>
          </TouchableOpacity>
          <CCInput {...this._inputProps("expiry")}
            placeholderColor={COLOR_GREY}
            keyboardType="numeric"
            containerStyle={s.expiryInput} />
          <CCInput {...this._inputProps("cvc")}
            placeholderColor={COLOR_GREY}
            keyboardType="numeric"
            containerStyle={s.cvcInput} />
        </View>
      </View>
    );
  }
}
