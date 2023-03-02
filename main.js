//? АПИ для запросов
const API = "http://localhost:8000/cars";

//? где добавляем карточки
const list = document.querySelector("#car-list");

// ? вызываем для ввода данный в Админ панель
const addForm = document.querySelector("#add-form");
const carNameInp = document.querySelector("#carname");
const priceInp = document.querySelector("#price");
const descriptionInp = document.querySelector("#description");
const imageInp = document.querySelector("#image");

//? вызываем модальное окно
const editCarInp = document.querySelector("#edit-car");
const editPriceInp = document.querySelector("#edit-price");
const editDescriptionInp = document.querySelector("#edit-descr");
const editImageInp = document.querySelector("#edit-image");
// const saveEditBtn = document.querySelector("#btn-save-edit");

const searchInput = document.querySelector("#search");
let searchV = "";

//? пагинация
const pagList = document.querySelector(".pag-list");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const lim = 3;
let currPage = 1;
let pTC = 3;

getCars();

async function getCars() {
  const res = await fetch(
    `${API}?title_like=${searchV}&_limit=${lim}&_page=${currPage}`
  );
  const count = res.headers.get("x-total-count");
  pTC = Math.ceil(count / lim);
  const data = await res.json();
  render(data);
}

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

async function deleteCar(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  getCars();
}

//? функция для получения одного продукта
async function getOneCar(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json();
  return data;
}

//? функция для изменения
async function editCar(id, updatedCar) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updatedCar),
    headers: {
      "Content-Type": "application/json",
    },
  });
  getCars();
}

// ? функция для отображения
function render(arr) {
  list.innerHTML = "";
  arr.forEach((item) => {
    list.innerHTML += `<div class="card m-5" style="width: 18rem">
        <img
          src="${item.image}"
          class="card-img-top w-100 h-30"
          alt="..."
        />
        <div class="card-body">
        <h5 class="card-title">${item.Carname}</h5>
        <p class="card-text">${item.description.slice(0, 70)}...</p>
        <p class="card-text">$ ${item.price}</p>
        <div class="dd">
        <button id="${item.id}" class="btn-delete">DELETE</button>
        <button "${item.id}" class="btn-edit">EDIT</button></div>
        </div>
        </div>
      </div>`;
  });
  getCars();
}

//? кнопка для добавления
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    !carNameInp.value.trim() ||
    !priceInp.value.trim() ||
    !descriptionInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  const car = {
    Carname: carNameInp.value,
    price: priceInp.value,
    description: descriptionInp.value,
    image: imageInp.value,
  };
  addCar(car);

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

let id = null;

// //? кнопка для изменение в модалке
// document.addEventListener("click", async (e) => {
//   if (e.target.classList.contains("btn-edit")) {
//     id = e.target.id;
//     const car = await getOneCar(e.target.id);
//     editCarInp.value = car.Carname;
//     editCarInp.value = car.price;
//     editDescriptionInp.value = car.description;
//     editImageInp.value = car.image;
//   }
// });

// //? кнопка для сохранения
// saveEditBtn.addEventListener("click", () => {
//   if (
//     !editCarInp.value.trim() ||
//     !editPriceInp.value.trim() ||
//     !editDescriptionInp.value.trim() ||
//     !editImageInp.value.trim()
//   ) {
//     alert("Заполни да бля!");
//     return;
//   }
//   const updatedCar = {
//     Carname: editCarInp.value,
//     price: editPriceInp.value,
//     description: editDescriptionInp.value,
//     image: editImageInp,
//   };
//   editCar(id, updatedCar);
// });

//? для поиска
searchInput.addEventListener("input", () => {
  searchV = searchInput.value;
  currPage = 1;
  getCars();
});

function rendPag() {
  pagList.innerHTML = "";
  for (let i = 1; i <= pTC; i++) {
    pagList.innerHTML += `<li class="page-item ${
      currPage == i ? "active" : ""
    }">
        <button class="page-link page_number">${i}</button>
      </li>`;
  }
  if (currPage == 1) {
    prev.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
  }

  if (currPage == pTC) {
    next.classList("disabled");
  } else {
    next.classList.remove("disabled");
  }
}

// //? кнопка для перехода на определенную страницу
// document.addEventListener("click", (e) => {
//   if (e.target.classList.contains("page_number")) {
//     currPage = e.target.innerText;
//     getCars();
//   }
// });

// //? кнопка для перехода не след страницу
// next.addEventListener("click", () => {
//   if (currPage == pTC) {
//     return;
//   }
//   currPage++;
//   getCars();
// });

// //? кнопка для перехода не пред страницу
// prev.addEventListener("click", () => {
//   if (currPage == 1) {
//     return;
//   }
//   currPage--;
//   getCars();
// });

// ! ====================
let currentPage = 1;
let limit = 3;

let countPage;

async function pageTotal() {
  let data = await fetch(`${API}?q=${searchValue}`).then((res) => res.json());
  countPage = Math.ceil(data.length / limit);
  console.log(countPage);
}

prev.addEventListener("click", () => {
  if (currentPage < 1) return;
  currentPage--;
  getCars();
});
next.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  getCars();
});
// getCars();
