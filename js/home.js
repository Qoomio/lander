const $startFree = document.querySelectorAll('#startFree')
	, isLoggedIn = {{isloggedin}}
	, nav = document.querySelector('.qoom-navibar')
	, emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
;

let $demoIframe = document.querySelector('.demo-iframe')
	, $codeEditerTab = document.getElementById('codeEditerTab')
	, $fileManagerTab = document.getElementById('fileManagerTab')
	, $sampleMenuItems = document.querySelectorAll('.sample-menu .menu-item')
	, $samplePreviews = document.querySelectorAll('.sample-preview')
	, demoDomain
	, defaultPreviewId = 'chatApp';
	

nav.className = 'qoom-navibar home';
window.onscroll = () => {
  if(this.scrollY <= 10) nav.className = 'qoom-navibar home';
  else nav.className = 'qoom-navibar';
};

$startFree.forEach($el => {
	$el.addEventListener('click', (e) => {
		if(!isLoggedIn) {
			const $signup = document.querySelector('#navbarFive > ul > li.nav-item.navbar-btn.signup > a');
			e.preventDefault();
			$signup.click();
		} 
	})
})

const bindRemixer = async(injectRemixerUiWindow) => {
	const remixButtons = document.querySelectorAll('.remix-button');
	for (const button of remixButtons) {
		const remixUrl = button.getAttribute('data-remix-url');
		const remixAppName = button.getAttribute('data-remix-app-name')
		button.addEventListener('click', async () => {
			await injectRemixerUiWindow(document.body, remixUrl, remixAppName);
		})
	}
	
}

// const main = async () => {
// 	try {
// 		const {injectRemixerUiWindow} = await import('/libs/remixer/static/remixerInject.js');
// 		await bindRemixer(injectRemixerUiWindow);
// 	} catch(ex) {
		
// 	}
// }

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

async function createDemoAccount() {
	const domainCookie = getCookie('demoDomain');
	const $loading = $demoIframe.querySelector('.loading');
	const $iframe = document.createElement('iframe');
	$iframe.setAttribute('allow', 'clipboard-write');
	if(!domainCookie) {
		const resp = await fetch('/demo/create')
			, json = await resp.json()
		;
		if(!json.domain) return;
		if($loading) $demoIframe.removeChild($loading)
		$iframe.src =  json.domain;
		$demoIframe.appendChild($iframe);	
		demoDomain = json.domain.split('/')[2];
		document.cookie = 'demoDomain='+ demoDomain + ';path=/';
	} else {
		if($loading) $demoIframe.removeChild($loading);
		demoDomain = domainCookie;
		$iframe.src =  `https://${demoDomain}/edit/demo.html`; 
		$demoIframe.appendChild($iframe);
	}
}

function setDefaultSamplePreview(id) {
	defaultPreviewId = id;
	$sampleMenuItems.forEach(item => {
		item.classList.remove('active');
	})
	document.querySelector(`div[data-id="${id}"]`).classList.add('active');
	$samplePreviews.forEach(preview => {
		preview.classList.remove('active');
	})
	document.getElementById(id).classList.add('active');
}

function changeSamplePreview(id) {
	$samplePreviews.forEach(preview => {
		preview.classList.remove('active');
	})
	document.getElementById(id).classList.add('active');
}

function submitUpdatesForm() {
	const $updatesListEmailInput = document.getElementById('updatesListEmail');
	
	if(!$updatesListEmailInput.value) return;
	if(!emailRegex.test($updatesListEmailInput.value)) {
		$updatesListEmailInput.parentElement.classList.replace('empty', 'error');
		$updatesListEmailInput.value = 'Please put valid email address';
		$updatesListEmailInput.addEventListener('click', (e) => {
			$updatesListEmailInput.parentElement.classList.replace('error', 'empty');
			$updatesListEmailInput.value = '';
		})
		return;
	}

	const data = {};
	data.email = $updatesListEmailInput.value;
	
	var survey = Object.assign({
		survey: 'Updates List'
		, date: new Date().toLocaleString()
	}, data);
	
	fetch('/survey/putonthelist', {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			survey:survey,
			email: {}
		})
	})
	.then(response => response.json())
	.then(data => {
		console.log('data:', data);
		if(data.success) {
			document.querySelector('.story-email-form').style.display = 'none';
	    	document.querySelector('.story-message .success-message').classList.add('sent-successful');
	    	return;
		}
	})
	.catch((error) => {
		console.log('Error:', error);
	});
}

function submitAPIWishList() {
	const $checkedInputs = document.querySelectorAll('#builtinApiListModal input:checked')
		, $textarea = document.querySelector('#builtinApiListModal textarea')
		, $email = document.querySelector('#builtinApiListModal input.email')
	if ($checkedInputs.length = 0 
		&& !$textarea.value
		&& !$email.value) return;
	
	if(!emailRegex.test($email.value)) {
		$email.parentElement.classList.replace('empty', 'error');
		$email.value = 'Please put valid email address';
		$email.addEventListener('click', (e) => {
			$email.parentElement.classList.replace('error', 'empty');
			$email.value = '';
		})
		return;
	}	

	const data = {};
	if($checkedInputs.length > 0) {
		$checkedInputs.forEach(input => {
			data[input.id] = true;
		})
	}
	if($textarea.value) data.additionalLists = $textarea.value;
	if($email.value) data.email = $email.value;
	
	var survey = Object.assign({
		survey: 'Built-in APIs'
		, date: new Date().toLocaleString()
	}, data);
	
	
	fetch('/survey/putonthelist', {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			survey:survey,
			email: {}
		})
	})
	.then(response => response.json())
	.then(data => {
		if(data.success) {
			document.querySelector('#builtinApiListModal .modal-container').innerHTML = `
	    		<div>Thank you! Your response has been recorded.</div>
	    	`;
	    	return;
		}
	})
	.catch((error) => {
		console.log('Error:', error);
	});
}

$sampleMenuItems.forEach(item => {
	item.addEventListener('click', (e) => {
		setDefaultSamplePreview(e.target.getAttribute(['data-id']));
	})
})
$sampleMenuItems.forEach(item => {
	item.addEventListener('mouseover', (e) => {
		changeSamplePreview(e.target.getAttribute(['data-id']));
	})
})
$sampleMenuItems.forEach(item => {
	item.addEventListener('mouseout', (e) => {
		changeSamplePreview(defaultPreviewId);
	})
})

createDemoAccount();
// main().then();

$codeEditerTab.addEventListener('click', (e) => {
	if(!demoDomain) return;
	document.querySelectorAll('.tab-item').forEach(tab => {
		tab.classList.remove('active');
		e.target.classList.add('active');
	})
	
	$demoIframe.innerHTML = `
		<h4>Write HTML, CSS or JavaScript code on the left side to see the changes in the right pane.</h4>
			<iframe src="https://${demoDomain}/edit/demo.html" allow="clipboard-write;"></iframe>
	`;
})

$fileManagerTab.addEventListener('click', (e) => {
	if(!demoDomain) return;
	document.querySelectorAll('.tab-item').forEach(tab => {
		tab.classList.remove('active');
		e.target.classList.add('active');
	})
	$demoIframe.innerHTML = `
		<h4>This is the Qoom file manager. Manage your files as you do in your computer</h4>
			<iframe src="https://${demoDomain}/explore/list" allow="clipboard-write;"></iframe>
	`
})

setDefaultSamplePreview(defaultPreviewId);