

fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(renderHtml)
    .catch((err) => {
        alert('Some error is occured')
    })

function renderHtml(data) {
    let mensCategory = document.querySelector('.mens-clothing');
    let womensClothing = document.querySelector('.womens-clothing');
    let jeweleryCategory = document.querySelector('.jewelery');
    let electronicsCategory = document.querySelector('.electronics');
    data.forEach(element => {
        let newElement = document.createElement('div')
        newElement.className = 'product-card';
        newElement.innerHTML = `
        <div class="product-image">
           <img src="${element.image}" alt="Something went wrong">
        </div> 
        <div class="product-details">
           <div class="product-category">${element.category}</div>
           <div class="product-title">${element.title}</div>
           <div class="product-price">${element.price}$</div>
           <div class="product-description">${element.description}</div>
           <div class="product-rating">
             <span class="product-stars">⭐ ${element.rating.rate}</span>
             <span class="rating-count">(${element.rating.count} reviews)</span>
           </div>
           <div class="btn-container">
            <button class="btn Buy-now-btn" >Buy Now</button>
            <button class="btn Cart-btn" data-id="${element.id}" data-name="${element.title}" data-price="${element.price}" data-img="${element.image}">Add to Cart</button>
           </div>
        </div>
        `;
        if (element.category === "women's clothing") {
            womensClothing.appendChild(newElement);
        } else if (element.category === "electronics") {
            electronicsCategory.appendChild(newElement);
        } else if (element.category === "jewelery") {
            jeweleryCategory.appendChild(newElement);
        } else {
            mensCategory.appendChild(newElement);
        }
    });

};

let cart = renderCartFromStoarge();
updateCartSummary()

function renderCartFromStoarge() {
    let cartFromStorage = localStorage.getItem('cart');
    if (!cartFromStorage) {
        cartFromStorage = []; 
        return cartFromStorage;
    };
    cartFromStorage = JSON.parse(cartFromStorage)
    renderCart(cartFromStorage);
    return cartFromStorage;
}


function addToCart(id, name, price, img) {
    let isInCart = cart.find(product => product.id === id);
    if (isInCart || isInCart === 0) {
        isInCart.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: img,
            quantity: 1
        })
    }
    let cartComfirmation = document.querySelector('#add-to-cart-confirmation');
    cartComfirmation.style.opacity = 1;
    setTimeout(() => {
        cartComfirmation.style.opacity = 0;
    }, 2000);
    renderCart(cart)
}

function ChangeQuantity(elem) {
    let product = cart.find(product => product.id === elem.dataset.id);
    product.quantity = +elem.value;

}

function renderCart(cart) {
    let cartConatiner = document.querySelector('.cart-items');
    cartConatiner.innerHTML = '';
    cart.forEach(element => {
        let newElement = document.createElement('div')
        newElement.className = 'cart-item';
        newElement.dataset.id = element.id;
        newElement.innerHTML = `
        <img src="${element.image}" alt="${element.name}" />
        <div class="item-details">
          <h2>${element.name}</h2>
          <p class="CartProductPrice">Price: ${element.price}$</p>
          <input type="number" value="${element.quantity}" data-id="${element.id}" class="product-quantity" min="1">
        </div>
        <button class="remove-btn" data-id="${element.id}">Remove</button>
        `;
        cartConatiner.appendChild(newElement);
    });

}

function updateCartSummary() {
    let TotalPrice = 0;
    let Items = 0;
    for (let i = 0; i < cart.length; i++) {
        let CurrentProductTotalPrice = cart[i].price * cart[i].quantity;
        TotalPrice += CurrentProductTotalPrice;
        Items += cart[i].quantity;
    } 
    document.querySelector('.totalPrice').textContent = `Total: $${TotalPrice}`;
    document.querySelector('.items').textContent = `Items: ${Items}`;
}

let openCartBtn = document.querySelector('.open-cart');
let closeCartBtn = document.querySelector('.close-cart');
let cartContainer = document.querySelector('#cart');
let body = document.querySelector('body');

openCartBtn.addEventListener('click', (e) => {
    cartContainer.style.minHeight = '100vh';
    body.style.overflow = 'hidden';
});
closeCartBtn.addEventListener('click', (e) => {
    cartContainer.style.minHeight = '0vh';
    body.style.overflow = 'visible';
});

function removeProduct(productId) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart.splice(i , 1)
            document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
            return;
        }
    }
}

function updateLocalStorage() {
    localStorage.setItem('cart' , JSON.stringify(cart));
}

// add events

document.addEventListener('input' , (e)=>{
    if (e.target.matches('.product-quantity')) {
        ChangeQuantity(e.target)
        updateCartSummary()
    }
    updateLocalStorage()
})

document.addEventListener('click' , (e)=>{
    if (e.target.matches('.Cart-btn')) {
        addToCart(e.target.dataset.id, e.target.dataset.name, e.target.dataset.price, e.target.dataset.img);
        renderCart(cart);
    } else if (e.target.matches('.remove-btn')) {
        removeProduct(e.target.dataset.id);
    }
    updateCartSummary()
    updateLocalStorage()

})



