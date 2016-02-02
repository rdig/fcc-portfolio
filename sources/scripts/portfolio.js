const main = $('#onepageScroll');
const body = $('body');
const topmenu = $('nav');
const footer = $('footer');
const links = {
	nav: $('#menu').children('li').children('a'),
	portfolio: $('#link-portfolio')
};
const rotator = $('#verb');

let altLinkScroll = function(element, index = element.dataset.index) {
	let currentView = $('.active').attr('data-index');
	if (body.hasClass('disabled-onepage-scroll')) {
		$('html, body').animate({
			scrollTop: $('section[data-index=' + index + ']').position().top
		});
	} else {
		if (currentView !== index) {
			main.moveTo(index);
		}
	}
}

main.onepage_scroll({
	easing: "ease-in-out",
	animationTime: 700,
	updateURL: true,
	beforeMove: () => {
		if (!body.hasClass('disabled-onepage-scroll')) {
			topmenu.fadeOut('fast');
			footer.fadeOut('fast');
		} else {
			topmenu.show();
			footer.show();
		}
	},
	afterMove: () => {
		if (!body.hasClass('disabled-onepage-scroll')) {
			topmenu.fadeIn('fast');
			footer.fadeIn('fast');
		} else {
			topmenu.show();
			footer.show();
		}
	},
	loop: false,
	keyboard: true,
	responsiveFallback: 800
});

rotator.textrotator({
	animation: 'flipUp',
	separator: ",",
	speed: 6000
});

links.nav.on('click', function() {
	altLinkScroll(this);
});

links.portfolio.on('click', function() {
	altLinkScroll(this, 2);
});
