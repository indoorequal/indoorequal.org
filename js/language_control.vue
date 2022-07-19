<script>
import { $helpers } from 'vue-mapbox/dist/vue-mapbox.umd.js';
import { updateStyle } from './style_language';

class LanguageControl {
  constructor(options) {
    this.lang = options.lang;

    let hasStyleLoaded = false;
    this._setStyleWithLang = (e) => {
      if (hasStyleLoaded || !this._map.isStyleLoaded()) return;
      this.setStyleWithLang();
      hasStyleLoaded = this._map.isStyleLoaded();
    };
  }

  onAdd(map) {
    this._map = map;
    if (this._map.isStyleLoaded()) {
      this.setStyleWithLang(map);
    } else {
      this._map.on('styledata', this._setStyleWithLang);
    }
    this._container = document.createElement('div');
    return this._container;
  }

  setStyleWithLang() {
    const style = this._map.getStyle();
    const newStyle = updateStyle(style, this.lang);
    this._map.setStyle(newStyle);
  }

  onRemove() {
    this._map.off('styledata', this._setStyleWithLang);
    this._map = undefined;
  }
}

export default {
  mixins: [$helpers.asControl],

  created() {
    this.control = new LanguageControl({
      lang: this.$i18n.locale
    });
    this.$_addControl();
  },

};
</script>
