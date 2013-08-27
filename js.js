$(document).ready(function(){
	var $list = $('.mod-template__list');
	var $block = $('.mod-template__block');
	var list = new Array();
	var list_choosen = {};
	var dragable = new Boolean(false);
	var list_length = $list.length;
	var $submit = $(".mod-template__submit");
	var jsonString;
	var datas = [];
	var cssSource = '';
	var htmlSource = '';
	var cssSingle = '';
	var htmlSingle = '';
	var boxPos = {
		l: 0,
		t: 0
	}
	var mousePos = {
		l: 0,
		t: 0
	}
	var currentPos = {
		l: 0,
		t: 0
	}
	var choosen_length = 0;

	function Elem(name,elem1,elem2){
		this.use = false;
		this.l = 0;
		this.t = 0;
		this.name = name;
		this.selector = elem1;
		this.block = elem2;
		Elem.prototype.showOrHide = function(){
			if(!this.use){
				this.block.addClass("mod-template__block_show");
				this.selector.addClass("mod-template__checked");
			}else{
				this.block.removeClass("mod-template__block_show");
				this.selector.removeClass("mod-template__checked");
			}
			this.use = !this.use;
		};
		Elem.prototype.init = function(x,y){
			this.block.css({
				"left" : x + 'px',
				"top" : y + 'px'
			});
		}
	}

	function chooseList(){
		$list.click(function(){

		});
	}

	function initElem(){
		for(var i = 0;i<list_length;i++){
			(function(num){
				list[num] = new Elem($list.eq(num).attr("name"),$list.eq(num),$block.eq(num));
			})(i);
		}
	}

	function toChoose(){
		$(".mod-template__ul").delegate("li","click",function(){
			var i = $(this).index(".mod-template__list");
			list[i].showOrHide();
		});
	}

	function initBoxPos(){
		boxPos.l = $('.mod-template__wrapper').eq(0).offset().left;
		boxPos.t = $('.mod-template__wrapper').eq(0).offset().top;
	}

	function moveBlock(){
		$(".mod-template__wrapper").delegate(".mod-template__block","mousedown",function(event){
			dragable = true;
			event.preventDefault();
			var num = $(this).index(".mod-template__block");
			var x = list[num].block.offset();
			mousePos.l = event.pageX;
			mousePos.t = event.pageY;
			$(document).mousemove(function(event){
				if(dragable){
				moveIt(list[num],event.pageX-mousePos.l,event.pageY-mousePos.t);
				mousePos.l = event.pageX;
				mousePos.t = event.pageY;
				}else{
					$(document).unbind();
					return false;
				}
			}).mouseup(function(){
					$(document).unbind();
					dragable = false;
			});
		});
	}

	function moveIt(elem,x,y){
		elem.l += x;
		elem.t += y;
		elem.init(elem.l,elem.t);
	}

	function buildJSON(){
		datas = [];
		for(var i = 0;i<list_length;i++){
			(function(num){
				if(list[num].use){
					choosen_length++;
					list_choosen = {
						"name" : list[num].name,
						"left" : list[num].l,
						"top" : list[num].t
					}
				jsonString = JSON.stringify(list_choosen);
				datas.push(list_choosen);
				}
			})(i);

		}
	}

	function initJSON(){
		$submit.click(function(){
			buildJSON();
			getLess();
			buildHTML();
		});
	}

	function getLess(){
		cssSource = '';
		for(var i = 0;i<datas.length;i++){
			(function(num){
				var lessURL = "mod-" + datas[num].name + "/import-mod-" + datas[num].name + ".less";
				$.get(lessURL,function(result){
					cssSingle = REGvalue(result,num);
					cssSource += cssSingle;
				}).done(function(){
					console.log(datas.length);
					if(num==datas.length-1){	
						$.ajax({
				     		type: 'POST',
				     		url: "css-server.php",
					    	data: {
					    		"contain" : cssSource
					    	}
						});
					}
				});
			})(i);
		}
	}


	//将其属性值替换掉
	function REGvalue(result,n){
		var reg = /([\s\S]*)\/\*start\*\/([\s\S]*)\/\*end\*\//m;
		result = result.replace(reg,"$2");
		var r_left = /@left/g;
		var r_top = /@top/g;
		result = result.replace(r_left,datas[n].left+'px');
		result = result.replace(r_top,datas[n].top+'px');
		return result;
	}

	//匹配出div元素
	function matchHTML(result){
		var reg = /([\s\S]*)<body>([\s\S]*)<\/body>([\s\S]*)/m;
		result = result.replace(reg,"$2");
		return result;
	}

	function buildHTML(){
		htmlSource = '';
		for(var i = 0;i<datas.length;i++){
			(function(num){
				var htmlURL = "mod-" + datas[num].name + "/index.html";
				$.get(htmlURL,function(result){
					result = matchHTML(result);
					htmlSource += result;
					console.log(htmlSource);	
				}).done(function(){
					if(num==datas.length-1){	
						$.ajax({
				     		type: 'POST',
				     		url: "html-server.php",
					    	data: {
					    		"html" : htmlSource
					    	}
						});
					}
				});
			})(i);
		}
	}

	initElem();
	toChoose();
	initBoxPos();
	moveBlock();
	initJSON()
});