'use strict';

//БЛОК DATA
//МЕСЯЧНЫЙ ДОХОД
let salaryAmountRemake = document.querySelector('.salary-amount');
// ДОПОЛНИТЕЛЬНЫЙ ДОХОД    
let incomeItemsRemake = document.querySelectorAll('.income-items'),
    incomeTitleRemake = document.querySelector('.income-title'),
    incomeAmountRemake = document.querySelector('.income-amount');
//Возможный доход
let additionalIncomeRemake = document.querySelectorAll('.additional_income'),
    additionalIncomeTitleRemake = document.querySelectorAll('.additional_income-item')[0],
    additionalIncomeAmountRemake = document.querySelectorAll('.additional_income-item')[1];
// Обязательные расходы
let expensesItemsRemake = document.querySelectorAll('.expenses-items'),
    expensesTitleRemake = document.querySelectorAll('.expenses-title')[1],
    expensesAmountRemake = document.querySelector('.expenses-amount');
    //amountExpenses = document.querySelectorAll('.expenses-amount');//добавлено
//Возможные расходы
let addExpItem = document.querySelector('.additional_expenses-item');
//Депозит
let checkBox = document.getElementById('deposit-check');
//Цель
let targetAmountRemake = document.querySelector('.target-amount');
//Период
let periodSelectRemake = document.querySelector('.period-select'),
    periodAmountRemake = document.querySelector('.period-amount');
//Кнопки
// let btnPlus = document.getElementsByTagName('button'),
//     incomePlus = btnPlus[0],
//     expensesPlus = btnPlus[1];
let btnExpAdd = document.querySelector('.expenses_add'),
    btnIncAdd = document.querySelector('.income_add');


//БЛОК РЕЗУЛЬТАТЫ
let budgetMonthValueRemake = document.querySelector('.budget_month-value'), //Доход за месяц
    budgetDayValueRemake = document.querySelector('.budget_day-value'), //Дневной бюджет
    expensesMonthValueRemake = document.querySelector('.expenses_month-value'), //Расход за месяц
    addIncomeValueRemake = document.querySelector('.additional_income-value'), //Возможные доходы
    addExpValueRemake = document.querySelector('.additional_expenses-value'), //Возможные расходы
    incomePeriodValueRemake = document.querySelector('.income_period-value'), //Накопления за период
    targetMonthValueRemake = document.querySelector('.target_month-value'); //Срок достижения цели в месяцах

//Запуск/отмена
let startRemake = document.getElementById('start'),
    cancelRemake = document.getElementById('cancel');

const AppData = function () {
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {}; 
    this.expensesMonth = 0;
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.addExpenses = [];
};
AppData.prototype.check = function () {
    if (salaryAmountRemake.value !== ''){
        startRemake.removeAttribute('disabled');
    }
};
AppData.prototype.start = function () {
    if (salaryAmountRemake.value !== ''){
        startRemake.setAttribute('disabled', 'true');
    } 
    let allInput = document.querySelectorAll('.data input[type = text]');
    allInput.forEach(function(item){
        item.setAttribute('disabled', 'true');
    });
    btnExpAdd.setAttribute('disabled', 'true');
    btnIncAdd.setAttribute('disabled', 'true');
    startRemake.style.display = 'none';
    cancelRemake.style.display = 'block';

    this.budget = +salaryAmountRemake.value;

        this.getExpenses();         
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getBudget(); 
        this.getInfoDeposit();
        this.getStatusIncome();
        this.showResult(); 

};
AppData.prototype.showResult = function(){
    const _this = this;
    budgetMonthValueRemake.value = this.budgetMonth;
    budgetDayValueRemake.value = Math.round(this.budgetDay);
    expensesMonthValueRemake.value = this.expensesMonth;
    addExpValueRemake.value = this.addExpenses.join(', ');
    addIncomeValueRemake.value = this.addIncome.join(', '); 
    targetMonthValueRemake.value = Math.ceil(this.getTargetMonth());
    incomePeriodValueRemake.value = this.calcPeriod();
    periodSelectRemake.addEventListener('change', function () {
        incomePeriodValueRemake.value = _this.calcPeriod();
    }); 
};
AppData.prototype.addExpensesBlock = function(){ 
        
    let cloneexpensesItem = expensesItemsRemake[0].cloneNode(true); 
    let inputOfClone = cloneexpensesItem.querySelectorAll('input');
    inputOfClone[0].value = ''; 
    inputOfClone[1].value = ''; 
    expensesItemsRemake[0].parentNode.insertBefore(cloneexpensesItem, expensesPlus); 
    expensesItemsRemake = document.querySelectorAll('.expenses-items');
    if(expensesItemsRemake.length === 3){
        btnExpAdd.style.display = 'none';  
    }
}; 
AppData.prototype.addIncomeBlock = function(){ 
    let cloneIncomeItems = incomeItemsRemake[0].cloneNode(true);
    let inputOfClone = cloneIncomeItems.querySelectorAll('input');
    inputOfClone[0].value = ''; 
    inputOfClone[1].value = ''; 
    incomeItemsRemake[0].parentNode.insertBefore(cloneIncomeItems, incomePlus);
    
    if (incomeItemsRemake.length === 3){
        btnIncAdd.style.display = 'none';
    }
};
AppData.prototype.getExpenses = function(){ 
    expensesItemsRemake.forEach(function(item){ 
     let itemExpenses = item.querySelector('.expenses-title').value;
     let cashExpenses = item.querySelector('.expenses-amount').value; 
        if(itemExpenses !== '' && cashExpenses !== ''){ 
           appData.expenses[itemExpenses] = cashExpenses; 
        }
    });
};
AppData.prototype.getIncome = function(){ //Получение доп доходов.
    incomeItemsRemake.forEach(function(item){
        let itemIncome = item.querySelector('.income-title').value;
        let cashIncome = item.querySelector('.income-amount').value;
         if(itemIncome !== '' && cashIncome !== ''){
             appData.income[itemIncome] = cashIncome;
         }
    });
    for (let key in this.income){
        this.incomeMonth += +this.income[key];
    }
};
AppData.prototype.getAddExpenses = function(){ 
    let addExpenses = addExpItem.value.split(',');
    addExpenses.forEach(function(item){ 
        item = item.trim();
        if(item !== ''){
            appData.addExpenses.push(item);
        }
    });
};
AppData.prototype.getAddIncome = function(){ //получение Возможных доходов. Просто наводим красоту.
    let addIncItem = additionalIncomeTitleRemake.value.trim();
    addIncItem.forEach(function(item){
        item = item.trim();
        if (item !== ''){
            appData.addIncome.push(item);
        }
    });
};
AppData.prototype.getExpensesMonth = function () { 
    for (let key in this.expenses){
        this.expensesMonth += +this.expenses[key];
    }   
};
AppData.prototype.getBudget = function () {
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
};
AppData.prototype.getTargetMonth = function () {
    return targetAmountRemake.value / this.budgetMonth;
};
AppData.prototype.getStatusIncome = function () {
    if (this.budgetDay > 800) {
        return ('Высокий уровень дохода');
    } else if (this.budgetDay > 300) {
        return ('Средний уровень дохода');
    } else if (this.budgetDay > 0) {
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
    return this.budgetMonth * periodSelectRemake.value;
};
AppData.prototype.reset = function(event){
    let inputTextData = document.querySelectorAll('.data input[type="text"]');
    let resultInputAll = document.querySelectorAll('.result input[type="text"]'); 

    inputTextData.forEach(function (elem) {
        elem.value = '';
        elem.removeAttribute('disabled');
        periodSelectRemake.value = '0';
        periodAmountRemake.innerHTML = periodSelectRemake.value;
    });
    resultInputAll.forEach(function (elem) {
        elem.value = '';
    });
    for (let i = 1; i < incomeItemsRemake.length; i++){
        incomeItemsRemake[i].parentNode.removeChild(incomeItemsRemake[i]);
        btnIncAdd.style.display = 'block';
    }
    this.budget = 0;         
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = []; 
    this.expenses = {};
    this.expensesMonth = 0;
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.addExpenses = [];

    cancelRemake.style.display = 'none';
    startRemake.style.display = 'block';
    btnIncAdd.removeAttribute('disabled');
    btnExpAdd.removeAttribute('disabled');
    checkBox.checked = false;   
};
AppData.prototype.eventsListeners = function(event, target, action){
    if (event) {
        return `${target}.addEventListener(${event}, ${action})`;
    }

};
AppData.prototype.listOfEventListeners = function(target){
    // if (expensesTitleRemake) { return expensesTitleRemake.addEventListener('keyup', AppData.blockInput)};
    // if (target = )    return incomeTitleRemake.addEventListener('keyup', AppData.blockInput);

    // if (target = )    return incomeAmountRemake.addEventListener('keyup', AppData.blockincomeAmount);
    // if (target = )    return additionalIncomeAmountRemake.addEventListener('keyup', AppData.blockadditionalIncomeAmount);
    // if (target = )    return expensesAmountRemake.addEventListener('keyup', AppData.blockexpensesAmount);
    // if (target = )    return targetAmountRemake.addEventListener('keyup', AppData.blocktargetAmount);
    // if (target = )    return periodAmountRemake.addEventListener('keyup', AppData.blockperiodAmount);
    // if (target = )    return btnExpAdd.addEventListener('click', AppData.addExpensesBlock);
    // if (target = )    return btnIncAdd.addEventListener('click', AppData.addIncomeBlock);

    if (target === startRemake) return startRemake.addEventListener('click', AppData.startingSet);
    // if (target = )    return cancelRemake.addEventListener('click', AppData.reset);
};

expensesTitleRemake.addEventListener('keyup', AppData.blockInput);
incomeTitleRemake.addEventListener('keyup', AppData.blockInput);

incomeAmountRemake.addEventListener('keyup', AppData.blockincomeAmount);
additionalIncomeAmountRemake.addEventListener('keyup', AppData.blockadditionalIncomeAmount);
expensesAmountRemake.addEventListener('keyup', AppData.blockexpensesAmount);
targetAmountRemake.addEventListener('keyup', AppData.blocktargetAmount);
periodAmountRemake.addEventListener('keyup', AppData.blockperiodAmount);
btnExpAdd.addEventListener('click', AppData.addExpensesBlock); //Активация плюсиков
btnIncAdd.addEventListener('click', AppData.addIncomeBlock);

startRemake.addEventListener('click', AppData.startingSet);
cancelRemake.addEventListener('click', AppData.reset);


const appDataRemake = new AppData();
console.log(appDataRemake);

