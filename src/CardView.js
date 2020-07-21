import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

import defaultIcons from "./Icons";
import FlipCard from "react-native-flip-card";
import cardBackground from "../images/card-background-pier.png";

const BASE_SIZE = { width: 327, height: 192 };

const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {},
  content: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginHorizontal: 32,
    marginVertical: 24,
  },
  icon: {
    width: 60,
    height: 40,
    resizeMode: "contain",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginLeft: BASE_SIZE.width - 60,
  },
  nameExpireContainer: {
    marginVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cvcContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 88,
    marginHorizontal: 56,
  },
  baseText: {
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "transparent",
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  focused: {
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
  },
  font14: {
    fontSize: 14,
  },
  font16: {
    fontSize: 16,
  },
  font18: {
    fontSize: 18,
  },
});

/* eslint react/prop-types: 0  https://github.com/yannickcr/eslint-plugin-react/issues/106 */
export default class CardView extends Component {
  static propTypes = {
    focused: PropTypes.string,

    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,

    scale: PropTypes.number,
    fontFamily: PropTypes.string,
    imageFront: PropTypes.number,
    imageBack: PropTypes.number,
    customIcons: PropTypes.object,
  };

  static defaultProps = {
    name: "",
    placeholder: {
      number: "• • • •\t • • • •\t • • • •\t • • • •",
      name: "Nome no cartão",
      expiry: "Mês/Ano",
      cvc: "• • •",
      cvcAmex: "• • • •",
    },

    scale: 1,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    imageFront: cardBackground,
    imageBack: cardBackground,
  };

  render() {
    const {
      focused,
      brand,
      name,
      number,
      expiry,
      cvc,
      customIcons,
      placeholder,
      imageFront,
      imageBack,
      scale,
      fontFamily,
    } = this.props;

    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === "american-express";
    const shouldFlip = focused === "cvc";

    const containerSize = { ...BASE_SIZE, height: BASE_SIZE.height * scale };
    const transform = {
      transform: [
        { scale },
        { translateY: (BASE_SIZE.height * (scale - 1)) / 2 },
      ],
    };

    return (
      <View style={[s.cardContainer, containerSize]}>
        <FlipCard
          style={{ borderWidth: 0 }}
          flipHorizontal
          flipVertical={false}
          friction={10}
          perspective={2000}
          clickable={false}
          flip={shouldFlip}
        >
          <ImageBackground
            style={[BASE_SIZE, s.cardFace, transform]}
            source={imageFront}
          >
            <View style={s.content}>
              <View style={s.iconContainer}>
                <Image style={[s.icon]} source={Icons[brand]} />
              </View>
              <View style={{ marginTop: 24 }}>
                <Text
                  style={[
                    s.baseText,
                    s.font18,
                    { fontFamily },
                    !number && s.placeholder,
                    focused === "number" && s.focused,
                  ]}
                >
                  {!number ? placeholder.number : number}
                </Text>
              </View>
              <View style={s.nameExpireContainer}>
                <Text
                  style={[
                    s.baseText,
                    s.font14,
                    { fontFamily },
                    !name && s.placeholder,
                    focused === "name" && s.focused,
                  ]}
                  numberOfLines={1}
                >
                  {!name ? placeholder.name : name}
                </Text>
                <Text
                  style={[
                    s.baseText,
                    s.font14,
                    { fontFamily },
                    !expiry && s.placeholder,
                    focused === "expiry" && s.focused,
                  ]}
                >
                  {!expiry ? placeholder.expiry : expiry}
                </Text>
              </View>
            </View>
          </ImageBackground>
          <ImageBackground
            style={[BASE_SIZE, s.cardFace, transform]}
            source={imageBack}
          >
            <View style={s.cvcContainer}>
              <Text
                style={[
                  s.font16,
                  s.baseText,
                  !cvc && s.placeholder,
                  focused === "cvc" && s.focused,
                ]}
              >
                {!cvc ? placeholder[isAmex ? "cvcAmex" : "cvc"] : cvc}
              </Text>
            </View>
          </ImageBackground>
        </FlipCard>
      </View>
    );
  }
}
