function checkLogIn(user, redirectUrl = "/") {
    if(!user) {
        document.location = redirectUrl;

    }
}

export default{
    checkLogIn
}