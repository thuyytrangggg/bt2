const calendarDays = document.querySelector('.calendar-days');
const monthList = document.querySelector('.month-list');
const monthPicker = document.querySelector('#month-picker');
const monthYearPicker = document.querySelector('#month-year-picker');
const yearPicker = document.querySelector('#year-picker');
const yearDisplay = document.querySelector('#year');
const preMonthBtn = document.querySelector('#pre-month');
const nextMonthBtn = document.querySelector('#next-month');
const calendarDate = document.querySelector('.calendar-date');
const dropdownButton = document.querySelector('.dropdown-button');
const countdownDisplay = document.querySelector('#countdown');
const addTimeButtons = document.querySelectorAll('#add-time');
const focusBtn = document.querySelector('.focus-btn');
const calendarWeekDays = document.querySelector('.calendar-week-days');
const scrollIndicator = document.getElementById('scroll-indicator');

monthYearPicker.addEventListener('click', () => {
    updateDisplay();
});


const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate = new Date();
let viewMode = 'month';
let focusMinutes = 30;
let focusTimer = null;
let isTimerRunning = false;
let isScrolling = false;
let scrollTimeout;

const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const getFebDays = (year) => isLeapYear(year) ? 29 : 28;

const daysInMonth = (month, year) => {
    return [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

const formatDateHeader = (date) => {
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${dayName}, ${monthName} ${day}`;
};

function renderMonthView() {
    calendarDays.innerHTML = '';
    monthList.style.display = 'none';
    calendarDays.style.display = 'grid';
    calendarWeekDays.style.display = 'grid';

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDay = firstDayOfMonth.getDay();
    const totalDays = daysInMonth(currentMonth, currentYear);

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = daysInMonth(prevMonth, prevYear);

    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    const today = new Date();

    for (let i = 0; i < 42; i++) {
        const dayEl = document.createElement('div');
        let dayNumber;
        let cellMonth = currentMonth;
        let cellYear = currentYear;
        let isPrevMonth = false;
        let isNextMonth = false;

        if (i < startDay) {
            dayNumber = prevMonthDays - (startDay - 1 - i);
            dayEl.classList.add('prev-month-day');
            isPrevMonth = true;
            cellMonth = prevMonth;
            cellYear = prevYear;
        } else if (i < startDay + totalDays) {
            dayNumber = i - startDay + 1;
            dayEl.classList.add('calendar-day');
        } else {
            dayNumber = i - startDay - totalDays + 1;
            dayEl.classList.add('next-month-day');
            isNextMonth = true;
            cellMonth = nextMonth;
            cellYear = nextYear;
        }

        dayEl.textContent = dayNumber;

        if (dayNumber === today.getDate() &&
            cellMonth === today.getMonth() &&
            cellYear === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        if (dayNumber === selectedDate.getDate() &&
            cellMonth === selectedDate.getMonth() &&
            cellYear === selectedDate.getFullYear()) {
            dayEl.classList.add('selected');
        }

        dayEl.addEventListener('click', () => {
            selectedDate = new Date(cellYear, cellMonth, dayNumber);

            updateDateHeader();
            updateDisplay();
        });

        calendarDays.appendChild(dayEl);
    }
}

function renderYearView() {
    calendarDays.style.display = 'none';
    calendarWeekDays.style.display = 'none';
    monthList.style.display = 'grid';
    monthList.innerHTML = '';
    monthList.className = 'month-list year-view';

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    monthAbbr.forEach((month, index) => {
        const monthEl = document.createElement('div');
        monthEl.textContent = month;
        monthEl.classList.add('month-item');

        if (index === todayMonth && currentYear === today.getFullYear()) {
            monthEl.classList.add('current-month');
        }

        monthEl.addEventListener('click', () => {
            currentMonth = index;
            viewMode = 'month';
            updateDisplay();
        });

        monthList.appendChild(monthEl);
    });
}

function renderDecadeView() {
    const startYear = Math.floor(currentYear / 10) * 10;
    yearDisplay.textContent = `${startYear} - ${startYear + 9}`;

    calendarDays.style.display = 'none';
    calendarWeekDays.style.display = 'none';
    monthList.style.display = 'grid';
    monthList.innerHTML = '';
    monthList.className = 'month-list decade-view';

    const today = new Date();
    const todayYear = today.getFullYear();

    for (let i = -3; i < 13; i++) {
        const year = startYear + i;
        const yearEl = document.createElement('div');
        yearEl.textContent = year;
        yearEl.classList.add('year-item');
        if (year === todayYear) {
            yearEl.classList.add('current-year');
        }

        if (i < 0 || i >= 10) {
            yearEl.classList.add('other-decade');
        }

        yearEl.addEventListener('click', () => {
            currentYear = year;
            viewMode = 'year';
            updateDisplay();
        });

        monthList.appendChild(yearEl);
    }
}

function updateDisplay() {
    monthPicker.textContent = monthNames[currentMonth];
    yearDisplay.textContent = currentYear;

    if (viewMode === 'year' || viewMode === 'decade') {
        monthPicker.classList.add('hidden');
    } else {
        monthPicker.classList.remove('hidden');
    }

    if (viewMode === 'month') {
        renderMonthView();
    } else if (viewMode === 'year') {
        renderYearView();
    } else if (viewMode === 'decade') {
        renderDecadeView();
    }
}

function updateDateHeader() {
    calendarDate.textContent = formatDateHeader(selectedDate);
}

function updateTimer() {
    if (isTimerRunning) return;
    countdownDisplay.textContent = `${focusMinutes} mins`;
}

function showScrollIndicator() {
    if (scrollIndicator) {
        scrollIndicator.classList.add('show');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollIndicator.classList.remove('show');
        }, 1500);
    }
}

function smoothMonthTransition(direction) {
    if (isScrolling || viewMode !== 'month') return;

    isScrolling = true;

    if (direction === 'up') {
        calendarDays.classList.add('scroll-up');
    } else {
        calendarDays.classList.add('scroll-down');
    }

    setTimeout(() => {
        if (direction === 'up') {
            navigatePrevious();
        } else {
            navigateNext();
        }

        calendarDays.classList.remove('scroll-up', 'scroll-down');

        if (direction === 'up') {
            calendarDays.classList.add('slide-down-in');
        } else {
            calendarDays.classList.add('slide-up-in');
        }

        setTimeout(() => {
            calendarDays.classList.remove('slide-up-in', 'slide-down-in');
            isScrolling = false;
        }, 300);
    }, 150);
}

function navigatePrevious() {
    if (viewMode === 'month') {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
    } else if (viewMode === 'year') {
        currentYear--;
    } else if (viewMode === 'decade') {
        currentYear -= 10;
    }
    updateDisplay();
}

function navigateNext() {
    if (viewMode === 'month') {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    } else if (viewMode === 'year') {
        currentYear++;
    } else if (viewMode === 'decade') {
        currentYear += 10;
    }
    updateDisplay();
}

function startFocusTimer() {
    if (focusTimer) {
        clearInterval(focusTimer);
        focusTimer = null;
        isTimerRunning = false;
        focusBtn.classList.remove('active');
        focusBtn.querySelector('.play-focus').textContent = '▶';
        focusBtn.querySelector('.focus').textContent = 'Focus';
        updateTimer();
        return;
    }

    let timeLeft = focusMinutes * 60;
    isTimerRunning = true;
    focusBtn.classList.add('active');
    focusBtn.querySelector('.play-focus').textContent = '◼';
    focusBtn.querySelector('.focus').textContent = 'End';

    focusTimer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(focusTimer);
            focusTimer = null;
            isTimerRunning = false;
            focusBtn.classList.remove('active');
            focusBtn.querySelector('.play-focus').textContent = '▸';
            focusBtn.querySelector('.focus').textContent = 'Focus';
            alert('Focus session completed!');
            updateTimer();
        }
    }, 1000);
}

preMonthBtn.addEventListener('click', () => {
    if (viewMode === 'month') {
        smoothMonthTransition('up');
    } else if (viewMode === 'year') {
        currentYear--;
        updateDisplay();
    } else if (viewMode === 'decade') {
        currentYear -= 10;
        updateDisplay();
    }
});

nextMonthBtn.addEventListener('click', () => {
    if (viewMode === 'month') {
        smoothMonthTransition('down');
    } else if (viewMode === 'year') {
        currentYear++;
        updateDisplay();
    } else if (viewMode === 'decade') {
        currentYear += 10;
        updateDisplay();
    }
});

monthPicker.addEventListener('click', () => {
    if (viewMode === 'month') {
        viewMode = 'year';
        updateDisplay();
    }
});

yearPicker.addEventListener('click', () => {
    if (viewMode === 'year') {
        viewMode = 'decade';
        updateDisplay();
    } else if (viewMode === 'month') {
        viewMode = 'year';
        updateDisplay();
    }
});

dropdownButton.addEventListener('click', () => {
    const today = new Date();
    selectedDate = new Date(today);
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    viewMode = 'month';
    updateDateHeader();
    updateDisplay();
});


const container = document.querySelector('.container');

dropdownButton.addEventListener('click', () => {
    container.classList.toggle('collapsed');
});



addTimeButtons[0].addEventListener('click', () => {
    if (!isTimerRunning && focusMinutes > 5) {
        focusMinutes -= 5;
        updateTimer();
    }
});

addTimeButtons[1].addEventListener('click', () => {
    if (!isTimerRunning) {
        focusMinutes += 5;
        updateTimer();
    }
});

focusBtn.addEventListener('click', startFocusTimer);


document.addEventListener('wheel', (e) => {
    if (viewMode !== 'month') return;

    const calendarBody = document.querySelector('.calendar-body');
    const rect = calendarBody.getBoundingClientRect();
    const isOverCalendar = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
    );

    if (!isOverCalendar) return;


    if (e.deltaY < 0) {
        smoothMonthTransition('up');
    } else if (e.deltaY > 0) {
        smoothMonthTransition('down');
    }
}, { passive: false });

document.addEventListener('keydown', (e) => {
    if (viewMode === 'month') {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                selectedDate.setDate(selectedDate.getDate() - 1);
                if (selectedDate.getMonth() !== currentMonth || selectedDate.getFullYear() !== currentYear) {
                    currentMonth = selectedDate.getMonth();
                    currentYear = selectedDate.getFullYear();
                }
                updateDateHeader();
                updateDisplay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                selectedDate.setDate(selectedDate.getDate() + 1);
                if (selectedDate.getMonth() !== currentMonth || selectedDate.getFullYear() !== currentYear) {
                    currentMonth = selectedDate.getMonth();
                    currentYear = selectedDate.getFullYear();
                }
                updateDateHeader();
                updateDisplay();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedDate.setDate(selectedDate.getDate() - 7);
                if (selectedDate.getMonth() !== currentMonth || selectedDate.getFullYear() !== currentYear) {
                    currentMonth = selectedDate.getMonth();
                    currentYear = selectedDate.getFullYear();
                }
                updateDateHeader();
                updateDisplay();
                break;
            case 'ArrowDown':
                e.preventDefault();
                selectedDate.setDate(selectedDate.getDate() + 7);
                if (selectedDate.getMonth() !== currentMonth || selectedDate.getFullYear() !== currentYear) {
                    currentMonth = selectedDate.getMonth();
                    currentYear = selectedDate.getFullYear();
                }
                updateDateHeader();
                updateDisplay();
                break;
            case 'PageUp':
                e.preventDefault();
                smoothMonthTransition('up');
                break;
            case 'PageDown':
                e.preventDefault();
                smoothMonthTransition('down');
                break;
        }
    }
});

calendarDate.addEventListener('click', () => {
    viewMode = 'month';
    updateDisplay();
});


function init() {
    const today = new Date();
    selectedDate = new Date(today);
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();

    updateDateHeader();
    updateTimer();
    updateDisplay();
}

init();