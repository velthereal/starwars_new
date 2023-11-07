document.addEventListener('DOMContentLoaded', function(){
	const currentPage = 1;
	const savedData = localStorage.getItem(`swapiDataFilmsPage${currentPage}`);
	if(savedData){
		const data = JSON.parse(savedData);
		hideLoader();
		showAllFilms(data.results);
		createPagination(data.count, data.results.length);
		document.querySelector('.number_page').classList.add('visible');
		activePagination();
	} else {
		// API
		showLoader();
		getFilms(currentPage, true);
	}
});

// LOADER
function showLoader() {
	let loader = document.querySelector('.loader-container');
	loader.style.display = 'flex';
}
function hideLoader() {
	let loader = document.querySelector('.loader-container');
	loader.style.display = 'none';
}

// GET API
function getFilms(page, create = false){
	let url = `https://swapi.dev/api/films/?page=${page}`;

	fetch(url)
	.then(response => response.json())
	.then(data => {
		localStorage.setItem(`swapiDataFilmsPage${page}`, JSON.stringify(data));
		return data;
	})
	.then(data => {
		hideLoader();
		showAllFilms(data.results);
		if(create){
			createPagination(data.count, data.results.length);
			document.querySelector('.number_page').classList.add('visible');
			activePagination();
		}
	})
	.catch(error => {
		hideLoader();
		console.error('Error:', error);
	})
}

// SHOW INFO
function showAllFilms(data){
	let content = document.querySelector('.content');
	content.innerHTML = '';
	data.forEach(element => {
		let str = `<div class="card mb-3">
							<h3 class="card-header">Episode ${element.episode_id}: ${element.title}</h3>
							<img src="https://starwars-visualguide.com/assets/img/films/${element.url.match(/\/([0-9]*)\/$/)[1]}.jpg" class="d-block user-select-none">
						</div>`;
		content.insertAdjacentHTML('beforeend', str);
	});
	showFilm(data);
}

// PAGINATION
function activePagination(){
	let page = document.querySelectorAll('.page-item');
	for(let i = 0; i < page.length; i++){
		page[i].addEventListener('click', function(){
			for (let i = 0; i < page.length; i++) {
				page[i].classList.remove('active');
			}
			this.classList.add('active');
			getFilms(this.firstElementChild.textContent);
		})
	}
}
function createPagination(all, current){
	let line = '';
	let number = parseInt(all / current) + (all / current > parseInt(all / current) ? 1 : 0);
	for (let i = 0; i < number; i++) {
		if(i === 0){
			line += `<li class="page-item active"><a class="page-link" href="#">${i+1}</a></li>`;
			continue;
		}
		line += `<li class="page-item"><a class="page-link" href="#">${i+1}</a></li>`;
	}
	document.querySelector('.pagination li:first-child').insertAdjacentHTML('afterend', line);
}

// SHOW DETAILS
function showFilm(data){
	let blocks = document.querySelectorAll('.content div.card');
	for(let i = 0; i < blocks.length; i++){
		blocks[i].children[1].onerror = function(){
			blocks[i].children[1].src = 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
		}
	}
	for (let i = 0; i < blocks.length; i++) {
		blocks[i].addEventListener('click', ()=>{
			showDetails(data[i], blocks[i].children[1].src);
			document.querySelector('.details').classList.add('show');
		})
	}
	document.querySelector('.details i').addEventListener('click', ()=>{
		document.querySelector('.details').classList.remove('show');
	})
}
// CREATE DETAILS
function showDetails(data, url){
	let img = document.querySelector('.details .card-header img');
	let li = document.querySelectorAll('.details .info');
	let name = document.querySelector('.details .card-title');
	const {title, director, producer, release_date, episode_id} = data;
	name.textContent = title;
	li[0].textContent = episode_id;
	li[1].textContent = release_date;
	li[2].textContent = director;
	li[3].textContent = producer;
	img.src = url;
}