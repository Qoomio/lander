//VALIDATE INPUTS
var $inputs = document.querySelectorAll('.input-items input');
var $emailInput = document.querySelector('.email input');
var $textAreaInput = document.querySelector('.input-items textarea');
var $submitBtn = document.getElementById('submitBtn');

validators = {
	notEmpty: function(v) {
		return !!(v && v.length);
	},
	isEmail: function(v) {
		var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
		return emailRegex.test(v);
	}
};

function runValidator() {
	this.parentNode.classList.remove('empty');
	var vd = this.getAttribute('validator');
	if (!vd) return;
	var vfn = validators[vd];
	if(!vfn(this.value)) {
		this.parentNode.classList.remove('default');
		this.parentNode.classList.add('error');
	} else {
		this.parentNode.classList.remove('error');
		this.parentNode.classList.add('default');
	}
} 

function validateInputs() {
	if (!document.querySelector('.error') && !document.querySelector('.empty')) {
		$submitBtn.disabled = false;
	} else {
		$submitBtn.disabled = true;
	}
}

function sendUsMessage() {
	if(!$emailInput.value) return;
	if(!$textAreaInput.value) return;
	
	const data = {};
	$inputs.forEach($input => {
		data[$input.id] = $input.value;
	});
	data[$emailInput.id] = $emailInput.value;
	data[$textAreaInput.id] = $textAreaInput.value;

	var survey = Object.assign({
		survey:'contactus'
		, date: new Date().toLocaleDateString()
	}, data);
		
	var xhr= new XMLHttpRequest();
	xhr.open('POST', '/survey/contactus');
	xhr.setRequestHeader('content-type', 'application/json');
	
	xhr.onreadystatechange = function() {
	    if(xhr.readyState === 4) {
	    	location.href = '/thankyouforcontactingus';
		}
	};
	
	xhr.send(JSON.stringify({
		survey:survey, email:{}
	}));
}

$inputs.forEach($input => {
	$input.setAttribute('validator', 'notEmpty');
	$input.addEventListener('keyup', runValidator);
});

$textAreaInput.setAttribute('validator', 'notEmpty');
$textAreaInput.addEventListener('keyup', runValidator);

$emailInput.setAttribute('validator', 'isEmail');
$emailInput.addEventListener('keyup', runValidator);

setInterval(validateInputs, 250);

$inputs.forEach($input => {
	if(!$input.value) return;
	runValidator.apply($input);
});