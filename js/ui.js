var noscript = document.getElementsByTagName("noscript")[0];
noscript.parentNode.removeChild(noscript);

var app = {
	ab: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
	newCell: {},
	spinner: {},
	addRow: function(){},
	addCol: function(){},
	dragCell: {}
};

yepnope({
	load: [
		"js/spin.min.js",
		"js/jquery.min.js",
		"js/jqueryui.min.js",
		"js/jquery.contextMenu.min.js",
		"js/Tabular.js",
		"js/lodash.min.js"
	],
	callback: {
		"spin.min.js": function(){
			app.spinner = new Spinner({
				length : 100,
				radius : 50
			}).spin(document.getElementsByTagName("body")[0]);
		},
		"jquery.min.js": function(){
			app.newCell = function(val){
				val = (typeof val === "undefined") ? "" : val;
				var cell = $("<td>"+val+"</td>").mousedown(function(evt){
					evt.preventDefault();
					app.dragCell = $(this);
					$("tbody tr td, th").mousemove(function(){
						$(".selected").removeClass("selected");
						var a = app.dragCell.prevAll().length,
						    b = $(this).prevAll().length,
						    c = app.dragCell.parent().prevAll().length,
						    d = $(this).parent().prevAll().length;
						$("tbody tr").slice(Math.min(c,d),Math.max(c,d)+1).each(function(i, row){
							$(row).children().slice(Math.min(a,b),Math.max(a,b)+1).addClass("selected");
						});
					});
					$(".selected").removeClass("selected");
				}).mouseup(function(){
					$("tbody tr td, th").unbind("mousemove");
					$(this).addClass("selected");
				}).dblclick(function(){
					var cell = $(this).attr("contenteditable", "true");
					cell.focusout(function(){
						cell.attr("contenteditable", "false");
					}).focus();
				});
				return cell;
			};

			app.addRows = function(rows){
				var tbody = $("tbody");
				var cols = $("thead th").length;
				var extantRows = $("tr").length;
				for(var i = 0; i < rows; i++){
					var row = $("<tr>").append($("<th>" + (extantRows+i) + "</th>").click(function(){
						$(".selected").removeClass("selected");
						$(this).addClass("selected").siblings().addClass("selected");
					}));
					for(var j = 0; j < cols; j++){
						row.append(app.newCell());
					}
					tbody.append(row);
				}
			};

			app.addRow = function(){
				app.addRows(1);
			};

			app.addCols = function(cols){
				cols = (typeof cols === "undefined") ? 1 : cols;
				var j = $("thead th").length;
				$("tr").each(function(i, row){
					for(k = 0; k < cols; k++){
						if(i==0){
							if(j+k <= 26){
								$(row).append("<th contextmenu='headermenu'>" + app.ab[j+k-1] + "</th>");
							} else if(j+cols <= 702){
								$(row).append("<th contextmenu='headermenu'>" + app.ab[Math.ceil((j+k)/26)-2] + app.ab[(j+k-1)%26] + "</th>");
							}
						} else {
							$(row).append(app.newCell());
						}
					}
				});
			};
			
			app.addCol = function(){
				app.addCols(1);
			};

			app.emptyTable = function(){
				$("thead").html("<tr><th></th></tr>");
				$("tbody").empty();
			};
			
			app.setTable = function(){
				app.addCols(50);
				app.addRows(100);
			};
			
			app.resetTable = function(){
				$("table").fadeOut(400, function(){
					app.emptyTable();
					app.setTable();
					$(this).fadeIn();
				});
			};

			$(window).scroll(function(){
				var doc = $(document);
				if((window.innerHeight+window.pageYOffset)/doc.height() > .9){
					app.addRows(5);
				}
				if((window.innerWidth+window.pageXOffset)/doc.width() > .9){
					app.addCol();
				}
			}).keydown(function(evt){
				var cell = $(".selected:first");
				switch(evt.keyCode){
					case 34: //PageDown
						app.addRows(31);
					break;
					case 37: //Left
						evt.preventDefault();
						$(".selected").removeClass("selected");
						cell.prev().addClass("selected").focus();
					break;
					case 38: //Up
						evt.preventDefault();
						$(".selected").removeClass("selected");
						var sib = cell.prevAll().length;
						$(cell.parent().prev().children()[sib]).addClass("selected").focus();
					break;
					case 39: //Right
						evt.preventDefault();
						$(".selected").removeClass("selected");
						cell.next().addClass("selected").focus();
					break;
					case 40: //Down
						evt.preventDefault();
						$(".selected").removeClass("selected");
						var sib = cell.prevAll().length;
						$(cell.parent().next().children()[sib]).addClass("selected").focus();						
					case 113: //F2
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
		},
		"jqueryui.min.js": function(){
			$("#new").button().click(function(){
				$("#newcontent").dialog({
					buttons: {
						"Yes": function(){
							app.spinner.spin($("body")[0]);
							$(this).dialog("close");
							$("table").fadeOut(400, function(){
								app.emptyTable();
								app.addRows(100);
								app.addCols(50);
								$(".spinner").fadeOut(400, function(){
									app.spinner.stop();
									$("table").fadeIn();									
								});
							});
						},
						Cancel: function(){
							$(this).dialog("close");
						}
					}
				});
			});
			$("#github").button();
			$("#about").button().click(function(){
				$("#aboutcontent").dialog();
			});
		},
		"jquery.contextMenu.min.js": function(){
			$("thead tr").contextMenu({
				selector: 'th',
				callback: function(key, options) {
               		var m = "clicked: " + key + " on " + $(this).text();
       	        	window.console && console.log(m) || alert(m); 
    	        },
	            items: $.contextMenu.fromMenu($('#headermenu'))
			});
		},
		"Tabular.js": function(){
			$("#uploadfile").change(function(){
				var reader = new FileReader();
				reader.onloadend = function(){
					app.csv = reader.result;
					app.data = tabular.parse(app.csv);
				};
				reader.readAsText($(this).get(0).files[0]);
			});
			$("#upload").button().click(function(){
				$("#uploadcontent").dialog({
					buttons: {
						"Let's edit this puppy!": function(){
							$("#filename").text($("#uploadfile").get(0).files[0].name);
							app.spinner.spin($("body")[0]);
							$("table").fadeOut(400, function(){
								app.addCols(app.data[0].length - $("thead th").length);
								var rows = $("tbody tr");
								app.addRows(app.data.length - rows.length);
								for(var y = 0; y < app.data.length; y++){
									var row = $(rows.get(y)).children();
									for(var x = 0; x < app.data[y].length; x++){
										$(row.get(x)).text(app.data[y][x]);
									}
								}
								$(this).fadeIn(400, function(){
									app.spinner.stop();
								});
							});
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
		}
	},
	complete : function() {
		app.setTable();
		$(".spinner").fadeOut(400, function() {
			app.spinner.stop();
			$("#content").fadeIn();
		});
	}
});
