// JavaScript Document // Cfurku Jan-2014 //
function new_lines_change() {
	new_lines = document.getElementById('newlines').value;
	if (document.getElementById('results').innerHTML != '') {
		butify();
	}
}
function add4spaces() {
	if (document.getElementById('results').innerHTML != '')
	butify();
}
function space4comm() {
	if (document.getElementById('results').innerHTML != '')
	butify();
}
function infunc() {
	if (document.getElementById('results').innerHTML != '') {
		butify();
	}
}
var new_lines = 0;
var isStr = false;
var isComm = -1;
var isfunc = 0;
var inspace = '    ';
var inspace2 = '  ';


export function butify(source, options) {
    const {spaces=4, identBody=true, addSpaceAfter=false} = options;

	console.log(new_lines);
	//------------clear-extra-lines-and-spaces-and-put-the-code-in-clean-lines---------//
	if (spaces == 4) {
		inspace = '    ';
		inspace2 = '  ';
	}
	else if (spaces == 2) {
		inspace = '  ';
		inspace2 = ' ';
	}
	else {
		inspace = '';
		inspace2 = '';
	}
	
	if (new_lines > 0) {
		if (new_lines == 1)
			source = source.replace(/^\s*\n/gm, '\n');
		if (new_lines > 1) {
			var source2 = source.split('\n');
			var s = 0;
			var source3 = '';
			for (var n = 0; n < source2.length; n++) {
				if (source2[n] == '') {
					if (s < new_lines) source3 += source2[n] + '\n';
					s += 1;
				}
				else {
					s = 0;
					source3 += source2[n] + '\n';
				}
			}
			source = source3;
		}
	}
	
	var gjith = '';
	var lines = source.split("\n");
	for (var i in lines) {
		var line = lines[i];
		//if (document.getElementById('chk1').value > 0) { // --in-case-we-need-no-change-- //
			line = line.replace(/^\s+|\s+$/g, ''); // remove empty spaces (para dhe pas) //
		//}
		gjith += '' + line + '\n';
		
	} //gjith = gjith.replace(/\"/g, '\'');//
	
	//-------create-hierarchy---------------------//
	
	gjith = gjith.split("\n");
	var gjith2 = '';
	var space = '';
	var kaswitch = 0;
	var kacase = 0;
	var kaof = 0;
	var isComm = -1;
	var comm_pos = -1;
	for (var j = 0; j < gjith.length; j++) {// in gjith) {
		var line2 = gjith[j];
		var para = '';
		var ndryshimet = false;
		
		if (line2.indexOf('%') > -1) { //------------------gjetja-e-komenteve----------------//
			
			comm_pos = findComm(line2);
			isComm = findComm(line2);
			
			var ccom_para = line2.substr(0, comm_pos);
			if (line2.indexOf('\'') < 0 && line2.indexOf('"') < 0) {
				ccom_para = replaces(ccom_para);
			}
			comm_pos = findComm(line2);
			if (comm_pos > 0)
				line2 = ccom_para.trim() + ' ' + line2.substr(comm_pos).trim();
			//else
				//line2 = line2.substr(0, comm_pos) + line2.substr(comm_pos);
			comm_pos = findComm(line2);
			isComm = findComm(line2);
			
			if (addSpaceAfter && line2.substr(comm_pos + 1, 1) != ' ')
				var spkot = ' ';
			else
				var spkot = '';
			
			line2 = line2.substr(0, comm_pos + 1) + spkot + line2.substr(comm_pos + 1);
		}
		//---------------------------------------
		if (line2.indexOf('\'') > -1) {
			//-----------------------------gjej-stringjet---------apostrofa-tek-----------//
			isComm = findComm(line2);
			if (isComm >= 0) {
				var str_para = line2.substr(0, isComm);
				var str_pas = line2.substr(isComm);
			} else {
				var str_para = line2;
				var str_pas = '';
			}
			var ap_arr = str_para.split('\'');
			str_arr = new Array;
			for (var apn = 0; apn < ap_arr.length; apn++) {
				if (apn % 2 == 0) {
					// --jasht-stringut-----------------//
					mstr = ap_arr[apn];
					if (mstr.indexOf('"') < 0) {
						mstr = replaces(mstr);
					}
					else {
						if (apn > 0) {
							mstr_para = mstr.substr(0, mstr.indexOf('"'));
							mstr_pas = mstr.substr(mstr.indexOf('"'));
							mstr = replaces(mstr_para) + mstr_pas;
						}
					}
					str_arr.push(mstr);
				}
				else {
					// --brenda-stringut---------------//
					str_arr.push(ap_arr[apn]);
				}
			}
			str_para = str_arr.join('\'');
			line2 = str_para + str_pas;
			
			isComm = findComm(line2);
			comm_pos = findComm(line2);
		}
		
		if (line2.indexOf('"') > -1) {
			//-----------------------------gjej-stringjet---------thonjza-dyshe-----------//
			isComm = findComm(line2);
			if (isComm >= 0) {
				var str_para = line2.substr(0, isComm);
				var str_pas = line2.substr(isComm);
			} else {
				var str_para = line2;
				var str_pas = '';
			}
			var ap_arr = str_para.split('"');
			str_arr = new Array;
			for (var apn = 0; apn < ap_arr.length; apn++) {
				if (apn % 2 == 0) {
					// --jasht-stringut-----------------//
					mstr = ap_arr[apn];
					if (mstr.indexOf("'") < 0) {
						mstr = replaces(mstr);
					}
					else {
						if (apn > 0) {
							mstr_para = mstr.substr(0, mstr.indexOf("'"));
							mstr_pas = mstr.substr(mstr.indexOf("'"));
							mstr = replaces(mstr_para) + mstr_pas;
						}
					}
					str_arr.push(mstr);
				}
				else {
					// --brenda-stringut---------------//
					str_arr.push(ap_arr[apn]);
				}
			}
			str_para = str_arr.join('"');
			line2 = str_para + str_pas;
			
			isComm = findComm(line2);
			comm_pos = findComm(line2);
		}
		
		
		if (line2.indexOf('%') < 0 && line2.indexOf('\'') < 0 && line2.indexOf('"') < 0) {
			//---normal-line------------------------------
			line2 = replaces(line2);
		}
		//-----------------------------------------------
		if (line2.indexOf('function') == 0) {
			isfunc = space.length;
		}
		
			if (line2.indexOf('function') == 0 || line2.indexOf('for ') == 0 || line2.indexOf('if ') == 0 || line2.indexOf('switch') == 0 || line2.indexOf('begin') == 0 || line2.indexOf('while') == 0 || line2.indexOf('classdef') == 0 || line2.indexOf('properties') == 0 || line2.indexOf('methods') == 0 || line2.indexOf('events') == 0 || line2.indexOf('try') == 0) {
				if (line2.indexOf('switch') == 0) {
					kaswitch = 1;
				}
				
				if (line2.indexOf('function') == 0 && identBody == false) {
					gjith2 += space + line2 + "\n";
				} else {
					gjith2 += space + line2 + "\n";
					space += inspace; //
				}
			}
			else if (line2.indexOf('case ') == 0){ // case of CASE //---------
				if (kacase == 0) {
					gjith2 += space + line2 + "\n";
					kacase = 1;
					if (kaswitch == 1) {
						space += inspace;
					}
					else {
						space += inspace2;
					}
				}
				else {
					if (kaswitch == 1) {
						space = space.replace(inspace, '');
						gjith2 += space + line2 + "\n";
						space += inspace;
					}
					else {
						space = space.replace(inspace2, '');
						gjith2 += space + line2 + "\n";
						space += inspace2;
					}
				}
			}
			else if (line2.indexOf('of ') == 0){ // state of OF //---------
				if (kaof == 0) {
					gjith2 += space + line2 + "\n";
					space += inspace2;
					kaof = 1;
				}
				else {
					space = space.replace(inspace2, '');
					gjith2 += space + line2 + "\n";
					space += inspace2;
				}
			}
			else {
				if (line2.indexOf('end_case') == 0) {
					space = space.replace(inspace2, '');
					space = space.replace(inspace2, '');
					gjith2 += space + line2 + "\n";
					kaof = 0;
					kacase = 0;
				}
				else if (line2.indexOf('end_proc') == 0) {
					space = space.replace(inspace, '');
					gjith2 += space + line2 + "\n";
				}
				else if (line2.indexOf('end') == 0) {
					if (kaswitch == 1) {
						space = space.replace(inspace, '');
					}
					if (space.length == isfunc && identBody == false) {
						gjith2 += space + line2 + "\n";
						isfunc -= inspace.length;
					} else {
						space = space.replace(inspace, '');
						gjith2 += space + line2 + "\n";
						kacase = 0;
						kaswitch = 0;
					}
				}
				else if (line2.indexOf('else') == 0) {
					space = space.replace(inspace, '');
					gjith2 += space + line2 + "\n";
					space += inspace;
				}
				else if (line2.indexOf('catch') == 0) {
					space = space.replace(inspace, '');
					gjith2 += space + line2 + "\n";
					space += inspace;
				}
				else if (line2.indexOf('otherwise') == 0) {
					if (kaswitch == 1) {
						space = space.replace(inspace, '');
						gjith2 += space + line2 + "\n";
						space += inspace;
					}
					else {
	
						space = space.replace(inspace2, '');
						gjith2 += space + line2 + "\n";
						space += inspace2;
					}
				}
				else {
					gjith2 += space + line2 + "\n";
				}
			}
		
		if (line2.indexOf('...') > -1) { // if lines break with '...'
			if (isComm > -1) {
				if (line2.indexOf('...') < isComm) {
					gjith2 = gjith2 + '  ';
				}
			}
			else {
				gjith2 = gjith2 + '  ';
			}
		}
	}
	
	gjith2 = gjith2.replace(/  \n/g, '\n');
	gjith2 = gjith2.replace(/ \n/g, '\n');
	// document.getElementById('text_field').value = gjith2;
	
	return toHtml(gjith2);
}


function findComm(line) {
	if (line.indexOf('%') > -1) {
		var ddfill = 0;
		for (var k = 0; k < line.match(/\%/g).length; k++) {
			var ddpara = line.substr(0, line.indexOf('%', ddfill)) || '';
			if (ddpara.indexOf('\'') > -1)
				var ddcop = ddpara.match(/\'/g).length;
			else
				var ddcop = 0;
			if (ddcop == 0 || ddcop % 2 == 0) {
				var retComm = line.indexOf('%', ddfill);
				break;
			}
			ddfill = line.indexOf('%', ddfill) + 1;
		}
	} else {
		var retComm = (-1);
	}
	return retComm;
}

function checkBracket1(data) {
	
	if (data.indexOf('(') > -1) var arr_left = data.split("(").length - 1; else var arr_left = 0;
	if (data.indexOf(')') > -1) var arr_right = data.split(")").length - 1; else var arr_right = 0;
	if (arr_left == arr_right) {
		//alert('ok');
		return true;
	}
	else {
		return false;
	}
}
function checkBracket2(data) {
	
	if (data.indexOf('[') > -1) var arr_left = data.split("[").length - 1; else var arr_left = 0;
	if (data.indexOf(']') > -1) var arr_right = data.split("]").length - 1; else var arr_right = 0;
	if (arr_left == arr_right) {
		//alert('ok');
		return true;
	}
	else {
		return false;
	}
}
function checkBracket3(data) {
	
	if (data.indexOf('{') > -1) var arr_left = data.split("{").length - 1; else var arr_left = 0;
	if (data.indexOf('}') > -1) var arr_right = data.split("}").length - 1; else var arr_right = 0;
	if (arr_left == arr_right) {
		//alert('ok');
		return true;
	}
	else {
		return false;
	}
}

function fix(val, symb) {
  var main_arr = val.split(symb);
  var new_arr = new Array;
  for (var i in main_arr) {
	  new_arr.push(main_arr[i].replace(/\s+/g, ' '));
  }
  var result2 = new_arr.join(' ' + symb + ' ');
  
  return result2;
}

function replaces(data) {
	data = data.replace(/\s+/g, ' ');
	data = fix(data, '+');
	data = fix(data, '-');
	data = fix(data, '*');
	data = fix(data, '/');
	data = fix(data, '\\');
	data = fix(data, '=');
	data = fix(data, '<');
	data = fix(data, '>');
	data = fix(data, '~');
	data = fix(data, '&');
	data = fix(data, '|');
	data = fix(data, '^');
	data = fix(data, ',');
	data = fix(data, ';');
	
	data = data.replace(/\. \*/g, '.*');
	data = fix(data, '.*');
	data = data.replace(/\. \^/g, '.^');
	data = fix(data, '.^');
	data = data.replace(/\. \//g, './');
	data = fix(data, './');
	data = data.replace(/\. \\/g, '.\\');
	data = fix(data, '.\\');
	data = data.replace(/\~ \=/g, '~=');
	data = fix(data, '~=');
	
	data = data.replace(/\s+/g, ' ');
	
	data = data.replace(/= =/g, '==');
	data = data.replace(/< =/g, '<=');
	data = data.replace(/> =/g, '>=');
	data = data.replace(/\+ \=/g, '+=');
	data = data.replace(/\- \=/g, '-=');
	data = data.replace(/\& \&/g, '&&');
	data = data.replace(/\| \|/g, '||');
	data = data.replace(/ \, /g, ', ');
	data = data.replace(/ \; /g, '; ');
	
	data = data.replace(/ \)/g, ')');
	data = data.replace(/ \]/g, ']');
	data = data.replace(/ \}/g, '}');
	data = data.replace(/\( /g, '(');
	data = data.replace(/\[ /g, '[');
	data = data.replace(/\{ /g, '{');
	
	data = data.replace('if(', 'if (');
	data = data.replace('while(', 'while (');
	
	data = data.replace(/\( \)/g, '()');
	data = data.replace(/\[ \]/g, '[]');
	data = data.replace(/\{ \}/g, '{}'); // jo e nevojshme //
	data = data.replace(/\^ - /g, '^ -'); // experimental //
	
	return data;
}

// function spaces(string, symbol) { // --------------------SPACES---------------------------
var err1_open = '';
var err1_close = '';
function toHtml(data) { //------------------export-to-HTML--------------------//
	
	data = data.replace(/\&/g, '&amp;');
	data = data.replace(/ /g, '&nbsp;');
	data = data.replace(/\</g, '&lt;');
	data = data.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
	
	var lines = data.split("\n");
	var alltd = '';
	var comm_posh = -1;
	var comm_kllap = -1;
	for (var i in lines) {
		var td = lines[i];
		
		//--ngjyros-funksionet------------------------
		if (td.indexOf('function') > -1) {
			td = td.substr(0, td.indexOf('function')) + '<func>' + td.substr(td.indexOf('function'), 8) + '</func>' + td.substr(td.indexOf('function') + 8);
		}
		if (td.indexOf('if&nbsp;') > -1) {
			td = td.substr(0, td.indexOf('if&nbsp;')) + '<func>' + td.substr(td.indexOf('if&nbsp;'), 2) + '</func>' + td.substr(td.indexOf('if&nbsp;') + 2);
		}
		if (td.indexOf('else') > -1) {
			td = td.substr(0, td.indexOf('else')) + '<func>' + td.substr(td.indexOf('else'), 4) + '</func>' + td.substr(td.indexOf('else') + 4);
		}
        if (td.indexOf('endif') > -1) {
			td = td.substr(0, td.indexOf('endif')) + '<func>' + td.substr(td.indexOf('endif'), 5) + '</func>' + td.substr(td.indexOf('endif') + 5);
		}
		if (td.indexOf('for&nbsp;') > -1) {
			td = td.substr(0, td.indexOf('for&nbsp;')) + '<func>' + td.substr(td.indexOf('for&nbsp;'), 3) + '</func>' + td.substr(td.indexOf('for&nbsp;') + 3);
		}
		if (td.indexOf('begin') > -1) {
			td = td.substr(0, td.indexOf('begin')) + '<func>' + td.substr(td.indexOf('begin'), 5) + '</func>' + td.substr(td.indexOf('begin') + 5);
		}
		if (td.indexOf('while') > -1) {
			td = td.substr(0, td.indexOf('while')) + '<func>' + td.substr(td.indexOf('while'), 5) + '</func>' + td.substr(td.indexOf('while') + 5);
		}
		if (td.indexOf('switch') > -1) {
			td = td.substr(0, td.indexOf('switch')) + '<func>' + td.substr(td.indexOf('switch'), 6) + '</func>' + td.substr(td.indexOf('switch') + 6);
		}
		if ((td.indexOf('case') == 0 || td.indexOf('&nbsp;case') > -1) && td.indexOf('case_') < 0) {
			td = td.substr(0, td.indexOf('case')) + '<func>' + td.substr(td.indexOf('case'), 4) + '</func>' + td.substr(td.indexOf('case') + 4);
		}
		if (td.indexOf('of&nbsp;') > -1) {
			td = td.substr(0, td.indexOf('of&nbsp;')) + '<func>' + td.substr(td.indexOf('of&nbsp;'), 2) + '</func>' + td.substr(td.indexOf('of&nbsp;') + 2);
		}
		if (td.indexOf('end_case') > -1) {
			td = td.substr(0, td.indexOf('end_case')) + '<func>' + td.substr(td.indexOf('end_case'), 8) + '</func>' + td.substr(td.indexOf('end_case') + 8);
		}
		if (td.indexOf('end_proc') > -1) {
			td = td.substr(0, td.indexOf('end_proc')) + '<func>' + td.substr(td.indexOf('end_proc'), 8) + '</func>' + td.substr(td.indexOf('end_proc') + 8);
		}
		if (((td.indexOf('end') == 0 && td.indexOf('end_') < 0) || td.indexOf('&nbsp;end') > -1)) {
			td = td.substr(0, td.indexOf('end')) + '<func>' + td.substr(td.indexOf('end'), 3) + '</func>' + td.substr(td.indexOf('end') + 3);
		}
		if (td.indexOf('otherwise') > -1) {
			td = td.substr(0, td.indexOf('otherwise')) + '<func>' + td.substr(td.indexOf('otherwise'), 9) + '</func>' + td.substr(td.indexOf('otherwise') + 9);
		}
		if (td.indexOf('classdef&nbsp;') > -1) {
			td = td.substr(0, td.indexOf('classdef&nbsp;')) + '<func>' + td.substr(td.indexOf('classdef&nbsp;'), 14) + '</func>' + td.substr(td.indexOf('classdef&nbsp;') + 14);
		}
		if (td.indexOf('properties&nbsp;') > -1) {
			td = td.substr(0, td.indexOf('properties&nbsp;')) + '<func>' + td.substr(td.indexOf('properties&nbsp;'), 16) + '</func>' + td.substr(td.indexOf('properties&nbsp;') + 16);
		}
		if (td.indexOf('methods') > -1) {
			td = td.substr(0, td.indexOf('methods')) + '<func>' + td.substr(td.indexOf('methods'), 7) + '</func>' + td.substr(td.indexOf('methods') + 7);
		}
		if (td.indexOf('events') > -1) {
			td = td.substr(0, td.indexOf('events')) + '<func>' + td.substr(td.indexOf('events'), 6) + '</func>' + td.substr(td.indexOf('events') + 6);
		}
		if (td.indexOf('return') > -1) {
			td = td.substr(0, td.indexOf('return')) + '<func>' + td.substr(td.indexOf('return'), 6) + '</func>' + td.substr(td.indexOf('return') + 6);
		}
		if (td.indexOf('break') > -1) {
			td = td.substr(0, td.indexOf('break')) + '<func>' + td.substr(td.indexOf('break'), 5) + '</func>' + td.substr(td.indexOf('break') + 5);
		}
		if (td.indexOf('try') > -1) {
			td = td.substr(0, td.indexOf('try')) + '<func>' + td.substr(td.indexOf('try'), 3) + '</func>' + td.substr(td.indexOf('try') + 3);
		}
		if (td.indexOf('catch') > -1) {
			td = td.substr(0, td.indexOf('catch')) + '<func>' + td.substr(td.indexOf('catch'), 5) + '</func>' + td.substr(td.indexOf('catch') + 5);
		}
		
		//------------------gjetja-e-komenteve-HTML----------------//
		td = err1_open + td; // ngyros backround if non-matching brackets //
		if (td.indexOf('%') > 0) {
			var ccfill = 0;
			for (var j = 0; j < td.match(/\%/g).length; j++) {
				var ccpara = td.substr(0, td.indexOf('%', ccfill)) || '';
				if (ccpara.indexOf('\'') > -1)
					var cccop = ccpara.match(/\'/g).length;
				else
					var cccop = 0;
				if (cccop == 0 || cccop % 2 == 0) {
					comm_posh = td.indexOf('%', ccfill);
					comm_kllap = comm_posh;
					td = td.substr(0, comm_posh) + '<comm>' + td.substr(comm_posh).replace(/\<func\>/g, '').replace(/<\/func\>/g, '') + '</comm>';
					break;
				}
				ccfill = td.indexOf('%', ccfill) + 1;
			}
			//td = td.substr(0, comm_posh) + '<comm>' + td.substr(comm_posh).replace(/\<func\>/g, '').replace(/<\/func\>/g, '') + '</comm>';
		}
		else if (td.indexOf('%') == 0) {
			comm_posh = 0;
			td = '<comm>' + td.replace(/\<func\>/g, '').replace(/\<\/func\>/g, '') + '</comm>';
		}
		//--------------------gjej-stringjet-----------------------//
		if (td.indexOf('\'') > -1) {
			if (comm_posh > -1) {
				var str_para = td.substr(0, comm_posh);
				var str_pas = td.substr(comm_posh);
			}
			else {
				var str_para = td;
				var str_pas = '';
			}
			if (comm_posh != 0) {
				var ap_arr = str_para.split('\'');
				str_arr = new Array;
				for (var apn = 0; apn < ap_arr.length; apn++) {
					if (apn % 2 == 0) {
						str_arr.push(ap_arr[apn]);
					}
					else {
						str_arr.push('<str>' + ap_arr[apn].replace(/\<func\>/g, '').replace(/<\/func\>/g, '') + '</str>');
					}
				}
				str_para = str_arr.join('\'');
			}
			td = str_para.replace(/\<\/str\>\'/g, '\'</str>').replace(/\'\<str\>/g, '<str>\'') + str_pas;
		}
		
		/* // --double-quote--------------
		if (td.indexOf('\"') > -1) {
			
			var ap_arr = td.split('\"');
			td = '';
			for (var apn = 0; apn < ap_arr.length - 1; apn++) {
				var metej = ap_arr[apn + 1] || '';
				td += ap_arr[apn] + '<str>\"' + metej + '\"' + '</str>'; apn += 1;
			}
			td += ap_arr[ap_arr.length - 1];
			if (comm > -1) {
				td = td.substr(0, comm) + td.substr(comm).replace(/<str>/g, '');
			}
		}
		*/
		if (comm_kllap > 0)
			var tdk = td.substr(0, comm_kllap + 6);
		else
			var tdk = td;
		
		if (tdk.indexOf('(') > -1) var l1 = tdk.match(/\(/g).length; else var l1 = 0;
		if (tdk.indexOf(')') > -1) var r1 = tdk.match(/\)/g).length; else var r1 = 0;
		if (tdk.indexOf('[') > -1) var l2 = tdk.match(/\[/g).length; else var l2 = 0;
		if (tdk.indexOf(']') > -1) var r2 = tdk.match(/\]/g).length; else var r2 = 0;
		if (tdk.indexOf('{') > -1) var l3 = tdk.match(/\{/g).length; else var l3 = 0;
		if (tdk.indexOf('}') > -1) var r3 = tdk.match(/\}/g).length; else var r3 = 0;
		
		if (l1 == r1 && l2 == r2 && l3 == r3) {	
			err1_open = '';
			err1_close = '';
		} else {
			err1_open = '<err>';
			err1_close = '</err>';
		}
		alltd += err1_open + td + err1_close + '<br />';
		err1_open = '';
		err1_close = '';
		comm_kllap = -1;
		//comm = -1;
		comm_posh = -1;
	}
	
	return alltd.slice(0, -8); // alltd // data -> no-Html //
}

function arrify(line, by) {
	var sub_arr = line.split(by);
	return sub_arr;
}

var fname = '';
function handleFileSelect(evt) {
    var files = evt.target.files;
	var cont = '';
	//var nr = 1; // autoadd index nr on multiselect
	document.getElementById('source').innerHTML = '';
	for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          
		  cont += e.target.result;
          document.getElementById('source').value = cont;
		  fname = escape(theFile.name);
		  //nr += 1;
		  butify();
        };
      })(f);

      reader.readAsText(f);
	}
}

//   document.getElementById('files').addEventListener('change', handleFileSelect, false);
  
function setData() {
	
	//document.getElementById('text_field').value = document.getElementById('results').innerHTML;
	document.getElementById('file_name').value = fname;
}

function selectFile() {
	document.getElementById('files').click();
}/*
var src_width = document.getElementById('results').clientWidth;
document.getElementById('results').style.maxWidth = (src_width - 8) + 'px';*/
function wraps() {
	if (document.getElementById('chk2').checked == true) {
		document.getElementById('source').setAttribute('wrap', 'off');
	}
	else {
		document.getElementById('source').setAttribute('wrap', 'virtual');
	}
}

function selectText(containerid) {
	//window.getSelection().removeAllRanges();
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(containerid));
		range.select();
		//cselect = range;
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(containerid));
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
		//cselect = range;
	}
}

var isCtrl = false;
var cselect = false;
document.body.onclick = divOut();
document.body.onkeyup = function(e)
{
	if(e.which == 17)
	isCtrl = false;
}

document.onkeydown = function(e) {
	if (e.which == 17)
		isCtrl = true;
	if (e.which == 65 && isCtrl == true && cselect == true) {
		selectText('results');
		return false;
	}
}
function divIn() {
	cselect = true;
}
function divOut() {
	cselect = false;
}
// var resWidth = document.getElementById('results').clientWidth;
// document.getElementById('results').style.maxWidth = resWidth - 12 + 'px';
// document.getElementById("results").style.height = (window.innerHeight - 230) + "px";
// document.getElementById("source").style.height = (window.innerHeight - 230) + "px";
// window.onresize = function () {
//     document.getElementById("results").style.height = (window.innerHeight - 230) + "px";
// 	document.getElementById('results').style.maxWidth = window.innerWidth / 2 + 3 + 'px';
// 	document.getElementById("source").style.height = (window.innerHeight - 230) + "px";
// }
