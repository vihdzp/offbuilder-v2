import coordinates from "./coordinates.js";
import { importCoordinates, exportCoordinates } from "./file.js";
import { 
	in_txt, 
	insert_btn, 
	clear_btn, 
	code_txt, 
	copy_btn, 
	dimensions_nud, 
	export_btn, 
	import_btn, 
	input_ofd, 
	newline_chk,
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

	for(let i = 0; i < coordinates.signChanges.length; i++)
		configCheckbox('sgn', i);
	for(let i = 0; i < coordinates.permutations.length; i++)
		configCheckbox('prm', i);
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

// Configures the parenthesis checkbox.
newline_chk.checked = false;
newline_chk.addEventListener('change', () => {
	coordinates.options.newline = newline_chk.checked ? '\r\n' : '\n';
});

plussigns_btn.addEventListener('click', () => addChange('sgn'));
plusperms_btn.addEventListener('click', () => addChange('prm'));

// A "change" refers to either a sign change or a permutation.
function addChange(key) {
	// The corresponding type of change.
	const type = key === 'sgn' ? 'sign changes' : 'permutations';

	// The fieldset to which the change is added.
	const fst = key === 'sgn' ? sign_fst : perm_fst;

	// The attribute of coordinates that will be modified.
	const changes = key === 'sgn' ? coordinates.signChanges : coordinates.permutations;
	
	// The index of the change of the corresponding type.
	const idx = changes.length;

	// Writes down all of the basic form HTML.
	const frm = document.createElement("form");
	frm.id = `${key}${idx}-frm`;
	frm.className = "change";
	fst.appendChild(frm);

	const labelTxt = ["No", "All", "Even", "Odd"];
	if(key === 'sgn')
		labelTxt.push("Full");

	labelTxt.forEach((txt, i) => {
		const input = document.createElement("input");
		input.name = "radio";
		input.type = "radio";
		input.id = `${key}${idx}-rad${i}`;
		input.checked = (i === 0);
		frm.appendChild(input);

		const label = document.createElement("label");
		label.htmlFor = input.id;
		label.appendChild(document.createTextNode(' ' + txt + ` ${type}`));
		frm.appendChild(label);

		frm.appendChild(document.createElement("br"));
	});

	const div = document.createElement("div");
	div.className = "checkboxDiv";
	div.id = `${key}${idx}-div`;
	frm.appendChild(div);

	changes.push({type: 0, indices: new Array(coordinates.dimensions).fill(true)});

	// Configures the radio buttons.
	document.getElementById(`${key}${idx}-frm`).radio.forEach((radio, i) => {
		radio.checked = (i === 0);

		radio.addEventListener('change', () => {
			changes[idx].type = i;
		});
	});

	// Configures the checkboxes.
	configCheckbox(key, idx);
}

function configCheckbox(key, idx) {	
	const div = document.getElementById(`${key}${idx}-div`);
	const changes = key === 'sgn' ? coordinates.signChanges : coordinates.permutations;

	div.innerHTML = "";

	for(let i = 0; i < coordinates.dimensions; i++) {
		const chk = document.createElement("input");
		chk.id = `${key}${idx}-chk${i}`;
		chk.type = "checkbox";
		chk.checked = true;
		div.append(chk);

		const label = document.createElement("label");
		label.htmlFor = chk.id;
		label.appendChild(document.createTextNode(
			' ' + (i + 1) + '\u00A0\u00A0\u00A0'
		));
		div.appendChild(label);
	}
	
	for(let i = 0; i < coordinates.dimensions; i++) {
		const chk = document.getElementById(`${key}${idx}-chk${i}`);
		chk.addEventListener('change', () => {
			changes[idx].indices[i] = chk.checked;
		});
	}
}