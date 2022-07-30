import Helpers from 'js/helpers';

export default class Base extends Helpers {
    constructor() {
        super();
    }

    months = [
        'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
        'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
    ]

    /**
     * Возвращает название месяца по номеру
     * 
     * @param {number} num порядковый номер месяца
     *
     * @returns {string} название месяца
     */
    _getMonthName(num) {
        return this.months[num];
    }

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
     * Проверка даты на валидность
     * 
     * @param {Object Date} date - Объект даты
     *
     * @returns {boolean} Результат проверки
     */
    _dateIsValid(date) {
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Возвращает дату не учитывая часовой пояс
     * 
     * @param {number} year - год
     * @param {number} month - месяц
     * @param {number} day - день
     *
     * @returns {object} Date
     */
    _numsToDate(year, month, day) {
        const time = 'T12:00:00.000Z';
        month = ('0' + (month + 1)).slice(-2);
        day = ('0' + day).slice(-2);

        return new Date(`${year}-${month}-${day}${time}`);
    }
}