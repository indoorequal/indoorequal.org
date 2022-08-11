function adaptNestedExpressionField(property, languageFieldName, isNonLatin) {
  if (Array.isArray(property)) {
    for (let i = 1; i < property.length; i++) {
      if (Array.isArray(property[i])) {
        if (property[i][0] === 'get' && (property[i][1] === 'name' || property[i][1] === 'name:latin')) {
          const adaptedProp = ['get', languageFieldName];
          property[i] = ['coalesce', adaptedProp, isNonLatin ? ['get', 'name:nonlatin'] : ['get', 'name:latin']];
        }
        if (property[i][0] === 'get' && property[i][1] === 'name:nonlatin') {
          property[i] = isNonLatin ? ['get', 'name:latin'] : ['get', 'name:nonlatin'];
        }
      }
    }
  }
}

function adaptPropertyLanguage(property, languageFieldName, isNonLatin) {
  adaptNestedExpressionField(property, languageFieldName, isNonLatin);

  // handle special case of bare ['get', 'name'] expression by wrapping it in a coalesce statement
  if (property[0] === 'get' && (property[1] === 'name' || property[1] === 'name:latin')) {
    const defaultProp = property.slice();
    const adaptedProp = ['get', languageFieldName];
    property = ['coalesce', adaptedProp, defaultProp];
  }
  return property;
}

function updateOldExpression(property) {
  if (property === '{name:latin}') {
    return ['get', 'name:latin'];
  } else if (property === '{name:latin}\n{name:nonlatin}') {
    return ['concat', ['get', 'name:latin'], '\n', ['get', 'name:nonlatin']];
  }
  return property;
}

function changeLayerTextProperty(layer, languageFieldName, isNonLatin) {
  if (layer.layout && layer.layout['text-field']) {
    const property = updateOldExpression(layer.layout['text-field']);
    return {
      ...layer,
      layout: {
        ...layer.layout,
        'text-field': adaptPropertyLanguage(property, languageFieldName, isNonLatin)
      }
    };
  }
  return layer;
}


const nonLatinLanguages = [
  'ar', // Arabic
  'be', // Belarusian
  'bg', // Bulgarian
  'el', // Greek
  'he', // Hebrew
  'hy', // Armenian
  'ja', // Japanese
  'ja_kana', // Japanese Kana form
  'ka', // Georgian
  'kk', // Kazakh
  'kn', // Kannada
  'ko', // Korean
  'ml', // Malayalam
  'ru', // Russian
  'sr', // Serbian, Cyrillic
  'th', // Thai
  'uk', // Ukrainian
  'zh', // Chinese
]
export function updateStyle(style, language) {
  const isNonLatin = nonLatinLanguages.includes(language);
  const field = `name:${language}`;
  const changedLayers = style.layers.map((layer) => {
    return changeLayerTextProperty(layer, field, isNonLatin);
  });

  const languageStyle = Object.assign({}, style, {
    layers: changedLayers
  });

  return languageStyle;
};
