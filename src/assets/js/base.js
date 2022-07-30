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
}