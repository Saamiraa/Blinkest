const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  };
  
  const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  
  const accounts = [account1, account2, account3, account4];
  
  // Elements
  const labelWelcome = document.querySelector('.welcome');
  const labelDate = document.querySelector('.date');
  const labelBalance = document.querySelector('.balance__value');
  const labelSumIn = document.querySelector('.summary__value--in');
  const labelSumOut = document.querySelector('.summary__value--out');
  const labelSumInterest = document.querySelector('.summary__value--interest');
  const labelTimer = document.querySelector('.timer');
  
  const containerApp = document.querySelector('.app');
  const containerMovements = document.querySelector('.movements');
  
  const btnLogin = document.querySelector('.login__btn');
  const btnTransfer = document.querySelector('.form__btn--transfer');
  const btnLoan = document.querySelector('.form__btn--loan');
  const btnClose = document.querySelector('.form__btn--close');
  const btnSort = document.querySelector('.btn--sort');
  
  const inputLoginUsername = document.querySelector('.login__input--user');
  const inputLoginPin = document.querySelector('.login__input--pin');
  const inputTransferTo = document.querySelector('.form__input--to');
  const inputTransferAmount = document.querySelector('.form__input--amount');
  const inputLoanAmount = document.querySelector('.form__input--loan-amount');
  const inputCloseUsername = document.querySelector('.form__input--user');
  const inputClosePin = document.querySelector('.form__input--pin');

  const displayMovments = function(movements, sort =
    false) {
    containerMovements.innerHTML = '';
      const movs = sort ? movements.slice().sort((a,b)=> a-b) : movements;

    movs.forEach(function (mov, index){
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
          <div class="movements__value">${mov}</div>
        </div> 
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html)
    })
  }

//get first username => Samira Mousaie => sm
//exmaple
// const user = 'Samira Mousaie FRONTEND';
// const username = user.toLowerCase().split(' ').map(function(name){
//   return name[0]
// }).join('')
// console.log(username)
//smf


const createUsernames = function(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('')
  })
}
createUsernames(accounts)
//console.log(accounts)

const updateUI = function(acc) {
  
    //Display movments
    displayMovments(acc.movements);

    //Display balance
    calcDisplayBalance(acc);

    //Display summery
    calDisplaySummery(acc)
}



//calculation the movments and show total
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};


//caclulate summary of pisitives numbers;
const calDisplaySummery = function (acc) {
  const incomes = acc.movements.filter(function(mov){
    if (mov > 0) {
      return mov
    }
  }).reduce(function(acc, mov){
    return acc+mov
  },0)
  labelSumIn.textContent = `${incomes}`;

  const out = acc.movements.filter(function(mov){
    if (mov < 0) {
      return mov
    }
  }).reduce(function(acc, mov){
    return acc+mov
  },0)
  labelSumOut.textContent = `${Math.abs(out)}`


  const interest = acc.movements.filter(function(mov){
    if (mov > 0) {
      return mov
    }
  }).map(function(deposit){
    return (deposit * acc.interestRate) / 100
  }).filter(function(int,i,arr){
    return int >= 1
  }).reduce(function(acc, int){
    return acc+int
  },0)
  labelSumInterest.textContent = `${interest}`
}




//login a user

let currentAccount;
btnLogin.addEventListener('click', function(e) {
  //Prevent form from submitting
  e.preventDefault()
  //console.log('LOGIN')

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);
   //? used when the answer is not correct and we dont want error just show undefine
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI nad message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;


    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur() // این فوکوسش رو از دست میده

    updateUI(currentAccount)
  }
})



//Tranfer section

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault() // چون این در فرم هست فر خود به خود ریلود میشه و اطلاعات میپره برای اینکه از ریولد شدن جلوگیری کنیم از این استفاده میکنیم
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
//console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
    // ?. it checks if the user exist if it isnt undefne
    // the current user cant transfer to its won
  )
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);


    //Update UI
    updateUI(currentAccount)


    //clean the focus
    inputTransferAmount.value = inputTransferTo.value = ''
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

    //Delete accoint
    accounts.splice(index, 1) // index is for calculation of which index must delete and 1 is for 1 element in slice should be delete

    //hide UI
    containerApp.style.opacity = 0;

    //clean the focus
    inputCloseUsername.value = inputClosePin.value = ''
  }
})

//loan botton

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov =>
    mov >= amount * 0.1)) {
  // Add movment
      currentAccount.movements.push(amount);

      //update UI
      updateUI(currentAccount)
    }
    inputLoanAmount.value= '';
})


//sorting button
let sorted = false; //its defualt unsorted
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovments(currentAccount.movements, !sorted) //if its unsorte sort, if its sorted unsorted
  sorted = !sorted //true to false, false to true
})



//adding all the movmets into one

// const accountMovements = accounts.map(function(acc){
//   return acc.movements
// })
// console.log(accountMovements);
// const allMovments = accountMovements.flat();
// console.log(allMovments)
// const overlaBalance = allMovments.reduce(function(acc,mov){
//   return acc + mov
// },0)
// console.log(overlaBalance)


//soultion2
const overlaBalance = accounts
  .map(acc=> acc.movements)
  .flat()
  .reduce((acc, mov)=> acc + mov , 0);
console.log(overlaBalance)



//Array Method Paractice
//1.
const bankDepositSum = accounts.map(acc => acc.
  movements)
  .flat()
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0)
console.log(bankDepositSum)


//2.
const deposites1000 = accounts.map(acc => acc.
  movements)
  .flat()
  .filter(mov => mov >= 1000).length;
console.log(deposites1000)

//3.
//get the sum of deposits and wittdrawal in object
const sums = accounts.map(acc => acc.
  movements)
  .flat()
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.
        withdrawals += cur);
        return sums
    },
    { deposits: 0, withdrawals: 0}
  )
console.log(sums)



  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // LECTURES














  
  const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
  ]);
  
  