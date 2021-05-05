
var regVal = new Array();

/**
 * Called by the individual fields to register their validators
 * Fields register the field-specific validator to call when
 * they output their presentation data.
 * @param newValidator the validator to add
 */

function registerValidator(newValidator) {
   var newPos = regVal.length;
   regVal[newPos] = newValidator;
}

function validateForm(theForm) {
   var errMsg = "";
   
   //for (var i = 0; i < regVal.length; i++) {
   for (var val in regVal) {
      errMsg += regVal[val](theForm);
   }
   
   if (errMsg.length != 0) {
      alert("The form had the following errors:\n" +
            "----------------------------------\n" + 
	    errMsg);
      return false;
   } else {
      return true; 
   }
}

