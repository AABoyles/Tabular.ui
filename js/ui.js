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
					$("td").removeClass("selected");
					$(this).addClass("selected");
				}).dblclick(function(){
					var cell = $(this);
					var tmp = cell.text();
					cell.empty().append($("<input type='text' value='"+tmp+"' />").keydown(function(evt){
						if(evt.keyCode==13){
							cell.empty().text(evt.target.value);
						};
					})).children().focusout(function(evt){
						cell.empty().text(evt.target.value);
					}).focus();
				}).clone(true);
			};

			app.addRow = function(){
				var numRows = $("tr").length;
				var numCols = $("thead th").length;
				newRow = $("<tr>").append("<th>" + numRows++ + "</th>");
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
				var cell = $("td.selected");
				switch(evt.keyCode){
					case 34:
						for(var i=0; i < 30; i++){
							app.addRow();
						}
					break;
					case 113:
						if(cell.length>0){
							var extant = cell.text();
							cell.empty().append($("<input type='text' value='" + extant + "' />").keydown(function(evt){
							if(evt.keyCode==13){
								cell.empty().text(evt.target.value);
							};
							})).children().focus();
							cell.children().focusout(function(evt){
								cell.empty().text(evt.target.value);
							});
						}
					break;
				}
			});
			for(var i = 0; i < 100; i++){ app.addRow(); }
		}
	},
	complete : function() {
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
