/* ******************************************************************
 * Popup Calendar
 *
 * author   : Tan Ling Wee on 2 Dec 2001
 * email    : fuushikaden@yahoo.com
 *
 * modified : Douglas Lee $Id$
 * changed input to accept three fields
 * kludged in year upper and lower clamps
 *
 */


// ******************************************************************
// script globals
// --------------------------
//
var fixedX         = -1 // x position (-1 if to appear below control)
var fixedY         = -1 // y position (-1 if to appear below control)
var startAt        = 0  // 0 - sunday ; 1 - monday
var showWeekNumber = 0  // 0 - don't show; 1 - show
var showToday      = 1  // 0 - don't show; 1 - show
var imgDir         = "" // directory for images. ex: var imgDir="/img/"

var gotoString         = "Go To Current Month"
var todayString        = "Go To Today's Date: "
var weekString         = "Wk"
var scrollLeftMessage  = "Click to scroll to previous month. Hold mouse button to scroll automatically."
var scrollRightMessage = "Click to scroll to next month. Hold mouse button to scroll automatically."
var selectMonthMessage = "Click to select a month."
var selectYearMessage  = "Click to select a year."
var selectDateMessage  = "Select [date] as date." // ** do not replace [date], it will be replaced by date

var crossobj, crossMonthObj, crossYearObj,
    monthSelected, yearSelected, dateSelected,
    omonthSelected, oyearSelected, odateSelected,
    monthConstructed, yearConstructed,
    intervalID1, intervalID2, timeoutID1,
    timeoutID2,
    ctlToPlaceMonthValue, ctlToPlaceDateValue, ctlToPlaceYearValue, ctlNow,
    dateFormat,
    nStartingYear

var bPageLoaded=false
var ie=document.all
var dom=document.getElementById

var ns4=document.layers
var today = new Date()
var dateNow  = today.getDate()
var monthNow = today.getMonth()
var yearNow  = today.getYear()

var imgsrc = new Array("drop1.gif","drop2.gif","left1.gif","left2.gif","right1.gif","right2.gif")
var img = new Array()

var bShow = false;


// ******************************************************************
// hideElement
// --------------------------
// hides <select> and <applet> objects (for IE only)
//
function hideElement( elmID, overDiv )
{
  if( ie )
  {
    for( i = 0; i < document.all.tags( elmID ).length; i++ )
    {
      obj = document.all.tags( elmID )[i];
      if( !obj || !obj.offsetParent )
      {
        continue;
      }
  
      // Find the element's offsetTop and offsetLeft relative to the BODY tag.
      objLeft   = obj.offsetLeft;
      objTop    = obj.offsetTop;
      objParent = obj.offsetParent;
      
      while( objParent.tagName.toUpperCase() != "BODY" )
      {
        objLeft  += objParent.offsetLeft;
        objTop   += objParent.offsetTop;
        objParent = objParent.offsetParent;
      }
  
      objHeight = obj.offsetHeight;
      objWidth = obj.offsetWidth;
  
      if(( overDiv.offsetLeft + overDiv.offsetWidth ) <= objLeft );
      else if(( overDiv.offsetTop + overDiv.offsetHeight ) <= objTop );
      else if( overDiv.offsetTop >= ( objTop + objHeight ));
      else if( overDiv.offsetLeft >= ( objLeft + objWidth ));
      else
      {
        obj.style.visibility = "hidden";
      }
    }
  }
}


// ******************************************************************
// showElement
// --------------------------
// unhides <select> and <applet> objects (for IE only)
//
function showElement( elmID )
{
  if( ie )
  {
    for( i = 0; i < document.all.tags( elmID ).length; i++ )
    {
      obj = document.all.tags( elmID )[i];
      
      if( !obj || !obj.offsetParent )
      {
        continue;
      }
    
      obj.style.visibility = "";
    }
  }
}


// ******************************************************************
// HolidayRec
// --------------------------
//
function HolidayRec (d, m, y, desc)
{
  this.d = d
  this.m = m
  this.y = y
  this.desc = desc
}

// ******************************************************************
// addHoliday
// --------------------------
//
var HolidaysCounter = 0
var Holidays = new Array()

function addHoliday (d, m, y, desc)
{
  Holidays[HolidaysCounter++] = new HolidayRec ( d, m, y, desc )
}


// ******************************************************************
// write calendar table
// --------------------------
if (dom)
{
  // preload images
  for (i=0;i<imgsrc.length;i++)
  {
    img[i] = new Image
    img[i].src= img + imgsrc[i]
  }
  
  // start calendar
  startCalHtml  = "<div onclick='bShow=true' id='calendar' class='div-style'>"
  startCalHtml += "  <table class='table-style' width='190'>"
  startCalHtml += "  <tr><td class='title-background-style'>"
  
  // insert date widgets here
  startCalHtml += "    <table width='100%'><tr>"  
  startCalHtml += "      <td class='title-style'><B><span id='caption'></span></B></td>"  
  
  // close calendar
  startCalHtml += "      <td class='title-style'>"
  startCalHtml += "        <a style='cursor: hand;'"
  startCalHtml += "           onclick='javascript:hideCalendar()'>"
  startCalHtml += "        <img src='"+imgDir+"close.gif' width='11' height='10'"
  startCalHtml += "             class='title-control-close'"
  startCalHtml += "             border='0' alt='Close the Calendar'></a>"
  startCalHtml += "    </td></tr></table>"
  startCalHtml += "  </td></tr>"

  // insert calendar body here
  startCalHtml += "  <tr><td class='body-style'>"  
  startCalHtml += "    <span id='content'></span>"
  startCalHtml += "  </td></tr>"

  document.write (startCalHtml);
  
  // go to current date footer
  if (showToday==1)
  {
    footerHtml  = "<tr><td class='today-style'>"
    footerHtml += "  <span id='lblToday'></span>"
    footerHtml += "</td></tr>"
    document.write (footerHtml)
  }
  
  // end calendar
  endCalHtml  = "</table></div>"
  endCalHtml += "<div id='selectMonth' class='div-style'></div>"
  endCalHtml += "<div id='selectYear' class='div-style'></div>"
  document.write (endCalHtml);
}


// ******************************************************************
// month and day string arrays
// --------------------------
//
var monthName = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")

if (startAt==0)
{
  dayName = new Array ("Sun","Mon","Tues","Wed","Thu","Fri","Sat")
}
else
{
  dayName = new Array ("Mon","Tue","Wed","Thu","Fri","Sat","Sun")
}


// ******************************************************************
// swapImage
// --------------------------
//  
function swapImage(srcImg, destImg) {
  if (ie) { document.getElementById(srcImg).setAttribute("src",imgDir + destImg) }
}


// ******************************************************************
// init
// --------------------------
//
function init()
{
  if (!ns4)
  {
    if (!ie) { yearNow += 1900  }

    crossobj=(dom)?document.getElementById("calendar").style : ie? document.all.calendar : document.calendar
    hideCalendar()

    crossMonthObj=(dom)?document.getElementById("selectMonth").style : ie? document.all.selectMonth : document.selectMonth

    crossYearObj=(dom)?document.getElementById("selectYear").style : ie? document.all.selectYear : document.selectYear

    monthConstructed=false;
    yearConstructed=false;
    
    // go to todays date footer
    if (showToday==1)
    {
      todayHTML  = " "
      todayHTML += "<a style='cursor: hand;'"
      todayHTML += "   onclick='"
      todayHTML += "     javascript:monthSelected=monthNow;"
      todayHTML += "     yearSelected=yearNow;"
      todayHTML += "     constructCalendar();'"
      todayHTML += "   onMouseOver=this.style.backgroundColor='#fffff0';this.style.color='#000'"
      todayHTML += "   onMouseOut=this.style.backgroundColor='';this.style.color=''>"
      
      document.getElementById("lblToday").innerHTML =
        todayString + todayHTML
        + dayName[(today.getDay()-startAt==-1)?6:(today.getDay()-startAt)] + ", "
        + dateNow + " " + monthName[monthNow].substring(0,3) + " " + yearNow + "</a>"
    }

    // title-control table
    sHTML1  = "<table border=0 cellspacing=2 cellpadding=0 width='150'><tr>"

    // left arrow
    sHTML1 += "<td class='title-control-normal-style'"
    sHTML1 += "      onmouseover='"
    sHTML1 += "        swapImage(\"changeLeft\",\"left2.gif\");"
    sHTML1 += "        this.className=\"title-control-select-style\";'"
    sHTML1 += "      onmouseout='"
    sHTML1 += "        clearInterval(intervalID1);"
    sHTML1 += "        swapImage(\"changeLeft\",\"left1.gif\");"
    sHTML1 += "        this.className=\"title-control-normal-style\";'"
    sHTML1 += "      onclick='"
    sHTML1 += "        decMonth()'"
    sHTML1 += "      onmousedown='"
    sHTML1 += "        clearTimeout(timeoutID1);"
    sHTML1 += "        timeoutID1=setTimeout(\"StartDecMonth()\",300)'"
    sHTML1 += "      onmouseup='"
    sHTML1 += "        clearTimeout(timeoutID1);"
    sHTML1 += "        clearInterval(intervalID1)'>"
    sHTML1 += "<span id='spanLeft'"
    sHTML1 += "      title='"+scrollLeftMessage+"'>"
    sHTML1 += "  <img id='changeLeft' src='"+imgDir+"left1.gif'"
    sHTML1 += "       width=10 height=11 border=0>"
    sHTML1 += "</span></td>"
    
    // month pulldown
    sHTML1 += "<td width='50%' class='title-control-normal-style'"
    sHTML1 += "      onmouseover='"
    sHTML1 += "        swapImage(\"changeMonth\",\"drop2.gif\");"
    sHTML1 += "        this.className=\"title-control-select-style\";'"
    sHTML1 += "      onmouseout='"
    sHTML1 += "        clearTimeout(timeoutID1);"
    sHTML1 += "        timeoutID1=setTimeout(\"popDownMonth()\",300);"
    sHTML1 += "        swapImage(\"changeMonth\",\"drop1.gif\");"
    sHTML1 += "        this.className=\"title-control-normal-style\";'"
    sHTML1 += "      onclick='popUpMonth();'>"
    sHTML1 += "<span id='spanMonth'"
    sHTML1 += "      title='"+selectMonthMessage+"'>"
    sHTML1 += "</span></td>"
    
    // year pulldown
    sHTML1 += "<td width='50%' class='title-control-normal-style'"
    sHTML1 += "      onmouseover='"
    sHTML1 += "        swapImage(\"changeYear\",\"drop2.gif\");"
    sHTML1 += "        this.className=\"title-control-select-style\";'"
    sHTML1 += "      onmouseout='"
    sHTML1 += "        clearTimeout(timeoutID2);"
    sHTML1 += "        timeoutID2=setTimeout(\"popDownYear()\",300);"
    sHTML1 += "        swapImage(\"changeYear\",\"drop1.gif\");"
    sHTML1 += "        this.className=\"title-control-normal-style\";'"
    sHTML1 += "      onclick='popUpYear();'>"    
    sHTML1 += "<span id='spanYear'"
    sHTML1 += "      title='"+selectMonthMessage+"'>"
    sHTML1 += "</span></td>"
    
    // right arrow
    sHTML1 += "<td class='title-control-normal-style'"
    sHTML1 += "    onmouseover='"
    sHTML1 += "      swapImage(\"changeRight\",\"right2.gif\");"
    sHTML1 += "      this.className=\"title-control-select-style\";'"
    sHTML1 += "    onmouseout='"
    sHTML1 += "      clearInterval(intervalID1);"    
    sHTML1 += "      swapImage(\"changeRight\",\"right1.gif\");"
    sHTML1 += "      this.className=\"title-control-normal-style\";'"
    sHTML1 += "    onclick='"
    sHTML1 += "      incMonth()'"
    sHTML1 += "    onmousedown='"
    sHTML1 += "      clearTimeout(timeoutID1);"
    sHTML1 += "      timeoutID1=setTimeout(\"StartIncMonth()\",300)'"
    sHTML1 += "    onmouseup='"
    sHTML1 += "      clearTimeout(timeoutID1);"
    sHTML1 += "      clearInterval(intervalID1)'>"
    sHTML1 += "<span id='spanRight' align='right'"
    sHTML1 += "      title='"+scrollRightMessage+"'>"
    sHTML1 += "  <img id='changeRight' src='"+imgDir+"right1.gif'"
    sHTML1 += "       width=10 height=11 border=0>"
    sHTML1 += "</span></td></tr></table>"

    document.getElementById("caption").innerHTML  = sHTML1

    bPageLoaded=true
  }
}


// ******************************************************************
// hideCalendar
// --------------------------
//
function hideCalendar()
{
  crossobj.visibility="hidden"
  if (crossMonthObj != null){crossMonthObj.visibility="hidden"}
  if (crossYearObj != null){crossYearObj.visibility="hidden"}

  showElement( 'SELECT' );
  showElement( 'APPLET' );
}


// ******************************************************************
// padZero
// --------------------------
//
function padZero(num)
{
  return (num < 10)? '0' + num : num ;
}


// ******************************************************************
// constructDate
// --------------------------
//
function constructDate(d,m,y)
{
  sTmp = dateFormat
  sTmp = sTmp.replace ("dd","<e>")
  sTmp = sTmp.replace ("d","<d>")
  sTmp = sTmp.replace ("<e>",padZero(d))
  sTmp = sTmp.replace ("<d>",d)
  sTmp = sTmp.replace ("mmm","<o>")
  sTmp = sTmp.replace ("mm","<n>")
  sTmp = sTmp.replace ("m","<m>")
  sTmp = sTmp.replace ("<m>",m+1)
  sTmp = sTmp.replace ("<n>",padZero(m+1))
  sTmp = sTmp.replace ("<o>",monthName[m])
  return sTmp.replace ("yyyy",y)
}



// ******************************************************************
// closeCalendar
// --------------------------
//
function closeCalendar()
{
  var sTmp

  hideCalendar();

  ctlToPlaceMonthValue.value = monthSelected+1
  ctlToPlaceDateValue.value  = dateSelected
  ctlToPlaceYearValue.value  = yearSelected
}


// ******************************************************************
// Month Functions
//

// **************************
// StartDecMonth
// --------------------------
//
function StartDecMonth()
{
  intervalID1=setInterval("decMonth()",80) // do not set to 0 or it wont auto-scroll
}

// **************************
// StartIncMonth
// --------------------------
//
function StartIncMonth()
{
  intervalID1=setInterval("incMonth()",80) // do not set to 0 or it wont auto-scroll
}

// **************************
// incMonth
// --------------------------
//
function incMonth()
{
  monthSelected++
  if (monthSelected>11)
  {
    monthSelected=0
    yearSelected++
  }
  constructCalendar()
}

// **************************
// decMonth
// --------------------------
//
function decMonth()
{
  monthSelected--
  if (monthSelected<0)
  {
    monthSelected=11
    yearSelected--
  }
  constructCalendar()
}

// **************************
// constructMonth
// --------------------------
//
function constructMonth()
{
  popDownYear()
  if (!monthConstructed) {
    sHTML = ""
    for (i=0; i<12; i++)
    {
      sName = monthName[i];
      sHTML += "<tr><td id='m" + i + "'"
      
      // get monthSelected css
      if (i==monthSelected) {
        sName = "<B>" + sName + "</B>"
        sHTML += "      class='dropdown-select-style'"
      } else if (i!=monthSelected) {
        sHTML += "      onmouseover='"
        sHTML += "        this.className=\"dropdown-select-style\"'"
        sHTML += "      onmouseout='"
        sHTML += "        this.className=\"dropdown-normal-style\"'"
      }
      
      // pass value
      sHTML += "        onclick='"
      sHTML += "          monthConstructed=false;"
      sHTML += "          monthSelected=" + i + ";"
      sHTML += "          constructCalendar();"
      sHTML += "          popDownMonth();"
      sHTML += "          event.cancelBubble=true'>&nbsp;" + sName + "&nbsp;"
      sHTML += "</td></tr>"
    }
    
    iHTML  = "<table class='dropdown-style' width=60 cellspacing=1 cellpadding=1"
    iHTML += "       onmouseover='"
    iHTML += "         clearTimeout(timeoutID1)'"
    iHTML += "       onmouseout='"
    iHTML += "         clearTimeout(timeoutID1);"
    iHTML += "         timeoutID1=setTimeout(\"popDownMonth()\",300);"
    iHTML += "         event.cancelBubble=true'>" + sHTML
    iHTML += "</table>"
    
    document.getElementById("selectMonth").innerHTML = iHTML

    monthConstructed=true
  }
}

// **************************
// popUpMonth
// --------------------------
//
function popUpMonth()
{
  constructMonth()
  crossMonthObj.visibility = (dom||ie)? "visible" : "show"
  crossMonthObj.left = parseInt(crossobj.left) + 26
  crossMonthObj.top = parseInt(crossobj.top) + 26 // offset pulldown

  hideElement( 'SELECT', document.getElementById("selectMonth") );
  hideElement( 'APPLET', document.getElementById("selectMonth") );      
}

// **************************
// popDownMonth
// --------------------------
//
function popDownMonth()
{
  crossMonthObj.visibility= "hidden"
}


// ******************************************************************
// Year Functions
//

// **************************
// selectYear
// --------------------------
//
function selectYear(nYear)
{
  //yearSelected=parseInt(nYear+nStartingYear);
  yearSelected=parseInt(nYear);
  yearConstructed=false;
  constructCalendar();
  popDownYear();
}

// **************************
// constructYear
// --------------------------
//
function constructYear()
{
  popDownMonth()
  sHTML = ""
  if (!yearConstructed)
  { j = 0
    
    // how many years to offset in pulldown
    // deprecated with kludged year clamping
    nStartingYear = yearSelected-3

    //for (i=(yearSelected-3); i<=(yearSelected+3); i++)
    for (i=1987; i<=2006; i++)
    {
      sName = i;
      sHTML += "<tr><td id='y" + j + "'"
      
      // give yearSelected css
      if (i==yearSelected) {
        sName = "<B>" + sName + "</B>"
        sHTML += "        class='dropdown-select-style'"
      } else if (i != yearSelected){
        sHTML += "        onmouseover='"
        sHTML += "          this.className=\"dropdown-select-style\"'"
        sHTML += "        onmouseout='"
        sHTML += "          this.className=\"dropdown-normal-style\"'"
      }
      
      // pass value
      sHTML += "        onclick='"
      sHTML += "          selectYear("+i+");"
      sHTML += "          event.cancelBubble=true'>"
      sHTML += "&nbsp;" + sName + "&nbsp;"
      sHTML += "</td></tr>"
      
      j ++;
    }
    
    // year pulldown table
    iHTML  = "<table width=60 class='dropdown-style' cellspacing=1 cellpadding=1"
    iHTML += "       onmouseover='"
    iHTML += "         clearTimeout(timeoutID2)'"
    iHTML += "       onmouseout='"
    iHTML += "         clearTimeout(timeoutID2);"
    iHTML += "         timeoutID2=setTimeout(\"popDownYear()\",300)'>" + sHTML
    iHTML +="</table>"
    
    document.getElementById("selectYear").innerHTML = iHTML

    yearConstructed = true
  }
}


// **************************
// popDownYear
// --------------------------
//
function popDownYear() {
  clearInterval(intervalID1)
  clearTimeout(timeoutID1)
  clearInterval(intervalID2)
  clearTimeout(timeoutID2)
  crossYearObj.visibility= "hidden"
}

// **************************
// popUpYear
// --------------------------
//
function popUpYear() {
  var leftOffset
  
  constructYear()
  crossYearObj.visibility = (dom||ie)? "visible" : "show"
  leftOffset = parseInt(crossobj.left) + document.getElementById("spanYear").offsetLeft
  if (ie)
  {
    leftOffset += 6
  }
  crossYearObj.left = leftOffset + 71
  crossYearObj.top = parseInt(crossobj.top) + 26 // offset pulldown
}


// ******************************************************************
// Calendar Functions
//
// **************************
// WeekNbr
// --------------------------
//  
function WeekNbr(today)
{
  Year = takeYear(today);
  Month = today.getMonth();
  Day = today.getDate();
  now = Date.UTC(Year,Month,Day+1,0,0,0);
  var Firstday = new Date();
  Firstday.setYear(Year);
  Firstday.setMonth(0);
  Firstday.setDate(1);
  then = Date.UTC(Year,0,1,0,0,0);
  var Compensation = Firstday.getDay();
  if (Compensation > 3) Compensation -= 4;
  else Compensation += 3;
  NumberOfWeek =  Math.round((((now-then)/86400000)+Compensation)/7);
  return NumberOfWeek;
}

// **************************
// takeYear
// --------------------------
// 
function takeYear(theDate)
{
  x = theDate.getYear();
  var y = x % 100;
  y += (y < 38) ? 2000 : 1900;
  return y;
}

// **************************
// constructCalendar
// --------------------------
//
function constructCalendar()
{
  var startDate  = new Date (yearSelected,monthSelected,1)
  var endDate    = new Date (yearSelected,monthSelected+1,1);
  endDate        = new Date (endDate - (24*60*60*1000));
  numDaysInMonth = endDate.getDate()

  datePointer = 0
  dayPointer = startDate.getDay() - startAt
    
  if (dayPointer<0)
  {
    dayPointer = 6
  }

  // calendar body
  sHTML = "<table border=0 class='body-style'><tr>"

  if (showWeekNumber==1)
  {
    sHTML += "<td><b>" + weekString + "</b></td>"
    sHTML += "<td rowspan=7 class='weeknumber-div-style'><img src='"+imgDir+"divider.gif' width=1></td>"
  }

  for (i=0; i<7; i++) {
    sHTML += "<td align='right'><B>"+ dayName[i]+"</B></td>"
  }
  sHTML +="</tr><tr>"
  
  if (showWeekNumber==1)
  {
    sHTML += "<td align=right>" + WeekNbr(startDate) + "&nbsp;</td>"
  }

  for ( var i=1; i<=dayPointer;i++ )
  {
    sHTML += "<td>&nbsp;</td>"
  }

  // selected day logic, assign css
  for ( datePointer=1; datePointer<=numDaysInMonth; datePointer++ )
  {
    dayPointer++;
    
    // regular day
    var sStyle="normal-day-style";    
    // today
    if ((datePointer==dateNow)&&(monthSelected==monthNow)&&(yearSelected==yearNow)) 
    {
      sStyle = "current-day-style";
    }    
    // calculate weekends
    else if ((dayPointer + 1) % 7 == 1 || dayPointer % 7 == (startAt * -1) +1)
    {
      sStyle = "end-of-weekday-style";
    }    
    // selected day
    if ((datePointer==odateSelected) && (monthSelected==omonthSelected) && (yearSelected==oyearSelected))
    {
      sStyle += " selected-day-style";
    }    
    // holiday tooltip
    sHint = ""
    for (k=0;k<HolidaysCounter;k++)
    {
      if ((parseInt(Holidays[k].d)==datePointer)&&(parseInt(Holidays[k].m)==(monthSelected+1)))
      {
        if ((parseInt(Holidays[k].y)==0)||((parseInt(Holidays[k].y)==yearSelected)&&(parseInt(Holidays[k].y)!=0)))
        {
          sStyle += " holiday-style";
          sHint+=sHint==""?Holidays[k].desc:"\n"+Holidays[k].desc
        }
      }
    }

    var regexp= /\"/g
    sHint=sHint.replace(regexp,"&quot;")

    // print today date
    sHTML += "<td align=right>"
    sHTML += "  <a style='cursor: hand' class='"+sStyle+"' title=\"" + sHint + "\""
    sHTML += "     onMouseOver=this.style.backgroundColor='#f93';this.style.color='#fff'"
    sHTML += "     onMouseOut=this.style.backgroundColor='';this.style.color=''"
    sHTML += "     onclick='"
    sHTML += "       javascript:dateSelected="+datePointer+";"
    sHTML += "       closeCalendar();'>" + datePointer + "</a>"

    if ((dayPointer+startAt) % 7 == startAt) { 
      sHTML += "</tr><tr>" 
      if ((showWeekNumber==1)&&(datePointer<numDaysInMonth))
      {
        sHTML += "<td align=right>" + (WeekNbr(new Date(yearSelected,monthSelected,datePointer+1))) + "&nbsp;</td>"
      }
    }
  }
  
  // print calendar
  document.getElementById("content").innerHTML   = sHTML
  document.getElementById("spanMonth").innerHTML = monthName[monthSelected] + "<IMG id='changeMonth' SRC='"+imgDir+"drop1.gif' WIDTH='12' HEIGHT='10' BORDER=0>"
  document.getElementById("spanYear").innerHTML  = yearSelected + "<IMG id='changeYear' SRC='"+imgDir+"drop1.gif' WIDTH='12' HEIGHT='10' BORDER=0>"
}

// ******************************************************************
// popUpCalendar
// --------------------------
//
function popUpCalendar(ctl, ctl2, ctl3, ctl4, format)
{
  var leftpos=0
  var toppos=0

  if (bPageLoaded)
  {
    if ( crossobj.visibility == "hidden" )
    {
      ctlToPlaceMonthValue = ctl2
      ctlToPlaceDateValue  = ctl3
      ctlToPlaceYearValue  = ctl4
      dateFormat=format;
      
      formatChar = " ";
      aFormat = dateFormat.split(formatChar);

      if (aFormat.length<3)
      {
        formatChar = "/";
        aFormat = dateFormat.split(formatChar);
        if (aFormat.length<3)
        {
          formatChar = "."
          aFormat = dateFormat.split(formatChar)
          if (aFormat.length<3)
          {
            formatChar = "-"
            aFormat = dateFormat.split(formatChar)
            if (aFormat.length<3)
            {
              formatChar="" // invalid date format
            }
          }
        }
      }
      
      // pass current date selections to calendar
      tokensChanged = 0
      if ( formatChar != "" )
      {
        aMonthData = ctl2.value // use user's date
        aDateData  = ctl3.value // use user's date
        aYearData  = ctl4.value // use user's date
        
        for (i=0;i<3;i++)
        {          
          if ((aFormat[i]=="d") || (aFormat[i]=="dd"))
          {
            dateSelected = parseInt(aDateData)
            tokensChanged ++
          }
          else if ((aFormat[i]=="m") || (aFormat[i]=="mm"))
          {
            monthSelected = parseInt(aMonthData - 1)
            tokensChanged ++
          }
          else if (aFormat[i]=="yyyy")
          {
            yearSelected = parseInt(aYearData) //parseInt(aYearData[i], 10)
            tokensChanged ++
          }
          else if (aFormat[i]=="mmm")
          {
            for (j=0; j<12; j++)
            {
              if (aMonthData[i]==monthName[j])
              {
                monthSelected=j
                tokensChanged ++
              }
            }
          }
        }
      }
      
      // if the date selections are bad assign current user time
      if ((tokensChanged!=3)||isNaN(dateSelected)||isNaN(monthSelected)||isNaN(yearSelected)||(yearSelected==""))
      {
        dateSelected = dateNow
        monthSelected = monthNow
        yearSelected = yearNow
      }

      odateSelected  = dateSelected
      omonthSelected = monthSelected
      oyearSelected  = yearSelected

      aTag = ctl
      do
      {
        aTag = aTag.offsetParent;
        leftpos += aTag.offsetLeft;
        toppos += aTag.offsetTop;
      } while(aTag.tagName!="BODY");

      crossobj.left = fixedX==-1 ? ctl.offsetLeft + leftpos : fixedX
      crossobj.top = fixedY==-1 ? ctl.offsetTop + toppos + ctl.offsetHeight + 2 : fixedY
      constructCalendar (1, monthSelected, yearSelected);
      crossobj.visibility=(dom||ie)? "visible" : "show"
      
      hideElement( 'SELECT', document.getElementById("calendar") );
      hideElement( 'APPLET', document.getElementById("calendar") );     

      bShow = true;
    }
  }
  else
  {
    init()
    popUpCalendar(ctl,  ctl2, ctl3, ctl4, format)
  }
}


// ******************************************************************
// Page Actions
// --------------------------
//

// hidecal1
document.onkeypress = function hidecal1 ()
{ 
  if (event.keyCode==27) 
  {
    hideCalendar()
  }
}

// hidecal2
document.onclick = function hidecal2 ()
{     
  if (!bShow)
  {
    hideCalendar()
  }
  bShow = false
}

// hidecal1
document.onload=init()
