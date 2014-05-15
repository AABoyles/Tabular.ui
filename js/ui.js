var noscript = document.getElementsByTagName("noscript")[0];
noscript.parentNode.removeChild(noscript);

String.prototype.titleize = function() {
	return this.toLowerCase().replace(/(?:^|\s|-)\S/g, function(c) {
		return c.toUpperCase();
	});
};

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

yepnope({
	load : [
		"js/jquery-2.1.0.min.js",
		"js/spin.min.js",
		"js/jquery.spin.js",
		"js/lodash.min.js",
		"js/jquery-ui.min.js",
		"js/jquery.contextMenu.min.js",
		"js/alertify.min.js",
		"js/jquery.tablesorter.min.js",
		"js/jquery.tablesorter.widgets.min.js"
	],
	callback : {
		"jquery-2.1.0.min.js": function(){
			$("th").dblclick(function(){
				var extant = $(this).text();
				
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
