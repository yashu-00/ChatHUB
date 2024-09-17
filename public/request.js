document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.accept-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const requestId = event.target.dataset.id;
            try {
                const response = await fetch(`/request/api/friend-request/accept`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ requestId }),
                });
                if (response.ok) {
                    event.target.parentElement.remove();
                    alert('Friend request accepted');
                } else {
                    alert('Error accepting request');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const requestId = event.target.dataset.id;
            try {
                const response = await fetch(`/request/api/friend-request/reject`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ requestId }),
                });
                if (response.ok) {
                    event.target.parentElement.remove();
                    alert('Friend request rejected');
                } else {
                    alert('Error rejecting request');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
});
