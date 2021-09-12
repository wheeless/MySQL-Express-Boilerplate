// $(document).ready( function() {
//     $('#defaultDate').val(new Date().toDateInputValue());
// });
// var n = Date.now(); 
// document.getElementById('defaultDate').valueAsDate = n;

function countChar(val) {
    var len = val.value.length;
    if (len >= 160) {
        val.value = val.value.substring(0, 160);
    } else {
        $('#charNum').text(160 - len);
    }
};

var deletePost = function (id) {
    console.log(id);
    fetch("posts/" + id, {
        method: "delete"
    }).then(result => window.location = window.location);
}

var deleteUser = function (id) {
    fetch("/users/admin/editUser/" + id, {
        method: "DELETE"
    }).then(result => window.location = "/users/admin");
}

var adminUser = function (id) {
    fetch("/users/admin/editUser/" + id, {
        method: "PUT"
    }).then(result => window.location = "/users/admin");
}

var updatePost = function (id) {
    console.log(id);
    var data = {
        PostTitle: document.getElementById("postTitle").value,
        PostBody: document.getElementById("postBody").value
    }
    fetch("/posts/" + id, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => window.location = "/posts");
}