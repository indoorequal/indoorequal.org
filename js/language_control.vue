<script setup>
import { useControl } from '@indoorequal/vue-maplibre-gl';
import { useI18n } from 'vue-i18n'
import { updateStyle } from './style_language';

class LanguageControl {
  constructor(options) {
    this.lang = options.lang;
  }

  onAdd(map) {
    this._map = map;
    if (this._map.isStyleLoaded()) {
      this.setStyleWithLang();
    } else {
      this._map.once('styledata', this.setStyleWithLang.bind(this));
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
    this._map = undefined;
  }
}

useControl(() => {
  const { locale } = useI18n();
  return new LanguageControl({
    lang: locale.value
  });
}, { position: 'top-right' });
</script>

<template></template>
