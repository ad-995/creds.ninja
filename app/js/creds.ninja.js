function create_table(json, searchterm) {
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
		while (results_count < 50) {
			if (value["vendor"].includes(searchterm)) {
				var row = document.createElement("tr");
				for (var i = 0; i < 3; i++) {
					var cell = document.createElement("td");
					var text = document.createTextNode(value[table_headers[i]])
					cell.appendChild(text)
					row.appendChild(cell)
				}
				tbody.appendChild(row)
				results_count++;
			}
		}
	}

	if (results_count < 50) {
		table.appendChild(tbody)
		console.log(results_count)
		return table
	} else {
		var header = document.createElement("h2");
		var header_text = document.createTextNode(Object.keys(json).length + " results found! Try narrowing it down")
		header.appendChild(header_text)
		return header
	}
}

function undateables(json) {
	var target = $('#results')
	// for all credentials
	// if we have more than none returned
	var search_term = document.getElementById("search").value

	var results = create_table(json, search_term)
	$("#results").append(results)
}

fetch('/creds.json')
    .then(data => data.json())
	.then(json => undateables(json))
    .catch(err => console.log(err));
