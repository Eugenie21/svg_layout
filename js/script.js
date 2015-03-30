var SvgLayout = (function($) {

	var modulesOnPage = {},
		moduleMap = {
			slBlock: function(module) {
				this.type = module.type;
				this.modkey = module.modkey;
				this.containerName = module.containerName;
				this.snapObj = null;
				this.content = module.content;
				this.viewParams = {
					color: {
						text: '#fff',
						back: 'rgba(240, 79, 15, 0.6)',
						border: 'rgba(0, 0, 0, 0.7)'
					},
					size: {
						text: '15',
						border: '6'
					},
					animationSpeed: 300
				};
				this.draw = function(){ 

					switch(module.type) {
						case 'navbar': methodMap.drawNav(module.modkey)
							break
						case 'sidebar': methodMap.drawSide(module.modkey)
							break
						default: console.log("No such module '"+module.type+"'")
							break
					}
				}
			}
		},
		methodMap = {
			svgInit: null,
			moduleInit: null,

			drawNav: null,
			drawSide: null,

			animate: {
				border: null
			},

			makeLink: null,
			// stringSize: null
		};


	methodMap.moduleInit = function(module) {

		modulesOnPage[module.modkey] = new moduleMap.slBlock(module);

		for(var key in module.viewParams) {
			if(modulesOnPage[module.modkey].viewParams.hasOwnProperty(key)) {
				if(modulesOnPage[module.modkey].viewParams[key].length > 1){
					for(var key2 in module.viewParams[key]) {
						modulesOnPage[module.modkey].viewParams[key][key2] = module.viewParams[key][key2];
					}
				}else{
					modulesOnPage[module.modkey].viewParams[key] = module.viewParams[key];
				}
			}
		}

		var params = modulesOnPage[module.modkey].viewParams;

		jQuery(modulesOnPage[module.modkey].containerName).css({
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%'
		});

		modulesOnPage[module.modkey].snapObj = new $(modulesOnPage[module.modkey].containerName);
		modulesOnPage[module.modkey].draw();
	}

	methodMap.animate.border = function(borderPath, modkey, index = 0) {

		var path = modulesOnPage[modkey].snapObj.path(borderPath[index]), 
			pathLength = path.getTotalLength();

		var animation = path.attr({
			stroke: modulesOnPage[modkey].viewParams.color.border,
			fill:'none',
			strokeWidth: modulesOnPage[modkey].viewParams.size.border,
			"stroke-dasharray": pathLength + " " + pathLength,
			"stroke-dashoffset": pathLength
		}).animate({"stroke-dashoffset": 0}, modulesOnPage[modkey].viewParams.animationSpeed, mina.linear);

		setTimeout(function() {
			if(borderPath[++index]) {
				methodMap.animate.border(borderPath, modkey, index++);
			}else{
				return true;
			}
		}, modulesOnPage[modkey].viewParams.animationSpeed/2);
	}

	//NAVBAR
	methodMap.drawNav = function(modkey) {

		if(!(modulesOnPage[modkey].content.links.length >  1)) {
			console.log('No Links in module '+ modkey);
			return false;
		}

		var blockHeight = parseInt(jQuery(modulesOnPage[modkey].containerName).height()),
			blockWidth = parseInt(jQuery(modulesOnPage[modkey].containerName).width()),
			borderWidth = modulesOnPage[modkey].viewParams.size.border,
			links = modulesOnPage[modkey].content.links.length,
			linkWidth = blockWidth/links - borderWidth,
			linkHeight = blockHeight-borderWidth*2,
			borderPath = [],
			buttons = [];

		for(var i=0; i<links; i++) {

			// buttons.push(function() {
			

			// });

			if(i==0) {
				borderPath.push('M '+(borderWidth/2+linkWidth*i+borderWidth*i)+' '+(borderWidth/2)
								+'L '+(borderWidth/2+linkWidth*i+borderWidth*i)+' '+(blockHeight-borderWidth/2)
								+', '+(borderWidth/2+linkWidth*(i+1)+borderWidth*i)+' '+(blockHeight-borderWidth/2)
								+', '+(borderWidth/2+linkWidth*(i+1)+borderWidth*i)+' '+(borderWidth/2)
								+', '+(borderWidth/2+ linkWidth*i+borderWidth*i)+' '+(borderWidth/2)+'z'); //Не убирать 'i' --- Потому-что !!!

				modulesOnPage[modkey].snapObj.rect(borderWidth, borderWidth, (linkWidth-borderWidth), linkHeight).attr({
					stroke: 'none',
					fill: modulesOnPage[modkey].viewParams.color.back,
					cursor: 'pointer'
				});

				console.log(linkWidth);

				modulesOnPage[modkey].snapObj.text( (linkWidth/2+borderWidth/2), (blockHeight/2), modulesOnPage[modkey].content.links[i].title).attr({
					fill: modulesOnPage[modkey].viewParams.color.text,
					'font-family': 'Sans-serif',
					'font-size': modulesOnPage[modkey].viewParams.size.text+'px',
					'dominant-baseline': 'middle',
					'font-weight': 'bold',
    				textAnchor: "middle"
				});
			}else{
				borderPath.push('M '+(borderWidth*i+linkWidth*i)+' '+(blockHeight-borderWidth/2)
								+'L '+(borderWidth*i+linkWidth*(i+1)+borderWidth/2)+' '+(blockHeight-borderWidth/2)
								+', '+(borderWidth*i+linkWidth*(i+1)+borderWidth/2)+' '+(borderWidth/2)
								+', '+(linkWidth*i+borderWidth*i)+' '+(borderWidth/2))+'z';

				modulesOnPage[modkey].snapObj.rect((borderWidth*i + linkWidth*i), borderWidth, linkWidth, linkHeight).attr({
					stroke: 'none',
					fill: modulesOnPage[modkey].viewParams.color.back,
					cursor: 'pointer'
				});

				modulesOnPage[modkey].snapObj.text( (linkWidth/2+borderWidth*i+linkWidth*i), (blockHeight/2), modulesOnPage[modkey].content.links[i].title).attr({
					fill: modulesOnPage[modkey].viewParams.color.text,
					'font-family': 'Sans-serif',
					'font-size': modulesOnPage[modkey].viewParams.size.text+'px',
					'dominant-baseline': 'middle',
					'font-weight': 'bold',
    				textAnchor: "middle"
				});
			}
		}

		methodMap.animate.border(borderPath, modkey);
	}

	

	//SIDEBAR
	methodMap.drawSide = function(modkey) {

	}

	methodMap.slInit = function(modules) {

		for (var key in modules) {

			if(modules[key].type && modules[key].modkey && modules[key].containerName) {
				methodMap.moduleInit(modules[key]);
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

	SvgLayout.init([
		{
			type: 'navbar',
			modkey: 'navbar12',
			containerName: '#slNavBar',
			content: {
				links: [
					{title: 'Главная', link: '#'},
					{title: 'Продукты', link: '#'},
					{title: 'Доставка', link: '#'},
					{title: 'О нас', link: '#'},
					{title: 'Телефон', link: '#'},
					{title: 'О нас', link: '#'},
					{title: 'Телефон', link: '#'}
				]
			},
			viewParams: {
				size: {
					border: '2'
				}
			}
		},{
			type: 'navbar',
			modkey: 'navbar1',
			containerName: '#slNavBar1',
			content: {
				links: [
					{title: 'Главная', link: '#'},
					{title: 'Продукты', link: '#'},
					{title: 'Доставка', link: '#'},
					{title: 'О нас', link: '#'},
				]
			},
			viewParams: {
				color: {
					text: '#000',
					back: '#ffa',
					border: '#000'
				},
				size: {
					border: '10'
				},
				animationSpeed: 300
			}
		},{
			type: 'sidebar',
			modkey: 'sidebar',
			containerName: '#slSideBar',
			content: {
				links: [
					{title: 'Главная', link: '#'},
					{title: 'Продукты', link: '#'},
					{title: 'Доставка', link: '#'},
					{title: 'О нас', link: '#'},
					{title: 'Телефон', link: '#'}
				]
			},
			viewParams: {
				color: {
					text: '#000',
					back: '#fcc',
					border: '#000'
				}
			}
		}
	]);
}, false);

//Проверить совпадение имен модулей на странице
//Сделать обертку
//Сделать резиновые модули