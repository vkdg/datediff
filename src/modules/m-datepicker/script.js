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
     * @returns Datepicker Elements
     */
    _generatePickers($picker) {

        const dayPickerDefault = this.createNode('option', { selected: true, disabled: true, text: 'День', value: 'default' });
        const monthPickerDefault = this.createNode('option', { selected: true, disabled: true, text: 'Месяц', value: 'default' });
        const yearPickerDefault = this.createNode('option', { selected: true, disabled: true, text: 'Год', value: 'default' });

        const dayPicker = this.createNode('select', { datajs: 'datepicker-day', child: dayPickerDefault });
        const monthPicker = this.createNode('select', { datajs: 'datepicker-month', child: monthPickerDefault });
        const yearPicker = this.createNode('select', { datajs: 'datepicker-year', child: yearPickerDefault });

        const dayPickerContainer = this.createNode('div', { child: dayPicker, cls: 'm-datepicker__select' });
        const monthPickerContainer = this.createNode('div', { child: monthPicker, cls: 'm-datepicker__select' });
        const yearPickerContainer = this.createNode('div', { child: yearPicker, cls: 'm-datepicker__select' });

        this.multiAppend($picker, dayPickerContainer, monthPickerContainer, yearPickerContainer);

        return { dayPicker, monthPicker, yearPicker }
    }

    /**
     * Заполнение последних 90 лет
     *
     * @param {HTMLElement} $select - селект в который заполняем
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
     * @param {HTMLElement} $select - селект в который заполняем
     */
    _generateMonths($select) {

        for (let i = 0; i <= 11; i++) {
            const $option = this.createNode('option', { value: String(i), text: this._getMonthName(i) })

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
            options.forEach(($opt) => { if ($opt.value !== 'default') $opt.remove() });
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