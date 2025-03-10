$(document).ready(function() {
    // fake store apiden ürünleri çek
    $.ajax({
        url: 'https://fakestoreapi.com/products',
        method: 'GET',
        success: function(products) {
            displayProducts(products);
            loadCart(); // sepeti local storagedan yükle
        },
        error: function(xhr, status, error) {
            console.error('Ürünler yüklenirken hata oluştu:', error);
            $('#productList').html('<p>Ürünler yüklenirken bir hata oluştu.</p>');
        }
    });

    // ürün kartı oluşturma fonksiyonu clone kullanımı
    function createProductCard(product) {
        const template = $(`
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button class="addToCartBtn">Sepete Ekle</button>
            </div>
        `).clone(true); // true parametresi ile eventleri de kopyala

        return template;
    }

    // ürünleri listeye ekleme
    function displayProducts(products) {
        const productList = $('#productList');
        productList.empty();

        products.forEach(product => {
            // her ürün için kart oluştur
            const productCard = $(`
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p class="price">$${product.price}</p>
                    <p class="description">${product.description.substring(0, 100)}...</p>
                    <button class="addToCartBtn">Sepete Ekle</button>
                    <button class="showDetailBtn">Detay Göster</button>
                </div>
            `);
            
            productList.append(productCard);
        });
    }

    // event delegation ile dinamik ürün kartları için event handling
    $('#productList').on('click', '.product-card img', function() {
        const productCard = $(this).closest('.product-card'); // traversing örnegi
        const productImage = $(this).attr('src');
        
        $.fancybox.open({
            src: productImage,
            type: 'image'
        });
    });

    // event delegation ile sepete ekleme
    $('#productList').on('click', '.addToCartBtn', function() {
        const productCard = $(this).closest('.product-card');
        const product = {
            id: productCard.data('id'),
            title: productCard.find('h3').text(),
            price: productCard.find('.price').text(),
            image: productCard.find('img').attr('src')
        };
        
        addToCart(product);
        
        // buton animasyonu
        $(this).animate({ scale: 1.2 }, 200)
               .animate({ scale: 1 }, 200);
    });

    // detay gösterme fonksiyonu
    $('#productList').on('click', '.showDetailBtn', function() {
        const productCard = $(this).closest('.product-card');
        const description = productCard.find('.description');
        
        description.slideToggle(400);
    });

    // Sepeti temizle
    $('#clearCart').click(function() {
        $('#cartItems').slideUp(400, function() {
            $(this).empty().show();
            localStorage.removeItem('cart');
        });
    });

    // sepete ürün ekleme
    function addToCart(product) {
        const cartItems = $('#cartItems');
        const cartItem = $(`
            <div class="cart-item" data-id="${product.id}" style="display: none;">
                <img src="${product.image}" alt="${product.title}">
                <div class="cart-item-details">
                    <h4>${product.title}</h4>
                    <p>${product.price}</p>
                </div>
                <button class="removeFromCart">Kaldır</button>
            </div>
        `);
        
        cartItems.append(cartItem);
        cartItem.slideDown(400);
        
        // local storage a kaydediyor
        let cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
        cartProducts.push(product);
        localStorage.setItem('cart', JSON.stringify(cartProducts));
    }

    // sepetten ürün kaldırma
    $('#cartItems').on('click', '.removeFromCart', function() {
        const cartItem = $(this).closest('.cart-item');
        const productId = cartItem.data('id');
        
        cartItem.fadeOut(400, function() {
            $(this).remove();
            
            // local storagedan kaldır
            let cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
            cartProducts = cartProducts.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cartProducts));
        });
    });

    // sepeti local storagedan yükleme
    function loadCart() {
        const cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
        cartProducts.forEach(product => addToCart(product));
    }
}); 