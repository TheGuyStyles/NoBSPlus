// Globals
var currentMetrics = document.getElementById(document.getElementById('sheet-menu').childNodes[2].id.split('-')[2]).getElementsByTagName('tr');
// --

function initMenuModal() {
	var dTitleRef = document.getElementById('doc-title'),
		menuBtnRef = document.createElement('input');

	menuBtnRef.setAttribute('type', 'button');
	menuBtnRef.value = 'Highlighter Menu';
	menuBtnRef.id = 'exmenu-btn';
	menuBtnRef.style.float = 'right';
	dTitleRef.appendChild(menuBtnRef);
	
	document.body.insertAdjacentHTML('beforeend', '<!-- The Modal --><div id="myModal" class="modal">  <!-- Modal content -->  <div class="modal-content">  <span class="modal-close"id="modal-cls">&times;</span>  <br>  <div id="modal-menu"><h2>RGBA Color Slider for the Row Highlighter:</h2><h4>Whatever color you chose is automatically saved *only* if the "X" is clicked to close this menu.</h4> <div><div id="rgb-cont"><fieldset><label for="r-hi">R</label><input type="range"min="0"max="255"id="r-hi"step="1"value="0"><output for="r-hi"id="r-hi_out">0</output></fieldset><fieldset><label for="g-hi">G</label><input type="range"min="0"max="255"id="g-hi"step="1"value="132"><output for="g-hi"id="g-hi_out">0</output></fieldset><fieldset><label for="b-hi">B</label><input type="range"min="0"max="255"id="b-hi"step="1"value="255"><output for="b-hi"id="b-hi_out">0</output></fieldset><fieldset><label for="a-hi">A</label><input type="range"min="0"max="1"id="a-hi"step=".01"value="0.3"><output for="a-hi"id="a-hi_out">1</output></fieldset></div> <div id="color-pre-box"></div></div> <h2>Extension Use Instructions:</h2><h3>To use, simply hover over each row to highlight it in the color you have chosen. To keep a row highlighted, click on any cell within the row except for the first one which contains the name of the coin. Clicking on the coin name will open a small area beneath its row to display each individual metric number that selected that coin. The highlighter works with each detail tab, but a few rows in one or two detail tabs do not for now. To save your highlight color in local storage, which persists even if you close the browser, click the "X" at the top right of the menu modal to close it. Otherwise, you can also close the menu by clicking outside of it.</h3><h4>This is still a work in progress, so simple bugs may come up. It is also not future proof in the case that the table conventions for the metrics change.</h4><h4>This started as a simple personal convenience project because I was growing fond of the spreadsheet. If I can confirm that the sheet will continue to be displayed in ways that my extension can reliably hook into it, then I will continue to improve it and add things I find useful. Hope you enjoy!</h4></div>  </div></div>');

	var mMenuCon = document.getElementById('modal-menu'),
		menuModal = document.getElementById('myModal'),
		modalBtn = document.getElementById("exmenu-btn"),
		modalSpan = document.getElementById("modal-cls");

	modalBtn.onclick = function() {
		menuModal.style.display = "block";
	};

	modalSpan.onclick = function() {
		menuModal.style.display = "none";
		localStorage.setItem('nobs_hi_color', JSON.stringify([Number(r_hi.value), Number(g_hi.value), Number(b_hi.value), Number(a_hi.value)]));
	};

	window.onclick = function(event) {
		if (event.target == menuModal) {
			menuModal.style.display = "none";
		}
	};
}
initMenuModal();

// Globals
var r_hi = document.querySelector('#r-hi'),
	g_hi = document.querySelector('#g-hi'),
	b_hi = document.querySelector('#b-hi'),
	a_hi = document.querySelector('#a-hi'),
	r_hi_out = document.querySelector('#r-hi_out'),
	g_hi_out = document.querySelector('#g-hi_out'),
	b_hi_out = document.querySelector('#b-hi_out'),
	a_hi_out = document.querySelector('#a-hi_out');

r_hi.addEventListener('input', function() {setHiColor(r_hi_out, this);}, false);

g_hi.addEventListener('input', function() {setHiColor(g_hi_out, this);}, false);

b_hi.addEventListener('input', function() {setHiColor(b_hi_out, this);}, false);

a_hi.addEventListener('input', function() {setHiColor(a_hi_out, this);}, false);

if (localStorage.getItem('nobs_hi_color') !== null) {
	var storedColor = JSON.parse(localStorage.getItem('nobs_hi_color'));
	r_hi.value = storedColor[0];
	g_hi.value = storedColor[1];
	b_hi.value = storedColor[2];
	a_hi.value = storedColor[3];
	r_hi_out.value = storedColor[0];
	g_hi_out.value = storedColor[1];
	b_hi_out.value = storedColor[2];
	a_hi_out.value = storedColor[3];
}
// --


function setHiColor(outHi, inHi) {
	var colorToAdd = [Number(r_hi.value), Number(g_hi.value), Number(b_hi.value), Number(a_hi.value)];
	var formatedColor = "rgba("+colorToAdd.join(', ')+")";
	outHi.value = inHi.value;
	document.getElementById('color-pre-box').style.backgroundColor = formatedColor;
}
setHiColor(r_hi_out, r_hi);
setHiColor(g_hi_out, g_hi);
setHiColor(b_hi_out, b_hi);
setHiColor(a_hi_out, a_hi);

// Globals
var childElems = document.getElementsByClassName('s8');

for (var i = 0; i < childElems.length; ++i) {
	childElems[i].parentNode.classList.add('td-refs');
}
var parentElems = document.getElementsByClassName('td-refs'),
	eachChildElem;

for (let i = 0; i < parentElems.length; ++i) {
	eachChildElem = parentElems[i].childNodes;
	
	for (let j = 0; j < eachChildElem.length; ++j) {
		
		eachChildElem[j].onmouseenter = function(event) {
			if (this.style.backgroundColor === '' && !this.classList.contains('just-selected')) {
				var rowCells = this.parentElement.childNodes;
				
				for (var k = 0; k < rowCells.length; ++k) {
					rowCells[k].style.backgroundColor = addColors(getRGBValues(getComputedStyle(rowCells[k]).backgroundColor), 0);
				}
			}
		};
		
		eachChildElem[j].onmouseleave = function(event) {
			if (this.style.backgroundColor !== '' && !this.classList.contains('just-selected')) {
				var rowCells = this.parentElement.childNodes;
				
				for (var k = 0; k < rowCells.length; ++k) {
					rowCells[k].style.backgroundColor = '';
				}
			}
		};
		
		if (eachChildElem[j].classList.contains('s8')) {
			eachChildElem[j].onclick = function(event) {
				var infoRow = this.parentNode.parentNode.childNodes[this.parentNode.rowIndex] || {};
				if (infoRow.classList && infoRow.classList.contains('own-info')) {
					infoRow.style.display = infoRow.style.display === 'none' ? '' : 'none';
				} else {
					this.parentNode.childNodes[4].style.backgroundColor = '';
					var thisCoin = this.innerHTML,
						metricPicks = [],
						metricsColor = getComputedStyle(this.parentNode.childNodes[4]).backgroundColor;

					var newRow = this.parentNode.parentNode.parentNode.insertRow(this.parentNode.rowIndex + 1);
					newRow.classList.add('own-info');
					newRow.appendChild(document.createElement('th'));

					var newCell1 = newRow.insertCell(),
						freezeBar = newRow.insertCell(),
						newCell2 = newRow.insertCell(),
						newCell3 = newRow.insertCell(),
						newCell4 = newRow.insertCell(),
						newCell5 = newRow.insertCell();

					freezeBar.classList.add('freezebar-cell');

					newCell2.style.verticalAlign = 'middle';
					newCell2.style.textAlign = 'center';
					newCell2.style.fontWeight = 'bold';
					newCell2.style.backgroundColor = '#b7e1cd';
					newCell2.innerHTML = 'Metrics:';

					newCell3.style.verticalAlign = 'top';
					newCell3.style.backgroundColor = '#b7e1cd';
					for (var i = 0; i < currentMetrics.length; ++i) {
						if (currentMetrics[i].childNodes[1].innerHTML === thisCoin) {
							for (var j = 5; j < currentMetrics[i].childNodes.length - 3; ++j) {
								if (currentMetrics[i].childNodes[j].innerHTML === 'Yes') {
									metricPicks.push(j - 4);
								}
							}
							break;
						}
					}

					var metricTbl = document.createElement('table'),
						metRowRef,
						metCellRef,
						metRowConst = 4,
						metRowNum = Math.ceil(metricPicks.length / metRowConst);
					metricTbl.classList.add('tiny-mets');

					for (var i = 0; i < metRowNum; ++i) {
						metRowRef = metricTbl.insertRow();
						for (var j = i * metRowConst; j < i * metRowConst + metRowConst; ++j) {
							metCellRef = metRowRef.insertCell();
							metCellRef.style.backgroundColor = metricsColor;
							metCellRef.innerHTML = metricPicks[j];
							if (j + 1 == metricPicks.length) {
								break;
							}
						}
					}
					newCell3.appendChild(metricTbl);

					newCell5.colSpan = this.parentNode.cells.length - 5;
					newCell5.style.backgroundColor = '#fff2cc';
				}
			};
		} else {
			eachChildElem[j].onclick = function(event) {
				if (!this.classList.contains('just-selected')) {
					var rowCells = this.parentElement.childNodes;
					
					for (var k = 0; k < rowCells.length; ++k) {
						rowCells[k].classList.add('just-selected');
						rowCells[k].style.backgroundColor = '';
						rowCells[k].style.backgroundColor = addColors(getRGBValues(getComputedStyle(rowCells[k]).backgroundColor), 0.2);
					}
				} else {
					var rowCells = this.parentElement.childNodes;
					
					for (var k = 0; k < rowCells.length; ++k) {
						rowCells[k].classList.remove('just-selected');
						rowCells[k].style.backgroundColor = '';
					}
				}
			};
		}
	}
}
// --

function getRGBValues(rgbStr) {
	//var vals = rgbStr.substring(rgbStr.indexOf('(') + 1, rgbStr.length - 1).split(', ');
	var vals = rgbStr.substring(4, rgbStr.length - 1).split(', ');
	return [
		vals[0],
		vals[1],
		vals[2],
		vals[3] ? vals[3] : '1'
	]
}

function addColors(base, alphaPlus) {
	var added = [Number(r_hi.value), Number(g_hi.value), Number(b_hi.value), Number(a_hi.value) + alphaPlus],
		mix = [];
	
	mix[3] = 1 - (1 - added[3]) * (1 - base[3]); // alpha
	mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3])); // red
	mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3])); // green
	mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3])); // blue
	
	return "rgba("+mix.join(', ')+")";
}