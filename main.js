src="https://kit.fontawesome.com/21249e4cb5.js"
crossorigin="anonymous"



let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
const removeFromCart = document.querySelector('remove-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let totalPriceSpan = document.querySelector(".total .total-price span");
let totalItems = document.querySelector(".total span");
const open_Cart = document.querySelector("#cart");
const close_Cart = document.querySelector(".close");
let products = [];
let cart = [];
// let total_Price = document.querySelector('total-price');

//for showing Add To Cart
open_Cart.addEventListener("click", () => document.body.classList.toggle("show-cart"));
close_Cart.addEventListener("click", () => document.body.classList.remove("show-cart"));

const initApp = () => {
  // get data products from json file
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // get data cart from memory
        if(localStorage.getItem('cart')){
          cart = JSON.parse(localStorage.getItem('cart'));
          addCartToHTML();
      }
  })
}
initApp();



const addDataToHTML = () => {
  // remove datas default from HTML

      // add new datas
      if(products.length > 0)  //if has data
      {
          products.forEach(product => {
              let newProduct = document.createElement('div');
              newProduct.dataset.id = product.id;
              let productId = product.id;
              newProduct.classList.add('item');
              newProduct.innerHTML = 
              `
                <div class="img-details">
                  <img src="${product.image}" alt="">
                </div>
                <h2 class="title" >${product.name}</h2>
                <div class="price">₹${product.price}</div>


                  <button id="btn" class="addCart">Add To Cart</button>

                <button class="viewProduct" onclick="selectProduct(${product.id})">View Product</button>
              `;
              listProductHTML.appendChild(newProduct);
              
          });
          
      }
  }

  const selectProduct = (productId) => {
    // Store the selected product ID in local storage
    localStorage.setItem('selectedProductId', productId);
    // Redirect to product.html
    window.location.href = 'product-details/product.html';
  }

  listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
      let id_product = positionClick.parentElement.dataset.id;
    if(positionClick.classList.contains('addCart')){
        addToCart(id_product);
    }
});


const addToCart = (product_id) => {
let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
if(cart.length <= 0){
    cart = [{
        product_id: product_id,
        quantity: 1
    }];
}else if(positionThisProductInCart < 0){
    cart.push({
        product_id: product_id,
        quantity: 1
    });
}
else{
  // alert('Item Already added into the cart');
}

addCartToHTML();
addCartToMemory();
}


const addCartToMemory = () => {
localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
listCartHTML.innerHTML = '';
let totalproducts = 0;
let total = 0;
let totalQuantity = 0;
if(cart.length > 0){
    cart.slice().reverse().forEach(item => {
        totalQuantity = totalQuantity + item.quantity;
        let newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.dataset.id = item.product_id;
        if(item.quantity > 0) {
          totalproducts += 1;
        }
        let positionProduct = products.findIndex((value) => value.id == item.product_id);
       
        let info = products[positionProduct];
        listCartHTML.appendChild(newItem);
        let cartPrice = info.price * item.quantity;
        total += cartPrice;
        
        newItem.innerHTML = 
        `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">
              ${info.name}
            </div>
            
            <div class="quantity">
                  <button class="minus">-
                    </button>
                  <span class="total-quantity">${item.quantity}</span>
                  <button class="plus">+
                    </button>
                    
            </div>

            <div class="remove-cart">
              <i class="fa-sharp fa-solid fa-trash remove-cart"></i>
            </div>
            

                  <div class="totalPrice">₹${cartPrice}
                  </div>
        `;
        
localStorage.setItem('total', JSON.stringify(total));
localStorage.setItem('cartPrice', JSON.stringify(cartPrice));
localStorage.setItem('totalQuantity', JSON.stringify(totalQuantity));
    })
}
else {
  listCartHTML.innerHTML = `<div class="cart-empty">Your cart is empty</div>`;
}
totalItems.innerText = totalQuantity;
totalPriceSpan.innerText = "₹ " + total;
iconCartSpan.innerText = totalproducts;
}



listCartHTML.addEventListener('click', (event) => {
let positionClick = event.target;
if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus') || positionClick.classList.contains('remove-cart')){
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = 'remove-cart';
    console.log(product_id);
    if(positionClick.classList.contains('plus')){
        type = 'plus';
    }
    else if(positionClick.classList.contains('remove-cart')) {
      type = 'remove-cart';
    }
    else {
      type = 'minus';
    }
    changeQuantityCart(product_id, type);
    // removeCart(product_id);
}
})



const changeQuantityCart = (product_id, type) => {
let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
if(positionItemInCart >= 0){
    let info = cart[positionItemInCart];
    switch (type) {
        case 'remove-cart':
        cart.splice(positionItemInCart, 1);
            break;

        case 'plus':
        cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
        break;
          
        default:
          let changeQuantity = cart[positionItemInCart].quantity - 1;
          if(changeQuantity > 0 ) {
             cart[positionItemInCart].quantity = changeQuantity;
          }
          //  else {
          //       cart.splice(positionItemInCart, 1);
          // }
         
            
            break;
    }
}
addCartToHTML();
addCartToMemory();
}

const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('categoryFilter');
const productResults = document.getElementById('products');

searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    productResults.innerHTML = ''; // Clear previous results
    products.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.dataset.id = product.id;
      newProduct.classList.add('item');
      newProduct.classList.add('name');
      newProduct.innerHTML = 
      `
      <div class="img-properties">
        <img src="${product.image}" alt="">
      </div>
        <h2>${product.name}</h2>
        <div class="price">₹${product.price}</div>
        <button class="addCart">Add To Cart</button>
      `;
      listProductHTML.appendChild(newProduct);
    });
}

// Initial display of all products
displayProducts(products);


// Get the button
const backToTopButton = document.getElementById("backToTop");

// Show the button when the user scrolls down 100px from the top of the document
window.onscroll = function() {
    if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

// When the user clicks on the button, scroll to the top of the document
backToTopButton.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scroll
    });
};