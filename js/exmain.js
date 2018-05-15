// Globals
var nobsPortObj = {};
var portLoaded = false;
var tableHooks = document.getElementsByTagName('table');
try {
	var currentMetrics = document.getElementById(document.getElementById('sheet-menu').childNodes[0].id.split('-')[2]).getElementsByTagName('tr');
} catch (err) {console.log(err);}
// --

function reloadMetrics() {
	try {
		currentMetrics = document.getElementById(document.getElementById('sheet-menu').childNodes[Number(document.getElementById('met-select').value)].id.split('-')[2]).getElementsByTagName('tr');
	} catch (err) {console.log(err);}
}

function searchMetricPk() {
	for (var i = 0; i < tableHooks.length; ++i) {
		var rowRef,
			nameRef,
			metricPicks = [],
			noPicks = false;
		for (var j = 0; j < tableHooks[i].rows.length; ++j) {
			rowRef = tableHooks[i].rows[j];
			nameRef = rowRef.childNodes[1].innerHTML;
			metricPicks = [];
			noPicks = false;
			for (var k = 0; k < currentMetrics.length; ++k) {
				try {
					if (currentMetrics[k].cells[1].innerHTML === nameRef && (currentMetrics[k].cells[10].innerHTML === 'Yes' || currentMetrics[k].cells[10].innerHTML === 'No')) {
						for (var l = 5; l < currentMetrics[k].cells.length - 3; ++l) {
							if (currentMetrics[k].cells[l].innerHTML === 'Yes') {
								metricPicks.push(l - 4);
							}
						}
						noPicks = metricPicks.length > 0 ? false : true;
						break;
					}
				} catch (err) {
					console.log(err);
				}
			}
			if ((noPicks == true) || (metricPicks.length > 0 && metricPicks.indexOf(Number(document.getElementById('met-kul').value)) == -1)) {
				rowRef.style.display = 'none';
				rowRef.classList.add('select-met-hidden');
			}
		}
	}
}

function clearMetricPk() {
	var hiddenRefs = document.getElementsByClassName('select-met-hidden');
	for (var i = 0; i < hiddenRefs.length; ++i) {
		hiddenRefs[i].style.display = '';
	}
}

function initMenuModal() {
	var dTitleRef = document.getElementById('doc-title'),
		menuBtnRef = document.createElement('input'),
		srchMetBtn = document.createElement('input'),
		srchMetInput = document.createElement('input'),
		clearMetBtn = document.createElement('input');

	menuBtnRef.setAttribute('type', 'button');
	menuBtnRef.value = 'NoBSPlus Menu';
	menuBtnRef.id = 'exmenu-btn';
	menuBtnRef.classList.add('nobs-menu-btns');
	dTitleRef.appendChild(menuBtnRef);
	
	clearMetBtn.setAttribute('type', 'button');
	clearMetBtn.value = 'Clear';
	clearMetBtn.id = 'met-clear';
	clearMetBtn.classList.add('nobs-menu-btns');
	clearMetBtn.onclick = function() {clearMetricPk();}
	dTitleRef.appendChild(clearMetBtn);
	
	srchMetInput.placeholder = 'Metric #';
	srchMetInput.id = 'met-kul';
	srchMetInput.classList.add('nobs-menu-btns');
	dTitleRef.appendChild(srchMetInput);
	
	srchMetBtn.setAttribute('type', 'button');
	srchMetBtn.value = 'Search';
	srchMetBtn.id = 'met-kulset';
	srchMetBtn.classList.add('nobs-menu-btns');
	srchMetBtn.onclick = function() {searchMetricPk();}
	dTitleRef.appendChild(srchMetBtn);
	
	document.body.insertAdjacentHTML('beforeend', '<!-- The Modal --><div id="myModal" class="modal">  <!-- Modal content -->  <div class="modal-content">  <span class="modal-close"id="modal-cls">&times;</span><div id="modal-menu"><center><h1>NoBSPlus</h1></center><h2>RGBA Color Slider for the Row Highlighter:</h2><h4>Whatever color you chose is automatically saved *only* if the "X" is clicked to close this menu.</h4> <div><div class="in-bl-divs"><fieldset><label for="r-hi">R</label><input type="range"min="0"max="255"id="r-hi"step="1"value="0"><output for="r-hi"id="r-hi_out">0</output></fieldset><fieldset><label for="g-hi">G</label><input type="range"min="0"max="255"id="g-hi"step="1"value="132"><output for="g-hi"id="g-hi_out">0</output></fieldset><fieldset><label for="b-hi">B</label><input type="range"min="0"max="255"id="b-hi"step="1"value="255"><output for="b-hi"id="b-hi_out">0</output></fieldset><fieldset><label for="a-hi">A</label><input type="range"min="0"max="1"id="a-hi"step=".01"value="0.3"><output for="a-hi"id="a-hi_out">1</output></fieldset></div> <div id="color-pre-box"></div></div> <h2>Basic Use:</h2><p>To use, simply hover over each row to highlight it in the color you have chosen. To keep a row highlighted, click on any cell within the row except for the first one which contains the name of the coin. Clicking on the coin name will open a small area beneath its row to display each individual metric number that selected that coin, as well as the current market price of the coin and any portfolio information if you\'ve entered any. The highlighter works with each detail tab. To save your highlighter color in local storage, which persists even if you close the browser, click the "X" at the top right of the menu modal to close it. Otherwise, you can also close the menu by clicking outside of it.</p><p>There is also a Metric search functionality now, which is in the top right corner. To use it, type in a metric number such as 1 or 20 and click the search button. The search can compound for several metrics. To return back to the full spreadsheet, just click the clear button</p><h2>Metric Tab Selector:</h2><p>Select from which detail tab you want metrics to display under the coin name after clicking on it. First tab is "0", then goes by two\'s, 0, 2, 4, etc.:</p><br><input value="0" id="met-select" /><input id="met-reset" type="button" value="Set" /><h2>Portfolio:</h2><p>When you open an info row by clicking on a coin name, you can now keep track of coins by adding how many coins you bought or sold and at what prices. The average price for the total amount of coins in each catagory is then calculated and displayed. I have also added CryptoCompare to try and get the market price of the coin, and calculate your full adjusted percent return.</p><p>Each time you press the save button, your current portfilio data will be encrypted and saved only on your machine. The encryption will be done with whatever password is typed in at the top, so you can change it every time you save.</p><p>To load it, use the same password that was in the "password" bar at the time of clicking the save button. This is because no passwords are stored anywhere, on your machine or another. The "Load Portfolio" button does not encrypt or save anything, it only checks for a locally stored portfolio and decrypts it with the entered password, then loads it. The save button encrypts and saves everything added into the portfolio up to that point with the password currently in the password input. An empty portfolio object is initialized upon page open, and clicking save will always prompt you to confirm. Still lightweight and experimental so CryptoCompare may fail, and calculations are still in trial.</p><p><a href="https://github.com/TheGuyStyles/NoBSPlus" target="_blank">Github link</a></p><h5>This is still a work in progress, so simple bugs may come up. It is also not future proof in the case that the table conventions for the metrics change.</h5><h5>This started as a simple personal convenience project by Guy Styles, but is now mostly maintained by me, Loshcat. If I can confirm that the sheet will continue to be displayed in ways that the extension can reliably hook into it, then I will continue to improve it and add things I find useful. Hope you enjoy!</h5></div>  </div></div>');
	
	document.getElementById('met-reset').onclick = function() {reloadMetrics();}

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

function initPortBtns() {
	var dTitleRef = document.getElementById('doc-title'),
		footerRef = document.getElementById('footer'),
		passInputRef = document.createElement('input'),
		passBtnRef = document.createElement('input'),
		saveBtnRef = document.createElement('input');
	
	saveBtnRef.setAttribute('type', 'button');
	saveBtnRef.value = 'Save Portfolio';
	saveBtnRef.id = 'port-save-btn';
	saveBtnRef.classList.add('nobs-menu-btns');
	footerRef.appendChild(saveBtnRef);

	passBtnRef.setAttribute('type', 'button');
	passBtnRef.value = 'Load Portfolio';
	passBtnRef.id = 'port-btn';
	passBtnRef.classList.add('nobs-menu-btns');
	footerRef.appendChild(passBtnRef);

	passInputRef.setAttribute('type', 'password');
	passInputRef.placeholder = 'Portfolio Password';
	passInputRef.id = 'port-pass';
	passInputRef.style.float = 'right';
	passInputRef.style.marginRight = '11px';
	footerRef.appendChild(passInputRef);

	passBtnRef.onclick = function () {
		if (document.getElementById('port-pass').value !== '') {
			if (localStorage.getItem('nobs_portfolio') !== null) {
				try {
					var encryptedPrt = localStorage.getItem('nobs_portfolio'),
						nobsPortStr = CryptoJS.AES.decrypt(encryptedPrt, document.getElementById('port-pass').value).toString(CryptoJS.enc.Utf8);
					nobsPortObj = JSON.parse(nobsPortStr);
					portLoaded = true;
				} catch (err) {
					alert('Portfolio Object was found but decryption or initialization failed - Try Password Again');
				}
			} else {
				alert('Doesn\'t seem like you have a Portfolio here -- An empty one is always initialized upon page load, which is now the one currently being used.');
			}
		} else {
			alert('Password Pls');
		}
	};
	
	saveBtnRef.onclick = function () {
		if (document.getElementById('port-pass').value !== '') {
			var confirmText = Object.keys(nobsPortObj).length === 0 && nobsPortObj.constructor === Object ? 'Your currently loaded portfolio is empty, do you want to save and/or overwrite?' : portLoaded == true ? 'You sure?' : 'You have not loaded a portfolio, are you sure you want to overwrite';
			var conf = confirm(confirmText);
			if (conf == true) {
				localStorage.setItem('nobs_portfolio', CryptoJS.AES.encrypt(JSON.stringify(nobsPortObj), document.getElementById('port-pass').value).toString());
			}
		} else {
			alert('Need a Password to encrypt with.');
		}
	};
}
initPortBtns();

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

var colorToAdd = [Number(r_hi.value), Number(g_hi.value), Number(b_hi.value), Number(a_hi.value)];
// --

function setHiColor(outHi, inHi) {
	//var colorToAdd = [Number(r_hi.value), Number(g_hi.value), Number(b_hi.value), Number(a_hi.value)];
	var formatedColor = "rgba("+colorToAdd.join(', ')+")";
	outHi.value = inHi.value;
	colorToAdd = [Number(r_hi.value), Number(g_hi.value), Number(b_hi.value), Number(a_hi.value)];
	document.getElementById('color-pre-box').style.backgroundColor = formatedColor;
}
setHiColor(r_hi_out, r_hi);
setHiColor(g_hi_out, g_hi);
setHiColor(b_hi_out, b_hi);
setHiColor(a_hi_out, a_hi);

function nobsSetup(tblHook) {
	//try {
	var childElems = [],
		parentElems = tblHook.rows,
		eachChildElem;
	
	for (var i = 0; i < tblHook.rows.length; ++i) {
		tblHook.rows[i].childNodes[1].classList.add('first-td');
		childElems.push(tblHook.rows[i].childNodes[1]);
	}

	for (var i = 0; i < parentElems.length; ++i) {
		eachChildElem = parentElems[i].childNodes;

		for (var j = 0; j < eachChildElem.length; ++j) {

			eachChildElem[j].onmouseenter = function() {
				if (this.style.backgroundColor === '' && !this.classList.contains('just-selected')) {
					var rowCells = this.parentElement.childNodes;

					for (var k = 0; k < rowCells.length; ++k) {
						rowCells[k].style.backgroundColor = addColors(getRGBValues(getComputedStyle(rowCells[k]).backgroundColor), 0);
					}
				}
			};

			eachChildElem[j].onmouseleave = function() {
				if (this.style.backgroundColor !== '' && !this.classList.contains('just-selected')) {
					var rowCells = this.parentElement.childNodes;

					for (var k = 0; k < rowCells.length; ++k) {
						rowCells[k].style.backgroundColor = '';
					}
				}
			};

			if (eachChildElem[j].classList.contains('first-td')) {
				eachChildElem[j].onclick = function() {
					var infoRow = this.parentNode.parentNode.childNodes[this.parentNode.rowIndex] || {},
						thisCoin = this.innerHTML;
					
					if (infoRow.classList && infoRow.classList.contains('own-info')) {
						//infoRow.style.display = infoRow.style.display === 'none' ? '' : 'none';
						//readPort(infoRow.cells[5], thisCoin);
						infoRow.remove();
						
					} else {
						this.parentNode.childNodes[4].style.backgroundColor = '';
						var metricPicks = [],
							metricsColor = getComputedStyle(this.parentNode.childNodes[4]).backgroundColor;

						var newRow = this.parentNode.parentNode.parentNode.insertRow(this.parentNode.rowIndex + 1);
						newRow.classList.add('own-info');
						newRow.appendChild(document.createElement('th'));

						var newCell1 = newRow.insertCell(),
							//freezeBar = newRow.insertCell(),
							newCell2 = newRow.insertCell(),
							newCell3 = newRow.insertCell(),
							newCell4 = newRow.insertCell(),
							newCell5 = newRow.insertCell();

						//newCell1.style.backgroundColor = '#fff2cc';
						newCell1.style.textAlign = 'center';
						newCell1.style.verticalAlign = 'top';
						newCell1.style.fontWeight = 'bold';
						newCell1.innerHTML = '<div><label>Number of Coins Bought/Sold:</label><br><input></input><br><label>Price per coin (BTC):</label><br><input></input><hr><input type="button" value="-" style="font-weight: bold; width: 50%;" placeholder="' + thisCoin + '"/><input type="button" value="+" style="font-weight: bold; width: 50%;" placeholder="' + thisCoin + '"/></div>';
						newCell1.getElementsByTagName('input')[3].onclick = function () {
							writePort(this, 'ownedCoins', 'avgPrice');
						};
						newCell1.getElementsByTagName('input')[2].onclick = function () {
							writePort(this, 'soldCoins', 'sldPrice');
						};

						//freezeBar.classList.add('freezebar-cell');

						newCell2.colSpan = 2;
						newCell2.style.verticalAlign = 'middle';
						newCell2.style.textAlign = 'center';
						newCell2.style.fontWeight = 'bold';
						newCell2.style.backgroundColor = '#b7e1cd';
						newCell2.innerHTML = 'Metrics:';

						//newCell3.colSpan = 2;
						newCell3.style.verticalAlign = 'top';
						newCell3.style.backgroundColor = '#b7e1cd';
						for (var i = 0; i < currentMetrics.length; ++i) {
							try {
								if (currentMetrics[i].cells[1].innerHTML === thisCoin) {
									for (var j = 5; j < currentMetrics[i].cells.length - 3; ++j) {
										if (currentMetrics[i].cells[j].innerHTML === 'Yes') {
											metricPicks.push(j - 4);
										}
									}
									break;
								}
							} catch(err) {console.log(err);}
						}

						var metricTbl = document.createElement('table'),
							metRowRef,
							metCellRef,
							metRowConst = 3,
							metRowNum = Math.ceil(metricPicks.length / metRowConst);
						metricTbl.classList.add('tiny-mets');

						for (var i = 0; i < metRowNum; ++i) {
							metRowRef = metricTbl.insertRow();
							for (var j = i * metRowConst; j < i * metRowConst + metRowConst; ++j) {
								metCellRef = metRowRef.insertCell();
								metCellRef.style.backgroundColor = metricsColor;
								if (typeof metricPicks[j] === 'number') {
									metCellRef.innerHTML = metricPicks[j];
								}
								if (j + 1 == metricPicks.length) {
									break;
								}
							}
						}
						newCell3.appendChild(metricTbl);

						newCell4.style.verticalAlign = 'middle';
						newCell4.style.textAlign = 'center';
						newCell4.style.fontWeight = 'bold';
						newCell4.innerHTML = 'Port\nfolio:';

						newCell5.colSpan = this.parentNode.cells.length - 6; //3;
						newCell5.style.backgroundColor = '#fff2cc';
						newCell5.style.verticalAlign = 'top';
						newCell5.style.fontWeight = 'bold';
						newCell5.innerHTML = '<div class="in-bl-divs"><label>Coins Purchased:</label><br><input class="port-displays" disabled /><br><label>Average Price Paid:</label><br><input class="port-displays" disabled /><br><label>Current Price:</label><br><input class="port-displays" disabled /></div><div class="in-bl-divs"><label>Coins Sold:</label><br><input class="port-displays" disabled /><br><label>Average Price Sold:</label><br><input class="port-displays" disabled /><br><label>BTC Locked-in:</label><br><input class="port-displays" disabled /></div><div class="in-bl-divs"><label>Coins Held:</label><br><input class="port-displays" disabled /><br><label>Total BTC Spent:</label><br><input class="port-displays" disabled /><br><label>Adjusted Value:</label><br><input class="port-displays" disabled /></div><div class="in-bl-divs"><label>Percent Return:</label><br><input class="port-displays" disabled /></div>';
						
						//readPort(newRow.cells[5], thisCoin);
						getCryptoCompare(newRow.cells[5], thisCoin);
					}
				};
			} else {
				eachChildElem[j].onclick = function() {
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
//} catch(err) {console.log(err);}
}
for (let i = 0; i < tableHooks.length; ++i) {
	nobsSetup(tableHooks[i]);
}

function writePort(thisOfBtn, coinNum, coinPrice) {
	var nInput = Number(thisOfBtn.parentNode.getElementsByTagName('input')[0].value),
		pInput = Number(thisOfBtn.parentNode.getElementsByTagName('input')[1].value),
		newA = nInput * pInput,
		medianP,
		totalN,
		portA = 0,
		portN = 0,
		coinName = thisOfBtn.placeholder;

	if (nInput != '' && pInput != '' && !isNaN(nInput) && !isNaN(pInput)) {
		//if (nobsPortObj.hasOwnProperty(coinName) && !isNaN(nobsPortObj[coinName][coinNum]) && typeof nobsPortObj[coinName][coinPrice] === 'number') {
		if (nobsPortObj.hasOwnProperty(coinName)) {
			if (nobsPortObj[coinName].hasOwnProperty(coinNum) && nobsPortObj[coinName].hasOwnProperty(coinPrice)) {
				portA = nobsPortObj[coinName][coinNum] * nobsPortObj[coinName][coinPrice],
				portN = nobsPortObj[coinName][coinNum];
			}
		} else {
			nobsPortObj[coinName] = {};
		}

		totalN = Number(portN + nInput); // Total coins held.
		medianP = Number(((portA + newA) / totalN).toFixed(8)); // Median Price per Coin Averaged over all purchased coins.
		nobsPortObj[coinName][coinNum] = totalN;
		nobsPortObj[coinName][coinPrice] = medianP;

		thisOfBtn.parentNode.getElementsByTagName('input')[0].value = '';
		thisOfBtn.parentNode.getElementsByTagName('input')[1].value = '';
		
		//readPort(thisOfBtn.parentNode.parentNode.parentNode.cells[5], coinName);
		getCryptoCompare(thisOfBtn.parentNode.parentNode.parentNode.cells[5], coinName);
	} else {
		alert('Numbers Pls');
	}
}

function getCryptoCompare(cellRef, coinName, newName) {
	var regExp = /\(([^)]+)\)/,
		matches = regExp.exec(coinName), //matches[1] contains the value between the parentheses
		realName = newName || matches[1],
		myURL = 'https://min-api.cryptocompare.com/data/price?fsym=' + realName + '&tsyms=BTC';
	
	var req = new XMLHttpRequest();
	req.open('GET', myURL, true);
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200 && realName.indexOf('*') == -1) {
			var coinData = JSON.parse(this.response);
			if (coinData.Response == 'Error') {
				getCryptoCompare(cellRef, coinName, matches[1] + '*');
			} else {
				readPort(cellRef, coinName, coinData.BTC);
			}
		}
	}
	req.send();
}

function readPort(cellRef, coinName, cryptoComp) {
	var docRefs = [cellRef.getElementsByTagName('input')[0], cellRef.getElementsByTagName('input')[1], cellRef.getElementsByTagName('input')[2], cellRef.getElementsByTagName('input')[3], cellRef.getElementsByTagName('input')[4], cellRef.getElementsByTagName('input')[5], cellRef.getElementsByTagName('input')[6], cellRef.getElementsByTagName('input')[7], cellRef.getElementsByTagName('input')[8], cellRef.getElementsByTagName('input')[9]];
	for (var doc of docRefs) {
			doc.value = 0;
		}
	if (nobsPortObj.hasOwnProperty(coinName)) {
		if (nobsPortObj[coinName].hasOwnProperty('ownedCoins') && nobsPortObj[coinName].hasOwnProperty('avgPrice')) {
			docRefs[0].value = nobsPortObj[coinName]['ownedCoins'];
			docRefs[1].value = nobsPortObj[coinName]['avgPrice'].toFixed(8);
		}
		if (nobsPortObj[coinName].hasOwnProperty('soldCoins') && nobsPortObj[coinName].hasOwnProperty('sldPrice')) {
			docRefs[3].value = nobsPortObj[coinName]['soldCoins'];
			docRefs[4].value = nobsPortObj[coinName]['sldPrice'].toFixed(8);
		}
	}
	docRefs[2].value = cryptoComp.toFixed(8);
	docRefs[5].value = (Number(docRefs[3].value) * Number(docRefs[4].value)).toFixed(8);
	docRefs[6].value = Number((Number(docRefs[0].value) - Number(docRefs[3].value)).toFixed(8));
	docRefs[7].value = (Number(docRefs[0].value) * Number(docRefs[1].value)).toFixed(8);
	docRefs[8].value = (Number(docRefs[6].value) * cryptoComp + Number(docRefs[5].value)).toFixed(8);
	docRefs[9].value = String(Number((((Number(docRefs[8].value) / Number(docRefs[7].value)) * 100) - 100).toFixed(2))) + '%';
}

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
	var added = colorToAdd.slice(),
		mix = [];
	added[3] += alphaPlus;
	
	mix[3] = 1 - (1 - added[3]) * (1 - base[3]); // alpha
	mix[0] = Math.round((added[0] * added[3] / mix[3]) + (base[0] * base[3] * (1 - added[3]) / mix[3])); // red
	mix[1] = Math.round((added[1] * added[3] / mix[3]) + (base[1] * base[3] * (1 - added[3]) / mix[3])); // green
	mix[2] = Math.round((added[2] * added[3] / mix[3]) + (base[2] * base[3] * (1 - added[3]) / mix[3])); // blue
	
	return "rgba("+mix.join(', ')+")";
}