document.addEventListener('DOMContentLoaded', function(){
	const currentPage = 1;
	const savedData = localStorage.getItem(`swapiDataPlanetsPage${currentPage}`);
	if(savedData){
		const data = JSON.parse(savedData);
		hideLoader();
		showAllPlanets(data.results);
		createPagination(data.count, data.results.length);
		document.querySelector('.number_page').classList.add('visible');
		activePagination();
	} else {
			// API
		showLoader();
		getPlanets(currentPage, true);
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
function getPlanets(page, create = false){
	let url = `https://swapi.dev/api/planets/?page=${page}`;
	fetch(url)
	.then(response => response.json())
	.then(data => {
		localStorage.setItem(`swapiDataPlanetsPage${page}`, JSON.stringify(data));
		return data;
	})
	.then(data => {
		hideLoader();
		showAllPlanets(data.results);
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
function showAllPlanets(data){
	let content = document.querySelector('.content');
	content.innerHTML = '';
	data.forEach(element => {
		let str = `<div class="card mb-3">
							<h3 class="card-header">${element.name}</h3>
							<img src="https://starwars-visualguide.com/assets/img/planets/${element.url.match(/\/([0-9]*)\/$/)[1]}.jpg" class="d-block user-select-none">
						</div>`;
		content.insertAdjacentHTML('beforeend', str);
	});
	showPlanet(data);
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
			getPlanets(this.firstElementChild.textContent);
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
function showPlanet(data){
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
	let title = document.querySelector('.details .card-title');
	const {name, population, climate, diameter, orbital_period, rotation_period} = data;
	title.textContent = name;
	li[0].textContent = population;
	li[1].textContent = climate;
	li[2].textContent = diameter;
	li[3].textContent = orbital_period;
	li[4].textContent = rotation_period;
	img.src = url;
}