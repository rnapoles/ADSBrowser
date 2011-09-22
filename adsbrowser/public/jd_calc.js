//-----------------------------------------------------------------------------
// convert calendar to Julian date		Year Zero and 4000-year rule added by SGS
// (Julian day number algorithm adapted from Press et al.)
//-----------------------------------------------------------------------------
function cal_to_jd (era, y, m, d, h, mn, s, yzero)
{
	var jy, jm, centry;   // scratch

	if ((y == 0 ) && !yzero)
	{
		alert("There was no year 0 in the Julian system.\nCheck 'Use Year Zero' if required.");
		return "Invalid";
	}
	if ((y == 1582) && (m == 10) && (d > 4) && (d < 15) && (era == "CE"))
	{
		alert("The dates 5th through 14th October 1582 did not exist in the Gregorian system!");
		return "Invalid";
	}

	if (era == "BCE")
	{
		y = -y;
		if (!yzero)
			y += 1;
	}

	if (m > 2)	// jy is the year, jm is (month + 1), eg. March = 4
	{
		jy = y;
		jm = m + 1;
	}
	else	// jy is the year less 1, jm is (month + 13), eg. January = 14, February = 15
	{
		jy = y - 1;
		jm = m + 13;
	}

	var intgr = Math.floor (365.25 * jy) + Math.floor (30.6001 * jm ) + d + 1720995;
	/*	Simple 'every fourth year is a leap year' is applied to bump (intgr) according to the
		year.  The 30.6001 multiplier is a clever system that indexes the correct number of
		days for complete months that have occurred since 1st March.  Then add the day-of-month.
		1720995 is a frig factor that adjusts (intgr) to zero for 4713-01-01 BCE
		The fact that 1720995 is JD for 0002-10-30 BCE seems to be irrelevant! */

	/*  Check to see if we need to be in the Gregorian calendar: since d !> 31, we can test by
		assuming all months have 31 days, so set gregcal to be (1582*12 + 10) months + 15 days */
	var gregcal = 588829;	// = 15 + 31*(10 + 12*1582)
	if (d + 31*(m + 12*y) >= gregcal)
	{
		centry = Math.floor (0.01 * jy);
			/*	centry will always be the century part of the year
				UNLESS Jan or Feb in a centennial year */
		intgr += 2 - centry + Math.floor (0.25 * centry) - Math.floor (0.025 * centry);
			/*	The middle term above corrects for the 400 year rule
				and the last for the 4000 year rule (added by SGS) */
	}

	// correct for half-day offset
	var dayfrac = h/24.0 - 0.5;
	if (dayfrac < 0.0)
	{
		dayfrac += 1.0;
		--intgr;
	}

	// now set the fraction of a day
	var frac = dayfrac + (mn + s/60.0) / (60.0*24.0);
		  
	// round to nearest 10ms
	var jd0 = (intgr + frac) * 10000000;
	var jd = Math.floor (jd0);
	if ((jd0 - jd) > 0.5)
		++jd;
	return jd/10000000;
}

//-----------------------------------------------------------------------------
// convert Julian date to calendar date
// (algorithm adapted from Hatcher, D.A., 1984, QJRAS 25, 53)
// (algorithm adapted from Press et al.)
//-----------------------------------------------------------------------------
function jd_to_cal (jd, form, yzero, erazero)
{
	var j1, j2, j3, j4, j5;   // scratch

	// get the date from the Julian day number
	var intgr = Math.floor (jd);
	var frac = jd - intgr;

	// correction for half day offset
	// SGS: Bug - this was originally after Gregorian date check.
	//	Add 5ms to correct rounding errors.
	var dayfract = frac + 0.500000058;
	if (dayfract >= 1.0)
	{
		dayfract -= 1.0;
		++intgr;
	}

	var gregjd = 2299161;	// 15th October 1582 (Gregorian)
	if (intgr >= gregjd)	// Gregorian calendar correction.  4000 year correction added by SGS
	{
//		var tmp = (intgr - 1867216.25) / 36524.25;
// Press et al.'s algorithm: no 4000 correction.

		var tmp = (intgr - 1721119.25) / 36524.225;
		/*	JD1867216 was 28th Feb 0400.  JD1721119 was 0000-03-02 (year zero, or 0001 BCE)
		 	Had to do this correction to go back 400 *Gregorian* years
		 	(ie. to 28th Feb + 3 days for the three centennial years that *weren't* leap years)
		 	so the 4000 year correction could be applied.
		 	The divisor now reflects the approximation with the 4000 year correction applied
		 	(ie. the fractional part is 969/4000, not 97/400).	*/
		var centry = Math.floor (tmp);
			// centry is the number of complete *Gregorian centuries* since 0000-03-02
			// (centry was the number of complete Gregorian centuries since 0400-02-28)
//		j1 = intgr + 1 + centry - Math.floor (0.25*centry);  // as was.
		j1 = intgr - 2 + centry - Math.floor (0.25*centry) + Math.floor (0.025*centry);
		/*	j1 is now intgr bumped a number of days to account for:
			+ 10 days for missing dates in October 1582
			+ number of centennial years that are not leap years after 1500
			- number of 4000 year intervals to account for the 4000 year rule */
	}
	else
		j1 = intgr;
		
	/*	Having applied any Gregorian correction, now calculate the calendar date assuming it is
		Julian.  Unwanted February 29ths will be skipped by the Gregorian correction algorithm */
	j2 = j1 + 1524.0;
//	j3 = Math.floor (6680.0 + ((j2 - 2439870.0) - 122.1 ) / 365.25);
	j3 = Math.floor (6680.0 + (j2 - 2439992.1) / 365.25);
	j4 = Math.floor (j3 * 365.25);
	j5 = Math.floor ((j2 - j4) / 30.6001);

	var d = Math.floor (j2 - j4 - Math.floor (j5*30.6001));
	var m = Math.floor (j5 - 1.0);
	if (m > 12)
		m -= 12;
	var y = Math.floor (j3 - 4715.0);
	if (m > 2)
		--y;
	if ((y <= 0) && !yzero)
		--y;

	//
	// get time-of-day from JD fraction
	//
	var xx  = Math.floor (dayfract * 8640000);	// units of 10ms
	var sc  = xx % 6000;
	xx = (xx - sc) / 6000;
	sc /= 100;
	var mn  = xx % 60;
	var hr  = (xx - mn) / 60;

	if (y <= 0)
	{
		y = -y;
		form.era[erazero].checked = true;
	}
	else
		form.era[1-erazero].checked = true;

	write_form (form, y, m, d, hr, mn, sc, jd);
}

//-----------------------------------------------------------------------------
// convert Julian date to UNIX seconds and back again - added SGS Nov 18th 2009
// UNIX 'time zero' was 00:00 UTC on 1970-01-01, which was JD 2440587.5
// There are 86400 seconds in a day
//-----------------------------------------------------------------------------
function jd_to_unix (jd)
{
	var unix_zero = 2440587.5;
	var msc = (jd - unix_zero) * 8640000; // in 10ms increments
	var unix_secs = Math.floor (msc + 0.5) / 100;
	return unix_secs;
}

function unix_to_jd (u_secs)
{
	var jd;
	var tmp = u_secs / 864 + 244058750.000005;
	// tmp is 100 * the jd value we want, +4.32ms, to ensure correct rounding down..
	jd = Math.floor (tmp * 100000) / 10000000;
	return jd;
}

//-----------------------------------------------------------------------------
// convert UNIX seconds to Microsoft File Time (MFT) and back again - added SGS Nov 18th 2010
// MFT 'time zero' was 00:00 UTC on 1601-01-01, which was 11644473600 seconds
// before UNIX 'time zero'.  The M$ time is the number of 100ns (ie. 10^-7 seconds)
// 'ticks' since its time zero.  It is expressed as a 64-bit number.
// This has been translated into Hi and Lo 32-bit numbers, each expressed in decimal.
// 2^32/10^7 is 429.4967296.
//-----------------------------------------------------------------------------
function unix_to_mft_hi (usecs)
{
	var mft_hi = Math.floor ((usecs + 11644473600) / 429.4967296);
	return mft_hi;
}

function unix_to_mft_lo (usecs)
{
	var mft_lo;
	var tmp = ((usecs + 11644473600) * 10000000 + 50000) % 4294967296;
	/*	We only need 10ms accuracy (100000 ticks), so having added 5ms
		to remove rounding errors, set the 5 LSDs to zero: */
	mft_lo = Math.floor (tmp / 100000) * 100000;
	return mft_lo;
}

function mft_to_unix (hi, lo)
{
	var usecs = hi * 429.4967296 + lo / 10000000 - 11644473600;
	return usecs;
}


function write_form (form, year, month, day, hour, mins, secs, jd)
// centralised here by SGS and jd added as a parameter.
{
	var x = "";
	var y = "";

	if (year < 1000)
		x = "0";
	if (year < 100)
		x = "00";
	if (year < 10)
		x = "000";
	form.year.value = x + year;

	// months run from January = 1
	for (k=1; k <= form.month.length; ++k)
	{
		if (k == month)
		{
			form.month[k-1].selected = true;
			break;
		}
	}

	form.day.value = day;

/*	Following has been removed since we got rid of the drop-down 'day' menu
	for (k=1; k <= form.day.length; ++k)
	{
		if (k == day)
		{
			form.day[k-1].selected = true;
			break;
		}
	}		*********************/

	if (hour > 9)
		form.hour.value = hour;
	else
		form.hour.value = "0" + hour;

	if (mins > 9)
		form.minute.value = mins;
	else
		form.minute.value = "0" + mins;

	x = "";
	y = "";
	if (secs < 10)
		x = "0";
	if (secs == (Math.floor (secs)))
		y = ".00";
	else
		if (secs*10 == (Math.floor (secs*10)))
			y = "0";

	form.second.value = x + secs + y;

	
	// get UNIX and Microsoft File Time
	var usecs = jd_to_unix (jd);
	form.UNIXedit.value = usecs;

	var mfthi = unix_to_mft_hi (usecs);
//	alert (mfthi + " " + unix_to_mft_lo (usecs));

	if (mfthi < 0)
	{
		form.MSHIedit.value = "Before                ";
		form.MSLOedit.value = "1601 CE               ";
	}
	else if (mfthi > 4294967295)
	{
		form.MSHIedit.value = "Overflow              ";
		form.MSLOedit.value = " ";
	}
	else
	{
		form.MSHIedit.value = unix_to_mft_hi (usecs);
		form.MSLOedit.value = unix_to_mft_lo (usecs);
	}

	// Calculate Maya Long Count Calendar
	var tmp = Math.floor (jd - 584282.5);
	while (tmp < 144000)
		tmp += 1872000;
	var md1 = tmp % 20;
	tmp -= md1;
	tmp /= 20;
	var md2 = tmp % 18;
	tmp -= md2;
	tmp /= 18;
	var md3 = tmp % 20;
	tmp -= md3;
	tmp /= 20;
	var md4 = tmp % 20;
	tmp -= md4;
	tmp /= 20;
	var md5 = tmp % 20;
	tmp -= md5;
	var md6 = tmp / 20;
	form.Maya6.value = md6;
	form.Maya5.value = md5;
	form.Maya4.value = md4;
	form.Maya3.value = md3;
	form.Maya2.value = md2;
	form.Maya1.value = md1;
}


function doDATE(form)
{
	for (k=0; k < form.calctype.length; ++k)
	{
		if (form.calctype[k].value == "date")
		{
			form.calctype[k].checked = true;
			break;
		}
	}
}

//** The following are only called from the main HTM page:  **//

function doJD(form)
{
	for (k=0; k < form.calctype.length; ++k)
	{
		if (form.calctype[k].value == "JD")
		{
			form.calctype[k].checked = true;
			break;
		}
	}
}

function doUNIX(form)
{
	for (k=0; k < form.calctype.length; ++k)
	{
		if (form.calctype[k].value == "UNIX")
		{
			form.calctype[k].checked = true;
			break;
		}
	}
}

function doMFT(form)
{
	for (k=0; k < form.calctype.length; ++k)
	{
		if (form.calctype[k].value == "MFT")
		{
			form.calctype[k].checked = true;
			break;
		}
	}
}

function set_form_fields_to_now (form)
{
	// grab the current machine time
	var today = new Date();

	var year  = today.getYear();
	/*	All browsers return a 2-figure year for 19xx.
		Some versions of IE return 4 figures for 20xx; other browsers return 1xx for 20xx */
	if (year < 1900)
		year += 1900;
	/*	Catch those that return 0 instead of 100 for 2000: assume, like DOS,
		that 2 figures >=80 mean 19xx and <=79 mean 20xx.  ***/
	if (year < 1980)
		year +=  100;
	/*	Bug fix: both these originally tested for (year < 2000), which displayed 19xx years
		as 20xx.  Could have used getFullYear() to get round all these problems,
		but not all browsers support it.  ***/
	var month = today.getMonth();	// January = 0
	var day   = today.getDate();
	var hour  = today.getHours();
	var mins  = today.getMinutes();
	var secs  = today.getSeconds();
//	alert (year + " " + (month + 1) + " " + day + " " + hour + ":" + mins + ":" + secs);

	/*	SGS - The following brought into this subroutine, and correction for leap years added,
		though this is academic since no PC clock supports dates after 2099!   ***/
	var febdays = 28;
	if ((year % 4 == 0) && (year % 100 != 0) || ((year % 400 == 0) && (year % 4000 != 0)))
		++febdays;
	var numdays = new Array(31,febdays,31,30,31,30,31,31,30,31,30,31);
			 
	// convert to UT
	var TZ = today.getTimezoneOffset();

	// SGS - below was added to cater for places like India, with 1/2 hour zones...
	var TZmins = today.getTimezoneOffset() % 60;
	TZ   -= TZmins;	// leaves the hours, expressed in minutes
	TZ   /= 60; 	// NOW divide it by 60!
	mins += TZmins;
	hour += TZ;

	if (mins >= 60)
	{
		mins -= 60;
		++ hour;
	}
	if (hour >= 24) 
	{
		hour -= 24;
		++day;
	}

	if (day > numdays[month] )	// Bug: was numdays[month-1]
	{
		++month;
		if (month > 11) 
		{
			month -= 12;
			++year;
		}
		day = 1;
	}

	/*	Typical Yanks - forgotten there *is* an eastern hemisphere!!
		Corrected by SGS...		***/
	if (mins < 0)
	{
		mins += 60;
		--hour;
	}
	if (hour < 0) 
	{
		hour += 24;
		--day;
	}

	if (day < 1) 
	{
		--month;
		if (month < 0) 
		{
			month += 12;
			--year;
		}
		day = numdays[month];
	}

	month++;	// Make January = 1 from now on

	/*	set the form fields - pass a dummy as the last parameter (the JD) to stop
		Javascript from whinging since it will be overwritten immediately later */
	write_form (form, year, month, day, hour, mins, secs, 0);
	form.era[1].checked = true;
			 
	doDATE(form);
	JDcalc(form);	// added by SGS for the 'Set to Now' button
}

//-----------------------------------------------------------------------------
// calculate Julian date from calendar date or calendar date from Julian date
//-----------------------------------------------------------------------------
function JDcalc (form)
{
	var era;
	var erazero = 0;	// added by SGS
	for (k=0; k < form.era.length; ++k)
	{
		if (form.era[k].checked)
		{
			era = form.era[k].value;
			if (((k == 1) && (era == "BCE")) || ((k == 0) && (era == "CE")))
				erazero = 1;	// buttons on form are swapped
			break;
		}
	}

	var yzero = 0;	// added by SGS
	if (form.yzero.checked)
		yzero = 1;

	var calctype;
	for (k=0; k < form.calctype.length; ++k)
	{
		if (form.calctype[k].checked)
		{
			calctype = form.calctype[k].value;
			break;
		}
	}

	if (calctype == "date")
	{
		var y  = parseFloat(form.year.value);

//		var m  = parseFloat(form.month.value) + 1;
		var m;
		for (var k=0; k < form.month.length; ++k)  // Netscape 4.7 is stoopid
		{
			if (form.month[k].selected)
			{
				m = k + 1;
				break;
			}
		}

		var d  = parseFloat(form.day.value);	// brought back in by SGS
/*		Following was needed for drop-down 'day' menu.
		If re-used, comment out '(form.day.value)' line above
		var d;
		for (var k=1; k <= form.day.length; ++k)   //Netscape 4.7 is stoopid
		{
			if (form.day[k-1].selected)
			{
				d = k;
				break;
			}
		}		*********************/

		var h  = parseFloat(form.hour.value);
		var mn = parseFloat(form.minute.value);
		var s  = parseFloat(form.second.value);
		if (y <= 0)
		{
			y = -y;
			era = "BCE";
			form.year.value = y;
			form.era[erazero].checked = true;
		}
		
		var jd;
		jd = cal_to_jd (era, y, m, d, h, mn, s, yzero);
			// seconds are rounded to nearest 1ms now
		form.JDedit.value = jd;
		
		write_form (form, y, m, d, h, mn, s, jd);
	}

	if (calctype == "JD")
		jd_to_cal (form.JDedit.value, form, yzero, erazero);

	if (calctype == "UNIX")
	{
		form.JDedit.value = unix_to_jd (form.UNIXedit.value);
		jd_to_cal (form.JDedit.value, form, yzero, erazero);
	}

	if (calctype == "MFT")
	{
		form.UNIXedit.value = mft_to_unix (form.MSHIedit.value, form.MSLOedit.value);
		form.JDedit.value = unix_to_jd (form.UNIXedit.value);
		jd_to_cal (form.JDedit.value, form, yzero, erazero);
	}


	// timezone - added by SGS
	var today = new Date();
	var TZ = 0 - today.getTimezoneOffset()/60;
	// OK this time to display half-hour zones as 'GMT +5.5' (eg. India)
	if (TZ >= 0)
		form.TZ.value = "GMT +" + TZ;
	else
		form.TZ.value = "GMT " + TZ;

	// weekday
	var weekday = new Array("Monday","Tuesday","Wednesday","Thursday",
	              "Friday","Saturday","Sunday");

	// 0.5 day plus 5ms for rounding errors
	var t  = parseFloat(form.JDedit.value) + 0.500000058;

	var wd = Math.floor (t % 7);    // simplified by SGS
	if (wd < 0)
		wd += 7;
	form.wkday.value = weekday[wd];
}

// Check to see if the ENTER key has been pressed
function checkEnter(e, form)
{
	var keycode;
	if (window.event)
		keycode = window.event.keyCode;
	else if (e)
		keycode = e.which;

	if (keycode == 13)
	{
 		JDcalc(form);
 		return true;
	}
	else
		return false;
}

/* Seemingly redundant code...
function mod(x,y)
{
	if (x >= 0)
	{
		var n = Math.floor(x/y);
		return x - Math.round(n*y);
	}
	else
	{
		var n = Math.ceil(x/y);
		return x - Math.round(n*y);
	}
}

*/
