import Base from 'js/base';

export default class DatePicker extends Base {
    constructor() {
        super();

        this.$elements = document.querySelectorAll('[data-js=datepicker]');
        this.$pickers = [];

        this.currentDate = new Date(Date.now());
        this.currentDay = this.currentDate.getDate();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.currentDaysInMonth = this.currentDate.daysInMonth();

        this.months = [
            'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
            'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
        ];

        this.init();

    }

    /**
     * Инициализация
     */
    init() {

        this.$elements.forEach(($picker) => {

            const pickers = this._generatePickers($picker);
            const $selectYear = pickers.yearPicker;
            const $selectMonth = pickers.monthPicker;
            const $selectDay = pickers.dayPicker;

            // Заполняем года
            this._generateYears($selectYear);

            // Заполняем месяцы
            this._generateMonths($selectMonth);

            // Заполняем дни
            this._generateDays($selectDay, this.currentDaysInMonth, 'current');

            // Каждый раз, когда меняется год или месяц перезаполняем дни
            [$selectMonth, $selectYear].forEach(($select) => {
                $select.addEventListener('change', this._changeListener.bind(this, $selectYear, $selectMonth, $selectDay));
            });
        })

    }

    /**
     * Генерирует датапикеры
     * 
     * @param {HTMLElement} $picker - элемент, в который иницилизируются селекты
     * 
     * @retruns Datepicker Elements
     */
    _generatePickers($picker) {
        const dayPickerDefault = this.createNode('option', { selected: true, disabled: true, text: 'День', value: '' });
        const monthPickerDefault = this.createNode('option', { selected: true, disabled: true, text: 'Месяц', value: '' });
        const yearPickerDefault = this.createNode('option', { selected: true, disabled: true, text: 'Год', value: '' });

        const dayPicker = this.createNode('select', { datajs: 'datepicker-day', child: dayPickerDefault });
        const monthPicker = this.createNode('select', { datajs: 'datepicker-month', child: monthPickerDefault });
        const yearPicker = this.createNode('select', { datajs: 'datepicker-year', child: yearPickerDefault });

        this.multiAppend($picker, dayPicker, monthPicker, yearPicker);

        return { dayPicker, monthPicker, yearPicker }
    }

    /**
     * Заполнение последних 90 лет
     *
     * @param {HTMLElement} select - селект в который заполняем
     */
    _generateYears($select) {

        for (let i = 0; i < 90; i++) {
            const $option = this.createNode('option', { value: this.currentYear - i, text: this.currentYear - i });

            if (this.currentYear - i === this.currentYear) $option.selected = true;

            $select.appendChild($option);
        }

    }

    /**
     * Заполнение месяцев
     *
     * @param {HTMLElement} select - селект в который заполняем
     */
    _generateMonths($select) {

        for (let i = 0; i <= 11; i++) {
            const $option = this.createNode('option', { value: i, text: this._getMonthName(i) })

            if (i === this.currentMonth) $option.selected = true;

            $select.appendChild($option);
        }

    }

    /**
     * Заполнение дней месяца с учетом месяца и года
     * 
     * @param {HTMLElement} $select - селект в который заполняем
     * @param {number} daysInMonth — количество дней в месяце
     * @param {string || number} selectDay - модификатор для выбора дня
     */
    _generateDays($select, daysInMonth, selectDay) {

        const selectDayIsNumber = typeof selectDay === 'number';

        const options = $select.querySelectorAll('option');
        if (options.length > 1) {
            options.forEach(($opt) => { if ($opt.value !== '') $opt.remove() });
        }

        for (let i = 0; i < daysInMonth; i++) {
            const $option = this.createNode('option', { value: i + 1, text: i + 1 });

            if (selectDay === 'current') {
                if (i + 1 === this.currentDay) {
                    $option.selected = true;
                }
            } else if (selectDayIsNumber) {
                if (i + 1 === selectDay) {
                    $option.selected = true;
                }
            } else {
                if (i + 1 === 1) {
                    $option.selected = true;
                }
            }

            $select.appendChild($option);
        }

    }

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

    /**
     * Отслеживание изменений селектов года и месяца для перегенерации селектора дней
     *
     * @param {HTMLElement} $selectYear - селектор года
     * @param {HTMLElement} $selectMonth - селектор месяца
     * @param {HTMLElement} $selectDay - селектор дня
     */
    _changeListener($selectYear, $selectMonth, $selectDay) {
        const selectedDay = Number($selectDay.value);
        const selectedMonth = Number($selectMonth.value);
        const selectedYear = Number($selectYear.value);
        const selectedDate = this._numsToDate(selectedYear, selectedMonth, selectedDay);

        // Если дата не валидна, ищем последний день месяца и выбираем его
        if (!this._dateIsValid(selectedDate)) {
            const maxDays = this._numsToDate(selectedYear, selectedMonth, 1).daysInMonth();
            this._generateDays($selectDay, maxDays, maxDays);
        } else {
            this._generateDays($selectDay, selectedDate.daysInMonth(), selectedDay);
        }
    }
}