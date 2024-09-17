document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');

    searchBtn.addEventListener('click', () => {
        searchUsers();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchUsers();
        }
    });

    function searchUsers() {
        const query = searchInput.value.trim();
        if (query) {
            fetch(`/search/api/search?username=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        searchResults.innerHTML = `<p>${data.message}</p>`;
                    } else {
                        displayResults(data);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }

    function displayResults(users) {
        searchResults.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.innerHTML = `
            <p><strong>${user}</strong></p>
            <button onclick="sendFriendRequest('${user}')">
                <i class="fas fa-user-plus"></i>
            </button>
        `;

            searchResults.appendChild(userElement);
        });
    }

    window.sendFriendRequest = function (friendUserName) {
        fetch('/search/api/friend-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ friendUserName })
        })
            .then(response => {
                if (!response.ok) {
                    // Extract error message from the response
                    return response.json().then(data => { throw new Error(data.message); });
                }
                return response.json(); // For successful responses
            })
            .then(data => {
                alert(data.message); // Display the message from the server
            })
            .catch(error => {
                alert(error.message); // Display the error message
                console.error('Error:', error);
            });
    };

});
