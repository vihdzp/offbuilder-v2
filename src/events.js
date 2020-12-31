"use strict";

//On coordinate textbox enter.
in_txt.addEventListener('keydown', event => {
	if(event.key !== "Enter") return;
	insert_btn.click();
	event.preventDefault();
});

//On insert button click.
insert_btn.addEventListener('click', event => {
	coordinates.add(parse(in_txt.value));
});

//On clear button click.
clear_btn.addEventListener('click', event => {
	coordinates.clear();
});

//On copy button click.
copy_btn.addEventListener('click', event => {
	out_txt.select();
	out_txt.setSelectionRange(0, 999999);

	document.execCommand("copy");
});

//On export button click.
export_btn.addEventListener('click', exportCoordinates);

//On import button click.
import_btn.addEventListener('click', event => {
	input_ofd.click();
});

//On file load.
input_ofd.addEventListener('change', event => {
	const file = event.target.files[0];
	if(!file) return;
	
	const fr = new FileReader(file);
	fr.onload = importCoordinates;
	fr.readAsText(file);
});

//On dimensions number-up-down change.
dimensions_nud.addEventListener('input', event => {
	project_btn.value = 'Project to ' + (dimensions_nud.value - 1) + 'D';
});
project_btn.value = 'Project to ' + (dimensions_nud.value - 1) + 'D';

//On code textbox keydown.
code_txt.addEventListener('keydown', event => {
	if(event.key === "Enter" && event.ctrlKey) {
		try {
			eval(editor.getValue());
			editor.setValue("");
		}
		catch (ex) {
			alert(ex.message);
		}
	}
});

//Configs formatting radio buttons.
document.forms.formatting.radio.forEach((radio, i) => {
	radio.checked = (i === 0);
	radio.addEventListener('change', event => {
		coordinates.options.formatting = i;
	});
});

//Configs sign radio buttons.
document.forms.signs.radio.forEach((radio, i) => {
	radio.checked = (i === 0);
	radio.addEventListener('change', event => {
		coordinates.options.sign = i;
	});
});

//Configs permutation radio buttons.
document.forms.perms.radio.forEach((radio, i) => {
	radio.checked = (i === 0);
	radio.addEventListener('change', event => {
		coordinates.options.permutation = i;
	});
});

paren_chk.checked = false;
paren_chk.addEventListener('change', event => {
	coordinates.options.parentheses = paren_chk.checked;
});