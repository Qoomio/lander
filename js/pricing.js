import Modal from '/libs/modal/script.js';

let $starterOptionsBtn = document.getElementById('starter') //
	, $freeOptionsBtn = document.getElementById('free')
	, $signupBtn = document.querySelector('.navbar-nav .nav-item.signup')
;

const $starterPassModal = new Modal({
	modalContainerId: 'starterPassModal'
	, modalTitleText: `Choose a Starter Pass`
	, modalContentsInnerHTML: `
	<div class="modal-description">
		<table>
			<tr class="pass365">
				<td class="pass-name">365 days access</td>
				<td class="pass-price"><span class="dollar"></span>${starter365dPrice}<span class="extra-note">save 38%</span></td>
				<td class="select-btn-container">
					<a id="starter365d" href="/subscribe/checkout/starter365d"><div class="qoom-main-btn qoom-button-full qoom-button-small">Select</div></a>
				</td>
			</tr>
			<tr class="pass90">
				<td class="pass-name">90 days access</td>
				<td class="pass-price"><span class="dollar"></span>${starter90dPrice}<span class="extra-note">save 17%</span></td>
				<td class="select-btn-container">
					<a id="starter90d" href="/subscribe/checkout/starter90d"><div class="qoom-main-btn qoom-button-outline qoom-button-small">Select</div></a>
				</td>
			</tr>
			<tr class="pass30">
				<td class="pass-name">30 days access</td>
				<td class="pass-price"><span class="dollar"></span>${starter30dPrice}</td>
				<td class="select-btn-container">
					<a id="starter30d" href="/subscribe/checkout/starter30d"><div class="qoom-main-btn qoom-button-outline qoom-button-small">Select</div></a>
				</td>
			</tr>
		</table>
	</div>
	`
});

function selectPlan() {
	var sp = this.data('id');
	location.href = '/subscribe/choosedomain/?sp=' + sp;
	//todo: this will redirect the user to the different pages depending on user's choice.
}

function addQs(obj) {
	
}

$freeOptionsBtn.addEventListener('click', function(e) {
	if(!window.loggedIn) {
		e.preventDefault();
		return $signupBtn.click();
	}
})

$starterOptionsBtn.addEventListener('click', function(){
	$starterPassModal.show();
	
	const $selectButtons = document.querySelectorAll('#starterPassModal .select-btn-container > a');
	$selectButtons.forEach($button => {
		$button.addEventListener('click', (e) => {
			if(!window.loggedIn) {
				e.preventDefault();
				window.afterSignUpUrl = $button.href;
				return $signupBtn.click();
			}
		})
	})
	
	
});