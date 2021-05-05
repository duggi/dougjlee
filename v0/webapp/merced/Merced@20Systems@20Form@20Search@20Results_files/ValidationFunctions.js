/**
 * ValidationFunctions.js
 * 
 * Library of client side validation functions
 * Pattern for these functions is: 
 * function <funcName> (form, fieldName, <optional parameters>)
 *
 * Mark Machado
 * $Id: ValidationFunctions.js,v 1.3 2002/05/18 20:09:07 markm Exp $
 */


/**************************************************
 * UTILITY FUNCTIONS
 **************************************************/
function fieldNotFoundError(fieldName) {
   return "Form Descriptor Error: can't get " + fieldName + " off of form\n";
}

function notTextError(fieldName, funcName) {
   return "Form Descriptor Error: field " + fieldName + 
         " is not a text, textarea, or password, but we are calling " +
         funcName + "() on it\n";
}

function isText(field) {
   if (field.type == "text" || 
       field.type == "textarea" ||
       field.type == "password")  
      return true;
   else 
      return false;
}

function rangeMessage(minV, maxV) {
      if (!isNaN(minV) && !isNaN(maxV)) {
         return "between " + minV + " and " + maxV + " inclusive";
      }
      else if (!isNaN(minV) && isNaN(maxV)) {
         return "greater than or equal to " + minV;
      }
      else if (isNaN(minV) && !isNaN(maxV)) {
         return "less than or equal to " + maxV;
      }
      else { 
         return ""; //or an error message about bad min+max values?
      }
}


/**************************************************
 * VALIDATOR FUNCTIONS
 *************************************************/

function testEmpty(form, fieldName) {
   var field = form[fieldName];
   if (field == null) 
      return fieldNotFoundError(fieldName);

   if ( !isText(field) )
      return notTextError(fieldName, "testEmpty")

   var data = field.value;
   if (data == null || data.length == 0) {
      return "Field " + fieldName + " must have a value\n";
   } else {
      return "";
   }

}

function testPassword(form, fieldName, confirmFieldName) {
  var field = form[fieldName];
  var confirmField = form[confirmFieldName];

  /* commented out: passwords are optional 
  var empTest = testEmpty(form, fieldName);
  if (empTest != "") {
    return empTest;
  }
  empTest = testEmpty(form, confirmFieldName);
  if (empTest != "") {
    return empTest;
  }
  */

  if (field.value != confirmField.value)
    return "Password confirmation must match the Password value\n";
  else
    return "";
}



 

function testNumberRange(form, fieldName, minVal, maxVal) {
   var field = form[fieldName];
   if (field == null) 
      return fieldNotFound(fieldName);

   if ( !isText(field) )
      return notTextError(fieldName, "testNumberRange");

   var nMin = parseFloat(minVal);
   var nMax = parseFloat(maxVal);
   var fieldValue = parseFloat(field.value);

   if (isNaN(fieldValue)) {
      return "Field " + fieldName + " must be a valid number " + 
         rangeMessage(nMin, nMax) + "\n";
   }

   if ((!isNaN(nMin) && nMin > fieldValue) ||
       (!isNaN(nMax) && nMax < fieldValue)) {
      return "Field " + fieldName + " must be a number " +
         rangeMessage(nMin, nMax) + "\n";
   } else {
      return "";  
   }
}



   
