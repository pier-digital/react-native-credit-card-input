import valid from "card-validator";
import { removeNonNumber, removeLeadingSpaces } from "./Utilities";
import pick from "lodash.pick";

valid.creditCardType.removeCard(valid.creditCardType.types.MAESTRO);
valid.creditCardType.removeCard(valid.creditCardType.types.JCB);
valid.creditCardType.removeCard(valid.creditCardType.types.UNIONPAY);
valid.creditCardType.removeCard(valid.creditCardType.types.MIR);
valid.creditCardType.removeCard(valid.creditCardType.types.DISCOVER);
valid.creditCardType.addCard({
  niceType: "Elo",
  type: "elo",
  prefixPattern: /^(40117[8-9]|43(1274|8935)|45(1416|7393|763[1-2])|504175|506(699|7[0-6]\d|77[0-8])|509\d{3}|627780|636297|636368|65003([1-3]|[5-9])|6500(4\d|5[0-1])|6504(8[5-9]|9\d)|6505([0-2]\d|3[0-8]|[4-8]\d|9[0-8])|6507(0\d|1[0-8]|2[0-7])|6509(01|1\d|20)|6516(5[2-9]|[6-7]\d)|6550([0-1]\d|2[1-9]|[3-4]\d|5[0-8]))\d?/,
  exactPattern: /^(40117[8-9]|43(1274|8935)|45(1416|7393|763[1-2])|504175|506(699|7[0-6]\d|77[0-8])|509\d{3}|627780|636297|636368|65003([1-3]|[5-9])|6500(4\d|5[0-1])|6504(8[5-9]|9\d)|6505([0-2]\d|3[0-8]|[4-8]\d|9[0-8])|6507(0\d|1[0-8]|2[0-7])|6509(01|1\d|20)|6516(5[2-9]|[6-7]\d)|6550([0-1]\d|2[1-9]|[3-4]\d|5[0-8]))\d?/,
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: "CVV",
    size: 3,
  },
});
valid.creditCardType.changeOrder("elo", 0);

const limitLength = (string = "", maxLength) => string.substr(0, maxLength);
const addGaps = (string = "", gaps) => {
  const offsets = [0].concat(gaps).concat([string.length]);

  return offsets.map((end, index) => {
    if (index === 0) return "";
    const start = offsets[index - 1];
    return string.substr(start, end - start);
  }).filter(part => part !== "").join(" ");
};

const FALLBACK_CARD = { gaps: [4, 8, 12], lengths: [16], code: { size: 3 } };
export default class CCFieldFormatter {
  constructor(displayedFields) {
    this._displayedFields = [...displayedFields, "type"];
  }

  formatValues = (values) => {
    const card = valid.number(values.number).card || FALLBACK_CARD;

    return pick({
      type: card.type,
      number: this._formatNumber(values.number, card),
      expiry: this._formatExpiry(values.expiry),
      cvc: this._formatCVC(values.cvc, card),
      name: removeLeadingSpaces(values.name),
      postalCode: removeNonNumber(values.postalCode),
    }, this._displayedFields);
  };

  _formatNumber = (number, card) => {
    const numberSanitized = removeNonNumber(number);
    const maxLength = card.lengths[card.lengths.length - 1];
    const lengthSanitized = limitLength(numberSanitized, maxLength);
    const formatted = addGaps(lengthSanitized, card.gaps);
    return formatted;
  };

  _formatExpiry = (expiry) => {
    const sanitized = limitLength(removeNonNumber(expiry), 4);
    if (sanitized.match(/^[2-9]$/)) { return `0${sanitized}`; }
    if (sanitized.length > 2) { return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`; }
    return sanitized;
  };

  _formatCVC = (cvc, card) => {
    const maxCVCLength = card.code.size;
    return limitLength(removeNonNumber(cvc), maxCVCLength);
  };
}
