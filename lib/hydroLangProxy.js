import HydroLang from '../hydrolang/hydro.js'

const HydroLangProxy = new Proxy(HydroLang, {
  construct: function (target, argumentsList) {
    if (!this.instance) {
      this.instance = new target(...argumentsList);
    }
    return this.instance;
  },
});

export default HydroLangProxy;