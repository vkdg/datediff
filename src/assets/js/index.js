// Include styles
import 'css/styles.scss';
import 'js/extensions.js';

import DatePicker from 'modules/m-datepicker/script';
import DateDiff from 'modules/m-datediff/script';

document.addEventListener('DOMContentLoaded', () => {

    // Датапикеры
    new DatePicker();

    // Подсчет разницы
    new DateDiff();

});