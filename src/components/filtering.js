import {createComparison, rules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(
  ['skipNonExistentSourceFields', 'skipEmptyTargetValues'],
  [
    rules.caseInsensitiveStringIncludes(),
    rules.arrayAsRange()
  ]
);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки данными
  Object.keys(indexes)
    .forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName])
          .map(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            return option;
          })
      );
    });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === 'clear') {
      const parent = action.parentElement;
      const input = parent.querySelector('input');
      const field = action.dataset.field;

      if (input) {
        input.value = '';
      }

      if (state[field] !== undefined) {
        state[field] = '';
      }
    }

    // Преобразуем значения totalFrom и totalTo в числа и формируем диапазон
    const filteredState = { ...state };
    const hasTotalFrom = typeof state.totalFrom === 'string' && state.totalFrom.trim() !== '';
    const hasTotalTo = typeof state.totalTo === 'string' && state.totalTo.trim() !== '';

    if (hasTotalFrom || hasTotalTo) {
      const from = hasTotalFrom ? parseFloat(state.totalFrom) : undefined;
      const to = hasTotalTo ? parseFloat(state.totalTo) : undefined;

      // Удаляем исходные поля, чтобы правило arrayAsRange сработало корректно
      delete filteredState.totalFrom;
      delete filteredState.totalTo;

      // Добавляем поле с диапазоном
      filteredState.total = [from, to];
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter(row => compare(row, filteredState));
  };
}
