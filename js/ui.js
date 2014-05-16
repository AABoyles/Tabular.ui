var noscript = document.getElementsByTagName("noscript")[0];
noscript.parentNode.removeChild(noscript);

currentRequest = {};
spinner = {
	lines : 13, // The number of lines to draw
	length : 100, // The length of each line
	width : 10, // The line thickness
	radius : 50, // The radius of the inner circle
	corners : 1, // Corner roundness (0..1)
	rotate : 0, // The rotation offset
	direction : 1, // 1: clockwise, -1: counterclockwise
	speed : 1, // Rounds per second
	trail : 60, // Afterglow percentage
	shadow : false, // Whether to render a shadow
	hwaccel : true, // Whether to use hardware acceleration
	className : 'spinner', // The CSS class to assign to the spinner
	zIndex : 2e9, // The z-index (defaults to 2000000000)
};

ab = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

yepnope({
	load : [
		"js/jquery-2.1.0.min.js",
		"js/spin.min.js",
		"js/jquery.spin.js",
		"js/lodash.min.js",
		"js/alertify.min.js",
		"js/jquery-ui.min.js",
		"js/jquery.contextMenu.min.js",
		"js/jquery.tablesorter.min.js",
		"js/jquery.tablesorter.widgets.min.js"
	],
	callback : {
		"jquery-2.1.0.min.js": function(){
			addRows = function(addRows){
				var numRows = $("tr").length;
				var numCols = $("thead th").length;
				for(var i = 0; i < addRows; i++){
					newRow = $("<tr>").append("<th>" + numRows++ + "</th>");
					for(var j = 1; j < numCols; j++){
						newRow.append($("<td>").click(function(){
							$("td").removeClass("selected");
							$(this).addClass("selected");
						}).dblclick(function(){
							var cell = $(this);
							cell.empty().append($("<input type='text' value='"+cell.text()+"'/>").keydown(function(evt){
								if(evt.keyCode==13){
									cell.empty().text(evt.target.value);
								};
							}));
							cell.children().focus();
							cell.children().focusout(function(evt){
								cell.empty().text(evt.target.value);
							});
						}));
					}
					$("tbody").append(newRow);
				}
			};
			
			addCols = function(addCols){
				numcols = $("thead th").length;
				$("tr").each(function(i, row){
					for(var j = numcols; j < numcols + addCols; j++){
						if(i==0){
							$(row).append("<th>" + ab[Math.floor(j/26)-1] + ab[(j-1)%26] + "</th>");
						} else {
							$(row).append($("<td>").click(function(){
								$("td").removeClass("selected");
								$(this).addClass("selected");
							}).dblclick(function(){
								var cell = $(this);
								cell.empty().append($("<input type='text' value='"+cell.text()+"'/>").keydown(function(evt){
									if(evt.keyCode==13){
										cell.empty().text(evt.target.value);
									};
								}));
								cell.children().focus();
								cell.children().focusout(function(evt){
									cell.empty().text(evt.target.value);
								});
							}));
						}
					}
					$("tbody").append(newRow);
				});
			};
			
			var table = $("table");
			if(table.height() < 2*window.innerHeight){
				var rows = Math.ceil((2*window.innerHeight - table.height())/12);
				addRows(rows);
			}
			if(table.width() < 2*window.innerWidth){
				var cols = Math.ceil((2*window.innerWidth - table.width())/150);
				addCols(cols);
			}

			$(window).scroll(function(evt){
				if((window.scrollY+window.innerHeight)/window.outerHeight > .8){
					addRows(20);
				}
				if((window.scrollX+window.innerWidth)/window.outerWidth > .8){
					addCols(10);
				}
			});
			
			$(window).keydown(function(evt){
				var cell = $("td.selected");
				if(evt.keycode==113 && cell.length>0){
					var extant = cell.text();
					cell.empty().append($("<input type='text' />").val(extant).keydown(function(evt){
						if(evt.keyCode==13){
							cell.empty().text(evt.target.value);
						};
					}));
					cell.children().focus();
					cell.children().focusout(function(evt){
						cell.empty().text(evt.target.value);
					});
				}
			});

			$("td").dblclick(function(){
				var cell = $(this);
				var extant = cell.text();
				cell.empty().append($("<input type='text' />").val(extant).keydown(function(evt){
					if(evt.keyCode==13){
						cell.empty().text(evt.target.value);
					};
				}));
				cell.children().focus();
				cell.children().focusout(function(evt){
					cell.empty().text(evt.target.value);
				});
			});
		},
		"jquery.spin.js" : function(){
			$("html").spin(spinner);
		},
		"jquery-ui.min.js": function() {
			$( document ).tooltip();

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
						if (_.isEmpty($(cell).find(":input"))) {
							row.push($(cell).text());
						} else {
							row.push($(cell).find(":input").val());
						}
					});
					csv += row.join(",") + "\r\n";
				});
				$(this).attr("href", "data:text/csv;charset=utf8," + encodeURI(csv));
			});
			
			$("#upload").button().click(function(){
				
			});
			
			$("#github").button();
			$("#about").button().click(function(){
				$("#aboutcontent").dialog();
				//alertify.alert("");
			});

			$(".datepicker").datepicker({
				changeMonth : true,
				changeYear : true,
				yearRange : "1800:" + new Date().getFullYear(),
				dateFormat : "dd-mm-yyyy"
			});

		},
		"alertify.min.js": function(){},
		"jquery.tablesorter.min.js": function(){
			$.tablesorter.addParser({
				id: 'editable-number',
				is: function(s, table, cell) {return false;},
				format: function(s, table, cell, cellIndex) {
					return $(cell).find("input").val();
				},
				type: 'numeric'
			});
			$.tablesorter.addParser({
				id: 'editable-text',
				is: function(s, table, cell) {return false;},
				format: function(s, table, cell, cellIndex) {
					return $(cell).find("input").val();
				},
				type: 'text'
			});
		}
	},
	complete : function() {
		$("#content").fadeIn(400, function(){
			$(".spinner").fadeOut(400, function() {
				$("html").spin(false);
			});
		});
	}
});
