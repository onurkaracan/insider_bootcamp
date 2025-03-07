$(document).ready(function() {
    // Load initial users when page loads
    loadUsers();

    // Add click event listener to the load button
    $('#loadUsers').on('click', function() {
        // Add shake animation to button
        $(this).addClass('shake');
        setTimeout(() => {
            $(this).removeClass('shake');
        }, 500);
        
        loadUsers();
    });

    function loadUsers() {
        // Clear existing cards with a fade out effect
        $('#userCards').children().fadeOut(300, function() {
            $(this).remove();
        });

        // Fetch 6 random users from the API
        $.ajax({
            url: 'https://randomuser.me/api/?results=6',
            dataType: 'json',
            success: function(data) {
                // Process each user
                data.results.forEach((user, index) => {
                    const card = createUserCard(user);
                    
                    // Add card to DOM with delay for cascade effect
                    setTimeout(() => {
                        $('#userCards').append(card);
                        // Animate the card appearance
                        $(card)
                            .css({
                                opacity: 0,
                                transform: 'translateY(20px)'
                            })
                            .animate({
                                opacity: 1,
                                transform: 'translateY(0)'
                            }, 500);
                    }, index * 200);
                });
            },
            error: function(err) {
                console.error('Error fetching users:', err);
                alert('Error loading users. Please try again.');
            }
        });
    }

    function createUserCard(user) {
        // Create the detailed content for Fancybox modal
        const detailedContent = `
            <div class="user-details">
                <div class="user-details-header">
                    <img src="${user.picture.large}" alt="User profile picture">
                    <h2>${user.name.first} ${user.name.last}</h2>
                </div>
                <div class="user-details-info">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Country:</strong> ${user.location.country}</p>
                    <p><strong>City:</strong> ${user.location.city}</p>
                    <p><strong>Street:</strong> ${user.location.street.name} ${user.location.street.number}</p>
                    <p><strong>Postcode:</strong> ${user.location.postcode}</p>
                    <p><strong>Date of Birth:</strong> ${new Date(user.dob.date).toLocaleDateString()}</p>
                    <p><strong>Age:</strong> ${user.dob.age}</p>
                </div>
            </div>
        `;

        return $('<div>')
            .addClass('user-card')
            .attr('data-fancybox', 'gallery')
            .attr('data-src', `#user-${user.login.uuid}`)
            .html(`
                <img src="${user.picture.large}" alt="User profile picture">
                <h3>${user.name.first} ${user.name.last}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Country:</strong> ${user.location.country}</p>
                <p><strong>City:</strong> ${user.location.city}</p>
                <div id="user-${user.login.uuid}" style="display:none">
                    ${detailedContent}
                </div>
            `)
            .hover(
                function() {
                    $(this).fadeTo('fast', 0.8);
                },
                function() {
                    $(this).fadeTo('fast', 1);
                }
            );
    }
}); 