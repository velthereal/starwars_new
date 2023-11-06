document.addEventListener('DOMContentLoaded', function(){
		// BURGER MENU
		let burger = document.querySelector('.burger');
		let burger_menu = document.querySelector('.burger_menu');
		let close_btn = document.querySelector('.close');
		burger.addEventListener('click', function(){
			burger_menu.classList.add('open');
		});
		close_btn.addEventListener('click', function(){
			burger_menu.classList.remove('open');
		})
})