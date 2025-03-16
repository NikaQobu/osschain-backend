import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./languages/en.json";
import russian from "./languages/ru.json";
import spain from "./languages/es.json";
import chinese from "./languages/cn.json";
import portuguese from "./languages/pt.json";
import haiti from "./languages/ht.json";
import french from "./languages/fr.json";

const numeral = require("numeral");
const numberFormatter = (value, format) => numeral(value).format(format);
i18n.use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: english,
      ru: russian,
      es: spain,
      cn: chinese,
      pt: portuguese,
      ht: haiti,
      fr: french,
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      format: (value, format) => numberFormatter(value, format),
    },
  })
  .then(r => {
  });
export default i18n;
