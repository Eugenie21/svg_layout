var SvgLayout = (function($) {

	var 
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
			},
			slGrid: function(module) {

				this.rows = module.rows;
				this.cols = module.cols;
				this.modkey = module.modkey;
				this.containerName = module.containerName;
				this.buttons = [];
				this.viewParams = {
					fontFamily: 'Sans-serif',
					fontSize: '15px',
					borderWidth: '0',
					borderRadius: '50',
					marginSize: '15px'
				};
			},
		},

		themeMap = {
			simple: {
				green: {
					fontColor: 'rgba(256,256,256,.8)',
					backColor: 'rgb(40, 143, 56)',
					borderColor: 'rgb(14, 72, 23)'
				},
				yellow: {
					fontColor: 'rgba(0,0,0,.5)',
					backColor: 'rgb(215, 221, 0)',
					borderColor: 'rgb(55, 57, 0)'
				},
				red: {
					fontColor: 'rgba(256,256,256,.8)',
					backColor: 'rgb(240, 15, 15)',
					borderColor: 'rgb(77, 3, 3)'
				},
				blue: {
					fontColor: 'rgba(256,256,256,.8)',
					backColor: 'rgb(18, 21, 227)',
					borderColor: 'rgb(2, 3, 51)'
				},
				orange: {
					fontColor: 'rgba(256,256,256,.8)',
					backColor: 'rgb(216, 124, 4)',
					borderColor: 'rgb(56, 32, 2)'
				}
			}
		},
		modulesOnPage = {},
		methodMap = {
			svgInit: null,
			moduleInit: null,

			makeButtons: null,

			horizontalButtons: null,
			verticalButtons: null,

			animate: {
				border: null,
				content: null
			},

			shuffleArray: null
		};

	methodMap.makeButtons = function(modkey, buttons) {

		if(buttons.length <  1) {
			console.log('No Links in module '+ modkey);
			return false;
		}

		var blockHeight = parseInt(jQuery(modulesOnPage[modkey].containerName).height()),
			blockWidth = parseInt(jQuery(modulesOnPage[modkey].containerName).width()),
			marginSize = parseInt(modulesOnPage[modkey].viewParams.marginSize),
			links = buttons.length,
			linkWidth = blockWidth/buttons[0].length - marginSize*2,
			linkHeight = blockHeight/buttons.length - marginSize*2,
			snap = new Snap(modulesOnPage[modkey].containerName),
			rect = null,
			filter = snap.filter('<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />'
								+'<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />');

		var filterGroup = snap.g().attr({filter: filter});

		for(var i = 0; i<buttons.length; i++) {

			modulesOnPage[modkey].buttons.push([]);

			for(var j = 0; j<buttons[0].length; j++) {

				rect = snap.rect( (linkWidth*j+marginSize*(2*j+1)), (linkHeight*i+marginSize*(2*i+1)), linkWidth, linkHeight).attr({
					rx: blockHeight/modulesOnPage[modkey].viewParams.borderRadius,
					ry: blockHeight/modulesOnPage[modkey].viewParams.borderRadius,
					strokeWidth: modulesOnPage[modkey].viewParams.borderWidth,
					stroke: buttons[i][j].theme.borderColor,
					fill: buttons[i][j].theme.backColor
				}).drag();

				filterGroup.add(rect);
			}
		}
	}

	methodMap.moduleInit = function(module) {

		modulesOnPage[module.modkey] = new moduleMap[module.type](module);

		jQuery(modulesOnPage[module.modkey].containerName).css({
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%'
		});

		methodMap.makeButtons(module.modkey, module.buttons);
	}

	// methodMap.shuffleArray = function(array) {

	// 	var currentIndex = array.length, temporaryValue, randomIndex ;

	// 	// While there remain elements to shuffle...
	// 	while (0 !== currentIndex) {

	// 		// Pick a remaining element...
	// 		randomIndex = Math.floor(Math.random() * currentIndex);
	// 		currentIndex -= 1;

	// 		// And swap it with the current element.
	// 		temporaryValue = array[currentIndex];
	// 		array[currentIndex] = array[randomIndex];
	// 		array[randomIndex] = temporaryValue;

	// 		console.log(randomIndex);
	// 	}

	// 	return array;
	// }

	// methodMap.animate.border = function(modkey, index = 0) {

	// 	var path = modulesOnPage[modkey].pathArray[index], 
	// 		pathLength = path.getTotalLength();

	// 	path.animate({"stroke-dashoffset": 0}, modulesOnPage[modkey].viewParams.animationSpeed, mina.linear);

	// 	setTimeout(function() {
	// 		if(modulesOnPage[modkey].pathArray[++index]) {
	// 			methodMap.animate.border(modkey, index++);
	// 		}else{
	// 			methodMap.animate.content(modkey);
	// 		}
	// 	}, modulesOnPage[modkey].viewParams.animationSpeed/2);
	// 	return false;
	// }

	// methodMap.animate.content = function(modkey, index = 0) {
		
	// 	modulesOnPage[modkey].contentArray[index].animate({ 'transform': 'T 0' }, 
	// 	modulesOnPage[modkey].viewParams.animationSpeed, mina.linear);

	// 	setTimeout(function() {
	// 		if(modulesOnPage[modkey].contentArray[++index]) {
	// 			methodMap.animate.content(modkey, index++);
	// 		}else{
	// 			return true			
	// 		}
	// 	}, modulesOnPage[modkey].viewParams.animationSpeed/2);
	// 	return false;
	// }

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

	// //vertical
	// methodMap.verticalButtons = function(modkey) {

	// 	if(modulesOnPage[modkey].content.links.length <  1) {
	// 		console.log('No Links in module '+ modkey);
	// 		return false;
	// 	}

	// 	var blockHeight = parseInt(jQuery(modulesOnPage[modkey].containerName).height()),
	// 		blockWidth = parseInt(jQuery(modulesOnPage[modkey].containerName).width()),
	// 		borderWidth = parseInt(modulesOnPage[modkey].viewParams.size.border),
	// 		links = modulesOnPage[modkey].content.links.length,
	// 		linkWidth = blockWidth - borderWidth*2,
	// 		linkHeight = blockHeight/links-borderWidth*2,
	// 		path = null,
	// 		text = null,
	// 		rect = null,
	// 		group = null;

	// 	for(var i=0; i<links; i++) {

	// 		path = modulesOnPage[modkey].snapObj.path('M '+(borderWidth)+' '+(linkHeight*i+borderWidth*(2*i+0.5))
	// 			+'L '+(blockWidth-borderWidth/2)+' '+(linkHeight*i+borderWidth*(2*i+0.5))
	// 			+', '+(blockWidth-borderWidth/2)+' '+(linkHeight*(i+1)+borderWidth*(2*i+1.5))
	// 			+', '+(borderWidth/2)+' '+(linkHeight*(i+1)+borderWidth*(2*i+1.5))
	// 			+', '+(borderWidth/2)+' '+(linkHeight*i+borderWidth*(2*i+0.5))+'z');

	// 		rect = modulesOnPage[modkey].snapObj.rect( borderWidth, (linkHeight*i+borderWidth*(2*i+1)), (linkWidth), linkHeight).attr({
	// 			stroke: 'none',
	// 			fill: modulesOnPage[modkey].viewParams.color.back
	// 		});

	// 		text = modulesOnPage[modkey].snapObj.text((blockWidth/2), ((linkHeight+borderWidth*2)*(i+0.5)),  modulesOnPage[modkey].content.links[i].title).attr({
	// 			fill: modulesOnPage[modkey].viewParams.color.text,
	// 			'font-family': modulesOnPage[modkey].viewParams.fontFamily,
	// 			'font-size': modulesOnPage[modkey].viewParams.size.text+'px',
	// 			'dominant-baseline': 'middle',
	// 			'font-weight': 'bold',
	// 			textAnchor: "middle"
	// 		});

	// 		group = modulesOnPage[modkey].snapObj.g().attr({
	// 			cursor: 'pointer'
	// 		});

	// 		group.add(rect,text);

	// 		modulesOnPage[modkey].pathArray.push(path.attr({
	// 			stroke: modulesOnPage[modkey].viewParams.color.border,
	// 			fill:'none',
	// 			strokeWidth: modulesOnPage[modkey].viewParams.size.border,
	// 			"stroke-dasharray": path.getTotalLength() + " " + path.getTotalLength(),
	// 			"stroke-dashoffset": path.getTotalLength()
	// 		}));

	// 		modulesOnPage[modkey].contentArray.push(group.transform('t'+(-blockWidth*1.1)));
	// 	}

	// 	methodMap.animate.border(modkey);
	// }

	methodMap.slInit = function(modules) {

		for (var key in modules) {

			if(moduleMap.hasOwnProperty(modules[key].type)) {
				methodMap.moduleInit(modules[key]);
			}
		}
	}

	return {
		init: methodMap.slInit,
		mods: modulesOnPage,
		theme: themeMap
	};

}(Snap));

document.addEventListener("DOMContentLoaded", function () {

	var consoleFunction = function() {
			console.log(this);
		},
		themes = SvgLayout.theme;

	SvgLayout.init([
		{
			type: 'slGrid',
			modkey: 'gridTest',
			containerName: '#gridTest',
			buttons: [
				[
					{content: '1', click: consoleFunction, theme: themes.simple.green},
					{content: '2', click: consoleFunction, theme: themes.simple.red},
					{content: '3', click: consoleFunction, theme: themes.simple.yellow},
					{content: '4', click: consoleFunction, theme: themes.simple.blue},
					{content: '5', click: consoleFunction, theme: themes.simple.orange}
				],
				[
					{content: '1', click: consoleFunction, theme: themes.simple.green},
					{content: '2', click: consoleFunction, theme: themes.simple.red},
					{content: '3', click: consoleFunction, theme: themes.simple.yellow},
					{content: '4', click: consoleFunction, theme: themes.simple.blue},
					{content: '5', click: consoleFunction, theme: themes.simple.orange}
				],
				[
					{content: '1', click: consoleFunction, theme: themes.simple.green},
					{content: '2', click: consoleFunction, theme: themes.simple.red},
					{content: '3', click: consoleFunction, theme: themes.simple.yellow},
					{content: '4', click: consoleFunction, theme: themes.simple.blue},
					{content: '5', click: consoleFunction, theme: themes.simple.orange}
				],
				[
					{content: '1', click: consoleFunction, theme: themes.simple.green},
					{content: '2', click: consoleFunction, theme: themes.simple.red},
					{content: '3', click: consoleFunction, theme: themes.simple.yellow},
					{content: '4', click: consoleFunction, theme: themes.simple.blue},
					{content: '5', click: consoleFunction, theme: themes.simple.orange}
				],
				[
					{content: '1', click: consoleFunction, theme: themes.simple.green},
					{content: '2', click: consoleFunction, theme: themes.simple.red},
					{content: '3', click: consoleFunction, theme: themes.simple.yellow},
					{content: '4', click: consoleFunction, theme: themes.simple.blue},
					{content: '5', click: consoleFunction, theme: themes.simple.orange}
				]
			]
		}
	]);
}, false);

//Проверить совпадение имен модулей на странице
//Сделать обертку
//Сделать резиновые модули
//Сетка()