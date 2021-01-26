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
	project_btn
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
	project_btn.value = 'Project to ' + (value - 1) + 'D';
}
dimensions_nud.addEventListener('input', dimChange);
dimChange();

// On project button click.
project_btn.addEventListener('click', () => {
	coordinates.project();
	dimensions_nud.value--;
	dimChange();
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
	radio.addEventListener('change', event => {
		coordinates.options.formatting = i;
	});
});

// Configures sign radio buttons.
document.forms.signs.radio.forEach((radio, i) => {
	radio.checked = (i === 0);
	radio.addEventListener('change', event => {
		coordinates.options.sign = i;
	});
});

// Configures permutation radio buttons.
document.forms.perms.radio.forEach((radio, i) => {
	radio.checked = (i === 0);
	radio.addEventListener('change', event => {
		coordinates.options.permutation = i;
	});
});

// Configures the parenthesis checkbox.
paren_chk.checked = false;
paren_chk.addEventListener('change', event => {
	coordinates.options.parentheses = paren_chk.checked;
});
