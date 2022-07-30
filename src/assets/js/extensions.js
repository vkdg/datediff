Date.prototype.daysInMonth = function () {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
}