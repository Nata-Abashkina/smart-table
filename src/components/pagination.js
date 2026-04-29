import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, allData, createPage) => {
  //if (typeof createPage !== 'function') {
  //  throw new Error('createPage must be a function');
  //}

  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  return (currentData, state, action) => {
    const rowsPerPage = parseInt(state.rowsPerPage, 10) || 10;
    const totalDataLength = allData.length;
    const pageCount = Math.ceil(totalDataLength / rowsPerPage);

    let page = state.page;

    // Обработка действий
    if (action) switch (action.name) {
      case 'prev': page = Math.max(1, page - 1); break;
      case 'next': page = Math.min(pageCount, page + 1); break;
      case 'first': page = 1; break;
      case 'last': page = pageCount; break;
    }

    // Гарантируем корректность текущей страницы
    page = Math.max(1, Math.min(pageCount, page));

    // Только если есть страницы для отображения
    if (pageCount > 0) {
      const visiblePages = getPages(page, pageCount, 5);

      pages.replaceChildren(...visiblePages.map(pageNumber => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }));
    } else {
      pages.innerHTML = '';
    }

    // Обновляем статус пагинации
    const skip = (page - 1) * rowsPerPage;
    fromRow.textContent = skip + 1;
    toRow.textContent = Math.min(skip + rowsPerPage, totalDataLength);
    totalRows.textContent = totalDataLength;

    // Возвращаем данные для текущей страницы
    return allData.slice(skip, skip + rowsPerPage);
  };
};


















/*import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);    // в качестве шаблона берём первый элемент из контейнера со страницами
    pages.firstElementChild.remove();                                // и удаляем его (предполагаем, что там больше ничего, как вариант, можно и всё удалить из pages)

    return (data, state, action) => {
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        const rowsPerPage = state.rowsPerPage;                        // будем часто обращаться, чтобы короче записывать
        const pageCount = Math.ceil(data.length / rowsPerPage);        // число страниц округляем в большую сторону
        let page = state.page;                                        // страница переменной, потому что она может меняться при обработке действий позже

        // @todo: #2.6 — обработать действия
        if (action) switch(action.name) {
        case 'prev': page = Math.max(1, page - 1); break;            // переход на предыдущую страницу
        case 'next': page = Math.min(pageCount, page + 1); break;    // переход на следующую страницу
        case 'first': page = 1; break;                                // переход на первую страницу
        case 'last': page = pageCount; break;                        // переход на последнюю страницу
        }

        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5);                // Получим массив страниц, которые нужно показать, выводим только 5 страниц

        pages.replaceChildren(...visiblePages.map(pageNumber => {        // перебираем их и создаём для них кнопку
        const el = pageTemplate.cloneNode(true);                    // клонируем шаблон, который запомнили ранее
        return createPage(el, pageNumber, pageNumber === page);        // вызываем колбэк из настроек, чтобы заполнить кнопку данными
        }))

        // @todo: #2.5 — обновить статус пагинации
        fromRow.textContent = (page - 1) * rowsPerPage + 1;                    // С какой строки выводим
        toRow.textContent = Math.min((page * rowsPerPage), data.length);    // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
        totalRows.textContent = data.length;                                // Сколько всего строк выводим на всех страницах вместе (после фильтрации будет меньше)

        // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
        const skip = (page - 1) * rowsPerPage;            // сколько строк нужно пропустить
        return data.slice(skip, skip + rowsPerPage);    // получаем нужную часть строк (заменяем имеющийся return)
    }
}*/