document.getElementById('logout-btn').addEventListener('click', () => {
    fetch('/auth/logout', {
        method: 'GET', // Changed to GET request
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            window.location.href = '/auth/login'; // Redirect to login page or home page
        } else {
            alert('Error logging out.');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('transaction-btn').addEventListener('click', () => {
    window.location.href = '/users/transactions'; // Redirect to the transactions page
});

