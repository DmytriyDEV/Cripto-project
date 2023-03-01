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

const local = JSON.parse(localStorage.getItem("obj"));
const objDate = local === null ? {} : local;
const valut = objDate.valute ? objDate.valute : "usd";

let coinData = {};
// {} === {}
const paint = (obj) => {
  // print name foto description

  h2.textContent = obj.localization.en;
  img.src = obj.image.large;

  if (obj.description.en === "") description.textContent = "no discriptions";
  else description.innerHTML = obj.description.en;

  // price.textContent = objDate.valute.toUpperCase() + ': ' + obj.market_data.current_price[objDate.valute];
  // price.textContent = local === null ? 'USD : ' + obj.market_data.current_price.usd: objDate.valute.toUpperCase() + obj.market_data.current_price[objDate.valute];

  price.textContent =
    valut.toUpperCase() + obj.market_data.current_price[valut];
  // create option for language

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
      console.log(response);
      if (response.ok === false) return new Promise.reject(response)
      return response.json();
    })
    .then((data) => {
      paint(data);
      coinData = data;
      optionValutes(data);
    })
    .catch((status)=>{
     let errors = ""
     switch (status) {
      case 404: errors = 'coins not found in Coin geco'; break;

      default : errors = 'coins not found in Coin geco'
     }
      // console.log(JSON.stringify(response));
      // open('./404.html')
      location.replace('./404.html?error=' + errors)
      
    })
};

const optionValutes = (obj) => {
  for (const key in obj.market_data.current_price) {
    const opt = document.createElement("option");
    opt.textContent = key;
    opt.value = key;
    desc.append(opt);
  }
  desc.value = valut;
  // desc.value = local === null ? 'usd': objDate.valute
};

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

const start = () => {
  getCoin();
};

start();

// https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=USD&days=30

const btnHostory = document.querySelector(".btn-hostory");
const data1 = document.querySelector(".data1");
const data2 = document.querySelector(".data2");
const dataDiv = document.querySelector(".data-div");

data1.onchange = () => {
  objDate["val1"] = data1.value;
  localStorage.setItem("obj", JSON.stringify(objDate));
};

data2.onchange = () => {
  objDate["val2"] = data2.value;
  localStorage.setItem("obj", JSON.stringify(objDate));
};

data1.value = objDate.val1;
data2.value = objDate.val2;

const dataError = (str) => {
  const error = document.createElement("div");
  error.classList.add("error");
  error.textContent = str;
  dataDiv.append(error);
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
      // console.log(data);
      creatGrafic(data);
    });
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

  historyFetch(days + 1);
};

// hw - diag
function format(unix) {
  const date = new Date(unix + new Date().getTimezoneOffset() * 60000); //

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// chart

function CreatGraficData() {
  let chart = null;
  let dataV = "";
  let priceCoin = "";
  const color = ["green", "yellow", "black", "red", "rgb(75, 192, 192)"];

  this.creat = function creat(data, prices) {
    // methood arrayData arrayPrices
    chart = new Chart(ctx, {
      // class element end object
      type: "line",
      data: {
        labels: data, // ['12.01','12.02','12.03','12.04','12.05','12.06','12.07','12.08','12.09','12.01','12.02','12.03','12.04','12.05','12.06','12.07','12.08','12.09'],// data,
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
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    dataV = data1.value + data2.value;
    priceCoin = desc.value;
  };

  this.changeDate = function (data, price) {
    // mthood dataArray
    chart.data.labels = data; //change array labels
    chart.data.datasets = [
      {
        label: desc.value,
        data: price,
        borderWidth: 1,
        borderColor: color.pop(),
      },
    ]; //change array labels
    chart.update(); //udate grafix
  };

  this.changePrices = function (price) {
    // meth\ priceArray

    chart.data.datasets.push({
      // push in arrayDatasets  object with keys
      label: desc.value,
      data: price,
      borderWidth: 1,
      borderColor: color.pop(),
    });
    chart.update(); // udate crafix
  };
  this.switchFuncion = function (data, prices) {
    // method have two arrays
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
    chart.clear();
    chart.destroy();
    chart = null;
  };
}

const myChart = new CreatGraficData();

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
    return; // dataError("Error! empty date");//about error
  } else if (data1.value > data2.value) {
    // inp1 > inp2 error
    return; // dataError("start data is ancorrect");
  } else if (+res1 > data || +res2 > data) {
    return; // dataError("incorect date");
  }

  historyFetch(days + 1);
};
funStartCrafic();

const thema1 = document.querySelector(".thema1");
const thema2 = document.querySelector(".thema2");
const thema3 = document.querySelector(".thema3");

const colorFromLocal = JSON.parse(localStorage.getItem("thema"));

const localObj = colorFromLocal === null ? {} : colorFromLocal;

const thems = [
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
    name: "green",
    text: "yellow",
    body: "green",
    button: "blue",
  },
];

const paintThema = (obj) => {
  document.body.style.background = obj.body;
  document.body.style.color = obj.text;
};

const removeshadow = () => {
  const a = document.querySelector(".shadow");
  a.classList.remove("shadow");
};

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

thema3.onclick = (e) => {
  const findThem3 = thems.find((el) => el.name === thema3.textContent);
  removeshadow();
  e.target.classList.add("shadow");

  localStorage.setItem("thema", JSON.stringify(findThem3));
  paintThema(findThem3);
};

const fn = () => {
  
  switch(localObj.name){
    case 'black': thema1.classList.add('shadow')
      break;
    case 'green': thema3.classList.add('shadow')
      break;  
    default : thema2.classList.add("shadow");
  }

  document.body.style.background = localObj.body;
  document.body.style.color = localObj.text;
};

fn();



// http://127.0.0.1:5500/cripto/description.html?id=0xdao-v2ad
// http://127.0.0.1:5500/cripto/description.html?id=0xdao-v2