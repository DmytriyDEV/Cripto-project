"use strict";
const aboutCoins = document.querySelector(".aboutCoins");
const ol = document.querySelector(".ol");
const theme = document.querySelector(".theme");

const sel = document.querySelector(".s_themes");
const img = document.querySelector(".img");
const img2 = document.querySelector(".img2");
const select = document.querySelector(".s_coins");


const themes = [
  {
    name: "black",
    text: "white",
    body: "black",
    button: "red",
  },
  {
    name: "white",
    text: "black",
    body: "white",
    button: "green",
  },
  {
    name: "middl",
    text: "green",
    body: "yellow",
    button: "blue",
  },
];



const apiCoin = "https://api.coingecko.com/api/v3/";

const vs = "usd";

//! logical 

const currenciesCriptoApi = (idC) =>
  apiCoin + `simple/price?ids=${idC}&vs_currencies=${vs}`;

const localDate = JSON.parse(localStorage.getItem("coins"));
const coins = localDate === null ? [] : localDate;
 

const addCoinsInSelect = (arr) => {
  arr.forEach((el) => {
    const option = document.createElement("option");
    option.textContent = el.name;
    option.value = el.id;
    select.append(option);
  });
};

const coinsFetch = () => {
  console.log('-------1');  // 1
  return fetch(apiCoin + "coins/list")
  .then((response) => {
    // console.log(response);
      console.log('-------2');
      if (response.ok === false)  return Promise.reject(response)
      return response.json();
    })
    .then((data) => {
      console.log('-------3');
      img.classList.add("hidden");
      addCoinsInSelect(data);
    })
    .catch(error => {
  
      select.innerHTML = '<option>Error</option>'
      select.disabled = true
      
    
      
    })
    console.log('-------5');
};

const priceCoins = (apiURL, id) => {
  return fetch(apiURL)
    .then((response) => { 
      if (response.ok === false) {
        console.log("Some ERROR!!!");
      }
      return response.json();
    })
    .then((data) => {
      paint(data, id);
     
    });
};


const paint = (data, id) => {

  const li = document.createElement("li");
  const btn = document.createElement("button");
  const description = document.createElement("a");
  const priceSpan = document.createElement("span");
  const valuteSpan = document.createElement("span");
  const pointSpan = document.createElement("span");
  const p1 = document.createElement("p");
  const pid = document.createElement("p");
  const p2 = document.createElement("p");



  const price = data[id][vs] ? data[id][vs] : 'no price';
  
  btn.textContent = 'update'
  priceSpan.textContent = price;
  pid.textContent = id;
  valuteSpan.textContent = vs;
  p1.textContent = ' - ( ';
  pointSpan.textContent = ' : ';
  p2.textContent = ' )';
  description.href = './description.html?id=' + id
  description.textContent = 'description'
  
  
  li.append(pid,p1,valuteSpan,pointSpan,priceSpan,p2,description)
  if (data[id][vs] !== undefined) li.append(btn);
 
  ol.append(li);
  img2.classList.add('hidden')


  btn.onclick = () => {
    actualInfo(id,priceSpan)
  }

};
//[bt]

const actualInfo = (id,priceSpan) => {
 
  const urlPriseSimple = currenciesCriptoApi(id)

  fetch(urlPriseSimple)
  .then((response) => {
    if (response.ok !== true) console.log('Error!');
    return response.json()
    
  })
  .then((data) => {
    console.log(data[id][vs]);
    
    priceSpan.textContent = data[id][vs]
  })
}

const optFromLocal = () => {
  if (coins.length === 0 ) return;
  const urlPriseSimple = apiCoin + "simple/price?ids=" + coins.join('%2C') + '&vs_currencies=' + vs;
  fetch(urlPriseSimple)
  .then((response) => {
    if (response.ok !== true) console.log('ERROR!');
     return response.json()
  })
  .then((data) => {

    for (const key in data) {
      paint(data,key)
      
    }
    
  })
 
} 



// ! events 

select.onchange = (e) => {
  coins.push(select.value);
  localStorage.setItem("coins", JSON.stringify(coins));

  const apiURL = currenciesCriptoApi(select.value);
  priceCoins(apiURL, select.value);
  img2.classList.remove('hidden')
};

// ! theme
const local = JSON.parse(localStorage.getItem("theme"));
const setings = local === null ? {} : local;

const createOption = () => {
  themes.forEach((el) => {
    const opt = document.createElement("option");
    opt.textContent = el.name;
    sel.append(opt);
  });
  sel.value = "white";
};

const painThema = (obj) => {
  document.body.style.background = obj.body;
  document.body.style.color = obj.text;
  document.styleSheets[0].cssRules[3].style.background = obj.button;
};


theme.onclick = () => {
  const name = sel.value; // str  black
  const them = themes.find((el) => el.name === name);
  localStorage.setItem("theme", JSON.stringify(them));

  painThema(them);
};

//! start


const start = () => {
  

  coinsFetch();
  optFromLocal()
  createOption();
  painThema(setings);

  sel.value = setings.name ? setings.name : "white";

 
};

start()


// //! //////////// ''''''''''''''''''''-----------------------
// const s_messages = document.querySelector(".s_messages");
// const s_users = document.querySelector(".s_users");
// const remove = document.querySelector(".remove");
// const create = document.querySelector(".create");
// const newMessage = document.querySelector(".newMessage");

// create.onclick = () => {
//   const user = users.find(el => el.id === +s_users.value)
//   const newMessag = {
//     text : newMessage.value,
//     id : user.mesage[user.mesage.length - 1].id + 1
//   }
//   user.mesage.push(newMessag)
//   newUserMessag(newMessag)
//   newMessage.value = '';
//   create.disabled = true
// }

// const newUserMessag = (obj) => {
//   const opt = document.createElement('option')
//   opt.textContent = obj.text
//   opt.value = obj.id
//   s_messages.append(opt)
// }

// newMessage.oninput = () => {

//   if (newMessage.value.trim() === '') return create.disabled = true;
//   create.disabled = false;

// }

// const users = [
//   {
//     name: "alex",
//     id: 2,
//     age: 44,
//     mesage: [
//       {
//         text: "assdasd",
//         id: 22,
//       },
//       {
//         text: "1231",
//         id: 23,
//       },
//       {
//         text: ";klk;lk;",
//         id: 24,
//       },
//     ],
//   },
//   {
//     name: "robert",
//     id: 3,
//     age: 11,
//     mesage: [
//       {
//         text: "heko",
//         id: 32,
//       },
//       {
//         text: "rob ",
//         id: 33,
//       },
//     ],
//   },
//   {
//     name: "alex",
//     id: 5,
//     age: 99,
//     mesage: [
//       {
//         text: "no",
//         id: 56,
//       },
//       {
//         text: "hello",
//         id: 55,
//       },
//       {
//         text: ";ok;lk;",
//         id: 51,
//       },
//     ],
//   },
// ];

// const paintSelect = () => {
//   users.forEach(el => {
//     const opt = document.createElement('option')
//     opt.value = el.id
//     opt.textContent = el.name
//     s_users.append(opt)
//   })

// }
// paintSelect()

// const userMessage = (obj) => {
//   s_messages.innerHTML = '<option hidden>choice message</option>'
//   obj.mesage.forEach(el => {
//     const opt = document.createElement('option')
//     opt.value = el.id
//     opt.textContent = el.text
//     s_messages.append(opt)
//   })

// }

// s_messages.onchange = () => {
//   const user = users.find(el => el.id === +s_users.value)
//   const messUser = user.mesage.find(el => el.id === +s_messages.value)
//   remove.disabled = false;
//   console.log(messUser);
// }

// s_users.onchange = () => {
//   const user = users.find(el => el.id === +s_users.value)//users [].find
//   remove.disabled = true;
//   newMessage.disabled = false;
//  userMessage(user)
// }

// remove.onclick = () => {
//    const user = users.find(el => el.id === +s_users.value)
//    const newMessage = user.mesage.filter(el => el.id !== +s_messages.value)
//    user.mesage = newMessage;
//    userMessage(user)
//    remove.disabled = true;
// }


//! 
// https://api.coingecko.com/api/v3/simple/price?ids=01coin%2C0chain&vs_currencies=usd
const back = 'https://api.coingecko.com/api/v3/'
const special = "simple/price"
const params  = '?'  
// param   !
// & 1 ids=01coin%2C0chain
// & 2 vs_currencies=usd

// const url = apiCoin + 'simple/price?ids' + select.value 

// const urlPriseSimple = 'https://api.coingecko.com/api/v3/' + "simple/price" + '?' + 'ids=' + coins.join('%2C') + '&' + 'vs_currencies=' + vs;
// console.log(urlPriseSimple);





// check error 429 
// creat modal for 429
// hidden spinner
// creat button for li 
// click log (id)


const dataO = {}

// const block1 = document.querySelector('.block1')
// const btn1 = document.querySelector('.btn1')
// const btn2 = document.querySelector('.btn2')
// const res3 = document.querySelector('.res3')

// dataO[1] = btn1; //! start



// console.log(data[1] === document.querySelector('.btn1')); // true
// btn1.onclick = () => {
//   console.log(1);
//   block1.innerHTML += 1;
//   console.log(data[1] === document.querySelector('.btn1')); // false
  
//   const btn1C = document.querySelector('.btn1')
//   dataO[2] = btn1C; // new cop btn

//   console.log(data[2] === document.querySelector('.btn1')); // true
  
//   btn1C.onclick = () => {
//     console.log(2);
//     block1.innerHTML += 2;
//     console.log(data[2] === document.querySelector('.btn1')); // false
//   }
 
// }



const d = {}
// const q = d;
// console.log(d === {});
// console.log(d === q);





// console.log(btn1);
// block1.textContent += ')';
// block1.textContent = block1.textContent +  ')';

// console.log(block1.innerHTML);

