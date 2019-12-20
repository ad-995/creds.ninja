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

    var json = JSON.stringify(data);
    return json;
}

function download(strData, strFileName, strMimeType) {
	// https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);

    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */

    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */

    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
        D.body.removeChild(f);
    }, 333);
    return true;
}

function export_table(){
    const table_html = document.getElementById("results_table");
    const export_button = document.getElementById("export");
    table_json = html_to_json(table_html);
    download(table_json, 'creds.ninja.json', 'application/json');
}

function refresh_div() {
	const div = document.getElementById("results");
	while (div.firstChild) {
		div.removeChild(div.firstChild);
	$('#export').hide();
	$('#info').show();
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
			$('#info').hide();
			return "<h2>No results found :'(</h2>"
		} else {

			table.appendChild(tbody)
		    $('#export').show();
		    $('#info').hide();
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
$('#info').show();
document.getElementById("search").addEventListener("input", populate);
