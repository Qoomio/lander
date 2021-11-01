// const creatorsList = {{creatorsList}};
const $creatorsList = document.querySelector('.creators-list')
	, $cohortInputs = document.querySelectorAll('input[name=cohort]')

let data;

function bindItem(item) {
	const div = document.createElement('div');
	div.className = 'creator';
	const list = `
		<a href='${item.links}' target='_blank'>
			<img src='${item.image}'>
			<h4>${item.firstName} ${item.lastName}</h4>
			<div>${item.city}</div>
		</a>
	`
	;
	div.innerHTML = list;
	$creatorsList.appendChild(div);
}

function sort(data) {
	data.sort((a, b) => a.firstName > b.firstName ? 1 : -1);
	bindData(data);
}
function filter(e) {
	let filteredData;
	if(this.value === 'all') {
		filteredData = data;
	} else {
		filteredData = data.filter(item => item.cohort.includes(this.value))
	}
	bindData(filteredData);
}

function bindData(data) {
	$creatorsList.innerHTML = '';
	data.forEach(bindItem);
}

async function fetchData() {
	const response = await fetch('/creators/list.json')
		, json = await response.json()
	;
	data = json;
	sort(data);
	bindData(data)
}

$cohortInputs.forEach(input => input.addEventListener('click', filter));
fetchData();
// Array.prototype.forEach.call(creatorsList, bindItem);