let listProductHTML = document.querySelector('.listProduct');
// const removeFromCart = document.querySelector('remove-cart');
const listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let totalItems = document.querySelector(".total span");
const open_Cart = document.querySelector("#cart");
const close_Cart = document.querySelector(".close");
let products = [];
let cart = [];
let totalPriceSpan = document.querySelector(".total .total-price span");

//////////////////////////////////for showing Add To Cart////////////////////////////////
open_Cart.addEventListener("click", () => document.body.classList.toggle("show-cart"));
close_Cart.addEventListener("click", () => document.body.classList.remove("show-cart"));



//////////////////////////////////// Get the selected product ID from local storage/////////////////////////////////////////////////
const selectedProductId = localStorage.getItem('selectedProductId');
const initApp = () => {
    fetch('/products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        ////////////////////////////////get data cart from memory////////////////////////////
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();


const addDataToHTML = () => {
    
    if(products) {
        let productSelect = document.createElement('div');
        let product = products.find(p => p.id == selectedProductId);
        productSelect.classList.add('item');
        productSelect.innerHTML = 
        `
        <h2>${product.name}</h2>
        <div class="img-details">
            <img src="/${product.image}" alt="${product.name}" />
        </div>
        <p>Price: ₹${product.price}</p>

        <div class="buttons">
            
            <button id="btn" class="addCart" onclick='addCart(${product.id})' >Add To Cart</button>
            <button class="btn_back" onclick='btn_back()'>Back to Products</button>
        </div>
        `;
        listProductHTML.appendChild(productSelect);

    }
}

const addCart = (productId) => {
    //////////////////////////////// taking the productId and passing to the addToCart////////////////////////
    addToCart(productId);
}


listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    let id_product = positionClick.parentElement.dataset.id;
    //////////////////////////// For going back to Original store page//////////////////////////////
    if(positionClick.classList.contains('btn_back')){
        window.location.href = '/index.html';
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
    }else{
        // alert('Item Already added into the cart');
        // alert(product_id);
        // cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
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
            newItem.dataset.id = item.product_id;
            newItem.classList.add('item');
            if(item.quantity > 0) {
              totalproducts += 1;
            }
            
            // const product = products.find(p => p.id == selectedProductId);
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
        })
    }
    else {
      listCartHTML.innerHTML = `<div class="cart-empty" >Your cart is empty</div>`;
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