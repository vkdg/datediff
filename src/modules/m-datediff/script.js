import Base from 'js/base';

export default class DateDiff extends Base {
    constructor() {
        super();

        this.$elements = document.querySelectorAll('[data-js=datediff]');

        this.init();
    }

    /**
     * Инициализация
     */
    init() {

        this.$elements.forEach(($dateDiffer) => {

            const $dateFrom = document.querySelector($dateDiffer.dataset.jsTargetDateFrom);
            const $dateTo = document.querySelector($dateDiffer.dataset.jsTargetDateTo);
            let $from = undefined;
            let $to = undefined;

            if ($dateFrom && $dateTo) {
                $from = {
                    $day: $dateFrom.querySelector('[data-js=datepicker-day]'),
                    $month: $dateFrom.querySelector('[data-js=datepicker-month]'),
                    $year: $dateFrom.querySelector('[data-js=datepicker-year]')
                };

                $to = {
                    $day: $dateTo.querySelector('[data-js=datepicker-day]'),
                    $month: $dateTo.querySelector('[data-js=datepicker-month]'),
                    $year: $dateTo.querySelector('[data-js=datepicker-year]')
                };
            } else {
                console.error($dateDiffer);
                throw new Error('Не найден один из датапикеров, проверьте селекторы в data аттрибутах');
            }

            // Рассчитываем изначальную разницу
            const difference = this._calcDifference($from, $to);
            this._printResult($dateDiffer, difference);

            // Начинаем слушать изменения в инпутах
            [$from.$day, $from.$month, $from.$year, $to.$day, $to.$month, $to.$year].forEach(($el) => $el.addEventListener('change', this._pickersListener.bind(this, $dateDiffer, $from, $to)));
        });

    }

    /**
     * Прослушивание изменений датапикеров
     */
    _pickersListener($dateDiffer, $from, $to) {
        const difference = this._calcDifference($from, $to);
        this._printResult($dateDiffer, difference);
    }

    /**
     * Отправка изменений в элемент
     */
    _printResult($dateDiffer, difference) {
        const result = [];

        if (difference.years > 0) result.push(`${difference.years} ${this.pluralNum(difference.years, ['год', 'года', 'лет'])}`);
        if (difference.months > 0) result.push(`${difference.months} ${this.pluralNum(difference.months, ['месяц', 'месяца', 'месяцев'])}`);
        if (difference.days > 0) result.push(`${difference.days} ${this.pluralNum(difference.days, ['день', 'дня', 'дней'])}`);

        if (result.length === 0) {
            $dateDiffer.innerText = 'Даты идентичны';
        } else {
            $dateDiffer.innerText = `Между выбранными датами ${result.join(', ')}`;
        }
    }

    /**
     * Извлекает числовые данные из инпутов
     * 
     * @param {object} $inputs - объект с селектами, содержащими выбранные даты
     * @returns {number[]} - массив из чисел полученных из селектов
     */
    _extractInputsNumbers($inputs) {
        return [
            Number($inputs.$year.value),
            Number($inputs.$month.value),
            Number($inputs.$day.value),
        ]
    }

    /**
     * Вычисляет разницу между датами
     * 
     * @param {array} $dateFrom - массив датапикера первой даты
     * @param {array} $dateTo - массив датапикера второй даты
     * 
     * @return {object} Объект, содержащий разницу между двумя датами
     */
    _calcDifference($dateFrom, $dateTo) {
        const dateFrom = new Date(...this._extractInputsNumbers($dateFrom));
        const dateTo = new Date(...this._extractInputsNumbers($dateTo));

        let diff;

        if (dateTo < dateFrom) {
            diff = new Date(dateFrom - dateTo);
        } else {
            diff = new Date(dateTo - dateFrom);
        }

        const years = diff.getUTCFullYear() - 1970;
        const months = diff.getUTCMonth();
        const days = diff.getUTCDate() - 1;

        return { days, months, years };
    }
}