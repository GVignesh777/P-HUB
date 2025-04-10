let itemList = document.querySelector('.listProduct');



//////////////////////////////////// Get the selected product ID from local storage/////////////////////////////////////////////////
const selectedProductId = localStorage.getItem('selectedProductId');
const total = JSON.parse(localStorage.getItem('total'));
const cartPrice = JSON.parse(localStorage.getItem('cartPrice'));

const initApp = () => {
    fetch('/products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        ////////////////////////////////get data cart from memory////////////////////////////
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addCartToHTML = () => {
    itemList.innerHTML = '';
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
            itemList.appendChild(newItem);
            let cartPrice = info.price * item.quantity;
            total += cartPrice;
            newItem.innerHTML = 
            `<div class="details">
                <div class="name">
                  ${info.name}
                </div>
            </div>

            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="details">

                <div class="remove-cart">
                  <i  class="fa-sharp fa-solid fa-trash remove-cart"></i>
                </div>

                <div class="totalPrice"><h3>Total-Price:-</h3>₹${cartPrice}</div>

                <div class="description"><h3>${info.description}</h3>
            </div>
            `;
        })
    }
    else {
      itemList.innerHTML = `<div class="cart-empty" >Your cart is empty</div>`;
    }
}

itemList.addEventListener('click', (event) => {
        let positionClick = event.target;
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'fa-sharp fa-solid fa-trash remove-cart';
        // console.log(positionClick.parentElement.parentElement.dataset.id);
        console.log(positionClick.parentElement.parentElement.dataset.id);
    if(positionClick.classList.contains('fa-sharp fa-solid fa-trash remove-cart')) {
        type = 'fa-sharp fa-solid fa-trash remove-cart';
        // console.log('no error');
    }
    else {
        // alert();
        console.log('error');
    }
    changeQuantityCart(product_id, type);
})

const moveBack = () => {
    window.location.href = '../index.html';
}



const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    console.log(type);
    if(positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'fa-sharp fa-solid fa-trash remove-cart':
                cart.splice(positionItemInCart, 1);
                // alert("item-removed");
                break;
            default:
                console.log('please add required item');
        }
    }
    addCartToMemory();
    addCartToHTML();
}