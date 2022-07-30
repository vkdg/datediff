export default class Base {

    /**
     * Склоняет слова в зависимости от переданного числа
     * 
     * @param {number} num - Целевое число
     * @param {string[]} textForms - Массив склонений
     * 
     * @returns Склонение
     */
    pluralNum(num, textForms) {
        num = Math.abs(num) % 100;
        const num1 = num % 10;

        if (num > 10 && num < 20) return textForms[2];
        if (num1 > 1 && num1 < 5) return textForms[1];
        if (num1 == 1) return textForms[0];
        return textForms[2];
    }

    /**
     * Массовое добавление потомков в родительский блок
     * 
     * @param {HTMLElement} parent - Нода в которую происходит добавление
     * @param {...HTMLElement} childs - Ноды, которые добавляем
     */
    multiAppend(parent, ...childs) {
        childs.forEach(child => parent.append(child));
    }

    /**
     * Создание элементов
     * 
     * @param {string} tag - HTML тег
     * @param {props{}} props - Различные пропсы для тега
     * 
     * @returns Готовая собранная нода
     */
    createNode(tag, props) {
        const node = document.createElement(tag)

        if (props.disabled) node.disabled = props.disabled
        if (props.selected) node.selected = props.selected
        if (props.text) node.innerText = props.text
        if (props.value) node.value = props.value
        if (props.datajs) node.dataset.js = props.datajs
        if (props.child) node.appendChild(props.child)

        return node
    }
}