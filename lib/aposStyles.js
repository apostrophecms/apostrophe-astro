export function stylesElements(widget) {
  return widget._options?.aposStylesElements || null;
}

export function stylesAttributes(widget, additionalAttrs = {}) {
  // Separate class and style from other additional attributes
  const {
    class: additionalClasses,
    style: additionalStyle,
    ...otherAttrs
  } = additionalAttrs;

  if (additionalClasses) {
    if (!Array.isArray(additionalClasses) && typeof additionalClasses !== 'string') {
      throw new Error('class must be a string or an array of strings');
    }
    if (Array.isArray(additionalClasses) && !additionalClasses.every(cls => typeof cls === 'string')) {
      throw new Error('class array must contain only strings');
    }
  }
  if (additionalStyle && typeof additionalStyle !== 'string') {
    throw new Error('style must be a string');
  }

  const stylesAttrs = widget._options?.aposStylesAttributes || {};

  const attrs = { ...stylesAttrs };

  // Merge classes, keeping them unique
  if (additionalClasses) {
    const classSet = new Set(splitClasses(stylesAttrs.class));

    const extraClasses = Array.isArray(additionalClasses)
      ? additionalClasses
      : splitClasses(additionalClasses);

    extraClasses.forEach(cls => classSet.add(cls));

    if (classSet.size) {
      attrs.class = Array.from(classSet).join(' ');
    }
  }

  // Merge styles
  if (additionalStyle) {
    attrs.style =
      removeTrainlngSemicolon(attrs.style) +
      removeTrainlngSemicolon(';' + additionalStyle);
  }

  // Add other additional attributes
  for (const [ key, value ] of Object.entries(otherAttrs)) {
    if (value !== undefined && value !== null) {
      attrs[key] = value;
    }
  }

  return attrs;
}

function removeTrainlngSemicolon(style) {
  return style.replace(/;$/, '');
}

function splitClasses(classes) {
  return classes
    ?.split(/\s+/) || []
    .filter(Boolean);
}
