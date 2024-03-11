document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://cats.petiteweb.dev/api/single/12rrr';
    const addCatModal = document.getElementById('addCatModal');
    const editCatModal = document.getElementById('editCatModal');
    const addCatForm = document.getElementById('addCatForm');
    const editCatForm = document.getElementById('editCatForm');
    let globalCatsData = [];
    document.getElementById('showAddCatModal').addEventListener('click', () => {
        addCatModal.style.display = 'block';
    });
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });
    document.getElementById('fetchCatsBtn').addEventListener('click', () => {
        fetchCats();
    });
    function getAgeString(age) {
        if (age % 100 >= 11 && age % 100 <= 19) {
            return `${age} лет`;
        } else if (age % 10 === 1) {
            return `${age} год`;
        } else if (age % 10 >= 2 && age % 10 <= 4) {
            return `${age} года`;
        } else {
            return `${age} лет`;
        }
    }
    addCatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const catData = Object.fromEntries(formData.entries());
        fetch(`${apiUrl}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(catData)
        })
            .then(response => response.json())
            .then(data => {
                
                fetchCats();
                addCatModal.style.display = 'none';
                addCatForm.reset();
            })
            
    });
    editCatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const catData = Object.fromEntries(formData.entries());
        const catId = catData.id;
        fetch(`${apiUrl}/update/${catId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(catData)
        })
            .then(response => response.json())
            .then(data => {
                fetchCats();
                editCatModal.style.display = 'none';
                editCatForm.reset();
            })
            ;
    });
    window.showViewCatModal = function (id) {
        const cat = globalCatsData.find(cat => cat.id === id);
        const catInfoContainer = document.getElementById('catInfoContainer');
        catInfoContainer.innerHTML = `
            <div class="cat-info">
                <div class="cat-details">
                    <h3>${cat.name}</h3>
                    <h4>Возраст: ${getAgeString(cat.age || 'Не указан')}</h4>
                    <p>${cat.description || 'Описание отсутствует'}</p>
                </div>
                <div class="cat-image">
                    <img src="${cat.image}" alt="${cat.name}">
                </div>
            </div>
        `;
        document.getElementById('viewCatModal').style.display = 'block';
    };
    window.showEditCatModal = function (id) {
        const cat = globalCatsData.find(cat => cat.id === id);
        if (!cat) {
            return;
        }
        document.getElementById('editId').value = cat.id;
        document.getElementById('editName').value = cat.name;
        document.getElementById('editAge').value = cat.age || '';
        document.getElementById('editImageUrl').value = cat.image;
        document.getElementById('editDescription').value = cat.description;
        editCatModal.style.display = 'block';
    };
    function fetchCats() {
        fetch(`${apiUrl}/show`)
            .then(response => response.json())
            .then(cats => {
                globalCatsData = cats;
                const catsContainer = document.getElementById('catsContainer');
                catsContainer.innerHTML = '';
                cats.forEach(cat => {
                    const catCard = document.createElement('div');
                    catCard.classList.add('cat');
                    catCard.innerHTML = `
                        <img src="${cat.image}" alt="Котик" style="width: 100%; height: auto;">
                        <h3>${cat.name}</h3>
                        <div>
                            <button onclick="showEditCatModal(${cat.id})"><i class="fa-solid fa-pen" style="color:#222;"></i></button>
                            <button onclick="deleteCat(${cat.id})"><i class="fa-solid fa-delete-left" style="color: #222;"></i></button> 
                            <button onclick="showViewCatModal(${cat.id} )">Посмотреть</button>
                        </div>
                    `;
                    catsContainer.appendChild(catCard);
                });
            });
    }
    window.deleteCat = function (id) {
        fetch(`${apiUrl}/delete/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                fetchCats();
            });
    };
    fetchCats();
});