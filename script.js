const urlBase = 'https://jsonplaceholder.typicode.com/posts' //esta es la url con la que interactuareamos
let posts = [] //iniciamos los posteos como un array vacio


function getData() {
    fetch(urlBase)
    .then(res => res.json())
    .then(data => {
        posts = data
        renderPostList();
    })
    .catch(error => console.error('Error al llamar a la API: ', error))
}
getData()
function renderPostList(){
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Borrar</button>

        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody">Comentario: </label>
            <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})">Actualizar</button>
        </div>
        `
        postList.appendChild(listItem)
    })
}

function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    //Chequeo que el posteo no esté vacio
    if(postTitle.trim() == '' || postBody.trim() == ''){
        alert('Los campos son obligatorios')
        return
    }

    //Creo el posteo
    fetch(urlBase,{
        method: 'POST',
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })

    //Sumo el nuevo posteo a los que ya tenía
    .then(res => res.json())
    .then(data => {
        posts.unshift(data)
        renderPostList();
        postTitleInput.value = '';
        postBodyInput.value = '';
    })
    //Capturo el error si lo hay
    .catch(error => console.error('Error al crear un posteo'))
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    //si displey es none pasa a block y sino al revés
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: id,
          title: editTitle,
          body: editBody,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(res => res.json())
      .then(data => {
        const index = posts.findIndex(post => post.id === data.id)
        if(index != -1){
            posts[index] = data
        }else{
            alert('Hubo un error al actualizar el posteo')
        }
        renderPostList()
      })
      //Capturo el error si lo hay
    .catch(error => console.error('Error al actualizar posteo'), error)
}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
      })
    .then(res => {
        if(res.ok) {
            //devuelve todos los posteos menos el que coincide con el id
            posts = posts.filter(post => post.id != id)
            renderPostList();
        }else{
            alert('Hubo un error al eliminar el posteo')
        }
    })
    .catch(error => console.error('hubo un error: ', error))
}