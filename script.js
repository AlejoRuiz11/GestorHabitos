document.addEventListener('DOMContentLoaded', () => {
    loadHabits();
    updateDateDisplay();
    updateButtonLabel();
    updateHabitChart();
});


const habitForm = document.getElementById('habitForm');
const habitList = document.getElementById('habitList');
const currentDateElement = document.getElementById('currentDate');
const addHabitBtn = document.getElementById('addHabitBtn');
const addAllDaysBtn = document.getElementById('addAllDaysBtn');

//let habitsByDay = {};
//let totalHabitsByDay = {};
let currentDate = new Date();
let auxMonthChart = false;

habitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const habitInput = document.getElementById('habitInput').value;
    if (habitInput === '') return;
    addHabitForDay(habitInput);
    document.getElementById('habitInput').value = '';
});

addAllDaysBtn.addEventListener('click', function() {
    const habitInput = document.getElementById('habitInput').value;
    if (habitInput === '') return;
    addHabitForAllDays(habitInput);
    document.getElementById('habitInput').value = '';
});

document.getElementById('prevDay').addEventListener('click', () => {
    changeDay(-1);
});

document.getElementById('nextDay').addEventListener('click', () => {
    changeDay(1);
});

function addHabitForDay(habit) {
    const dayOfWeek = getCurrentDayOfWeek();
    const currentDateString = currentDate.toDateString();
    let finishDateString = new Date(currentDate);
    finishDateString.setFullYear(finishDateString.getFullYear() + 2); // Añadir 2 años por defecto
    finishDateString = finishDateString.toDateString();

    let habits = JSON.parse(localStorage.getItem(dayOfWeek)) || [];
    habits.push({ id: new Date().toISOString(), habit, completedDates: [], startDate: currentDateString, finishDate: finishDateString });
    localStorage.setItem(dayOfWeek, JSON.stringify(habits));
    loadHabits();
}

function addHabitForAllDays(habit) {
    const currentDayIndex = currentDate.getDay();
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    let finishDateString = new Date(currentDate);
    finishDateString.setFullYear(finishDateString.getFullYear() + 2); // Añadir 2 años por defecto
    finishDateString = finishDateString.toDateString();



    const id = new Date().toISOString();

    for (let i = currentDayIndex; i < daysOfWeek.length; i++) {
        let habits = JSON.parse(localStorage.getItem(daysOfWeek[i])) || [];
        habits.push({ id: id, habit, completedDates: [], startDate: currentDate.toDateString(), finishDate: finishDateString });
        localStorage.setItem(daysOfWeek[i], JSON.stringify(habits));
    }

    for (let i = 0; i < currentDayIndex; i++) {
        let habits = JSON.parse(localStorage.getItem(daysOfWeek[i])) || [];
        habits.push({ id: id, habit, completedDates: [], startDate: currentDate.toDateString(), finishDate: finishDateString });
        localStorage.setItem(daysOfWeek[i], JSON.stringify(habits));
    }


    loadHabits();
}

function loadHabits() {
    habitList.innerHTML = '';
    const dayOfWeek = getCurrentDayOfWeek();
    const currentDateString = currentDate.toDateString();
    let habits = JSON.parse(localStorage.getItem(dayOfWeek)) || [];
    /*
    if (!totalHabitsByDay[currentDate]) {
        totalHabitsByDay[currentDate] = 0;
    }
    if (!habitsByDay[currentDate]) {
        habitsByDay[currentDate] = 0;
    }*/

    //let aux = 0;
    //let aux1 = 0
    habits.forEach(item => {        
        if (new Date(item.startDate) <= currentDate && new Date(item.finishDate) >= currentDate) {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            
            //aux++;
            
            if (item.completedDates && item.completedDates.includes(currentDateString)) {
                li.classList.add('completed');
                //aux1++;
            }
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div class="nombreHabito">
                        <span class="${item.completedDates && item.completedDates.includes(currentDateString) ? 'completed' : ''}">${item.habit}</span>
                    </div>
                    <div class="d-flex">
                        <button class="btn btnEliminar btn-sm float-end delete shakeFix my-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                            </svg>
                        </button>
                        <button class="btn btnComplete btn-success btn-sm float-end complete m-2 growComplete">Complete</button>
                    </div>
                </div>
            `;

            li.dataset.id = item.id;
            habitList.appendChild(li);
        }
    });
    //console.log(aux);
    /*
    totalHabitsByDay[currentDate] = aux;
    habitsByDay[currentDate] = aux1;
    console.log(totalHabitsByDay[currentDate]);
    console.log(habitsByDay[currentDate]);
    console.log(currentDate);
    */
}

// Error por icono
/*
habitList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete')) {
        removeHabitFromCurrentOnward(event.target.parentElement);
    } else if (event.target.classList.contains('complete')) {
        const habitElement = event.target.parentElement;
        habitElement.querySelector('span').classList.toggle('completed');
        toggleComplete(habitElement.dataset.id);
        updateHabitChart();
    }
});*/

habitList.addEventListener('click', function(event) {
    if (event.target.closest('.delete')) {
        removeHabitFromCurrentOnward(event.target.closest('li'));
        updateHabitChart();
    } else if (event.target.closest('.complete')) {
        const habitElement = event.target.closest('li');
        habitElement.querySelector('span').classList.toggle('completed');
        toggleComplete(habitElement.dataset.id);
        loadHabits();
        updateHabitChart();
    }
});

function removeHabitFromCurrentOnward(item) {
    const currentDayIndex = currentDate.getDay();
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    // Ajustar la finishDate del hábito para que sea la fecha actual
    for (let i = 0; i < daysOfWeek.length; i++) {
        let habits = JSON.parse(localStorage.getItem(daysOfWeek[i])) || [];
        console.log(i);
        //console.log(currentDate.toDateString());
        habits.forEach(habit => {
            
            console.log(habit.id + " DatasetID: " + item.dataset.id);
            if (habit.id == item.dataset.id) {
                habit.finishDate = currentDate.toDateString();
                //totalHabitsByDay[currentDate]--;
                console.log("si");
                //console.log(currentDate.toDateString());
            }
        });
        
        localStorage.setItem(daysOfWeek[i], JSON.stringify(habits));
    }
/*
    // Ajustar la finishDate para los días de la semana siguientes
    for (let i = 0; i < currentDayIndex; i++) {
        let habits = JSON.parse(localStorage.getItem(daysOfWeek[i])) || [];
        habits.forEach(habit => {
            if (habit.id === item.dataset.id) {
                habit.finishDate = currentDate.toDateString();
            }
        });
        localStorage.setItem(daysOfWeek[i], JSON.stringify(habits));
    }*/

    loadHabits();
}

function toggleComplete(id) {
    const dayOfWeek = getCurrentDayOfWeek();
    const currentDateString = currentDate.toDateString();
    let habits = JSON.parse(localStorage.getItem(dayOfWeek)) || [];
    habits.forEach(habit => {
        if (habit.id === id) {
            if (!habit.completedDates) habit.completedDates = [];
            const index = habit.completedDates.indexOf(currentDateString);
            if (index > -1) {
                habit.completedDates.splice(index, 1);
            } else {
                habit.completedDates.push(currentDateString);
            }
        }
    });
    localStorage.setItem(dayOfWeek, JSON.stringify(habits));
}

function changeDay(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateDateDisplay();
    loadHabits();
    updateButtonLabel();
}

function updateDateDisplay() {
    currentDateElement.innerText = currentDate.toDateString();
}

function updateButtonLabel() {
    const daysOfWeek = ['domingos', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábados'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    addHabitBtn.textContent = `Añadir hábito para los ${dayOfWeek}`;
}

function getCurrentDayOfWeek() {
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return daysOfWeek[currentDate.getDay()];
}


////////////////////////////////////////////

// *-*-*-*-*-*-*-*-*-*-*-* GRAFICOS *-*-*-*-*-*-*-*-*-*--*

////////////////////////////////////////////

document.getElementById('prevWeek').addEventListener('click', function() {

    if(auxMonthChart)
    {
        currentWeekOffset = currentWeekOffset - 3;
    }
    currentWeekOffset--;

    updateHabitChart();

});

document.getElementById('nextWeek').addEventListener('click', function() {

    if(auxMonthChart)
    {
        currentWeekOffset = currentWeekOffset + 3;
    }
    currentWeekOffset++;
    
    updateHabitChart();

});



const timeRangeSelect = document.getElementById('timeRange');
const habitChartCanvas = document.getElementById('habitChart');
let habitChart;

// Escuchar el cambio en el rango de tiempo
timeRangeSelect.addEventListener('change', () => {
    updateHabitChart();
});

let currentWeekOffset = 0;

function updateHabitChart() {
    const range = timeRangeSelect.value;
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7)));

    const habitData = getHabitCompletionData(range, startOfWeek);
    const labels = habitData.labels;
    const data = habitData.data;

    if (habitChart) {
        habitChart.destroy();
    }

    habitChart = new Chart(habitChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Porcentaje de hábitos completados',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: 'white', // Cambia el color del texto del eje y a blanco
                        callback: function(value) {
                            return value + "%";
                        }
                    }
                },
                x: {
                    ticks: {
                        color: 'white' // Cambia el color del texto del eje x a blanco
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Cambia el color del texto de la leyenda a blanco
                    }
                }
            }
        }
    });
    
}



function getHabitCompletionData(range, startOfWeek = new Date()) {
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const habitsByDay = {};
    const totalHabitsByDay = {};
    const today = new Date();
    
    let aux;
    let aux1;
    

    // Recorrer cada día de la semana y contar los hábitos completados y totales
    daysOfWeek.forEach(day => {
        aux = 0;
        aux1 =0;
        const habits = JSON.parse(localStorage.getItem(day)) || [];
        habits.forEach(habit => {
            //console.log("habit")
            for (let date = new Date(habit.startDate); date < new Date(habit.finishDate); date.setDate(date.getDate() + 1)) {
                const dateString = date.toDateString();

                if (!totalHabitsByDay[dateString]) {
                    totalHabitsByDay[dateString] = 0;
                    habitsByDay[dateString] = 0;
                }
                // if coincide day actual con la fecha actual del for entonces suma 1
                if(date.getDay() === daysOfWeek.indexOf(day)) {
                    //console.log(dateString);
                    totalHabitsByDay[dateString]++;
                    //console.log(totalHabitsByDay[dateString]);
                    if (habit.completedDates.includes(dateString)) {
                        //console.log("s");
                        habitsByDay[dateString]++;
                    }
                }
                
                //console.log(totalHabitsByDay[dateString]);
                //console.log(totalHabitsByDay[currentDate]);
                //console.log(habitsByDay[dateString]);

            }
        });
    });
    
    //console.log(currentDate);

    //console.log(totalHabitsByDay);
    //console.log(habitsByDay);
   

const labels = [];
const data = [];

if (range === 'days') {
    //const startOfWeek = new Date(today);
    //startOfWeek.setDate(today.getDate() - today.getDay());
    const result = calculateCompletionPercentage(habitsByDay, totalHabitsByDay, startOfWeek, 7);
    labels.push(...result.labels);
    data.push(...result.data);
    auxMonthChart = false;
} else if (range === 'weeks') {
    //console.log("si")
    const pastTenWeeks = [];
    const daysPerWeek = 7;

    // Obtener las últimas 10 semanas
    for (let i = 0; i < 10; i++) {
        const weekStart = new Date(startOfWeek);
        weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + (i * 7)));
        pastTenWeeks.push(weekStart);
    }

    // Calcular el porcentaje semanal promedio usando la función de días
    pastTenWeeks.reverse().forEach(weekStart => {
        const result = calculateCompletionPercentage(habitsByDay, totalHabitsByDay, weekStart, daysPerWeek);
        const weeklyPercentage = result.data.reduce((sum, value) => sum + value, 0) / daysPerWeek; // Promedio semanal
        labels.push(`Semana ${getWeekNumber(weekStart)}`);
        data.push(weeklyPercentage);
    });
    auxMonthChart = false;
} else if (range === 'months') {
    auxMonthChart = true;
    const pastTwelveMonths = [];
    const daysPerMonth = 30; // Aproximadamente 30 días por mes

    for (let i = 0; i < 12; i++) {
        const monthStart = new Date(startOfWeek);
        monthStart.setMonth(monthStart.getMonth() - i);
        monthStart.setDate(1); // Establecer al primer día del mes
        pastTwelveMonths.push(monthStart);
    }

    pastTwelveMonths.reverse().forEach(monthStart => {
        const endOfMonth = new Date(monthStart);
        endOfMonth.setMonth(monthStart.getMonth() + 1);
        endOfMonth.setDate(0); // Establecer al último día del mes
        const result = calculateCompletionPercentage(habitsByDay, totalHabitsByDay, monthStart, endOfMonth.getDate());
        const monthlyTotal = result.data.reduce((sum, value) => sum + value, 0); // Sumar los porcentajes diarios
        const monthlyPercentage = monthlyTotal / endOfMonth.getDate(); // Promedio mensual

        labels.push(monthStart.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }));
        data.push(monthlyPercentage);
    });


}


return { labels, data };
//aa
}


function calculateCompletionPercentage(habitsByDay, totalHabitsByDay, startDate, daysCount) {
    const labels = [];
    const data = [];

    for (let i = 0; i < daysCount; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateString = date.toDateString();
        labels.push(dateString);
        const total = totalHabitsByDay[dateString] || 1; // Evitar división por cero
        const completed = habitsByDay[dateString] || 0;
        data.push((completed / total) * 100);
    }

    return { labels, data };
}


function getWeekNumber(d) {
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}




document.addEventListener('DOMContentLoaded', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    var navbarCollapse = document.getElementById('navbarCollapse');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Verificar si el botón de la barra de navegación está visible
            if (window.innerWidth < 768) { // O el ancho que defina tu punto de ruptura
                var bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: true
                });
            }
        });
    });
});

