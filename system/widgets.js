/*
This is the JS file for the Windows widgets, which include
 - Run
 - About/WinVer
and also contains the Win95Emu Debug window.
WARNING: Requires, and must be loaded AFTER, win95.js
Widgets: unresizable windows that may or may not have a taskbar button and/or titlebar icon.
----
TODO: see if dynamically side-loading js files is possible (create a debug.js for the debug wizard)
remove classses in widgets.css
TODO: create widgetjs folder (or another name) and create a run.js inside it (and include it, ln 91)
fix window spawn positioning bug and get the 'open' and 'cancel' buttons to work on the run dialog
*/

$( document ).ready(function(){
	console.log("Widget Creation Syntax: makeWidget('Icon URL/False', 'Window Title', 'HTML', Taskbar Boolean, Minimize Boolean, Question Boolean, Center Boolean, Width, Height, 'Custom Class');");
});

function makeWidget(icon, title, html, taskbar, min, ques, center, wid, hei, cusClass) { /* IT WORKS!!! What's the catch? */
	window_set++;
	// Add titlebar height to window height
	var winHeight = hei + titbHeight;
	// split window HTML into sections to allow concatenation
	if(cusClass != false) { // custom class
		var sec1 = '<div class="win_drag win_widget nores ' + cusClass + '" id="window_';
	} else { // no custom class
		var sec1 = '<div class="win_window nores" id="window_';
	}
	var sec2 = '" style="width: ' + wid + 'px; height: ' + winHeight + 'px;"';
	var sec3 = '><div class="win_titlebar win_titb_active nores" id="win_titb_';
	if(icon == false) { // no icon (default)
		var sec4 = '">';
		var sec5 = '<div class="win_titb_text win_titb_text_noicon">';
	} else { // icon present
		var sec4 = '"><div class="win_titb_icon"><img src="';
		var sec5 = '" onerror="this.src = defaultImage"></div><div class="win_titb_text">';
	}
	var sec6 = '</div><div class="win_titb_controls" id="win_windc_'
	// determine Window control type
	if(min == true) {
		// minimize shown
		var sec7 = '"><img src="system/win_controls/min.png" class="win_titb_min" id"_"><img src="system/win_controls/max_disabled.png" class="win_titb_max_dis" id"_"><img src="system/win_controls/close.png" class="win_titb_close" id"_"></div></div>';
	} else {
		if(ques != true) { // No Question Mark
			var sec7 = '"><img src="system/win_controls/close.png" class="win_titb_close" id"_"></div></div>';
		} else { // Question Mark Present
			var sec7 = '"><img src="system/win_controls/question.png" class="win_titb_question" id"_"><img src="system/win_controls/close.png" class="win_titb_close" id"_"></div></div>';
		}
	}
	// merge strings into one variable for insertion into DOM
	if(icon == false) { // prevents "false" boolean from being inserted into page
		var insertHTML = sec1 + window_set + sec2 + window_set + sec3 + window_set + sec4 + sec5 + title + sec6 + window_set + sec7;
	} else {
		var insertHTML = sec1 + window_set + sec2 + window_set + sec3 + window_set + sec4 + icon + sec5 + title + sec6 + window_set + sec7;
	}
	// SET UP HTML TARGET DIV
	var htmlTarget = '<div class="win_widget_htmltarget" style="height: ' + hei + 'px;">' + html + '</div></div>';
	var finalHTML = insertHTML + htmlTarget;
	$( '#win_placeholder' ).after( finalHTML );
	var window_id = '#window_' + window_set; // gets the ID of current window
	var titlebar_id = '#win_titb_' + window_set; // window id in titlebar format
	// window active/inactive classes
	$( '.win_window').removeClass( 'win_window_active' );
	$( '.win_window').addClass( 'win_window_inactive' );
	$( window_id ).removeClass('win_window_inactive');
	$( window_id ).addClass('win_window_active');
	// titlebar active/inactive classes
	$( '.win_titlebar').removeClass( 'win_titb_active' );
	$( '.win_titlebar').addClass( 'win_titb_inactive' );
	$( titlebar_id ).removeClass('win_titb_inactive');
	$( titlebar_id ).addClass('win_titb_active');
	if(taskbar != false) {
		addTaskbar(window_set, icon, title);
	}
	//return window_set;
	if(center == true) {
		windowCenter(window_set);
	}
}

function run(start) { // the run box
	// toggle Start menu if launched from there
	if(start == true) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_start" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_start" );
			$( "#win_start_button" ).toggleClass( "win_start_button_depressed" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/run.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_run_tgt"></div><div id="win_wid_run_container"> <div id="win_wid_run_icondiv"> <img src="system/images/run_icon.png"> ';
	var sec2 = '</div> <p id="win_wid_run_text"> Type the name of a program, folder, or document, and<br> ';
	var sec3 = 'Windows will open it for you. </p> <p id="win_wid_run_opent"> <span class="win_underline">O';
	var sec4 = '</span>pen: </p> <input type="text" id="win_wid_run_input" autofocus> <button id="win_wid_run_obutton" onClick="runOK()" disabled autofocus>';
	var sec5 = 'OK</button> <button class="win_wid_run_cbutton" id="test" onClick="runCancel()">Cancel</button> <button class="win_wid_run_bbutton" onClick="runBrowse()">';
	var sec6 = 'Browse...</button> </div>';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6; // combine html code
	// time to make the widgets...
	makeWidget(false, 'Run', widgetHTML, false, false, false, false, 340, 140, 'win_wid_run_dialog');
	$( '#win_wid_run_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_run_input' ).on('input', function() {
		var tbVal = $( '#win_wid_run_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_run_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_run_obutton' ).prop('disabled', true);
		}
	});
}
function runOK() {
	var boxVal = $( "#win_wid_run_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	runClose();
}
function runCancel() {
	runClose();
}
function runBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function runClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_run_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}
/* NOTEPAD APP */

function notepad(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_notepad" );
			$( ".win_titlebar_notepad" ).toggleClass( "win_titb_notepad" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_notepad" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/notepad.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_notepad_tgt"></div><div id="win_wid_notepad_container"> <div id="win_wid_notepad_container_inside"> <div id="win_wid_notepad_icondiv"> <img src="system/images/notepad2.png"> ';
	var sec2 = '</div><textarea class="notepadtextarea" type="text" name="Notepad" style="overflow:scroll;resize:none;height:361px;width:627px;border:0px solid transparent;position:relative;left:0px;top:0px;"></textarea>';
	var sec3 = '<p id="win_wid_notepad_opent">';
	var sec4 = '<p class="win_wid_notepad_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:7px;">F</p><p style="position:absolute;top:-35px;left:14px;" class="win_wid_notepad_container_text">ile</p>';
	var sec5 = '<p class="border_test"></p>';
	var sec6 = '<p class="win_wid_notepad_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:46px;">E</p><p style="position:absolute;top:-35px;left:53px;" class="win_wid_notepad_container_text">dit</p>';
	var sec7 = '<p class="win_wid_notepad_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:83px;">S</p><p style="position:absolute;top:-35px;left:90px;" class="win_wid_notepad_container_text">earch</p>';
	var sec8 = '<p class="win_wid_notepad_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:143px;">H</p><p style="position:absolute;top:-35px;left:152px;" class="win_wid_notepad_container_text">elp</p>';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/notepadfile.png', 'Untitled - Notepad', widgetHTML, true, true, true, true, 640, 350, 'win_wid_notepad_dialog');
	$( '#win_wid_notepad_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_notepad_input' ).on('input', function() {
		var tbVal = $( '#win_wid_notepad_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_notepad_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_notepad_obutton' ).prop('disabled', true);
		}
	});
}
function notepadOK() {
	var boxVal = $( "#win_wid_notepad_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	notepadClose();
}
function notepadCancel() {
	notepadClose();
}
function notepadBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function notepadClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_notepad_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}


/* README APP */

function readme(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_readme" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_readme" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/readme.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_readme_tgt"></div><div id="win_wid_readme_container"> <div id="win_wid_readme_container_inside"> <div id="win_wid_readme_icondiv"> <img src="system/images/notepadfile.png"> ';
	var sec2 = '</div><textarea class="readmetextarea" type="text" name="Readme" style="overflow:scroll;resize:none;height:361px;width:627px;border:0px solid transparent;position:relative;left:0px;top:0px;"></textarea>';
	var sec3 = '<p id="win_wid_readme_opent"></p>';
	var sec4 = '<img style="position:absolute;top:5px;left:500px;" src="system/images/flower.gif">';
	var sec5 = '<img style="position:absolute;top:220px;left:0px;" src="system/images/birdbath.gif">';
	var sec6 = '<p id="win_wid_readme_text" style="position:absolute;top:100px;left:230px;">designed by:</p><a id="win_wid_readme_text" style="position:absolute;top:110px;left:310px;" href="https://instagram.com/ethan.daq/">@ethan.daq</a>';
	var sec7 = '<p id="win_wid_readme_text" style="position:absolute;top:140px;left:230px;">i got too much time on my hands</p>';
	var sec8 = '';
	var sec9 = '<img style="position:absolute;top:200px;left:500px;" src="system/images/flower3.gif">';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8 + sec9; // combine html code
	// time to make the widgets...
	makeWidget('system/images/notepadfile.png', 'Readme.txt', widgetHTML, true, true, true, true, 640, 350, 'win_wid_readme_dialog');
	$( '#win_wid_readme_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_readme_input' ).on('input', function() {
		var tbVal = $( '#win_wid_readme_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_readme_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_readme_obutton' ).prop('disabled', true);
		}
	});
}
function readmeOK() {
	var boxVal = $( "#win_wid_readme_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	readmeClose();
}
function readmeCancel() {
	readmeClose();
}
function readmeBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function readmeClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_readme_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}



function readme2(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_readme" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_readme" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/readme.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_readme_tgt"></div><div id="win_wid_readme_container"> <div id="win_wid_readme_container_inside"> <div id="win_wid_readme_icondiv"> <img src="system/images/notepadfile.png"> ';
	var sec2 = '</div><textarea class="readmetextarea" type="text" name="Readme" style="overflow:scroll;resize:none;height:361px;width:627px;border:0px solid transparent;position:relative;left:0px;top:0px;"></textarea>';
	var sec3 = '<p id="win_wid_readme_opent"></p>';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var sec9 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8 + sec9; // combine html code
	// time to make the widgets...
	makeWidget('system/images/notepadfile.png', 'Credits.txt', widgetHTML, true, true, true, true, 640, 350, 'win_wid_readme_dialog');
	$( '#win_wid_readme_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_readme_input' ).on('input', function() {
		var tbVal = $( '#win_wid_readme_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_readme_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_readme_obutton' ).prop('disabled', true);
		}
	});
}
function readme2OK() {
	var boxVal = $( "#win_wid_readme_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	readmeClose();
}
function readme2Cancel() {
	readmeClose();
}
function readme2Browse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function readme2Close() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_readme_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}





function ms(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_ms" );
			$( ".win_titlebar_ms" ).toggleClass( "win_titb_ms" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_ms" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/ms.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_ms_tgt"></div><div id="win_wid_ms_container"> <div id="win_wid_ms_container_inside"> <div id="win_wid_ms_icondiv"> ';
	var sec2 = '<iframe style="overflow: hidden;height:310px;width:245px;" src="minesweeper/minesweeper.html" title="description"></iframe>';
	var sec3 = '';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('minesweeper/mine-menu-icon.png', 'Minesweeper', widgetHTML, true, true, true, true, 244, 310, 'win_wid_ms_dialog');
	$( '#win_wid_ms_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_ms_input' ).on('input', function() {
		var tbVal = $( '#win_wid_ms_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_ms_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_ms_obutton' ).prop('disabled', true);
		}
	});
}
function msOK() {
	var boxVal = $( "#win_wid_ms_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	notepadClose();
}
function msCancel() {
	notepadClose();
}
function msBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function msClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_ms_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}



function tetris(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_tetris" );
			$( ".win_titlebar_tetris" ).toggleClass( "win_titb_tetris" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_tetris" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/tetris.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_tetris_tgt"></div><div id="win_wid_tetris_container"> <div id="win_wid_tetris_container_inside"> <div id="win_wid_tetris_icondiv"> ';
	var sec2 = '<iframe style="overflow: hidden;height:398px;width:304px;" src="tetris/tetris.html" title="description"></iframe>';
	var sec3 = '';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('tetris/tetris-icon.png', 'Tetris', widgetHTML, true, true, true, true, 304, 393, 'win_wid_ms_dialog');
	$( '#win_wid_tetris_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_tetris_input' ).on('input', function() {
		var tbVal = $( '#win_wid_tetris_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_tetris_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_tetris_obutton' ).prop('disabled', true);
		}
	});
}
function tetrisOK() {
	var boxVal = $( "#win_wid_tetris_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	notepadClose();
}
function tetrisCancel() {
	notepadClose();
}
function tetrisBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function tetrisClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_tetris_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}


function spacejam(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_spacejam" );
			$( ".win_titlebar_spacejam" ).toggleClass( "win_titb_spacejam" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_spacejam" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/spacejam.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_spacejam_tgt"></div><div id="win_wid_spacejam_container"> <div id="win_wid_spacejam_container_inside"> <div id="win_wid_spacejam_icondiv"> ';
	var sec2 = '<iframe style="height:600px;width:825px;" src="https://cloutius.github.io/this_is_not_my_family/" title="description"></iframe>';
	var sec3 = '';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/internet.png', 'Internet Explorer', widgetHTML, true, true, true, true, 825, 600, 'win_wid_spacejam_dialog');
	$( '#win_wid_spacejam_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_spacejam_input' ).on('input', function() {
		var tbVal = $( '#win_wid_spacejam_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_spacejam_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_spacejam_obutton' ).prop('disabled', true);
		}
	});
}
function spacejamOK() {
	var boxVal = $( "#win_wid_spacejam_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	spacejamClose();
}
function tetrisCancel() {
	spacejamClose();
}
function spacejamBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function spacejamClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_spacejam_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}



function paint(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_paint" );
			$( ".win_titlebar_paint" ).toggleClass( "win_titb_paint" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_paint" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/paint.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_paint_tgt"></div><div id="win_wid_paint_container"> <div id="win_wid_paint_container_inside"> <div id="win_wid_paint_icondiv"> ';
	var sec2 = '<iframe style="overflow: hidden;height:525px;width:690px;" src="https://jspaint.app/#local:e56e3be8ea65a" title="description"></iframe>';
	var sec3 = '';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/paint.png', 'MS Paint', widgetHTML, true, true, true, true, 690, 525, 'win_wid_paint_dialog');
	$( '#win_wid_paint_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_paint_input' ).on('input', function() {
		var tbVal = $( '#win_wid_paint_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_paint_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_paint_obutton' ).prop('disabled', true);
		}
	});
}
function paintOK() {
	var boxVal = $( "#win_wid_paint_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	spacejamClose();
}
function paintCancel() {
	spacejamClose();
}
function paintBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function paintClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_paint_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}



function spotify(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_spotify" );
			$( ".win_titlebar_spotify" ).toggleClass( "win_titb_spotify" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_spotify" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/spotify.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_spotify_tgt"></div><div id="win_wid_spotify_container"> <div id="win_wid_spotify_container_inside"> <div id="win_wid_spotify_icondiv"> ';
	var sec2 = '<iframe style="border: 2px solid #c0c0c0;" src="https://open.spotify.com/embed/playlist/13SNFzQR2ufBJBoP9maXMG?utm_source=generator" width="600" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>';
	var sec3 = '';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/music.png', 'Spotify', widgetHTML, true, true, true, true, 600, 380, 'win_wid_spotify_dialog');
	$( '#win_wid_spotify_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_spotify_input' ).on('input', function() {
		var tbVal = $( '#win_wid_spotify_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_spotify_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_spotify_obutton' ).prop('disabled', true);
		}
	});
}
function spotifyOK() {
	var boxVal = $( "#win_wid_spotify_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	spotifyClose();
}
function spotifyCancel() {
	spotifyClose();
}
function spotifyBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function spotifyClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_spotify_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}


function wallpaper(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_wallpaper" );
			$( ".win_titlebar_wallpaper" ).toggleClass( "win_titb_wallpaper" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_wallpaper" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/wallpaper.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_wallpaper_tgt"></div><div id="win_wid_wallpaper_container"> <div id="win_wid_spotify_wallpaper_inside"> <div id="win_wid_wallpaper_icondiv">';
	var sec2 = '<img width="460"height="400" draggable=false src="system/images/backgroundmenu.png"> <button id="win_wid_run_obutton" style="left:370px;top:365px;" onClick="wallpaperClose()">OK</button>';
	var sec3 = '<div style="position:absolute;margin-top:-140px;margin-left:174px;height:65px;width:140px;border:1px solid #ccc;font:12px notbold, Serif;overflow-x:hidden;"> <a onclick="bgChanger()">Background 1 (Default)</a> <a onclick="bgChanger2()">Background 2&emsp;&emsp;</a> <a onclick="bgChanger3()">Background 3</a> <a onclick="bgChanger4()">Background 4</a> <a onclick="bgChanger5()">Background 5</a> <a onclick="bgChanger6()">Background 6</a> <a onclick="bgChanger7()">Background 7</a> <a onclick="bgChanger8()">Background 8</a> </div>';
	var sec4 = '<a style="position:absolute;top:240px;left:142px;font:12px notbold"> Wallpaper </a>';
	var sec5 = '<a style="position:absolute;top:13px;left:18px;font:13px notbold"> Background </a>';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/icons/settings24.png', 'Display Properties', widgetHTML, true, true, true, true, 454, 380, 'win_wid_wallpaper_dialog');
	$( '#win_wid_wallpaper_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_wallpaper_input' ).on('input', function() {
		var tbVal = $( '#win_wid_wallpaper_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_wallpaper_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_wallpaper_obutton' ).prop('disabled', true);
		}
	});
}
function wallpaperOK() {
	var boxVal = $( "#win_wid_wallpaper_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	spotifyClose();
}
function wallpaperCancel() {
	spotifyClose();
}
function wallpaperBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function wallpaperClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_wallpaper_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}



function calender(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_calender" );
			$( ".win_titlebar_calender" ).toggleClass( "win_titb_calender" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_calender" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/calender.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_calender_tgt"></div><div id="win_wid_calender_container"> <div id="win_wid_calender_wallpaper_inside"> <div id="win_wid_calender_icondiv">';
	var sec2 = '<iframe style="margin-left:-10px;margin-top:-10px;border-color:transparent;height:500px;width:610px;font-family: notbold" src="calender/index.html">';
	var sec3 = '</iframe>';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/clock.png', 'Date/Time Properties', widgetHTML, true, true, true, true, 587, 500, 'win_wid_calender_dialog');
	$( '#win_wid_calender_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_calender_input' ).on('input', function() {
		var tbVal = $( '#win_wid_calender_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_calender_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_calender_obutton' ).prop('disabled', true);
		}
	});
}
function calenderOK() {
	var boxVal = $( "#win_wid_calender_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	calenderClose();
}
function calenderCancel() {
	calenderClose();
}
function calenderBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function calenderClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_calender_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	calenderClose(win_num);
}



function mp(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_mp" );
			$( ".win_titlebar_mp" ).toggleClass( "win_titb_mp" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_mp" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/mp.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_mp_tgt"></div><div id="win_wid_mp_container"> <div id="win_wid_mp_container_inside"> <div id="win_wid_mp_icondiv"> ';
	var sec2 = '<iframe style="overflow: hidden;height:280px;width:410px;font-family: notbold" src="musicplayer/index.html" title="description"></iframe>';
	var sec3 = '';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/music.png', 'Music Player', widgetHTML, true, true, true, true, 410, 300, 'win_wid_mp_dialog');
	$( '#win_wid_mp_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_mp_input' ).on('input', function() {
		var tbVal = $( '#win_wid_mp_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_mp_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_mp_obutton' ).prop('disabled', true);
		}
	});
}
function mpOK() {
	var boxVal = $( "#win_wid_mp_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	notepadClose();
}
function mpCancel() {
	mpClose();
}
function mpBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function mpClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_mp_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}



function help(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_help" );
			$( ".win_titlebar_help" ).toggleClass( "win_titb_help" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_help" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/help.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_help_tgt"></div><div id="win_wid_help_container"> <div id="win_wid_help_wallpaper_inside"> <div id="win_wid_help_icondiv">';
	var sec2 = '<img width="500"height="300" draggable=false src="system/images/helpmenu.png">';
	var sec3 = '';
	var sec4 = '<a style="position:absolute;top:20px;left:160px;font:14px bold"> &quot;We fear rejection, want attention, crave affection, and dream of perfection.&quot; - Mac Miller </a>';
	var sec5 = '<a style="position:absolute;top:100px;left:160px;font:14px bold"><u>No Help For You.</ul></a>';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/icons/help24.png', 'Help', widgetHTML, true, true, true, true, 494, 380, 'win_wid_help_dialog');
	$( '#win_wid_help_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_help_input' ).on('input', function() {
		var tbVal = $( '#win_wid_help_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_help_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_help_obutton' ).prop('disabled', true);
		}
	});
}
function helpOK() {
	var boxVal = $( "#win_wid_help_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	helpClose();
}
function helpCancel() {
	helpClose();
}
function helpBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function helpClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_help_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}



function bb(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_bb" );
			$( ".win_titlebar_bb" ).toggleClass( "win_titb_bb" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_bb" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/spacejam.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_bb_tgt"></div><div id="win_wid_bb_container"> <div id="win_wid_bb_container_inside"> <div id="win_wid_bb_icondiv"> ';
	var sec2 = '<iframe style="overflow: hidden;height:600px;width:825px;" src="https://web.archive.org/web/19961224041615/http://www.blockbuster.com/" title="description"></iframe>';
	var sec3 = '';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/internet.png', 'Internet Explorer', widgetHTML, true, true, true, true, 825, 600, 'win_wid_bb_dialog');
	$( '#win_wid_bb_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_bb_input' ).on('input', function() {
		var tbVal = $( '#win_wid_bb_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_bb_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_bb_obutton' ).prop('disabled', true);
		}
	});
}
function bbOK() {
	var boxVal = $( "#win_wid_bb_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	bbClose();
}
function bbCancel() {
	bbClose();
}
function bbBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function bbClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_bb_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}




function comment(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_comment" );
			$( ".win_titlebar_comment" ).toggleClass( "win_titb_comment" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_comment" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/comment.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_comment_tgt"></div><div id="win_wid_comment_container"> <div id="win_wid_comment_container_inside"> <div id="win_wid_comment_icondiv"> ';
	var sec2 = '<iframe src="https://www3.cbox.ws/box/?boxid=3515228&boxtag=qc6VxF" width="600px" height="450px" allowtransparency="yes" allow="autoplay" frameborder="0" marginheight="0" marginwidth="0" scrolling="auto"></iframe>';
	var sec3 = '';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/icons/find24.png', 'Comments', widgetHTML, true, true, true, true, 596, 380, 'win_wid_comment_dialog');
	$( '#win_wid_comment_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_comment_input' ).on('input', function() {
		var tbVal = $( '#win_wid_comment_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_comment_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_comment_obutton' ).prop('disabled', true);
		}
	});
}
function commentOK() {
	var boxVal = $( "#win_wid_comment_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	spotifyClose();
}
function commentCancel() {
	commentClose();
}
function commentBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function commentClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_comment_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}




function conpan(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_conpan" );
			$( ".win_titlebar_conpan" ).toggleClass( "win_titb_conpan" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_conpan" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/conpan.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_conpan_tgt"></div><div id="win_wid_conpan_container"> <div id="win_wid_conpan_container_inside"> <div id="win_wid_conpan_icondiv"> <img src="system/images/conpan2.png">';
	var sec2 = '</div><textarea class="conpantextarea" type="text" name="Conpan" style="overflow:scroll;overflow-x:hidden;resize:none;height:361px;width:445px;border:0px solid transparent;position:relative;left:0px;top:0px;"></textarea>';
	var sec3 = '<p id="win_wid_conpan_opent">';
	var sec4 = '<p class="win_wid_conpan_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:7px;">F</p><p style="position:absolute;top:-35px;left:14px;" class="win_wid_conpan_container_text">ile</p>';
	var sec5 = '<p class="border_test"></p> <img class="win_wid_conpan_container_text" style="width:48px;height:48px;position:absolute;top:5px;left:20px;" src="system/images/mypc.png" ondblclick="system(true)"> <p class="win_wid_conpan_container_text" style="position:absolute;top:45px;left:18px;" >System</p><img class="win_wid_conpan_container_text" style="width:44px;height:44px;position:absolute;top:5px;left:120px;" src="system/images/display.png" ondblclick="wallpaper(true)"> <p class="win_wid_conpan_container_text" style="position:absolute;top:45px;left:118px;" >Display</p><img class="win_wid_conpan_container_text" style="width:44px;height:44px;position:absolute;top:5px;left:215px;" src="system/images/fonts.png" ondblclick="display(true)"> <p class="win_wid_conpan_container_text" style="position:absolute;top:45px;left:220px;" >Fonts</p><img class="win_wid_conpan_container_text" style="width:44px;height:44px;position:absolute;top:5px;left:305px;" src="system/images/mouse.png" ondblclick="mouse(true)"> <p class="win_wid_conpan_container_text" style="position:absolute;top:45px;left:310px;">Mouse</p>';
	var sec6 = '<p class="win_wid_conpan_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:46px;">E</p><p style="position:absolute;top:-35px;left:53px;" class="win_wid_conpan_container_text">dit</p>';
	var sec7 = '<p class="win_wid_conpan_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:83px;">S</p><p style="position:absolute;top:-35px;left:90px;" class="win_wid_conpan_container_text">earch</p>';
	var sec8 = '<p class="win_wid_conpan_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:143px;">H</p><p style="position:absolute;top:-35px;left:152px;" class="win_wid_conpan_container_text">elp</p>';
	var sec9 = '</pre> <div id="win_wid_conpan_container_indent">';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8 + sec9; // combine html code
	// time to make the widgets...
	makeWidget('system/images/conpan2.png', 'Control Panel', widgetHTML, true, true, true, true, 462, 350, 'win_wid_conpan_dialog');
	$( '#win_wid_conpan_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_conpan_input' ).on('input', function() {
		var tbVal = $( '#win_wid_conpan_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_conpan_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_conpan_obutton' ).prop('disabled', true);
		}
	});
}
function conpanOK() {
	var boxVal = $( "#win_wid_conpan_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	conpanClose();
}
function conpanCancel() {
	conpanClose();
}
function conpanBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function conpanClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_conpan_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}




function system(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_system" );
			$( ".win_titlebar_system" ).toggleClass( "win_titb_system" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_system" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/system.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_system_tgt"></div><div id="win_wid_system_container"> <div id="win_wid_system_inside"> <div id="win_wid_system_icondiv">';
	var sec2 = '<img width="460"height="500" draggable=false src="system/images/system.png"> <button id="win_wid_run_obutton" style="left:373px;top:463px;" onClick="systemClose()">OK</button>';
	var sec3 = '';
	var sec4 = '<a style="position:absolute;top:57px;left:239px;font:13px notbold;color:black"> System: </a><a style="position:absolute;top:78px;left:257px;font:13px notbold;color:black"> Microsoft Windows 95 </a><a style="position:absolute;top:99px;left:260px;font:13px notbold;color:black"> 4.00.950 C </a>';
	var sec5 = '<a style="position:absolute;top:13px;left:18px;font:13px notbold"> General </a>';
	var sec6 = '<a style="position:absolute;top:150px;left:239px;font:13px notbold;color:black"> Registered to: </a><a style="position:absolute;top:170px;left:257px;font:13px notbold;color:black"> Nawrah Insaf Kouri </a><a style="position:absolute;top:192px;left:260px;font:13px notbold;color:black"> 01000-0EM-0123456-01000 </a>';
	var sec7 = '<a style="position:absolute;top:270px;left:239px;font:13px notbold;color:black"> Computer: </a><a style="position:absolute;top:290px;left:257px;font:13px notbold;color:black"> 33MHz Intel Pentium Pro </a><a style="position:absolute;top:312px;left:260px;font:13px notbold;color:black"> 16.0MB RAM </a>';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget(false , 'System Properties', widgetHTML, true, true, true, true, 455, 380, 'win_wid_system_dialog');
	$( '#win_wid_system_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_system_input' ).on('input', function() {
		var tbVal = $( '#win_wid_system_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_system_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_system_obutton' ).prop('disabled', true);
		}
	});
}
function systemOK() {
	var boxVal = $( "#win_wid_system_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	systemClose();
}
function systemCancel() {
	systemClose();
}
function systemBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function systemClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_system_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}




function display(start) { // DISPLAY IS ACTUALLY FONTS!!!
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_display" );
			$( ".win_titlebar_display" ).toggleClass( "win_titb_display" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_display" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/display.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_display_tgt"></div><div id="win_wid_display_container"> <div id="win_wid_display_container_inside"> <div id="win_wid_display_icondiv"> <img src="system/images/folder.png"> ';
	var sec2 = '</div><textarea readonly class="notepadtextarea" type="text" name="Notepad" style="overflow:scroll;resize:none;height:361px;width:627px;border:0px solid transparent;position:relative;left:0px;top:0px;"></textarea>';
	var sec3 = '</p> <img class="win_wid_conpan_container_text" style="width:40px;height:40px;position:absolute;top:5px;left:20px;" src="system/images/bluefont.png"> <p class="win_wid_conpan_container_text" style="position:absolute;top:40px;left:25px;" >Arial</p><img class="win_wid_conpan_container_text" style="width:40px;height:40px;position:absolute;top:5px;left:100px;" src="system/images/bluefont.png"> <p class="win_wid_conpan_container_text" style="position:absolute;top:40px;left:95px;" >Verdana</p><img class="win_wid_conpan_container_text" style="width:40px;height:40px;position:absolute;top:5px;left:180px;" src="system/images/redfont.png"> <p class="win_wid_conpan_container_text" style="position:absolute;top:40px;left:162px;" >MS Sans Serif</p>';
	var sec4 = '';
	var sec5 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:7px;">F</p><p style="position:absolute;top:-35px;left:14px;" class="win_wid_conpan_container_text">ile</p>';
	var sec6 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:46px;">E</p><p style="position:absolute;top:-35px;left:53px;" class="win_wid_display_container_text">dit</p>';
	var sec7 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:83px;">S</p><p style="position:absolute;top:-35px;left:90px;" class="win_wid_display_container_text">earch</p>';
	var sec8 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:143px;">H</p><p style="position:absolute;top:-35px;left:152px;" class="win_wid_display_container_text">elp</p>';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/folder.png', 'Fonts', widgetHTML, true, true, true, true, 640, 350, 'win_wid_display_dialog');
	$( '#win_wid_display_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_display_input' ).on('input', function() {
		var tbVal = $( '#win_wid_display_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_display_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_display_obutton' ).prop('disabled', true);
		}
	});
}
function displayOK() {
	var boxVal = $( "#win_wid_display_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	displayClose();
}
function displayCancel() {
	displayClose();
}
function notepadBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function displayClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_display_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}




function mouse(start) { // DISPLAY IS ACTUALLY FONTS!!!
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_mouse" );
			$( ".win_titlebar_mouse" ).toggleClass( "win_titb_mouse" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_mouse" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/mouse.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_system_tgt"></div><div id="win_wid_system_container"> <div id="win_wid_system_inside"> <div id="win_wid_system_icondiv">';
	var sec2 = '<img width="480"height="500" draggable=false src="system/images/mousemenu.png"> <button id="win_wid_run_obutton" style="left:395px;top:463px;" onClick="systemClose()">OK</button>';
	var sec3 = '<img draggable=false style="width:85px;height:80px;position:absolute;top:320px;left:325px;" src="system/images/jackbox2.gif">';
	var sec4 = '';
	var sec5 = '';
	var sec6 = '';
	var sec7 = '';
	var sec8 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget(false, 'Mouse Properties', widgetHTML, true, true, true, true, 475, 350, 'win_wid_mouse_dialog');
	$( '#win_wid_mouse_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_mouse_input' ).on('input', function() {
		var tbVal = $( '#win_wid_mouse_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_mouse_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_mouse_obutton' ).prop('disabled', true);
		}
	});
}
function mouseOK() {
	var boxVal = $( "#win_wid_mouse_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	mouseClose();
}
function mouseCancel() {
	mouseClose();
}
function mouseBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function mouseClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_mouse_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}




function mypc(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_mypc" );
			$( ".win_titlebar_mypc" ).toggleClass( "win_titb_mypc" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_mypc" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/mypc.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_mypc_tgt"></div><div id="win_wid_mypc_container"> <div id="win_wid_mypc_container_inside"> <div id="win_wid_mypc_icondiv"> <img src="system/images/mypc2.png">';
	var sec2 = '</div><textarea class="conpantextarea" type="text" name="Conpan" style="overflow:scroll;overflow-x:hidden;resize:none;height:200px;width:245px;border:0px solid transparent;position:relative;left:0px;top:0px;"></textarea>';
	var sec3 = '<p id="win_wid_mypc_opent">';
	var sec4 = '<p class="win_wid_mypc_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:7px;">F</p><p style="position:absolute;top:-35px;left:14px;" class="win_wid_mypc_container_text">ile</p>';
	var sec5 = '<img class="win_wid_mypc_container_text" style="width:48px;height:48px;position:absolute;top:5px;left:20px;" src="system/images/drive2.png" onclick="snd.play()" ondblclick="error(true)"> <p class="win_wid_conpan_container_text" style="position:absolute;top:45px;left:14px;" >Removable<br>&nbsp;&nbsp;&nbsp;Disk (A:)</br></p><img class="win_wid_mypc_container_text" style="width:44px;height:44px;position:absolute;top:5px;left:120px;" src="system/images/drive1.png" ondblclick="wallpaper(true)"> <p class="win_wid_mypc_container_text" style="position:absolute;top:45px;left:103px;" >Windows 95<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C:)</br></p><img class="win_wid_mypc_container_text" style="width:48px;height:48px;position:absolute;top:110px;left:20px;" src="system/images/conpan3.png" ondblclick="conpan(true)"> <p class="win_wid_conpan_container_text" style="position:absolute;top:150px;left:10px;" >Control Panel</p>';
	var sec6 = '<p class="win_wid_mypc_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:46px;">E</p><p style="position:absolute;top:-35px;left:53px;" class="win_wid_mypc_container_text">dit</p>';
	var sec7 = '<p class="win_wid_mypc_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:83px;">S</p><p style="position:absolute;top:-35px;left:90px;" class="win_wid_mypc_container_text">earch</p>';
	var sec8 = '<p class="win_wid_mypc_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:143px;">H</p><p style="position:absolute;top:-35px;left:152px;" class="win_wid_mypc_container_text">elp</p>';
	var sec9 = '</pre> <div id="win_wid_mypc_container_indent">';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8 + sec9; // combine html code
	// time to make the widgets...
	makeWidget('system/images/mypc2.png', 'My Computer', widgetHTML, true, true, true, true, 260, 200, 'win_wid_mypc_dialog');
	$( '#win_wid_mypc_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_mypc_input' ).on('input', function() {
		var tbVal = $( '#win_wid_mypc_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_mypc_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_mypc_obutton' ).prop('disabled', true);
		}
	});
}
function mypcOK() {
	var boxVal = $( "#win_wid_mypc_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	mypcClose();
}
function mypcCancel() {
	mypcClose();
}
function mypcBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function mypcClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_mypc_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}



function error(start) { // the run box
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_error" );
			$( ".win_titlebar_error" ).toggleClass( "win_titb_error" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_error" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/error.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_error_tgt"></div><div id="win_wid_error_container"> <div id="win_wid_error_container_inside"> <div id="win_wid_error_icondiv">';
	var sec2 = '';
	var sec3 = '';
	var sec4 = '<img style="width:48px;height:48px;position:absolute;top:-25px;left:0px;" src="system/icons/error.png"></div>';
	var sec5 = '<p class="win_wid_error_container_text" style="position:aboslute;left:85px;top:-20px;"> A:&bsol; is not accessible<br></br><br> The device is not ready</br></p>';
	var sec6 = '<button id="win_wid_error_obutton" style="position:absolute;top:75px;left:165px;" onClick="errorClose()">Cancel</button>';
	var sec7 = '';
	var sec8 = '';
	var sec9 = '';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8 + sec9; // combine html code
	// time to make the widgets...
	makeWidget(false, 'Removable Disk (A:)', widgetHTML, false, true, true, true, 250, 140, "win_wid_error_dialog");
	$( '#win_wid_error_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_error_input' ).on('input', function() {
		var tbVal = $( '#win_wid_error_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_error_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_error_obutton' ).prop('disabled', true);
		}
	});
}
function errorOK() {
	var boxVal = $( "#win_wid_error_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	errorClose();
}
function errorCancel() {
	errorClose();
}
function errorBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function errorClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_error_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}





function folder(start) { //
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_folder" );
			$( ".win_titlebar_folder" ).toggleClass( "win_titb_folder" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_folder" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/folder.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_display_tgt"></div><div id="win_wid_display_container"> <div id="win_wid_display_container_inside"> <div id="win_wid_display_icondiv"> <img src="system/images/folder.png"> ';
	var sec2 = '</div><textarea readonly class="notepadtextarea" type="text" name="Notepad" style="overflow:scroll;resize:none;height:361px;width:627px;border:0px solid transparent;position:relative;left:0px;top:0px;"></textarea>';
	var sec3 = '</p> <img class="win_wid_conpan_container_text" style="width:40px;height:40px;position:absolute;top:5px;left:20px;" src="system/icons/painting.png" ondblclick="picture1(true)"> <p class="win_wid_conpan_container_text" style="position:absolute;top:40px;left:30px;">001</p><img class="win_wid_conpan_container_text" style="width:40px;height:40px;position:absolute;top:5px;left:100px;" src="system/icons/painting.png"> <p class="win_wid_conpan_container_text" style="position:absolute;top:40px;left:110px;" >002</p><img class="win_wid_conpan_container_text" style="width:40px;height:40px;position:absolute;top:5px;left:180px;" src="system/icons/painting.png"> <p class="win_wid_conpan_container_text" style="position:absolute;top:40px;left:190px;" >003</p>';
	var sec4 = '';
	var sec5 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:7px;">F</p><p style="position:absolute;top:-35px;left:14px;" class="win_wid_conpan_container_text">ile</p>';
	var sec6 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:46px;">E</p><p style="position:absolute;top:-35px;left:53px;" class="win_wid_display_container_text">dit</p>';
	var sec7 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:83px;">S</p><p style="position:absolute;top:-35px;left:90px;" class="win_wid_display_container_text">earch</p>';
	var sec8 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:143px;">H</p><p style="position:absolute;top:-35px;left:152px;" class="win_wid_display_container_text">elp</p>';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/images/folder2.png', 'Pictures', widgetHTML, true, true, true, true, 640, 350, 'win_wid_display_dialog');
	$( '#win_wid_folder_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_folder_input' ).on('input', function() {
		var tbVal = $( '#win_wid_folder_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_folder_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_folder_obutton' ).prop('disabled', true);
		}
	});
}
function folderOK() {
	var boxVal = $( "#win_wid_folder_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	folderClose();
}
function folderCancel() {
	folderClose();
}
function notepadBrowse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function folderClose() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_folder_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}


function picture1(start) { //
	// toggle Start menu if launched from there
	if(start == false) {
		$( "#win_start" ).toggle(0, function(){
			$( ".win_titlebar" ).toggleClass( "win_titb_picture1" );
			$( ".win_titlebar_picture1" ).toggleClass( "win_titb_picture1" );
			$( ".win_tb_button" ).toggleClass( "win_tb_button_picture1" );
		});
	}
	// add in the run.js include into <head>
	var runJsLink = $("<script src='system/widgetjs/picture1.js'>");
    $("head").append(runJsLink);
	//html code below
	var sec1 = '<div class="win_wid_picture1_tgt"></div><div id="win_wid_picture1_container"> <div id="win_wid_picture1_container_inside"> <div id="win_wid_picture1_icondiv"> <img src="system/images/folder.png"> ';
	var sec2 = '</div><img draggable=false style="position:absolute;top:0px;left:-5px;" src="system/images/picture1.png">';
	var sec3 = '<img draggable=false style="width:472px;height:462px;position:absolute;top:5px;left:135px;" src="system/images/art.gif">';
	var sec4 = '';
	var sec5 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:7px;">F</p><p style="position:absolute;top:-35px;left:14px;" class="win_wid_conpan_container_text">ile</p>';
	var sec6 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:46px;">E</p><p style="position:absolute;top:-35px;left:53px;" class="win_wid_display_container_text">dit</p>';
	var sec7 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:83px;">S</p><p style="position:absolute;top:-35px;left:90px;" class="win_wid_display_container_text">earch</p>';
	var sec8 = '<p class="win_wid_display_container_text" style="text-decoration: underline;position:absolute;top:-35px;left:143px;">H</p><p style="position:absolute;top:-35px;left:152px;" class="win_wid_display_container_text">elp</p>';
	var widgetHTML = sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8; // combine html code
	// time to make the widgets...
	makeWidget('system/icons/painting.png', '001.png', widgetHTML, true, true, true, true, 626, 650, 'win_wid_display_dialog');
	$( '#win_wid_picture1_input' ).focus();
	// set "open" button active and inactive based on input value
	$( '#win_wid_picture1_input' ).on('input', function() {
		var tbVal = $( '#win_wid_picture1_input' ).val();
		if(tbVal.length > 0) { // input != empty
			$( '#win_wid_picture1_obutton' ).removeAttr('disabled');
		} else { // input is empty
			$( '#win_wid_picture1_obutton' ).prop('disabled', true);
		}
	});
}
function picture1OK() {
	var boxVal = $( "#win_wid_picture1_input" ).val();
	aliasRun(boxVal); // sends the input to the alias => JS function (run.js)
	picture1Close();
}
function folderCancel() {
	picture1Close();
}
function picture1Browse() {
	// this is just a placeholder for if/when we can browse for "executables"
}
function picture1Close() {
	// get the grandparent of the placeholder div (aka: win_window)
	var win_id = $( ".win_wid_picture1_tgt" ).parent().parent().attr('id');
	// start refining the window_id retrieved above and execute windowClose()
	var win_id_splt = win_id.split("_");
	var win_num = win_id_splt[1];
	windowClose(win_num);
}
