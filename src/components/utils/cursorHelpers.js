// focus end of text - https://stackoverflow.com/a/3866442/20942838
export const cursorToEndLine = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

export const getNextEditableSibling = (currentElement) => {
  const iterateSiblings = (start) => {
    let sibling = start;
    while (sibling) {
      if (sibling.contentEditable === 'true') return sibling;
      sibling = sibling.nextElementSibling;
    }
  };

  // first start at current elements next sibling
  const nextElement = iterateSiblings(currentElement.nextElementSibling);
  if (nextElement) return nextElement;
  // if not found start at the elements first sibling
  return iterateSiblings(currentElement.parentElement.firstElementChild);
};

// TODO figure out if necessary
export const trimSpaces = (string) => {
  return string
    .replace(/&nbsp;/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<');
};

export const tabPress = (e) => {
  if (e.key !== 'Tab') return;
  if (!document.activeElement.parentElement.id === 'properties') return;

  e.preventDefault();
  const nextEl = getNextEditableSibling(document.activeElement);
  cursorToEndLine(nextEl);
};
