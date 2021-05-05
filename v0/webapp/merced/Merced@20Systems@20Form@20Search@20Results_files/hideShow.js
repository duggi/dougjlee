/*
 * hideShow.js
 * --------------------------
 * Douglas Lee
 * $Id: hideShow.js,v 1.1 2002/10/08 18:48:25 doug Exp $
 *
 */

/*
 * hideShow
 *
 * hides the leftnav
 * this script pairs up links and divs
 * using the divname,linkname value pairs
 * then it uses the visibility and innerHTML properties
 * to hide or show the div section
 *
 * @param divname the name of the div to hide or show
 * @param linkname the name of the link that calls this function
 *
 */

function hideShow(divname,linkname) {
  var linktochange = linkname;
  if(divname.style.visibility == 'hidden') {
    linktochange.innerHTML = '<img border="0" src="/merced/ccimages/arrow_divclose.gif" alt="hide left nav">';
    divname.style.position = 'relative';
    divname.style.visibility = 'visible';
  } else {
      linktochange.innerHTML = '<img border="0" src="/merced/ccimages/arrow_divopen.gif" alt="show left nav">';
      divname.style.visibility = 'hidden';
      divname.style.position = 'absolute';
  }
}

