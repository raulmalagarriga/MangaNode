let xhr = new XHR();

function $(id) {
    return document.getElementById(id);
};

function logIn() {
    if ($('username').value.trim() !== "" && $('password').value.trim() !== "") {
        xhr.post('../session/login', {
                username: $('username').value.trim(),
                password: $('password').value.trim()
            },{})
            .then(data => {
                console.log('log In Successful')
            })
            .catch(err => {
                console.error(err)
            });
    } else {
        alert('Ingrese todos los campos porfavor');
    }
}

function getValue() {
    xhr.get('../session/value', {}, {})
        .then(data => {
            console.log(data)
        })
        .catch(err => console.log(err));
}

function logOut() {
    xhr.get('../session/logout', {}, {})
        .then(data => console.log(data))
        .catch(err => console.log(err));
}

$('logIn').addEventListener('click', logIn);
$('logOut').addEventListener('click', logOut);
$('getValue').addEventListener('click', getValue);
