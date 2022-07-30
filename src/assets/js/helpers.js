export default class Helpers {
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

        if (props.cls) {
            if (typeof props.cls === 'array') {
                node.classList.add(...props.cls)
            } else if (typeof props.cls === 'string') {
                node.classList.add(props.cls)
            }
        }

        return node
    }
}