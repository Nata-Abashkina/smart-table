import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes, onAction) {
  // Заполняем выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    const selectElement = elements[elementName];
    if (selectElement) {
      selectElement.append(
        ...Object.values(indexes[elementName]).map(name => {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          return option;
        })
      );
    }
  });

  // Добавляем обработчики для отслеживания изменений в полях фильтров
  Object.keys(elements).forEach(key => {
    const element = elements[key];
    if (element && (element.tagName === 'INPUT' || element.tagName === 'SELECT')) {
      element.addEventListener('input', () => {
        if (state) {
          state[key] = element.value;
        }
        if (typeof onAction === 'function') {
          onAction();
        }
      });
    }
  });

  return (data, state, action) => {
    // Обрабатываем очистку поля
    if (action && action.name === 'clear') {
      const fieldName = action.dataset.field;
      const parentElement = action.closest('.filter-wrapper');

      if (parentElement) {
        const inputElement = parentElement.querySelector('input');
        if (inputElement) {
          inputElement.value = '';
          if (state && fieldName) {
            state[fieldName] = '';
          }
          if (typeof onAction === 'function') {
            onAction();
          }
        }
      }
    }

    // Дополнительная фильтрация по сумме ДО применения компаратора
    let filteredData = data;

    // Фильтрация по totalFrom
    if (state.totalFrom) {
      const minTotal = parseFloat(state.totalFrom);
      filteredData = filteredData.filter(row => {
        const total = parseFloat(row.total);
        return !isNaN(total) && total >= minTotal;
      });
    }

    // Фильтрация по totalTo
    if (state.totalTo) {
      const maxTotal = parseFloat(state.totalTo);
      filteredData = filteredData.filter(row => {
        const total = parseFloat(row.total);
        return !isNaN(total) && total <= maxTotal;
      });
    }

    // Применяем стандартный компаратор к уже отфильтрованным данным
    filteredData = filteredData.filter(row => compare(row, state));

    // Пагинация
    const currentPage = parseInt(state.page) || 1;
    const rowsPerPage = parseInt(state.rowsPerPage) || 10;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return filteredData.slice(startIndex, endIndex);
  };
}


/*import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                .map(name => {                        // используйте name как значение и текстовое содержимое
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;                                    // @todo: создать и вернуть тег опции
                })
        )
     })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;
            const parentElement = action.closest('.filter-wrapper');

            if (parentElement) {
                const inputElement = parentElement.querySelector('input');

                if (inputElement) {
                    inputElement.value = '';

                    if (state && fieldName) {
                        state[fieldName] = '';
                    }
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}*/