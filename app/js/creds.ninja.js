function undateables(json){
	console.log(json)
}

fetch('/creds.json')
    .then(data => data.json())
	.then(json => undateables(json))
    .catch(err => console.log(err));