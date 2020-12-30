in_txt.addEventListener('keydown', event => {
	if(event.key !== "Enter") return;
	insert_btn.click();
	event.preventDefault();
});

insert_btn.addEventListener('click', event => {
	coordinates.add(parse(in_txt.value));
});

clear_btn.addEventListener('click', event => {
	coordinates.clear();
});

copy_btn.addEventListener('click', event => {
	out_txt.select();
	out_txt.setSelectionRange(0, 999999);

	document.execCommand("copy");
});

dimensions_nud.addEventListener('input', event => {
	project_btn.value = 'Project to ' + (dimensions_nud.value - 1) + 'D';
});
project_btn.value = 'Project to ' + (dimensions_nud.value - 1) + 'D';

document.forms.signFrm.signs.forEach((radio, i) => {
	radio.checked = (i === 0);
	radio.addEventListener('change', () => {
		coordinates.options.sign = i;
	});
});

document.forms.permFrm.perms.forEach((radio, i) => {
	radio.checked = (i === 0);
	radio.addEventListener('change', () => {
		coordinates.options.permutation = i;
	});
});