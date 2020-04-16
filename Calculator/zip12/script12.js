'use strict';
//ПЕРЕМЕННЫЕ
//БЛОК DATA
//МЕСЯЧНЫЙ ДОХОД
let salaryAmount = document.querySelector('.salary-amount');
// ДОПОЛНИТЕЛЬНЫЙ ДОХОД    
let incomeItems = document.querySelectorAll('.income-items'),
    incomeTitle = document.querySelector('.income-title'),
    incomeAmount = document.querySelector('.income-amount');
//Возможный доход
let additionalIncome = document.querySelectorAll('.additional_income'),
    additionalIncomeTitle = document.querySelectorAll('.additional_income-item')[0],
    additionalIncomeAmount = document.querySelectorAll('.additional_income-item')[1];
// Обязательные расходы
let expensesItems = document.querySelectorAll('.expenses-items'),
    expensesTitle = document.querySelectorAll('.expenses-title')[1],
    expensesAmount = document.querySelector('.expenses-amount'), 
    amountExpenses = document.querySelectorAll('.expenses-amount');//добавлено
//Возможные расходы
let additionalExpenses = document.querySelector('.additional_expenses-item');
//Депозит
let depositCheck = document.getElementById('deposit-check');
//Цель
let targetAmount = document.querySelector('.target-amount');
//Период
let periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount');
//Кнопки
let btnPlus = document.getElementsByTagName('button'),
    incomePlus = btnPlus[0],
    expensesPlus = btnPlus[1];

//БЛОК РЕЗУЛЬТАТЫ
let budgetMonthValue = document.querySelector('.budget_month-value'), //Доход за месяц
    budgetDayValue = document.querySelector('.budget_day-value'), //Дневной бюджет
    expensesMonthValue = document.querySelector('.expenses_month-value'), //Расход за месяц
    addIncomeValue = document.querySelector('.additional_income-value'), //Возможные доходы
    addExpValue = document.querySelector('.additional_expenses-value'), //Возможные расходы
    incomePeriodValue = document.querySelector('.income_period-value'), //Накопления за период
    targetMonthValue = document.querySelector('.target_month-value'); //Срок достижения цели в месяцах

//Запуск/отмена
let start = document.getElementById('start'),
    cancel = document.getElementById('cancel');


const AppData = function () {
    budget = 0,
    budgetDay = 0,
    budgetMonth = 0,
    income = {}, 
    incomeMonth = 0,
    addIncome = [],
    expenses = [],
    addExpenses = [], 
    expensesMonth = 0,
    deposit = false,
    percentDeposit = 0,
    moneyDeposit = 0;
};
AppData.prototype.start = function(){
        
        this.budget = +salaryAmount.value; //месячный доход
        this.getExpenses(); //расчет расходов        
        this.getIncome();// расчет доходов
        this.getExpensesMonth(); // выведение ежемесячных расходов
        this.getAddExpenses();//  выведение дополнительных расходов
        this.getAddIncome();//  выведение дополнительных доходов
        this.getBudget(); // расчет бюджета
        this.calcPeriod(); // калькулирование бюджета
        this.showResult(); // запуск расчета
};
AppData.prototype.showResult = function(){
        budgetMonthValue.value = this.budgetMonth; //полю с результатами Доход за месяц присвоить значение budgetMonth
        budgetDayValue.value = Math.round(this.budgetDay);//полю с результатами Дневной бюджет присвоить значение budgetDay
        expensesMonthValue.value = this.getExpensesMonth(); //Расход за месяц = свойство expensesMonth
        addIncomeValue.value = this.addIncome.join(', '); // Возможные доходы = строка из массива addIncome
        addExpValue.value = this.addExpenses.join(', ');//Возможные доходы = строка из массива addExpenses
        periodSelect.addEventListener('change', this.moveRange); // движение движка
        //incomePeriodValue = countSavedMoney();
        targetMonthValue.value = Math.ceil(this.getTargetMonth());//Срок достижения цели в месяцах = getTargetMonth
        incomeItems.value = this.getIncome();
        incomePeriodValue.value = this.calcPeriod(); //Срок достижения цели в месяцах = результат функции calcPeriod
    };
AppData.prototype.addExpensesBlock = function(){ //добавление инпутов плюсиком (Обязательные расходы)
        
        let cloneexpensesItem = expensesItems[0].cloneNode(true); // создали клон
        let inputOfClone = cloneexpensesItem.querySelectorAll('input');
        inputOfClone[0].value = ''; //Чистые новые поля ввода
        inputOfClone[1].value = ''; //Чистые новые поля ввода
        expensesItems[0].parentNode.insertBefore(cloneexpensesItem, expensesPlus); // указали, куда его вставлять
        //УСЛОВИЕ ПРОПАДАНИЯ ПЛЮСИКА
        expensesItems = document.querySelectorAll('.expenses-items');
        if(expensesItems.length === 3){
            expensesPlus.style.display = 'none';  
        }
}; 
AppData.prototype.addIncomeBlock = function(){ // добавление инпутов плюсиком (ДОПОЛНИТЕЛЬНЫЙ ДОХОД)
        let cloneIncomeItems = incomeItems[0].cloneNode(true);
        let inputOfClone = cloneIncomeItems.querySelectorAll('input');
        inputOfClone[0].value = ''; //Чистые новые поля ввода
        inputOfClone[1].value = ''; //Чистые новые поля ввода
        incomeItems[0].parentNode.insertBefore(cloneIncomeItems, incomePlus);
        incomeItems = document.querySelectorAll('.income-items');
        if (incomeItems.length === 3){
            incomePlus.style.display = 'none';
        }

    };
AppData.prototype.getExpenses = function(){ //Получение расходов. Запись в объект введенных значений
        expensesItems.forEach(function(item){ //для каждого блока данных
            const _this = this;
         let itemExpenses = item.querySelector('.expenses-title').value; //значение поля наименование
         let cashExpenses = item.querySelector('.expenses-amount').value; //значение поля сумма
            if(itemExpenses !== '' && cashExpenses !== ''){ //есть поля непустые
               _this.expenses[itemExpenses] = cashExpenses; // ключ - наименование, свойство - сумма
            }
        });
    },
AppData.prototype.getIncome = function(){ //Получение доп доходов.
        additionalIncome.forEach(function(item){
            const _this = this;
            let itemAddIncomeTitle = additionalIncomeTitle.value;
            let itemAddIncomeAmount = additionalIncomeAmount.value;
             if(itemAddIncomeTitle !== '' && itemAddIncomeAmount !== ''){
                 _this.addIncome[itemAddIncomeTitle] = itemAddIncomeAmount;
             }
        });
    },
AppData.prototype.getAddExpenses = function(){ //Возможные расходы (это 1 поле). Просто наводим красоту
        let addExpenses = additionalExpenses.value.split(','); //строку преобразуем в массив
        addExpenses.forEach(function(item){ //для каждого элемента массива
            const _this = this;
            item = item.trim();//убираем лишние пробелы
            if(item !== ''){//делает проверку на пустоту
                _this.addExpenses.push(item);//добавляем в конец массива 
            }
        });
    },
AppData.prototype.getAddIncome = function(){ //получение Возможных доходов. Просто наводим красоту.
        let addIncome = additionalIncomeTitle.value.split(',');
        addIncome.forEach(function(item){
            const _this = this;
            item = item.trim();
            if (item !== ''){
                _this.addIncome.push(item);
            }
        });
    },
AppData.prototype.getExpensesMonth = function () { //расчет расходов // TODO
    for (let key in this.expenses){
        this.expensesMonth += +this.expenses[key];
    }   
};
        
AppData.prototype.getSumOutcome = function () {
        let cashExpenses = document.querySelectorAll('.expenses-amount');
        cashExpenses.reduce(function(previousValue, currentValue) {
            return previousValue + currentValue;
        });
};
AppData.prototype.getBudget = function () {
        appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
        appData.budgetDay = Math.floor(appData.budgetMonth / 30);
};
AppData.prototype.getTargetMonth = function () {
        return targetAmount.value / appData.budgetMonth;
};
AppData.prototype.getStatusIncome = function () {
        if (appData.budgetDay > 800) {
            return ('Высокий уровень дохода');
        } else if (appData.budgetDay > 300) {
            return ('Средний уровень дохода');
        } else if (appData.budgetDay > 0) {
            return ('Низкий уровень дохода');
        } else {
            return('Что-то пошло не так!');
        }
};
AppData.prototype.getInfoDeposit = function(){
    if (this.deposit){
        do{
            this.percentDeposit = prompt('А под какой процент?','10%');
        } while (isNaN(this.moneyDeposit) || this.moneyDeposit === null || this.moneyDeposit ===' ');
        do{
            this.moneyDeposit = prompt('Какая сумма депозита?','10000');
        } while (this.percentDeposit === ' ' || this.percentDeposit === null || isNaN(this.percentDeposit));
        
    }
};
AppData.prototype.calcPeriod = function (){
        return appData.budgetMonth * periodSelect.value;
};
AppData.prototype.moveRange = function(event){ //переключение RANGE
    console.log('it moves!'); 
    let count = 1;
    if (event){
        periodAmount.innerHTML = periodSelect.value;
    }
};
AppData.prototype.stopping = function(event){
        if (salaryAmount.value === ''){
            let notice = confirm('Ошибка, поле "Месячный доход" должно быть заполнено! Для расчета обновите страницу');
        } else {
            this.start();
        }
};
AppData.prototype.blockInput = function(event){
       
    let allowedSigns = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'э', 'ю', 'я', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Э', 'Ю', 'Я', '!', ',', '.', '?', ' '];
    const symbol = allowedSigns.find(sign => sign === expensesTitle.value.substring(0, 1));
        if (!symbol){
            expensesTitle.value = '';
       }
};
AppData.prototype.blocksalaryAmount = function(event){ 
        if (salaryAmount.value / 10 > 0){
            return;
        } else {
            salaryAmount.value = '';
        }
};
AppData.prototype.blockincomeAmount = function(event){
        if (incomeAmount.value / 10 > 0){
            return;
        } else {
            incomeAmount.value = '';
        }
};
AppData.prototype.blockadditionalIncomeAmount = function(event){
        if (additionalIncomeAmount.value / 10 > 0){
            return;
        } else {
            additionalIncomeAmount.value = '';
        }
};
AppData.prototype.blockexpensesAmount = function(event){
        if (expensesAmount.value / 10 > 0){
            return;
        } else {
            expensesAmount.value = '';
        }
};
AppData.prototype.blocktargetAmount = function(event){
        if (targetAmount.value / 10 > 0){
            return;
        } else {
            targetAmount.value = '';
        }
};
AppData.prototype.blockperiodAmount = function(event){
        if (periodAmount.value / 10 > 0){
            return;
        } else {
            periodAmount.value = '';
        }
};
AppData.prototype.startingSet = function(event){ //ОСТАНОВКА ПЕРВОГО ЦИКЛА, ИЗМЕНЕНИЕ ДАННЫХ НЕВОЗМОЖНО
    if (event){
        let leftBlock = document.querySelector('div');
        let inputs = leftBlock.querySelectorAll('[type="text"]');
        for (let input in inputs){
            if (input <= 10){
                let dataOfUser = inputs[input].value;
                console.log('Сработал Рассчитать');
                inputs[input].setAttribute('disabled', true);
            } 
        }
        //КНОПКИ
        start.style.display = 'none';
        cancel.style.display = 'block';
    }
};
AppData.prototype.reset = function(event){ //ЗАПУСК НОВОГО РАСЧЕТА
    if (event){
        cancel.style.display = 'none';
        start.style.display = 'block';
    // АКТИВАЦИЯ НЕАКТИВНЫХ ИНПУТОВ            
        let inputs = document.querySelectorAll('[type="text"]');
        inputs.forEach(function(elem){
            elem.removeAttribute("disabled");
        });
    }    
};

 
start.addEventListener('click', this.stopping); //Запуск старта
expensesTitle.addEventListener('keyup', this.blockInput);
incomeTitle.addEventListener('keyup', this.blockInput);
salaryAmount.addEventListener('keyup', this.blocksalaryAmount);
incomeAmount.addEventListener('keyup', this.blockincomeAmount);
additionalIncomeAmount.addEventListener('keyup', this.blockadditionalIncomeAmount);
expensesAmount.addEventListener('keyup', this.blockexpensesAmount);
targetAmount.addEventListener('keyup', this.blocktargetAmount);
periodAmount.addEventListener('keyup', this.blockperiodAmount);
expensesPlus.addEventListener('click', this.addExpensesBlock); //Активация плюсиков
incomePlus.addEventListener('click', this.addIncomeBlock);
periodSelect.addEventListener('change', this.moveRange); // движение движка
start.addEventListener('click', this.startingSet);
cancel.addEventListener('click', this.reset);



