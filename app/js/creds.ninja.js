function undateables(json) {
	console.log(json)
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	var target = $('#results')
	if (Object.keys(json).length > 0) {
		var table_headers = ['vendor', 'username', 'password']
		var headers = document.createElement("tr");
		for (const header_index in table_headers) {
			var cell = document.createElement("th");
			var text = document.createTextNode(table_headers[header_index]);
			cell.appendChild(text)
			headers.appendChild(cell)
		}
		tbody.appendChild(headers)
		for (const [key, value] of Object.entries(json)) {
			var row = document.createElement("tr");
			for (var i = 0; i < 3; i++) {
				var cell = document.createElement("td");
				var text = document.createTextNode(value[table_headers[i]])
				cell.appendChild(text)
				row.appendChild(cell)
			}
			tbody.appendChild(row)
		}
		table.appendChild(tbody)
		$("#results").append(table)
	} else {
		var header = document.createElement("h2");
		var header_text = document.createTextNode(Object.keys(json).length + " results found! Try narrowing it down")
		header.appendChild(header_text)
	}
}

fetch('/creds.json')
    .then(data => data.json())
	.then(json => undateables(json))
    .catch(err => console.log(err));
