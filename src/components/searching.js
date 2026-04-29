import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const ruleNames = rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false);

  const safeRuleNames = Array.isArray(ruleNames)
    ? ruleNames.filter(ruleName =>
        typeof rules[ruleName] === 'function'
      )
    : [];

  // Создаём массив кастомных правил с skipEmptyTargetValues
  const customRules = [
    (key, sourceValue, targetValue, source, target) => {
      // Правило skipEmptyTargetValues
      if (key === searchField) {
        const targetValueActual = target[searchField];
        if (targetValueActual === undefined || targetValueActual === null || targetValueActual === '') {
          return { result: true, skip: false, continue: false };
        }
      }
      return { result: false, skip: false, continue: true };
    }
  ];

  const compare = createComparison(safeRuleNames, customRules);

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchTerm = state[searchField] || '';
        const searchedData = data.filter(row => compare(row, { [searchField]: searchTerm }));

        return searchedData;
    }
}