var SvgLayout = (function($) {

	var modulesOnPage = {},
		moduleMap = {
			navBar: {
				type: 'navBar',
				modKey: '',
				modContainer: '#',
				modParams: {
					links: [
						{title: 'empty', link: 'empty'},
						{title: 'empty', link: 'empty'},
						{title: 'empty', link: 'empty'},
						{title: 'empty', link: 'empty'},
						{title: 'empty', link: 'empty'}
					],
					color: {
						text: '#000',
						back: '#ccc',
						border: '#000'
					},
					size: {
						text: '15',
						border: '2'
					},
					speed: '1000'
				},
				snapContainer: null,
				init: null
			},
			sideBar: {
				type: 'sideBar',
				modKey: '',
				modContainer: '#',
				modParams: {
					links: [
						{title: 'empty', link: 'empty'},
						{title: 'empty', link: 'empty'},
						{title: 'empty', link: 'empty'},
						{title: 'empty', link: 'empty'},
						{title: 'empty', link: 'empty'}
					],
					color: {
						text: '#000',
						back: '#ccc',
						border: '#000'
					},
					size: {
						text: '15',
						border: '2'
					},
					speed: '1000'
				},
				snapContainer: null,
				init: null
			}
		},
		methodMap = {
			svgInit: null,
			moduleInit: null
		};


	methodMap.moduleInit = function(module, modType) {

		modulesOnPage[module.modKey] = moduleMap[modType];

		modulesOnPage[module.modKey].modKey = module.modKey;
		modulesOnPage[module.modKey].modContainer = module.modContainer;

		for(var key in module.modParams) {
			if(modulesOnPage[module.modKey].modParams.hasOwnProperty(key)) {
				modulesOnPage[module.modKey].modParams[key] = module.modParams[key];
			}
		}

		var params = modulesOnPage[module.modKey].modParams;

		jQuery(modulesOnPage[module.modKey].modContainer).css({
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%'
		});

		modulesOnPage[module.modKey].snapContainer = new Snap(modulesOnPage[module.modKey].modContainer);

		modulesOnPage[module.modKey].init();
	}

	//NAVBAR
	moduleMap.navBar.init = function(p) {

		console.log(this);
	}

	//SIDEBAR
	moduleMap.sideBar.init = function(p) {

	}

	methodMap.slInit = function(modules) {

		for (var key in modules) {

			if(moduleMap.hasOwnProperty(key)) {
				if(modules[key].length > 1) {
					for(var key2 in modules[key]) {
						methodMap.moduleInit(modules[key][key2],key);
					}
				}else {
					methodMap.moduleInit(modules[key],key);
				}
			}
		}
		console.log('Modules On Page: ');
		for(key in modulesOnPage) {
			console.log(modulesOnPage[key]);
		}
	}

	return {
		init: methodMap.slInit,
		mods: modulesOnPage
		};

}(Snap));

document.addEventListener("DOMContentLoaded", function () {

	SvgLayout.init({

		navBar: [
			{
				modKey: 'navBar1',
				modContainer: '#slNavBar',
				modParams: {
					links: [
						{title: 'Главная', link: '#'},
						{title: 'Продукты', link: '#'},
						{title: 'Доставка', link: '#'},
						{title: 'О нас', link: '#'},
						{title: 'Телефон', link: '#'}
					]
				}
			},{
				modKey: 'navBar2',
				modContainer: '#slNavBar1',
				modParams: {
					links: [
						{title: 'Главная', link: '#'},
						{title: 'Продукты', link: '#'},
						{title: 'Доставка', link: '#'},
						{title: 'О нас', link: '#'},
						{title: 'Телефон', link: '#'}
					]
				}
			}
		],
		sideBar: [
			{
				modKey: 'sideBar1',
				modContainer: '#slSideBar',
				modParams : {
					links: [
						{title: 'Главная', link: '#'},
						{title: 'Продукты', link: '#'},
						{title: 'Доставка', link: '#'},
						{title: 'О нас', link: '#'},
						{title: 'Телефон', link: '#'}
					]
				}
			}
		]
	});
}, false);

//Проверить совпадение имен модулей на странице
//Сделать обертку