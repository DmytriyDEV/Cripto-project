
const params = new URL(document.location).searchParams;
const errorParam = params.get("error");

const h1 = document.querySelector('h1')
const back = document.querySelector('.back')

h1.textContent = errorParam.toLocaleLowerCase()

back.onclick = () => history.back()
