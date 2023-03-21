"use strict";
const c_coins = document.querySelector(".coins");
const theme = document.querySelector(".theme");

const sel = document.querySelector(".s_themes");
const img = document.querySelector(".img");
const img2 = document.querySelector(".img2");
const select = document.querySelector(".s_coins");

const clear = document.querySelector('.clear')
const divCoins = document.querySelector('.coins')

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
    name: "another",
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
  return fetch(apiCoin + "coins/list")
    .then((response) => {
      if (response.ok === false) return Promise.reject(response);
      return response.json();
    })
    .then(addCoinsInSelect)
    .finally(() => img.classList.add("hidden"))
    .catch((error) => {
      select.innerHTML = "<option>Error</option>";
      select.disabled = true;
    });
};

const priceCoins = (apiURL, id) => {
  return fetch(apiURL)
    .then((response) => {
      if (response.ok === false) return Promise.reject(response);;
      return response.json();
    })
    .then((data) => {
      paint(data, id);
    });
};

const paint = (data, id) => {
  
  const elem = document.createElement("div");
  elem.classList.add("elem");

  const price = data[id][vs] ? data[id][vs] : "00.00";
  let name = id;
  if (id.length > 10) name = id.slice(0, 9) + "..";

  elem.innerHTML = `
              <h2 class="name">${name}</h2>
              <p>
               <span class="price">${price}</span> <span class="valuts">(${vs})</span>
              </p>
              `;
  const update = document.createElement("img");
  update.classList.add("update");
  update.src = "./img/upadate.png";
  update.onclick = () => actualInfo(id, elem.querySelector('.price'),elem);

  if (data[id][vs] !== undefined) elem.innerHTML += `<a href="./description.html?id=${id}">open description</a>`;
  elem.append(update);
  c_coins.append(elem);

  img2.classList.add("hidden");
};
//[bt]

const actualInfo = (id, priceSpan,elem) => {
  const urlPriseSimple = currenciesCriptoApi(id);
  elem.classList.add('loading')
  
  fetch(urlPriseSimple)
    .then((response) => {
      if (response.ok !== true) return  Promise.reject('error')
      return response.json();
     
    })
    .then((data) => {
      priceSpan.textContent = data[id][vs];
    })
    .finally(()=>elem.classList.remove('loading'))
    .catch((error) => console.log(error))
};
//

const optFromLocal = () => {
  if (coins.length === 0) return;
  const urlPriseSimple =
    apiCoin + "simple/price?ids=" + coins.join("%2C") + "&vs_currencies=" + vs;
  fetch(urlPriseSimple)
    .then((response) => {
      if (response.ok !== true) return Promise.reject('error')
      return response.json();
    })
    .then((data) => {
      for (const key in data) {
        paint(data, key);
      }
    })
    .catch((e) => console.log(e));
};

// ! events

select.onchange = (e) => {
  coins.push(select.value);
  localStorage.setItem("coins", JSON.stringify(coins));

  const apiURL = currenciesCriptoApi(select.value);
  priceCoins(apiURL, select.value);
  img2.classList.remove("hidden");
};


clear.onclick = () => {
  divCoins.innerHTML = ''
  localStorage.clear()
}

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

// theme.onclick = () => {
//   const name = sel.value;
//   const them = themes.find((el) => el.name === name);
//   localStorage.setItem("theme", JSON.stringify(them));

//   // painThema(them);
// };

//! start

const start = () => {
  coinsFetch();
  optFromLocal();
  createOption();
  // painThema(setings);

  // sel.value = setings.name ? setings.name : "white";
};

start();

