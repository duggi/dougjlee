/**
 * PresentationFunctions.js
 *
 * Utility functions used by client-side javascript presenters
 * Mark Machado
 * $Id: PresentationFunctions.js,v 1.2 2002/10/10 15:44:53 markm Exp $
 */



/**
 * Changes a select input type to display the Options in arrayObject
 * selectObject must be a Select list, and the arrayObject must
 * only have Option objects
 * @param selectObject the select object to change
 * @param arrayObject the array of Options to change the select object to
 */

function setOptionsToArray(selectObject, arrayObject) {
  selectObject.options.length = 0;
  selectObject.options.length = arrayObject.length;
  for (var i = 0; i < arrayObject.length; i++) { 
    selectObject.options[i] = arrayObject[i];
  }
}

/**
 * Extracts an int value from the selected option's label in a select field
 * Reads the initial numeric part of the label + returns that value
 * Example : Label of "4 - Exceeds Expectations" returns 4
 * @param field the select field to read the value from
 * @return the numeric portion of field's selected option
 */
function extractSelectValue(field) {
  if (field.tagName.toLowerCase() != "select") {
    return 0;
  }
  
  var selected = field.selectedIndex;
  if (selected < 0) {
    return 0;
  }
  
  var textVal = field.options[selected].text;
  var numVal = parseFloat(textVal);
  if (isNaN(numVal)) {
    numVal = 0;
  }
  
  return numVal;  
}


function getEnclosingForm(field) {
  var parent = field;
  while (parent != null &&
         parent.tagName.toLowerCase() != "form")  {
    parent = parent.parentElement;
  }
  return parent;
}






/*****************************************************
 * CHANGE LISTENER FUNCTIONS
 ****************************************************/

var changeListeners = new Array();

/**
 * Called by the individual fields to register themselves as change listeners
 * @param newListener the new listener
 */

function registerChangeListener(newListener) {
   var newPos = changeListeners.length;
   changeListeners[newPos] = newListener;
}

function changeEvent(field) {
  var form = getEnclosingForm(field);

  for (var cl in changeListeners) {
    changeListeners[cl](form, field);
  }
}

