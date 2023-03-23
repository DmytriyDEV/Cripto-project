const api = "https://api.coingecko.com/api/v3/";

const params = new URL(document.location).searchParams;
const id = params.get("id");
const coinApi = api + "coins/" + id;

const ctx = document.getElementById("myChart");
const time = new Date();
const day = time.getDate();
const month = time.getMonth() + 1;
const data = +(
  "" +
  time.getFullYear() +
  (month > 9 ? month : "0" + month) +
  (day > 9 ? day : "0" + day)
);

const h2 = document.querySelector("h2");
const img = document.querySelector("img");
const description = document.querySelector(".description");
const price = document.querySelector(".price");
const language = document.querySelector(".language");
const desc = document.querySelector(".desc");
const btnClear = document.querySelector(".clear");
const myChartID = document.querySelector(".myChart");
const bodyError = document.querySelector(".bodyError");
const contentBody = document.querySelector(".contentBody");

const btnHostory = document.querySelector(".btn-hostory");
const data1 = document.querySelector(".data1");
const data2 = document.querySelector(".data2");

const local = JSON.parse(localStorage.getItem("obj"));
const objDate = local === null ? {} : local;
const valut = objDate.valute ? objDate.valute : "usd";

const thema1 = document.querySelector(".thema1");
const thema2 = document.querySelector(".thema2");

const colorFromLocal = JSON.parse(localStorage.getItem("thema"));

const localObj = colorFromLocal === null ? {} : colorFromLocal;

const thems = [
  {
    name: "black",
    text: "white",
    body: "rgba(30, 30, 30, 0.76)",
    button: "rgb(225, 225, 225)",
  },
  {
    name: "white",
    text: "black",
    body: "rgba(255, 255, 255, 0.555)",
    button: "rgb(38, 38, 38)",
  },
];

let coinData = {};

// Function
const fn = () => {
  if (!localObj.name) return;

  switch (localObj.name) {
    case "black":
      thema1.classList.add("shadow");
      break;
    // case 'green': thema3.classList.add('shadow')
    //   break;
    default:
      thema2.classList.add("shadow");
  }
  contentBody.style.background = localObj.body;
  document.body.style.setProperty(
    "--primary--color-light-text",
    localObj.button
  );
  document.body.style.setProperty("--primary-color-text", localObj.text);
};

const paint = (obj) => {
  h2.textContent = obj.localization.en;
  img.src = obj.image.large;

  if (obj.description.en === "") description.textContent = "no discriptions";
  else description.innerHTML = obj.description.en;

  // price.textContent = objDate.valute.toUpperCase() + ': ' + obj.market_data.current_price[objDate.valute];
  // price.textContent = local === null ? 'USD : ' + obj.market_data.current_price.usd: objDate.valute.toUpperCase() + obj.market_data.current_price[objDate.valute];

  price.textContent =
    valut.toUpperCase() + obj.market_data.current_price[valut];

  let isRemoveSelect = true;

  for (const key in obj.description) {
    if (obj.description[key] === "") continue;
    isRemoveSelect = false;
    const opt = document.createElement("option");

    opt.textContent = key;
    opt.value = key;
    language.append(opt);
  }
  if (isRemoveSelect) language.remove();
};

const getCoin = () => {
  return fetch(coinApi)
    .then((response) => {
      if (response.ok === false) return new Promise.reject(response);
      return response.json();
    })
    .then((data) => {
      paint(data);
      coinData = data;
      optionValutes(data);
    })
    .catch((status) => {
      let errors = "";
      switch (status) {
        case 404:
          errors = "coins not found in Coin geco";
          break;
        default:
          errors = "coins not found in Coin geco";
      }
      location.replace("./404.html?error=" + errors);
    });
};

const optionValutes = (obj) => {
  for (const key in obj.market_data.current_price) {
    const opt = document.createElement("option");
    opt.textContent = key;
    opt.value = key;
    desc.append(opt);
  }
  desc.value = valut;
};

const paintThema = (obj) => {
  contentBody.style.background = obj.body;
  document.body.style.setProperty("--primary--color-light-text", obj.button);
  document.body.style.setProperty("--primary-color-text", obj.text);
};

const removeshadow = () => {
  const a = document.querySelector(".shadow");
  a.classList.remove("shadow");
};

const dataError = (str) => {
  const error = document.createElement("div");
  error.classList.add("error");
  error.textContent = str;
  bodyError.append(error);
  setTimeout(() => {
    error.remove();
  }, 2000);
};

const historyFetch = (days) => {
  return fetch(
    api +
      "coins/" +
      id +
      "/market_chart?vs_currency=" +
      (desc.value ? desc.value : "usd") +
      "&days=" +
      days
  )
    .then((response) => {
      if (response.ok === false) console.log("response error!!!");
      return response.json();
    })
    .then((data) => {
      creatGrafic(data);
    });
};

function format(unix) {
  const date = new Date(unix + new Date().getTimezoneOffset() * 60000); //

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function CreatGraficData() {
  let chart = null;
  let dataV = "";
  let priceCoin = "";
  const color = ["green", "yellow", "black", "red", "rgb(75, 192, 192)"];
  this.creat = function creat(data, prices) {
    btnClear.disabled = false;
    chart = new Chart(ctx, {
      type: "line",

      data: {
        labels: data,
        datasets: [
          {
            label: desc.value,
            data: prices, //[1,3,5,3,8,12,3], //prices,
            borderWidth: 1,
            borderColor: color.pop(),
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: "white",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "white",
            },
          },
        },
      },
    });

    dataV = data1.value + data2.value;
    priceCoin = desc.value;
  };

  this.changeDate = function (data, price) {
    chart.data.labels = data;
    chart.data.datasets = [
      {
        label: desc.value,
        data: price,
        borderWidth: 1,
        borderColor: color.pop(),
      },
    ];
    chart.update();
  };

  this.changePrices = function (price) {
    chart.data.datasets.push({
      label: desc.value,
      data: price,
      borderWidth: 1,
      borderColor: color.pop(),
    });
    chart.update(); // udate crafix
  };
  this.switchFuncion = function (data, prices) {
    if (chart === null) return this.creat(data, prices); // if chart dont fix start mthood creat

    let newDataV = data1.value + data2.value; // values from inputs data
    let newPrice = desc.value; // valutes
    if (newDataV !== dataV) {
      // if change data print new data in grafix
      this.changeDate(data, prices);
      dataV = newDataV;
    }
    if (priceCoin !== newPrice) {
      //if change price print new price in grafix
      this.changePrices(prices);
      newPrice = priceCoin;
    }
  };
  this.remove = function () {
    localStorage.removeItem("obj");
    chart.clear();
    btnClear.disabled = true;
    chart.destroy();
    chart = null;
    ctx.style.height = "1px";
  };
}

const creatGrafic = (data) => {
  const dataArray = [];
  const pricearray = [];

  data.prices.forEach((elem) => {
    dataArray.push(format(elem[0]));
    pricearray.push(Math.floor(elem[1]));
  });

  myChart.switchFuncion(dataArray, pricearray);
};

const funStartCrafic = () => {
  const val1 = data1.value;
  const val2 = data2.value;

  const res1 = val1.split("-").join("");
  const res2 = val2.split("-").join("");

  const days = Math.abs(res1 - res2); //days

  if (data1.value.length === 0 || data2.value.length === 0) {
    // error
    return dataError("Error! empty date"); //about error
  } else if (data1.value > data2.value) {
    // inp1 > inp2 error
    return dataError("start data is ancorrect");
  } else if (+res1 > data || +res2 > data) {
    return dataError("incorect date");
  }

  historyFetch(days + 1);
};



const myChart = new CreatGraficData();
//Events

language.onchange = () => {
  const val = language.value;

  h2.textContent = coinData.localization[val];
  description.innerHTML = coinData.description[val];
};

desc.onchange = () => {
  const prCoin = desc.value;
  objDate["valute"] = prCoin;
  localStorage.setItem("obj", JSON.stringify(objDate));
  price.textContent =
    prCoin.toUpperCase() + ": " + coinData.market_data.current_price[prCoin];
};

data1.onchange = () => {
  objDate["val1"] = data1.value;
  localStorage.setItem("obj", JSON.stringify(objDate));
};

data2.onchange = () => {
  objDate["val2"] = data2.value;
  localStorage.setItem("obj", JSON.stringify(objDate));
};

btnHostory.onclick = () => {
  const val1 = data1.value;
  const val2 = data2.value;

  const res1 = val1.split("-").join("");
  const res2 = val2.split("-").join("");

  const days = Math.abs(res1 - res2);

  if (data1.value.length === 0 || data2.value.length === 0) {
    return dataError("Error! empty date");
  } else if (data1.value > data2.value) {
    return dataError("start data is ancorrect");
  } else if (+res1 > data || +res2 > data) {
    return dataError("incorect date");
  }
  ctx.style.height = "200px";
  historyFetch(days + 1);
};

btnClear.onclick = () => myChart.remove();

thema1.onclick = (e) => {
  const findThem1 = thems.find((el) => el.name === thema1.textContent);
  removeshadow();
  e.target.classList.add("shadow");

  localStorage.setItem("thema", JSON.stringify(findThem1));
  paintThema(findThem1);
};

thema2.onclick = (e) => {
  const findThem2 = thems.find((el) => el.name === thema2.textContent);
  removeshadow();
  e.target.classList.add("shadow");

  localStorage.setItem("thema", JSON.stringify(findThem2));
  paintThema(findThem2);
};

const start = () => {
  data1.value = objDate.val1;
  data2.value = objDate.val2;
  
  getCoin();
  fn();

  local && funStartCrafic();

};

start();
