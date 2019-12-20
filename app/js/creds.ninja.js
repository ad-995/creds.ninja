function html_to_json(table) {
    var data = [];

    // first row needs to be headers
    var headers = [];
    for (var i=0; i<table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
    }

    // go through cells
    for (var i=1; i<table.rows.length; i++) {

        var tableRow = table.rows[i];
        var rowData = {};

        for (var j=0; j<tableRow.cells.length; j++) {

            rowData[ headers[j] ] = tableRow.cells[j].innerHTML;

        }

        data.push(rowData);
    }       

    return data;
}

function export_table(){
    const table_html = document.getElementById("results_table");
    table_json = html_to_json(table_html);
    console.log(table_json);
}

function refresh_div() {
	const div = document.getElementById("results");
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	$('#export').hide();
	}
}

function create_table(json, searchterm) {
	refresh_div()
	if (searchterm != "") {
		var results_count = 0;
		var table = document.createElement("table");
		table.setAttribute('id', 'results_table');
		table.setAttribute("class","centered highlight");
		var thead = document.createElement("thead");
		var tbody = document.createElement("tbody");
		var table_headers = ['vendor', 'username', 'password']
		var headers = document.createElement("tr");

		for (const header_index in table_headers) {
			var cell = document.createElement("th");
			var text = document.createTextNode(table_headers[header_index]);
			cell.appendChild(text)
			headers.appendChild(cell)
		}

		thead.appendChild(headers)
		table.appendChild(thead)

		for (const [key, value] of Object.entries(json)) {
			vendor = value["vendor"].toLowerCase()
			if (vendor.includes(searchterm.toLowerCase())) {
				var row = document.createElement("tr");
				for (var i = 0; i < 3; i++) {
					var cell = document.createElement("td");
					var text = document.createTextNode(value[table_headers[i]])
					cell.appendChild(text)
					row.appendChild(cell)
				}
				tbody.appendChild(row)
			}
		}
		if (tbody.children.length < 1) {
			return "<h2>No results found :'(</h2>"
		} else {

			table.appendChild(tbody)
		    $('#export').show();
			return table
		}
	}
}

function undateables(json) {
	var target = $('#results')
	var search_term = document.getElementById("search").value
	var results = create_table(json, search_term)
	$("#results").append(results)
}

function populate() {
	fetch('/creds.json')
		.then(data => data.json())
		.then(json => undateables(json))
		.catch(err => console.log(err));
}

$('#export').hide();
document.getElementById("search").addEventListener("input", populate);
