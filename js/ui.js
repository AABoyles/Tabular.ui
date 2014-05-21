var noscript = document.getElementsByTagName("noscript")[0];
noscript.parentNode.removeChild(noscript);

var app = {
	ab: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
	newCell: {},
	spinner: {},
	addRow: function(){},
	addCol: function(){}
};

yepnope({
	load: [
		"js/spin.min.js",
		"js/jquery-2.1.0.min.js",
		"js/lodash.min.js",
		"js/jquery-ui.min.js"
	],
	callback : {
		"spin.min.js": function(){
			app.spinner = new Spinner({
				length : 100,
				radius : 50
			}).spin(document.getElementsByTagName("body")[0]);
		},
		"jquery-2.1.0.min.js": function(){
			app.newCell = function(){
				return $("<td>").click(function(){
					$(".selected").removeClass("selected");
					$(this).addClass("selected");
				}).dblclick(function(){
					var cell = $(this).attr("contenteditable", "true");
					cell.focusout(function(){
						cell.attr("contenteditable", "false");
					}).focus();
				}).clone(true);
			};

			app.addRow = function(){
				var numRows = $("tr").length;
				var numCols = $("thead th").length;
				var newRow = $("<tr>").append($("<th>" + numRows++ + "</th>").click(function(){
					$(".selected").removeClass("selected");
					$(this).addClass("selected").siblings().addClass("selected");
				}));
				for(var j = 1; j < numCols; j++){
					newRow.append(app.newCell());
				}
				$("tbody").append(newRow);
			};

			app.addCol = function(){
				var j = $("thead th").length;
				$("tr").each(function(i, row){
					if(i==0){
						if(j <= 702){
							$(row).append("<th>" + app.ab[Math.ceil(j/26)-2] + app.ab[(j-1)%26] + "</th>");
						} else {
							$(row).append("<th>" + app.ab[Math.ceil(j/702)-2] + app.ab[Math.ceil(j%702/26)-1] + app.ab[(j-1)%26] + "</th>");
						}
					} else {
						$(row).append(app.newCell());
					}
				});
			};

			$(window).scroll(function(){
				var doc = $(document);
				if((window.innerHeight+window.pageYOffset)/doc.height() > .5){
					app.addRow();
				}
				if((window.innerWidth+window.pageXOffset)/doc.width() > .6){
					app.addCol();
				}
			}).keydown(function(evt){
				var cell = $(".selected:first");
				switch(evt.keyCode){
					case 34:
						for(var i=0; i < 30; i++){
							app.addRow();
						}
					break;
					case 37: //Left
						evt.preventDefault();
						$(".selected").removeClass("selected");
						cell.prev().addClass("selected");
					break;
					case 38: //Up
						evt.preventDefault();
						$(".selected").removeClass("selected");
						var sib = cell.prevAll().length;
						$(cell.parent().prev().children()[sib]).addClass("selected");
					break;
					case 39: //Right
						evt.preventDefault();
						$(".selected").removeClass("selected");
						cell.next().addClass("selected");
					break;
					case 40: //Down
						evt.preventDefault();
						$(".selected").removeClass("selected");
						var sib = cell.prevAll().length;
						$(cell.parent().next().children()[sib]).addClass("selected");						
					case 113:
						if(cell.length>0){
							if(cell.attr("contenteditable")!="false"){
								cell.attr("contenteditable", "false");	
							} else {
								cell.attr("contenteditable", "true").focus();
							}
						}
					break;
				}
			});
			for(var i = 0; i < 100; i++){ app.addRow(); }
		}
	},
	complete : function() {
		$("#new").button().click(function(){
			$("#newcontent").dialog({
				buttons: {
					"Yes": function(){
						$("table").fadeOut(400, function(){
							$(".selected").removeClass("selected");
							$("td").text("");
							$("table").fadeIn();
						});
						$(this).dialog("close");
					},
					Cancel: function(){
						$(this).dialog("close");
					}
				}
			});
		});
		$("#upload").button().click(function(){
			$("#uploadcontent").dialog({
				buttons: {
					"Let's edit this puppy!": function(){
						$(this).dialog("close");
					},
					Cancel: function(){
						$(this).dialog("close");
					}
				}
			});
		});
		$("#download").button().mousedown(function() {
			var table = $("table");
			var row = [];
			table.find("th").each(function(ind, el) {
				row.push($(el).text());
			});
			var csv = "";
			table.find("tbody > tr").each(function(ind, el) {
				row = [];
				$(el).find("td").each(function(i, cell) {
					row.push($(cell).text());
				});
				csv += row.join(",") + "\n";
			});
			$(this).attr({
				"href": "data:text/csv;charset=utf8," + encodeURI(csv),
				"download": $("#filename").text()
			});
		});
		$("#github").button();
		$("#about").button().click(function(){
			$("#aboutcontent").dialog();
		});
		$(".spinner").fadeOut(400, function() {
			app.spinner.stop();
			$("#content").fadeIn();
		});
	}
});
