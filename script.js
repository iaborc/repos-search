const query = document.getElementById('input');
const wrap = document.getElementById('wrap');
const search = document.getElementById('search');
const debounce = (fn, debounceTime) => {
    let a
    return function() {
        if (a) clearTimeout(a);
        a = setTimeout(fn.bind(this), debounceTime, ...arguments)
    }
}
const addRep = (result, event) => {
    const num = event.target.dataset.num
    if (num) {
        const repos = result.items[num]
        const card = document.createElement('div');
        card.classList.add('rep-card');
        const info = document.createElement('div')
        const name = document.createElement('div');
        const owner = document.createElement('div');
        const stars = document.createElement('div');
        const btn = document.createElement('img');
        btn.setAttribute('src', 'img/delete.PNG' );
        btn.setAttribute('width', '40px' );
        btn.setAttribute('height', '40px' );
        btn.classList.add('remove-btn')
        name.textContent = `Name: ${repos.name}`;
        owner.textContent = `Owner: ${repos.owner.login}`;
        stars.textContent = `Stars: ${repos['stargazers_count']}`;
        info.append(name, owner, stars);
        card.append(info, btn);
        wrap.append(card);
        btn.addEventListener('click', () => {
            btn.closest('.rep-card').remove();
            }
        )
    }
}
function autocomplete(q) {
    let url = `https://api.github.com/search/repositories?q=${q}`
    fetch(url)
        .then(response => {
            if (response.ok){
           return response.json();
            } else throw new Error(response);
        })
        .then(result => {
            const pre = document.querySelector('#pre');
            if (pre) pre.remove();
            const ul = document.createElement('ul');
            ul.classList.add('results-list');
            for (let i = 0; i < 5; i++) {
                const li = document.createElement('li')
                li.classList.add('results-item');
                li.textContent = result.items[i].name;
                li.setAttribute('data-num', i);
                ul.append(li);
                ul.setAttribute('id', 'pre');
            }
            if(query.value) search.append(ul);
            ul.addEventListener("click", addRep.bind(null, result));
        })
        .catch(() => {
            alert('Подождите минуту и попробуйте снова');
        });
}
const fetchDelay = debounce(autocomplete, 700);
input.addEventListener('input', event => {
    let q = query.value;
    if(q) {
        fetchDelay(q);
    } else if (document.querySelector('#pre')) document.querySelector('#pre').remove();
})