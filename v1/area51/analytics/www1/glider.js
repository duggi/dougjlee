
/* -- GLIDER ------------------------------------------------------------- */
div.scroller { 
	width: 348px; 
	height: 159px;
	overflow: hidden;
  position: relative;
}
div.scroller div.section { /* match the size of the scroller window */		
  width:348px;
  height:159px;
  overflow:hidden;
  float:left;
  padding:3px;	
}
div.scroller div.content {
  width: 10000px;
}
div.controls {
  margin-top: 3px;
  height: 17px;
  padding: 3px;
  text-align: center;
  border-bottom: 1px dotted #999;
}

div.controls a {
  color: #666;
  font-family: arial;
  padding: 3px 8px;
  border-bottom: 2px solid #fff;
  background: #fff url('../images/rev-corner-white-nw.png') 0 0 no-repeat;
}
