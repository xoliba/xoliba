function closeNotification() {
    var element = document.getElementById('notificationpopup');
    element.style.transition = '0.5s';
    element.style.left = '105%';
    setTimeout(() => {
        element.style.transition = '0s';
    }, 500);
}
