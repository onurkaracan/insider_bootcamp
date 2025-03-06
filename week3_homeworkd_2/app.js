let page = 0;
const postsPerPage = 5;
let isLoading = false;
let hasMorePosts = true;

function loadPosts() {
    if (isLoading || !hasMorePosts) return;
    
    isLoading = true;
    $('#loader').removeClass('hidden');

    $.get(`https://jsonplaceholder.typicode.com/posts?_start=${page * postsPerPage}&_limit=${postsPerPage}`)
        .done(function(posts) {
            if (posts.length < postsPerPage) {
                hasMorePosts = false;
            }

            posts.forEach(post => {
                const postElement = `
                    <div class="post">
                        <h2>${post.title}</h2>
                        <p>${post.body}</p>
                    </div>
                `;
                $('#postContainer').append(postElement);
            });

            page++;
            isLoading = false;
            $('#loader').addClass('hidden');
        })
        .fail(function(error) {
            console.error('Gönderiler yüklenirken hata oluştu:', error);
            isLoading = false;
            $('#loader').addClass('hidden');
        });
}

$(document).ready(function() {
    //sayfa yüklendiğinde gönderileri yükler
    loadPosts();

    // sonayaklaşıldığında yeni gönderiler yükler
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
            loadPosts();
        }
    });
}); 