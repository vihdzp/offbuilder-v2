import coordinates from "./coordinates.js";
import { importCoordinates, exportCoordinates } from "./file.js";
import { 
	in_txt, 
	insert_btn, 
	clear_btn, 
	copy_btn, 
	export_btn, 
	import_btn, 
	input_ofd, 
	dimensions_nud, 
	code_txt, 
	paren_chk,
	perm_fst,
	project_btn,
	plussigns_btn,
	plusperms_btn,
	sign_fst
} from "./domElements.js";

// On coordinate textbox enter.
in_txt.addEventListener('keydown', event => {
	if(event.key !== "Enter") return;
	insert_btn.click();
	event.preventDefault();
});

// On insert button click.
insert_btn.addEventListener('click', () => {
	coordinates.add(coordinates.parse(in_txt.value));
});

// On clear button click.
clear_btn.addEventListener('click', () => {
	coordinates.clear();
});

// On copy button click.
copy_btn.addEventListener('click', () => {
	out_txt.select();
	out_txt.setSelectionRange(0, 999999);

	document.execCommand("copy");
});

//On export button click.
export_btn.addEventListener('click', exportCoordinates);

// On import button click.
import_btn.addEventListener('click', () => {
	input_ofd.click();
});

// On file load.
input_ofd.addEventListener('change', event => {
	const file = event.target.files[0];
	if(!file) return;

	const fr = new FileReader(file);
	fr.onload = importCoordinates;
	fr.readAsText(file);
});

// On dimensions number-up-down change.
function dimChange() {
	const value = Number(dimensions_nud.value);

	coordinates.setDimensions(value);
	project_btn.value = `Project to ${value - 1}D`;
}
dimensions_nud.addEventListener('input', dimChange);
dimChange();

// On project button click.
project_btn.addEventListener('click', () => {
	coordinates.project();
	dimensions_nud.value--;
	dimChange();

	for(let i = 0; i < coordinates.signChanges.length; i++)
		configCheckbox('sgn', i);
		
	for(let i = 0; i < coordinates.permutations.length; i++)
		configCheckbox('prm', i);
});

// On code textbox keydown.
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

// Configures formatting radio buttons.
document.forms.formatting.radio.forEach((radio, i) => {
	radio.checked = (i === 0);
	radio.addEventListener('change', () => {
		coordinates.options.formatting = i;
	});
});

// Configures the parenthesis checkbox.
paren_chk.checked = false;
paren_chk.addEventListener('change', () => {
	coordinates.options.parentheses = paren_chk.checked;
});

plussigns_btn.addEventListener('click', () => addVariable('sign changes'));
plusperms_btn.addEventListener('click', () => addVariable('permutations'));

function addVariable(type) {
	const fieldset = document.createElement("fieldset");
	const key = type === 'sign changes' ? 'sgn' : 'prm'
	const fst = key === 'sgn' ? sign_fst : perm_fst;
	const changes = key === 'sgn' ? coordinates.signChanges : coordinates.permutations;
	const idx = changes.length;

	// Writes down all of the basic form HTML.
	let html = `<form id="${key}${idx}-frm">
		<input name="radio" type="radio" id="${key}${idx}-rad0" checked />
		<label for="${key}${idx}-rad0">No ${type}</label><br />

		<input name="radio" type="radio" id="${key}${idx}-rad1" />
		<label for="${key}${idx}-rad1">All ${type}</label><br />

		<input name="radio" type="radio" id="${key}${idx}-rad2" />
		<label for="${key}${idx}-rad2">Even ${type}</label><br />

		<input name="radio" type="radio" id="${key}${idx}-rad3" />
		<label for="${key}${idx}-rad3">Odd ${type}</label>`;

	if(key === 'sgn') 
		html += `<br />

		<input name="radio" type="radio" id="${key}${idx}-rad4" />
		<label for="${key}${idx}-rad4">Full sign changes</label>`;

	html += `<div style="overflow-x:auto; width:calc(30vw - 80px);
	white-space: nowrap;" id="${key}${idx}-div"></div></form>`;

	fst.innerHTML += html;

	changes.push({type: 0, indices: new Array(coordinates.dimensions).fill(false)});

	// Configures the radio buttons.
	document.getElementById(`${key}${idx}-frm`).radio.forEach((radio, i) => {
		radio.checked = (i === 0);

		radio.addEventListener('change', () => {
			changes[idx].type = i;
			console.log(i);
		});
	});

	// Configures the checkboxes.
	configCheckbox(key, idx);
}

function configCheckbox(key, idx) {	
	const div = document.getElementById(`${key}${idx}-div`);
	const changes = key === 'sgn' ? coordinates.signChanges : coordinates.permutations;

	div.innerHTML = "";

	for(let i = 0; i < coordinates.dimensions; i++) 
		div.innerHTML += `
			<input type="checkbox" id="${key}${idx}-chk${i}" />
			<label for="${key}${idx}-chk${i}">${i + 1}</label>`;
	
	for(let i = 0; i < coordinates.dimensions; i++) {
		const chk = document.getElementById(`${key}${idx}-chk${i}`);
		chk.addEventListener('change', () => {
			changes[idx].indices[i] = chk.checked;
		});
	}
}