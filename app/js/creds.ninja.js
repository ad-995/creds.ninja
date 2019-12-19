function refresh_div() {
	const div = document.getElementById("results");
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	}
}

function create_table(json, searchterm) {
	refresh_div()
	if (searchterm != "") {
		var results_count = 0;
		var table = document.createElement("table");
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
			vendor = value["vendor"]
			if (vendor.includes(searchterm)) {
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

document.getElementById("search").addEventListener("input", populate);
