document.addEventListener('DOMContentLoaded', () => {

const hopShop = async () => {

  let data = await fetch('https://fakestoreapi.com/products');
      data = await data.json();

  let products = document.getElementById('products');

  for (const product of data) {
    products.innerHTML +=
    `
    <div class="product" style="display: block;">
      <div class="top">
        <img src="${product.image}" alt="alt">
      </div>
      <p class="title">${product.title}</p>
      <p class="price">Price : ${product.price} $</p>
      <div class="bottom" id="${product.id}">
        <span class="details">Details..</span>
        <span class="add-cart">Add to cart</span>
      </div>
    </div>
    `;
  }

  if (localStorage.getItem('cart') === null) {
    localStorage.setItem('cart', '[]')
  }

  products = document.getElementsByClassName('product');
  const shoppingTable = document.getElementById('shoppingTable'),
        shoppingDesk = document.getElementById('shoppingDesk'),
        modalContent = document.getElementById('modalContent'),
        addCarts = document.getElementsByClassName('add-cart'),
        details = document.getElementsByClassName('details'),
        titles = document.getElementsByClassName('title'),
        cart = JSON.parse(localStorage.getItem('cart')),
        times = document.getElementById('closeModal'),
        modal = document.getElementById('modal'),
        query = document.getElementById('query'),

        sortProduct = query => {
          for (const title of titles) {
            if (title.innerText.toLowerCase().indexOf(query) > -1) {
              title.parentElement.style.display = 'block';
            } else {
              title.parentElement.style.display = '';
            }
          }
        },

        cartRefresh = cart => {
          let selectedProducts = '',
              total = 0;

          for (const product of cart) {
            selectedProducts += 
            `
            <tr>
              <td><img src="${product.image}" ></td>
              <td>${product.title}</td>
              <td>${product.price} $</td>
            </td>
            `;
            total += product.price;
          }
          if (selectedProducts) {
            shoppingTable.innerHTML =
            `
            <tr>
              <td>Total : </td>
              <td></td>
              <td>${total} $</td>
            </td>
            ` + selectedProducts;
          } else {
            shoppingTable.innerHTML = '<p>Cart is empty.</p>';
          }

          const products = shoppingTable.querySelectorAll('tr:not(:first-child)');
          for (const product of products) {
            product.addEventListener('click', e => removeCart(e));
          }
        },

        addCart = e => {
          const cart = JSON.parse(localStorage.getItem('cart')),
                productId = +e.target.parentElement.id;

          for (const product of data) {
            if (productId === product.id) {
              cart.push(product);
              localStorage.setItem('cart', JSON.stringify(cart));
              break;
            }
          }

          cartRefresh(cart);
        },

        removeCart = e => {
          const productIndex = e.target.parentElement.sectionRowIndex,
                cart = JSON.parse(localStorage.getItem('cart'));

          cart.splice(productIndex - 1, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          cartRefresh(cart);
        }

        openModal = e => {
          const productId = +e.target.parentElement.id;
          for (const product of data) {
            if (productId === product.id) {
              modalContent.innerHTML =
              `
              <div>
                <img src="${product.image}" >
                <p><b>Category:</b> ${product.category}</p>
                <p><b>Name:</b> ${product.title}</p>
                <p><b>Price:</b> ${product.price} $</p>
                <p><b>Rating:</b> ${product.rating.rate}. / <b>User:</b> ${product.rating.count}</p>
                <p><b>Description:</b> <i>${product.description}</i></p>
              </div>
              `;
              break;
            }
          }
          modal.style.visibility = 'visible';
          modal.style.opacity = '1';
        },

        closeModal = () => {
          modal.style.visibility = '';
          modal.style.opacity = '';
        },

        openCloseCart = () => {
          if (!shoppingDesk.style.visibility) {
            shoppingDesk.style.visibility = 'visible';
            shoppingDesk.style.opacity = '1';
          } else {
            shoppingDesk.style.visibility = '';
            shoppingDesk.style.opacity = '';
          }
        };

  cartRefresh(cart);
  query.addEventListener('keyup', () => sortProduct(query.value.toLowerCase()));
  document.getElementById('shoppingCart').addEventListener('click', openCloseCart);
  times.addEventListener('click', closeModal);
  for (let i = 0; i < addCarts.length; i++) {
    addCarts[i].addEventListener('click', e => addCart(e));
    details[i].addEventListener('click', e => openModal(e));
  }
};

hopShop();
});