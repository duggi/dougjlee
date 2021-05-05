/*
 * preloadImages.js
 * --------------------------
 * Douglas Lee
 * $Id: preloadImages.js,v 1.1 2002/10/08 18:48:25 doug Exp $
 *
 */

/*
 * preloadImages
 *
 * takes an array of urls and preloads them
 * place comma separated list of urls in the function call
 *
 */
var images=new Array()
  
function preloadImages() {
  for (i=0;i<preloadImages.arguments.length;i++) {
    images[i]=new Image()
    images[i].src=preloadImages.arguments[i]
  }
}
