
<!-- Begin
var checkObjects        = new Array();
var errors              = "";
var returnVal           = false;
var language            = new Array();
language["header"]      = "You are missing some information needed to process this form:\n\n"
language["start"]       = "*";
language["field"]       = " ";
language["require"]     = " is required";
language["min"]         = " and must consist of at least ";
language["max"]         = " and must not contain more than ";
language["minmax"]      = " and no more than ";
language["chars"]       = " characters";
language["num"]         = " and must contain a number";
language["email"]       = " must contain a valid e-mail address";

function define(n, type, HTMLname, min, max, d) {
	var p;
	var i;
	var x;
	
	if (!d) d = document;
	
		if ((p=n.indexOf("?"))>0&&parent.frames.length) {
			d = parent.frames[n.substring(p+1)].document;
			n = n.substring(0,p);
		}
		if (!(x = d[n]) && d.all) x = d.all[n];
			for (i = 0; !x && i < d.forms.length; i++) {
			x = d.forms[i][n];
		}
		for (i = 0; !x && d.layers && i < d.layers.length; i++) {
			x = define(n, type, HTMLname, min, max, d.layers[i].document);
			return x;
		}
		n = n .replace(/\|/,'');
		n = n .replace(/\-/,'');		
		eval("V_"+n+" = new formResult(x, type, HTMLname, min, max);");
		checkObjects[eval(checkObjects.length)] = eval("V_"+n);
}

function formResult(form, type, HTMLname, min, max) {
	this.form = form;
	this.type = type;
	this.HTMLname = HTMLname;
	this.min  = min;
	this.max  = max;
}

function validate() {
	if (checkObjects.length > 0) {
		errorObject = "";
		for (i = 0; i < checkObjects.length; i++) {
		validateObject = new Object();
		validateObject.form = checkObjects[i].form;
		validateObject.HTMLname = checkObjects[i].HTMLname;
		validateObject.val = checkObjects[i].form.value;
		validateObject.len = checkObjects[i].form.value.length;
		validateObject.min = checkObjects[i].min;
		validateObject.max = checkObjects[i].max;
		validateObject.type = checkObjects[i].type;
		if (validateObject.type == "num" || validateObject.type == "string") {
			if ((validateObject.type == "num" && validateObject.len <= 0) || (validateObject.type == "num" && isNaN(validateObject.val))) { errors += language['start'] + language['field'] + validateObject.HTMLname + language['require'] + language['num'] + "\n";
			} else if (validateObject.min && validateObject.max && (validateObject.len < validateObject.min || validateObject.len > validateObject.max))
			{ errors += language['start'] + language['field'] + validateObject.HTMLname + language['require'] + language['min'] + validateObject.min + language['minmax'] + validateObject.max+language['chars'] + "\n";
			} else if (validateObject.min && !validateObject.max && (validateObject.len < validateObject.min)) { errors += language['start'] + language['field'] + validateObject.HTMLname + language['require'] + language['min'] + validateObject.min + language['chars'] + "\n";
			} else if (validateObject.max && !validateObject.min &&(validateObject.len > validateObject.max)) { errors += language['start'] + language['field'] + validateObject.HTMLname + language['require'] + language['max'] + validateObject.max + language['chars'] + "\n";
			} else if (!validateObject.min && !validateObject.max && validateObject.len <= 0) { errors += language['start'] + language['field'] + validateObject.HTMLname + language['require'] + "\n";
  	 		}
		} else if(validateObject.type == "email") {
// Checking existense of "@" and ".".
// Length of must >= 5 and the "." must
// not directly precede or follow the "@"
		if ((validateObject.val.indexOf("@") == -1) || (validateObject.val.charAt(0) == ".") || (validateObject.val.charAt(0) == "@") || (validateObject.len < 6) || (validateObject.val.indexOf(".") == -1) || (validateObject.val.charAt(validateObject.val.indexOf("@")+1) == ".") || (validateObject.val.charAt(validateObject.val.indexOf("@")-1) == ".")) { errors += language['start'] + language['field'] + validateObject.HTMLname + language['email'] + "\n"; }
      }
   }
}

if (errors) {
	alert(language["header"].concat("\n" + errors));
	errors = "";
	returnVal = false;
} else {
	returnVal = true;
   	}
}

var isNN = (navigator.appName.indexOf("Netscape")!=-1);

function autoTab(input,len, e) {
	var keyCode = (isNN) ? e.which : e.keyCode; 
	var filter = (isNN) ? [0,8,9] : [0,8,9,16,17,18,37,38,39,40,46];
	if(input.value.length >= len && !containsElement(filter,keyCode)) {
		input.value = input.value.slice(0, len);
		input.form[(getIndex(input)+1) % input.form.length].focus();
}

function containsElement(arr, ele) {
	var found = false, index = 0;
	while(!found && index < arr.length)
	if(arr[index] == ele)
	found = true;
	else
	index++;
	return found;
}
	
function getIndex(input) {
	var index = -1, i = 0, found = false;
	while (i < input.form.length && index == -1)
	if (input.form[i] == input)index = i;
		else i++;
		return index;
	}
	return true;
}

// function used to make sure a call status button is selected

function checkRadios() {
	var el = document.forms[0].elements;
	for(var i = 0 ; i < el.length ; ++i) {
		if(el[i].name == "call_detail|status") {
			var radiogroup = el[el[i].name]; // get the whole set of radio buttons.
			var itemchecked = false;
			for(var j = 0 ; j < radiogroup.length ; ++j) {
				if(radiogroup[j].checked) {
					itemchecked = true;
					break;
				}
			}
			if(!itemchecked) { 
				alert("Please Select a Contact Status");
				if(el[i].focus)
				el[i].focus();
				return false;
			}
		}
	}
	return true;
} 

function checkBulk() {
 var el = document.forms[0].elements;
 for(var i = 0 ; i < el.length ; ++i) {
  if(el[i].name == "bulk_calls|status") {
   var radiogroup = el[el[i].name]; // get the whole set of radio buttons.
   var itemchecked = false;
   for(var j = 0 ; j < radiogroup.length ; ++j) {
    if(radiogroup[j].checked) {
	 itemchecked = true;
	 break;
	}
   }
   if(!itemchecked) { 
    alert("Please Select a Contact Status");
    if(el[i].focus)
     el[i].focus();
	return false;
   }
  }
 }
 return true;
} 


// Given a URL, this function will open a popup window titled with 'name'.  The
// 'widgets' argument can contain any other controls needed to pass to the 
// window.open call.

function openWindow (earl,name,widgets)
{
    host = location.hostname;
    if (host.indexOf('DigtalCampaigns') != -1)
    {
        var url = 'http://www.digitalcampaigns.com' + earl;
    }
    else
    {
        var url = earl;
    }
    popupWin = window.open (url,name,widgets);
    popupWin.opener.top.name="opener";
    popupWin.focus();
}

//-----------------------------------------------------------------------------
// swapOptions(controlField, targetField)
//-----------------------------------------------------------------------------
//
// A method for swapping one set of options in a select dropdown for another set
// of options based on what is selected from a controlling dropdown.
//
// Options are stored in arrays with a name of the format:
// 
//    [option_label]_fld
//
// This necessarily means that the controlField dropdown must have labels with
// no spaces or other funny chars that will make javascript barf when it tries
// to use it as an array name

function swapOptions(controlField, targetField) { 
  var theForm = window.document.forms[0];
  var key_idx = theForm[controlField].options.selectedIndex;
  var key     = theForm[controlField].options[key_idx].value;

  var the_array = eval(key + '_flds');
  setOptionText(theForm[targetField], the_array);
}

//-----------------------------------------------------------------------------
// setOptionText(the_select, the_array)
//-----------------------------------------------------------------------------
//
// Given a dropdown select 'the_select' and an array of values 'the_array' this
// function updates 'the_select' to have the values contained within 'the_array'

function setOptionText(the_select, the_array) {
  the_select.length = the_array.length;

  for (loop=0; loop < the_select.options.length; loop++)
  {
    the_select.options[loop].text = the_array[loop];
  }

  the_select.selectedIndex = 0;
}


//-----------------------------------------------------------------------------
// uncheckAll(the_form, the_name)
//-----------------------------------------------------------------------------
//
// Uncheck all checkboxes with a given name

function uncheckAll(the_form, the_name) {
	var special = 0;

	for (loop=0; loop < the_form.elements.length; loop++) {
		if (the_form.elements[loop].name == "_"+the_name) {
			special = 1;
			the_form.elements[loop].checked = 0;
        }

		if (the_form.elements[loop].name == the_name) {
			if (special) {
				the_form.elements[loop].value   = '';
			} else {
				the_form.elements[loop].checked = 0;
			}
        }

	}
}


function doCheckAll()
{
  with (document.forms[0]) {
    for (var i=0; i < elements.length; i++) {
        if (elements[i].type == 'checkbox')
           elements[i].checked = true;
    }
  }
}

function doUnCheckAll()
{
  with (document.forms[0]) {
    for (var i=0; i < elements.length; i++) {
        if (elements[i].type == 'checkbox')
           elements[i].checked = false;
    }
  }
}


function validPass(passForm) {
 if (passForm.confirm.value != passForm.elements['signup|user-password'].value) { 
    alert("The passwords you entered do not match!");
    passForm.confirm.focus();
    passForm.confirm.select();
    return false;
  } 
  return true;
} 







//-------------------------------------------------------------------
// TIMESTAMPS AND CHECKBOXES
//


function selector_failure_msg(valuename) {

	alert('WARNING: The ' + valuename + ' you have selected cannot be stored reliably, because of a software error. Please copy this message and report it to Digital Campaigns Customer Service.')
}


function test_number_name(elementnumber,fieldname,valuename) {

	var testResult = false
	
	if ( (document.forms[0].elements.length > elementnumber) && (elementnumber >= 0) ) {

		if (document.forms[0].elements[elementnumber].name == fieldname) { 
			testResult = true
		}
	}

	if (testResult == false) { 
//selector_failure_msg(valuename) 
}
	return testResult
}


function update_timestamp(target_element_num, target_field_name) {

	if ( test_number_name(target_element_num, target_field_name, "date") ) {

		var target_field = document.forms[0].elements[target_element_num]
		var month_selector = document.forms[0].elements[target_element_num + 1]
		var month = month_selector.options[month_selector.selectedIndex].value
		var day_selector = document.forms[0].elements[target_element_num + 2]
		var day = day_selector.options[day_selector.selectedIndex].value
		var year_selector = document.forms[0].elements[target_element_num + 3]
		var year = year_selector.options[year_selector.selectedIndex].value


		if ( (month!="") && (day!="") && (year!="") ) {
			target_field.value = year + '-' + month + '-' + day + ' 00:00:00'
		} else {
			target_field.value = 'NULL'
		}

	}
}

function update_checkbox(target_element_num, target_field_name) {

	if ( test_number_name(target_element_num, target_field_name, "checkbox") ) {

		var target_field = document.forms[0].elements[target_element_num]
		var source_checkbox = document.forms[0].elements[target_element_num + 1]

		if ( source_checkbox.checked ) {
			target_field.value = "TRUE"
		} else {
			target_field.value = "FALSE"
		}

	}
}


// END OF TIMESTAMPS AND CHECKBOXES
//-------------------------------------------------------------------


//  End -->

