//const e = require("cors");
const SERVER_URL = 'http://195.2.92.124:8080';

function generateGroupOptions(htmlDatalistName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", SERVER_URL + '/group/all-names', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = function () {
        var allGroups = JSON.parse(this.responseText);
        var options = '';
        for (var i = 0; i < allGroups.length; i++) {
            options += '<option value="' + allGroups[i] + '" />';
        }
        document.getElementById(htmlDatalistName).innerHTML = options;
    };
}

function doAuth(email, password, rePassword, groupName) {
    if (!rePassword && !groupName) {
        signIn(email, password);
    } else {
        signUp(email, password, rePassword, groupName);
    }
}

function signUp(email, password, rePassword, groupName) {
    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) ||
        password != rePassword ||
        groupName == '' ||
        groupName == undefined) {

        alert("Переделываем, подходим");
    } else {
        document.getElementById('spinning-loader').style = "";

        var words = CryptoJS.enc.Utf8.parse(CryptoJS.HmacSHA256(password, email));
        var hashedPassword = CryptoJS.enc.Utf8.stringify(words);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", SERVER_URL + '/student/new', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('email', String(email));
        xhr.setRequestHeader('password', String(hashedPassword));
        localStorage.setItem('password', String(hashedPassword));
        xhr.setRequestHeader('groupName', String(groupName));
        xhr.send();
        xhr.onload = function () {
            document.getElementById('spinning-loader').style = "";
            var data = JSON.parse(this.responseText);
            console.log(data);

            localStorage.setItem("email", data.email);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("groupName", data.groupName);

            document.getElementById('spinning-loader').style = "display: none";

            window.location.replace("buffer.html");

            return true;
        };

        return true;
    }
}

function signIn(email, password) {
    document.getElementById('spinning-loader').style = "";

    var words = CryptoJS.enc.Utf8.parse(CryptoJS.HmacSHA256(password, email));
    var hashedPassword = CryptoJS.enc.Utf8.stringify(words);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", SERVER_URL + '/student/auth', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('email', String(email));
    xhr.setRequestHeader('password', String(hashedPassword));
    localStorage.setItem('password', String(hashedPassword));

    xhr.send();
    xhr.onload = function () {
        document.getElementById('spinning-loader').style = "";
        var data = JSON.parse(this.responseText);
        console.log(data);
        localStorage.setItem("email", data.email);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("groupName", data.groupName);

        document.getElementById('spinning-loader').style = "display: none";

        window.location.replace("index.html");

        return true;
    };

    return true;
}

function logout() {
    localStorage.clear();
    window.location.replace("index.html");
}

function checkAuth() {
    var email = localStorage.getItem("email");
    var password = localStorage.getItem("password");

    console.log("Email: " + email);
    console.log("Password: " + password);

    if (password == '' || password == null || password == undefined) {
        window.location.replace("auth.html");
        return;
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", SERVER_URL + '/student/exists', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('email', email);
        xhr.setRequestHeader('password', password);

        xhr.send();
        xhr.onload = function () {
            var isExists = JSON.parse(this.responseText);
            console.log(isExists);

            if (isExists == 'false') {
                window.location.replace("auth.html");
            }
        };

        xhr.onerror = function () {
            window.location.replace("auth.html");
        }
    }
}