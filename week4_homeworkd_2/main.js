$(document).ready(function() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';
    const localStorageKey = 'usersData';
    const oneDay = 24 * 60 * 60 * 1000; // 1 gün

    // sayfaya verileri güncelle butonu ekleme
    $('body').append('<button id="refresh-data">Verileri Güncelle</button>');

    // 'ins-api-users' sınıfına sahip div'i oluştur ve stil ekle
    const $userDiv = $('<div>', { class: 'ins-api-users' }).css({
        'display': 'flex',
        'flex-wrap': 'wrap',
        'gap': '20px',
        'padding': '20px',
        'background-color': '#f9f9f9',
        'border-radius': '8px',
        'justify-content': 'center'
    });
    $('body').append($userDiv);

    // localStoragedan veriyi kontrol etme
    const storedData = localStorage.getItem(localStorageKey);
    const storedTime = localStorage.getItem(`${localStorageKey}_time`);

    if (storedData && storedTime && (new Date().getTime() - storedTime < oneDay)) {
        // localStoragedan veriyi kullanma
        displayUsers(JSON.parse(storedData));
    } else {
        fetchDataAndDisplay();
    }

    // "Verileri Güncelle" butonuna tıklama olayını dinleme
    $('#refresh-data').click(function() {
        fetchDataAndDisplay();
    });

    function fetchDataAndDisplay() {
        // APIden veri çekme
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('API erişim hatası');
                }
                return response.json();
            })
            .then(data => {
                // veriyi localStorage a kaydetme
                localStorage.setItem(localStorageKey, JSON.stringify(data));
                localStorage.setItem(`${localStorageKey}_time`, new Date().getTime());
                displayUsers(data);
            })
            .catch(error => {
                // hata mesajı göster
                $('body').append(`<div class="error">Veri çekme hatası: ${error.message}</div>`);
            });
    }

    function displayUsers(users) {
        const $userList = $('<div class="ins-api-users"></div>');
        if (users.length === 0) {
            $userList.append('<p>Hiç kullanıcı yok.</p>');
        } else {
            users.forEach((user, index) => {
                const $userDiv = $(`
                    <div class="user" data-index="${index}">
                        <h3>${user.name}</h3>
                        <p>Email: ${user.email}</p>
                        <p>Address: ${user.address.street}, ${user.address.city}</p>
                        <button class="delete-user">Sil</button>
                    </div>
                `).css({
                    'background-color': '#fff',
                    'border': '1px solid #ddd',
                    'border-radius': '8px',
                    'padding': '15px',
                    'width': '200px',
                    'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
                    'transition': 'transform 0.2s'
                }).hover(
                    function() { $(this).css('transform', 'translateY(-5px)'); },
                    function() { $(this).css('transform', 'translateY(0)'); }
                );
                $userList.append($userDiv);
            });
        }
        $('.ins-api-users').remove(); // eski kullanıcı listesini kaldır
        $('body').append($userList);

        // kullanıcı silme işlemi
        $('.delete-user').click(function() {
            const $userDiv = $(this).closest('.user');
            const userIndex = $userDiv.data('index');
            users.splice(userIndex, 1); // kullanıcıyı listeden kaldır
            localStorage.setItem(localStorageKey, JSON.stringify(users)); // localStorage ı güncelle
            $userDiv.remove(); // kullanıcıyı ekrandan kaldır

            // eğer kullanıcı listesi boşsa, mesaj göster
            if (users.length === 0) {
                $('.ins-api-users').append('<p>Hiç kullanıcı yok.</p>');
            }
        });
    }
}); 