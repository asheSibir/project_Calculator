'use strict';
let salaryAmount = document.querySelector('.salary-amount'),
    expensesItemsBlock = document.querySelector('.expenses-items'),
    expensesTitle = expensesItemsBlock.querySelector('input'),
    expensesAmount = expensesItemsBlock.querySelector('.expenses-amount'),
    btnExpAdd = document.querySelector('.btn_plus'),
    checkBox = document.getElementById('deposit-check'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    result = document.querySelector('.result'),
    resultData = result.querySelectorAll('input'),
    budgetMonth = resultData[0],
    budgetDay =  resultData[1],
    expensesMonth = resultData[2],
    incomePeriod = resultData[3],
    timeTarget = resultData[4],
    start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),
    inputTitle = document.querySelector('[placeholder="Наименование"]');

const appData = {
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    income: {}, 
    incomeMonth: 0,
    expenses: [],
    expensesMonth: 0,
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    controlInInput: function() {
        if(!(salaryAmount.value - 1) || salaryAmount.value === ''){
            alert('Ошибка ввода! Для вычислений необходимо ввести число!');
            salaryAmount.value = '';
        } localStorage.income = salaryAmount.value;

        salaryAmount.classList.add('amount');
        expensesAmount.classList.add('amount');
        targetAmount.classList.add('amount');
    },
    controlAmounts: function(event){
       if(!(event.key / 1 > 0)){
           alert('Вводите только цифровые значения!');
           event.target.value = '';
       }
    },
    controlInputsText: function(){
        let allowedSigns = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'э', 'ю', 'я', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Э', 'Ю', 'Я', '!', ',', '.', '?', ' '];
        const symbol = allowedSigns.find(sign => sign === expensesTitle.value.substring(0, 1));
        let newDiv = 0;
        if (!symbol){
            let newDiv = 0;
            newDiv = document.createElement('div');
            expensesTitle.before(newDiv);
            newDiv.innerHTML = 'Вводите русские буквы!';
            newDiv.style.color = 'red';
            newDiv.classList.add('redText');
            expensesTitle.value = '';  
       } 
    },
    moveRange: function(){
        periodAmount.innerHTML = periodSelect.value;
    },
    addBlock: function(){
        const _this = this;
        let clone = expensesItemsBlock.cloneNode(true);
        expensesItemsBlock.after(clone);
        clone.classList.add('clone');
        let inputs = clone.querySelectorAll('[type="text"]');
        inputs[0].value = '';
        inputs[1].value = '';
        inputs[1].addEventListener('keyup', _this.controlAmounts);
        let blocks = document.querySelectorAll('.expenses-items');
        if (blocks.length > 2) {
            btnExpAdd.style.display = 'none';
        }
    },
    getExpenses: function(){
        let expenses = document.querySelectorAll('.expenses-amount');
        let sumExp = 0;
        for (let i = 0; i < expenses.length; i++){
            sumExp += +expenses[i].value;
        }
        return (sumExp);
    },
    getBudget: function(){
        let arg1 = salaryAmount.value / 1;
        let arg2 = this.getExpenses();
        return arg1 - arg2;
    },
    
    showResults: function(){ 
        expensesMonth.value = appData.getExpenses();
        budgetMonth.value = appData.getBudget();
        budgetDay.value = Math.round(appData.getBudget() / 30);
        incomePeriod.value = appData.getBudget() * periodSelect.value;
        timeTarget.value = Math.ceil(targetAmount.value / appData.getBudget());
    },
    changeButton: function(event){
        const _this = this;
        let userDataBlock = document.querySelector('.data'),
            userData = userDataBlock.querySelectorAll('input');
        if(event.target === start){
            start.style.display = 'none';
            cancel.style.display = 'block';
            userData.forEach((elem) => elem.setAttribute('disabled', true));
        } else {
            start.style.display = 'block';
            cancel.style.display = 'none';
            userData.forEach((elem) => elem.removeAttribute('disabled'));
            const inputs = document.querySelectorAll('input');
            inputs.forEach((elem) => elem.value = '');
            const tip = expensesItemsBlock.querySelectorAll('.redText');
            tip.forEach((tip) => tip.remove());
            periodSelect.value = 0;
            periodAmount.innerHTML = 0;
        }
        
    }
    
};
 
salaryAmount.addEventListener('input', appData.controlInInput);
inputTitle.addEventListener('blur', appData.controlInputsText);
expensesAmount.addEventListener('input', appData.controlInputsAmount);
salaryAmount.addEventListener('input', appData.controlInputsAmount);
targetAmount.addEventListener('input', appData.controlInputsAmount);
periodSelect.addEventListener('change', appData.moveRange);
btnExpAdd.addEventListener('click', appData.addBlock);
start.addEventListener('click', appData.showResults);
expensesAmount.addEventListener('keyup', appData.controlAmounts);
start.addEventListener('click', appData.changeButton);
cancel.addEventListener('click', appData.changeButton);





