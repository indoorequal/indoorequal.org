function adaptNestedExpressionField(property, languageFieldName) {
  if (Array.isArray(property)) {
    for (let i = 1; i < property.length; i++) {
      if (Array.isArray(property[i])) {
        if (property[i][0] === 'get' && (property[i][1] === 'name' || property[i][1] === 'name:latin')) {
          const defaultProp = property[i].slice();
          const adaptedProp = ['get', languageFieldName];
          property[i] = ['coalesce', adaptedProp, defaultProp];
        }
      }
    }
  }
}

function adaptPropertyLanguage(property, languageFieldName) {
  adaptNestedExpressionField(property, languageFieldName);

  // handle special case of bare ['get', 'name'] expression by wrapping it in a coalesce statement
  if (property[0] === 'get' && (property[1] === 'name' || property[1] === 'name:latin')) {
    const defaultProp = property.slice();
    const adaptedProp = ['get', languageFieldName];
    property = ['coalesce', adaptedProp, defaultProp];
  } else if (property === '{name:latin}') {
    property = ['coalesce', ['get', languageFieldName], ['get', 'name:latin']];
  } else if (property === '{name:latin}\n{name:nonlatin}') {
    property = ['concat', ['coalesce', ['get', languageFieldName], ['get', 'name:latin']], '\n', ['get', 'name:nonlatin']];
  }
  return property;
}

function changeLayerTextProperty(layer, languageFieldName) {
  if (layer.layout && layer.layout['text-field']) {
    return Object.assign({}, layer, {
      layout: Object.assign({}, layer.layout, {
        'text-field': adaptPropertyLanguage(layer.layout['text-field'], languageFieldName)
      })
    });
  }
  return layer;
}

export function updateStyle(style, language) {
  const field = `name:${language}`;
  const changedLayers = style.layers.map((layer) => {
    return changeLayerTextProperty(layer, field);
  });

  const languageStyle = Object.assign({}, style, {
    layers: changedLayers
  });

  return languageStyle;
};
