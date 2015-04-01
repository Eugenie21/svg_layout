var SvgLayout = (function($) {

	var modulesOnPage = {},
		moduleMap = {
			slBlock: function(module) {
				this.type = module.type;
				this.modkey = module.modkey;
				this.containerName = module.containerName;
				this.snapObj = null;
				this.pathArray = [];
				this.contentArray = [];
				this.content = module.content;
				this.viewParams = {
					color: {
						text: '#fff',
						back: 'rgba(240, 79, 15, 0.6)',
						border: 'rgba(0, 0, 0, 0.7)'
					},
					size: {
						text: '15',
						border: 2
					},
					fontFamily: 'Sans-serif',
					animationSpeed: 1000
				};
				this.draw = function(){ 

					switch(module.type) {
						case 'horizontal': methodMap.horizontalButtons(module.modkey)
							break
						case 'vertical': methodMap.verticalButtons(module.modkey)
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

			horizontalButtons: null,
			verticalButtons: null,

			animate: {
				border: null,
				content: null
			},

			shuffleArray: null
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

	methodMap.shuffleArray = function(array) {

		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;

			console.log(randomIndex);
		}

		return array;
	}

	methodMap.animate.border = function(modkey, index = 0) {

		var path = modulesOnPage[modkey].pathArray[index], 
			pathLength = path.getTotalLength();

		path.animate({"stroke-dashoffset": 0}, modulesOnPage[modkey].viewParams.animationSpeed, mina.linear);

		setTimeout(function() {
			if(modulesOnPage[modkey].pathArray[++index]) {
				methodMap.animate.border(modkey, index++);
			}else{
				methodMap.animate.content(modkey);
			}
		}, modulesOnPage[modkey].viewParams.animationSpeed/2);
		return false;
	}

	methodMap.animate.content = function(modkey, index = 0) {
		
		modulesOnPage[modkey].contentArray[index].animate({ 'transform': 'T 0' }, 
		modulesOnPage[modkey].viewParams.animationSpeed, mina.linear);

		setTimeout(function() {
			if(modulesOnPage[modkey].contentArray[++index]) {
				methodMap.animate.content(modkey, index++);
			}else{
				return true			
			}
		}, modulesOnPage[modkey].viewParams.animationSpeed/2);
		return false;
	}

	//horizontal
	methodMap.horizontalButtons = function(modkey) {

		if(modulesOnPage[modkey].content.links.length <  1) {
			console.log('No Links in module '+ modkey);
			return false;
		}

		var blockHeight = parseInt(jQuery(modulesOnPage[modkey].containerName).height()),
			blockWidth = parseInt(jQuery(modulesOnPage[modkey].containerName).width()),
			borderWidth = parseInt(modulesOnPage[modkey].viewParams.size.border),
			links = modulesOnPage[modkey].content.links.length,
			linkWidth = blockWidth/links - borderWidth*2,
			linkHeight = blockHeight-borderWidth*2,
			path = null,
			text = null,
			rect = null,
			group = null;

		for(var i=0; i<links; i++) {

			path = modulesOnPage[modkey].snapObj.path('M '+(linkWidth*i+borderWidth*(2*i+0.5))+' '+(borderWidth)
				+'L '+(linkWidth*i+borderWidth*(2*i+0.5))+' '+(blockHeight-borderWidth/2)
				+', '+(linkWidth*(i+1)+borderWidth*(2*i+1.5))+' '+(blockHeight-borderWidth/2)
				+', '+(linkWidth*(i+1)+borderWidth*(2*i+1.5))+' '+(borderWidth/2)
				+', '+(linkWidth*i+borderWidth*(2*i+0.5))+' '+(borderWidth/2)+'z');

			rect = modulesOnPage[modkey].snapObj.rect( (linkWidth*i+borderWidth*(2*i+1)), borderWidth, (linkWidth), linkHeight).attr({
				stroke: 'none',
				fill: modulesOnPage[modkey].viewParams.color.back
			});

			text = modulesOnPage[modkey].snapObj.text(((linkWidth+borderWidth*2)*(i+0.5)), (blockHeight/2), modulesOnPage[modkey].content.links[i].title).attr({
				fill: modulesOnPage[modkey].viewParams.color.text,
				'font-family': modulesOnPage[modkey].viewParams.fontFamily,
				'font-size': modulesOnPage[modkey].viewParams.size.text+'px',
				'dominant-baseline': 'middle',
				'font-weight': 'bold',
				textAnchor: "middle"
			});

			group = modulesOnPage[modkey].snapObj.g().attr({
				cursor: 'pointer'
			});

			group.add(rect,text);

			modulesOnPage[modkey].pathArray.push(path.attr({
				stroke: modulesOnPage[modkey].viewParams.color.border,
				fill:'none',
				strokeWidth: modulesOnPage[modkey].viewParams.size.border,
				"stroke-dasharray": path.getTotalLength() + " " + path.getTotalLength(),
				"stroke-dashoffset": path.getTotalLength()
			}));

			modulesOnPage[modkey].contentArray.push(group.transform('t'+(-blockWidth*1.1)));
		}

		methodMap.animate.border(modkey);
	}

	//vertical
	methodMap.verticalButtons = function(modkey) {

		if(modulesOnPage[modkey].content.links.length <  1) {
			console.log('No Links in module '+ modkey);
			return false;
		}

		var blockHeight = parseInt(jQuery(modulesOnPage[modkey].containerName).height()),
			blockWidth = parseInt(jQuery(modulesOnPage[modkey].containerName).width()),
			borderWidth = parseInt(modulesOnPage[modkey].viewParams.size.border),
			links = modulesOnPage[modkey].content.links.length,
			linkWidth = blockWidth - borderWidth*2,
			linkHeight = blockHeight/links-borderWidth*2,
			path = null,
			text = null,
			rect = null,
			group = null;

		for(var i=0; i<links; i++) {

			path = modulesOnPage[modkey].snapObj.path('M '+(borderWidth)+' '+(linkHeight*i+borderWidth*(2*i+0.5))
				+'L '+(blockWidth-borderWidth/2)+' '+(linkHeight*i+borderWidth*(2*i+0.5))
				+', '+(blockWidth-borderWidth/2)+' '+(linkHeight*(i+1)+borderWidth*(2*i+1.5))
				+', '+(borderWidth/2)+' '+(linkHeight*(i+1)+borderWidth*(2*i+1.5))
				+', '+(borderWidth/2)+' '+(linkHeight*i+borderWidth*(2*i+0.5))+'z');

			rect = modulesOnPage[modkey].snapObj.rect( borderWidth, (linkHeight*i+borderWidth*(2*i+1)), (linkWidth), linkHeight).attr({
				stroke: 'none',
				fill: modulesOnPage[modkey].viewParams.color.back
			});

			text = modulesOnPage[modkey].snapObj.text((blockWidth/2), ((linkHeight+borderWidth*2)*(i+0.5)),  modulesOnPage[modkey].content.links[i].title).attr({
				fill: modulesOnPage[modkey].viewParams.color.text,
				'font-family': modulesOnPage[modkey].viewParams.fontFamily,
				'font-size': modulesOnPage[modkey].viewParams.size.text+'px',
				'dominant-baseline': 'middle',
				'font-weight': 'bold',
				textAnchor: "middle"
			});

			group = modulesOnPage[modkey].snapObj.g().attr({
				cursor: 'pointer'
			});

			group.add(rect,text);

			modulesOnPage[modkey].pathArray.push(path.attr({
				stroke: modulesOnPage[modkey].viewParams.color.border,
				fill:'none',
				strokeWidth: modulesOnPage[modkey].viewParams.size.border,
				"stroke-dasharray": path.getTotalLength() + " " + path.getTotalLength(),
				"stroke-dashoffset": path.getTotalLength()
			}));

			modulesOnPage[modkey].contentArray.push(group.transform('t'+(-blockWidth*1.1)));
		}

		methodMap.animate.border(modkey);
	}

	methodMap.slInit = function(modules) {

		for (var key in modules) {

			if(modules[key].type && modules[key].modkey && modules[key].containerName) {
				methodMap.moduleInit(modules[key]);
			}
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
			type: 'horizontal',
			modkey: 'horizontal12',
			containerName: '#slhorizontal',
			content: {
				links: [
					{title: 'Главная', link: '#'},
					{title: 'Продукты', link: '#'},
					{title: 'Доставка', link: '#'},
					{title: 'О нас', link: '#'},
					{title: 'Телефон', link: '#'},
					{title: 'О нас', link: '#'}
				]
			},
			viewParams: {
				size: {
					border: 2 
				}
			}
		},{
			type: 'horizontal',
			modkey: 'horizontal1',
			containerName: '#slhorizontal1',
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
					border: 10
				},
				animationSpeed: 400
			}
		},{
			type: 'vertical',
			modkey: 'vertical',
			containerName: '#slvertical',
			content: {
				links: [
					{title: 'Главная', link: '#'},
					{title: 'Продукты', link: '#'},
					{title: 'Доставка', link: '#'},
					{title: 'О нас', link: '#'},
					{title: 'Телефон', link: '#'},
					{title: 'О нас', link: '#'},
					{title: 'Телефон', link: '#'},
					{title: 'Главная', link: '#'},
					{title: 'Продукты', link: '#'},
					{title: 'Доставка', link: '#'},
					{title: 'О нас', link: '#'}
				]
			},
			viewParams: {
				color: {
					text: 'rgba(256,256,256,.7)',
					back: 'rgba(15, 176, 240, 0.68)',
					border: 'rgba(0,0,0,.7)'
				},
				size: {
					text: 18,
					border: 1
				},
				animationSpeed: 400
			}
		}
	]);
}, false);

//Проверить совпадение имен модулей на странице
//Сделать обертку
//Сделать резиновые модули
//Сетка()