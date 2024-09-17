function viewProfile() {
    window.location.href = '/users/profile';
}

function searchUsers() {
    window.location.href = '/search/search';
}

function viewFriendRequests() {
    window.location.href = '/request/requests';
}

function openChat(friendId, friendUserName) {
    window.location.href = '/users/chat/' + friendId + '?username=' + friendUserName;
}

function addFriends() {
    window.location.href = '/users/add-friends';
}
