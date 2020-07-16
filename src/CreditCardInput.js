import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  ViewPropTypes,
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const COLOR_WHITE = "#FFF";
const s = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  form: {
    marginTop: 40,
    backgroundColor: COLOR_WHITE,
  },
  inputContainer: {
    marginLeft: 20,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
});

const DEFAULT_WIDTH = Dimensions.get("window").width - 48;
const CVC_INPUT_WIDTH = DEFAULT_WIDTH;
const EXPIRY_INPUT_WIDTH = DEFAULT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 0;
const CARD_NUMBER_INPUT_WIDTH = DEFAULT_WIDTH;
const NAME_INPUT_WIDTH = DEFAULT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 0;
const POSTAL_CODE_INPUT_WIDTH = 120;

/* eslint react/prop-types: 0 // https://github.com/yannickcr/eslint-plugin-react/issues/106 */
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(
      PropTypes.shape(TextInput.propTypes)
    ),
  };

  static defaultProps = {
    cardViewSize: {},
    placeholders: {
      name: "Nome no cartão",
      number: "Número do cartão",
      expiry: "Validade MM/AA",
      cvc: "Código de segurança CVV",
      postalCode: "34567",
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: "black",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = (newProps) => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = (field) => {
    if (!field) return;

    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(
      nodeHandle,
      (e) => {
        throw e;
      },
      (x) => {
        scrollResponder.scrollTo({
          x: Math.max(x - PREVIOUS_FIELD_OFFSET),
          animated: true,
        });
        this.refs[field].focus();
      }
    );
  };

  _inputProps = (field) => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  _maxLength = () => {
    const {
      focused,
      values: { type },
    } = this.props;
    return type === "american-express" ? 17 : 19;
  };
  _maxLengthCVC = () => {
    const {
      focused,
      values: { type },
    } = this.props;
    return type === "american-express" ? 4 : 3;
  };

  render() {
    const {
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: { number, expiry, cvc, name, type },
      focused,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons,
    } = this.props;

    return (
      <View style={s.container}>
        <CreditCard
          focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc}
        />
        <ScrollView
          ref="Form"
          horizontal
          keyboardShouldPersistTaps="always"
          showsHorizontalScrollIndicator={false}
          style={s.form}
        >
          <CCInput
            {...this._inputProps("number")}
            maxLength={this._maxLength()}
            keyboardType="numeric"
            containerStyle={[
              s.inputContainer,
              inputContainerStyle,
              { width: CARD_NUMBER_INPUT_WIDTH },
            ]}
          />
          <CCInput
            {...this._inputProps("expiry")}
            maxLength={5}
            keyboardType="numeric"
            containerStyle={[
              s.inputContainer,
              inputContainerStyle,
              { width: EXPIRY_INPUT_WIDTH },
            ]}
          />
          {requiresCVC && (
            <CCInput
              {...this._inputProps("cvc")}
              maxLength={this._maxLengthCVC()}
              keyboardType="numeric"
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: CVC_INPUT_WIDTH },
              ]}
            />
          )}
          {requiresName && (
            <CCInput
              {...this._inputProps("name")}
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: NAME_INPUT_WIDTH },
              ]}
            />
          )}
          {requiresPostalCode && (
            <CCInput
              {...this._inputProps("postalCode")}
              keyboardType="numeric"
              containerStyle={[
                s.inputContainer,
                inputContainerStyle,
                { width: POSTAL_CODE_INPUT_WIDTH },
              ]}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}
