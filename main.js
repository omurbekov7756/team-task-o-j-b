//? АПИ для запросов
const API = "http://localhost:8000/cars";

//? где добавляем карточки
const list = document.querySelector("#car-list");

// ? вызываем для ввода данных в Админ панель
const addForm = document.querySelector("#add-form");
const carNameInp = document.querySelector("#carname");
const priceInp = document.querySelector("#price");
const descriptionInp = document.querySelector("#description");
const imageInp = document.querySelector("#image");

//? вызываем модальное окно
const modal = document.querySelector(".modal");
const editCarInp = document.querySelector("#edit-car");
const editPriceInp = document.querySelector("#edit-price");
const editDescriptionInp = document.querySelector("#edit-descr");
const editImageInp = document.querySelector("#edit-image");
const saveEditBtn = document.querySelector("#btn-save-edit");

//? инпуты для поиска
const searchInput = document.querySelector("#search");
//? переменная по которой делаем запрос на поиск
let searchV = "";

//? пагинация
const pagList = document.querySelector(".pag-list");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

//? макс кол машин
const lim = 3;
//? текущая страница
let currPage = 1;
//? макс кол страниц
let pTC = 1;

//? первоначальное отображение
getCars();

//? функция для получение данных
async function getCars() {
  const res = await fetch(
    `${API}?carname_like=${searchV}&_limit=${lim}&_page=${currPage}`
  );
  const count = res.headers.get("x-total-count");
  pTC = Math.ceil(count / lim);
  const data = await res.json();
  render(data);
}

//? функция для добавления
async function addCar(car) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(car),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getCars();
}

//? функция для удаления
async function deleteCar(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  getCars();
}

//? функция для получения одного продукта
async function getOneCars(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

//? функция для изменения
async function editCar(id, editedCars) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedCars),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getCars();
}

// ? функция для отображения
function render(arr) {
  //? чтобы не копировало
  list.innerHTML = "";
  arr.forEach((item) => {
    list.innerHTML += `<div class="card m-5" style="width: 18rem">
        <img
          src="${item.image}"
          class="card-img-top w-100 h-30"
          alt="..."
        />
        <div class="card-body">
        <h5 class="card-title">${item.carname}</h5>
        <p class="card-text">${item.description.slice(0, 70)}...</p>
        <p class="card-text">$ ${item.price}</p>
        <div class="father">
    <button id="${item.id}" href="#" class="btn-delete">DELETE</button>
    <button data-bs-toggle="modal" data-bs-target="#exampleModal" id="${
      item.id
    }" href="#" class="btn-edit">EDIT</button></div>
        </div>
        </div>`;
  });
  //? чтобы пагинация тоже отображалось
  rendPag();
}

//? кнопка для добавления
addForm.addEventListener("submit", (e) => {
  //? убираем дефолтное поведение form
  e.preventDefault();
  //? проверяем все инпуты на заполненность
  if (
    !carNameInp.value.trim() ||
    !priceInp.value.trim() ||
    !descriptionInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert("Заполни да ээй");
    return;
  }
  //? обьект для отправки в DB
  const car = {
    carname: carNameInp.value,
    price: priceInp.value,
    description: descriptionInp.value,
    image: imageInp.value,
  };
  addCar(car);

  //? очищаем инпуты после добавления
  carNameInp.value = "";
  priceInp.value = "";
  descriptionInp.value = "";
  imageInp.value = "";
});

//? кнопка для удаления
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    deleteCar(e.target.id);
  }
});

//? переменная чтобы сохранить id продукта
let id = null;

//? кнопка для изменение в модалке
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-edit")) {
    id = e.target.id;
    const cars = await getOneCars(e.target.id);
    editCarInp.value = cars.carname;
    editPriceInp.value = cars.price;
    editDescriptionInp.value = cars.description;
    editImageInp.value = cars.image;
  }
});

// //? кнопка для сохранения
saveEditBtn.addEventListener("click", () => {
  if (
    !editCarInp.value.trim() ||
    !editPriceInp.value.trim() ||
    !editPriceInp.value.trim() ||
    !editImageInp.value.trim()
  ) {
    alert("Заполни поля");
    return;
  }
  const editedCars = {
    carname: editCarInp.value,
    price: editPriceInp.value,
    description: editDescriptionInp.value,
    image: editImageInp.value,
  };
  editCar(id, editedCars);
});

//? для поиска
searchInput.addEventListener("input", () => {
  searchV = searchInput.value;
  currPage = 1;
  getCars();
});

function rendPag() {
  pagList.innerHTML = "";
  for (let i = 1; i <= pTC; i++) {
    pagList.innerHTML += `
      <li class="page-item ${currPage == i ? "active" : ""}">
         <button class="page-link page_number">${i}</button>
      </li>
      `;
  }
  //? чтобы кнопка prev была не активна на первой странице
  if (currPage == 1) {
    prev.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
  }

  //? чтобы кнопка next была не активна на последней странице
  if (currPage == pTC) {
    next.classList.add("disabled");
  } else {
    next.classList.remove("disabled");
  }
}

//? обработчик события чтобы перейти на определенную страницу
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    console.log("CLOCK", currPage);
    currPage = e.target.innerText;
    getCars();
  }
});

//? обработчик события чтобы перейти на следующию страницу
next.addEventListener("click", () => {
  if (currPage == pTC) {
    return;
  }
  currPage++;
  getCars();
});

//? обработчик события чтобы перейти на предыдущую страницу
prev.addEventListener("click", () => {
  if (currPage == 1) {
    return;
  }
  currPage--;
  getCars();
});
