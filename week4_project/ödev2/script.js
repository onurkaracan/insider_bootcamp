$(document).ready(function() {
    const appendLocation = '.ins-api-users';
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';
    const usersContainer = $(appendLocation);
    const storageKey = 'usersData';
    const sessionKey = 'fetchButtonUsed';
    const oneDay = 24 * 60 * 60 * 1000;

    const style = `
        <style>
            .ins-api-users {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
            }
            .user-card {
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 5px;
                width: 200px;
            }
            .user-card h3 {
                margin: 0 0 10px;
            }
            .user-card p {
                margin: 5px 0;
            }
            .delete-user {
                background-color: #f44336;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px;
            }
            .delete-user:hover {
                background-color: #d32f2f;
            }
            .fetch-users {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                border-radius: 5px;
                margin-top: 20px;
            }
            .fetch-users:hover {
                background-color: #45a049;
            }
        </style>
    `;
    $('head').append(style);

    const storedData = JSON.parse(localStorage.getItem(storageKey));
    const now = new Date().getTime();

    if (storedData && now - storedData.timestamp < oneDay) {
        displayUsers(storedData.users);
    } else {
        fetchUsers();
    }

    function fetchUsers() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(users) {
                localStorage.setItem(storageKey, JSON.stringify({ users, timestamp: new Date().getTime() }));
                displayUsers(users);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                usersContainer.html(`<p>Veri alınamadı: ${textStatus}</p>`);
            }
        });
    }

    function displayUsers(users) {
        const userCards = users.map(user => `
            <div class="user-card" data-id="${user.id}">
                <h3>${user.name}</h3>
                <p>Email: ${user.email}</p>
                <p>Address: ${user.address.street}, ${user.address.city}</p>
                <button class="delete-user">Sil</button>
            </div>
        `).join('');

        usersContainer.html(userCards);

        $('.delete-user').on('click', deleteUser);

        observeUserContainer();
    }

    function deleteUser(event) {
        const userCard = $(event.target).closest('.user-card');
        const userId = userCard.data('id');
        const updatedUsers = JSON.parse(localStorage.getItem(storageKey)).users.filter(user => user.id != userId);

        localStorage.setItem(storageKey, JSON.stringify({ users: updatedUsers, timestamp: new Date().getTime() }));
        userCard.remove();
    }

    function observeUserContainer() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.removedNodes.length > 0 && usersContainer.children().length === 0) {
                    showFetchButton();
                }
            });
        });

        observer.observe(usersContainer[0], { childList: true });
    }

    function showFetchButton() {
        if (!sessionStorage.getItem(sessionKey)) {
            const fetchButton = $('<button class="fetch-users">Kullanıcıları Yeniden Çek</button>');
            fetchButton.on('click', () => {
                fetchUsers();
                sessionStorage.setItem(sessionKey, 'true');
                fetchButton.remove();
            });
            usersContainer.after(fetchButton);
        }
    }
});