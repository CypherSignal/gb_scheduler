
const FILE_NAME = 'weaponData.csv'
const WEAP_NUM_SKIP_LINE = 1;
const ELEM_TABL_COL = 9;   
const STATUS_TABL_COL = 9;
const MATERIA_TABL_COL = 8;
const UNIQUE_TABL_COL = 12;
const MAX_POT_INDEX = 6;   // Index into the maxPot for sorting

const BATTLE_START_DATE = (1764460800000);
let weaponDatabase = [];
function ecSearch() {
     document.getElementById("ecDropdown").classList.toggle("show");
    var divToPrint = document.getElementById('Output');                       
    divToPrint.innerHTML = ''
}

// Create a table to display the result
function tableCreate(user_row, user_col, list, header) {
    //body reference 
    var body = document.getElementById('Output'); 

    // header
    const h1 = document.createElement("h1"); 
    const textNode = document.createTextNode(header);
    h1.className = "weaponHeader";
    h1.appendChild(textNode);
    body.appendChild(h1);

    console.log("Table Data:", list);
  
    // create <table> and a <tbody>
    var tbl = document.createElement("table");
    let tblClassName;

    // Different format for each table 
    if (user_col == ELEM_TABL_COL) {
        tblClassName = "elemTable";
    }
    else if (user_col == MATERIA_TABL_COL) {
        tblClassName = "materiaTable";
    }
    else if (user_col == STATUS_TABL_COL) {
        tblClassName = "statusTable";
    }
    else if (user_col == UNIQUE_TABL_COL) {
        tblClassName = "uniqueTable";
    }
    else
    {
        tblClassName = "effectTable";
    }
    tbl.className = tblClassName + " cell-border display compact hover order-column stripe";

    let tblId = tblClassName + Math.random().toString(36).substr(2, 9); // Generate a unique ID for each table
    tbl.id = tblId;
    var tblBody = document.createElement("tbody");
    console.log("Creating table: " + tblClassName);

    var headerRow = document.createElement("tr");
    // create <tr> and <td>
    for (var j = 0; j < user_row; j++) {
        var row = document.createElement("tr");

        for (var i = 0; i < user_col; i++) {
            var cell;
            if (j == 0) {
                cell = document.createElement("th");
                headerRow.appendChild(cell);
            }
            else {
                cell = document.createElement("td");
                row.appendChild(cell);
            }
            var cellText;
            cellText = document.createTextNode(list[j][i] || ""); 
            cell.appendChild(cellText);
            
        }
        if (j > 0) {
            tblBody.appendChild(row);
        }
    }

    // append the <tbody> inside the <table>
    var tblHead = document.createElement("thead");
    tblHead.appendChild(headerRow);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);

    // put <table> in the <body>
    body.appendChild(tbl);

    new DataTable('#' + tblId, {
        paging: false
    });
    console.log("Created table: " + tblClassName);
}

function sortTable(cell) {
    // Grab the table node
    var table = cell.parentNode.parentNode;
    var col = 0;
    var asc = true;
    var swap = true;
    var shouldSwap = false;
    var count = 0;
    var isNumber = false;

    for (var i = 0; i < table.rows[0].cells.length; i++) {
        if (table.rows[0].cells[i].innerHTML == cell.innerHTML) {
            col = i;
            if (cell.innerHTML == "Pot%" || cell.innerHTML == "Max%" || cell.innerHTML == "Duration (s)"
                || cell.innerHTML == "% per ATB") {
                isNumber = true;
            }
        }
    }

    while (swap) {
        swap = false;
        var rows = table.rows;

        // Skip header row
        for (var i = 1; i < (rows.length - 1); i++) {
            shouldSwap = false;
            // get current row and the next row
            var x = rows[i].getElementsByTagName("td")[col];
            var y = rows[i + 1].getElementsByTagName("td")[col];
            var xValue = x, yValue = y;

            if (isNumber) {
                xValue = parseFloat(x.innerHTML);
                yValue = parseFloat(y.innerHTML);
            }
            else {
                xValue = x.innerHTML;
                yValue = y.innerHTML;
            }

            if (asc) {
                // Check if switch based on ascendence 

                if (xValue > yValue) {
                    shouldSwap = true;
                    break;
                }
            }
            else {
                // Check if switch based on descendence 
                if (xValue < yValue) {
                    shouldSwap = true;
                    break;
                }
            }
        }
        if (shouldSwap) {
            // Swap
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            swap = true;
            count++;
        }
        else {
            if (count == 0 && asc) {
                asc = false;
                swap = true;
            }
        }
    }   
                    
}

function readDatabase() {
    if (weaponDatabase[0] != null) {
        return;
    }

    var location = window.location.href;
    var directoryPath = location.substring(0, location.lastIndexOf("/") + 1);
    result = loadFile(directoryPath + FILE_NAME);

    if (result != null) {
        // By lines
        var lines = result.split('\n');

        for (var line = WEAP_NUM_SKIP_LINE; line < lines.length-1; line++) {

            var row = CSVToArray(lines[line], ',');
            var i = 0;
            let weapData = [];
            weapData.push({ name: 'name', value: row[i][0] });
            weapData.push({ name: 'charName', value: row[i][1] });
            weapData.push({ name: 'sigil', value: row[i][2] });
            weapData.push({ name: 'atb', value: row[i][3] });
            weapData.push({ name: 'type', value: row[i][4] });    // dmg type
            weapData.push({ name: 'element', value: row[i][5] });
            weapData.push({ name: 'range', value: row[i][6] });
            weapData.push({ name: 'effect1Target', value: row[i][7] });
            weapData.push({ name: 'effect1', value: row[i][8] });
            weapData.push({ name: 'effect1Pot', value: row[i][9] });
            weapData.push({ name: 'effect1MaxPot', value: row[i][10] });
            weapData.push({ name: 'effect2Target', value: row[i][11] });
            weapData.push({ name: 'effect2', value: row[i][12] });
            weapData.push({ name: 'effect2Pot', value: row[i][13] });
            weapData.push({ name: 'effect2MaxPot', value: row[i][14] });
            var m = 15;
            weapData.push({ name: 'effect3Target', value: row[i][m] }); m++;
            weapData.push({ name: 'effect3', value: row[i][m] }); m++;
            weapData.push({ name: 'effect3Pot', value: row[i][m] }); m++;
            weapData.push({ name: 'effect3MaxPot', value: row[i][m] }); m++;
            weapData.push({ name: 'support1', value: row[i][m] }); m++;
            weapData.push({ name: 'support2', value: row[i][m] }); m++;
            weapData.push({ name: 'support3', value: row[i][m] }); m++;
            weapData.push({ name: 'rAbility1', value: row[i][m] }); m++;
            weapData.push({ name: 'rAbility2', value: row[i][m] }); m++;
            weapData.push({ name: 'potOb10', value: row[i][m] }); m++;
            weapData.push({ name: 'maxPotOb10', value: row[i][m] }); m++;
            weapData.push({ name: 'effect1Dur', value: row[i][m] }); m++;
            weapData.push({ name: 'effect2Dur', value: row[i][m] }); m++;
            weapData.push({ name: 'effect3Dur', value: row[i][m] }); m++;
            weapData.push({ name: 'condition1', value: row[i][m] }); m++;
            weapData.push({ name: 'condition2', value: row[i][m] }); m++;
            weapData.push({ name: 'condition3', value: row[i][m] }); m += 15;
            weapData.push({ name: 'effect1Range', value: row[i][m] }); m++;

            if (row[i][m] == 0) {
                weapData.push({ name: 'uses', value: "No Limit" });
            }
            else {
                weapData.push({ name: 'uses', value: row[i][m] });
            }
            m++;
            m++; // id

            weapData.push({ name: 'gachaType', value: row[i][m] }); m++;
            weapData.push({ name: 'effect2Range', value: row[i][m] }); m++;


            weaponDatabase.push(weapData);
            // console.log(weapData);
        }
    }
}

// Find elements in an array
function findElement(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i][propName] == propValue)
            return arr[i];
}
function getValueFromDatabaseItem(item, name) {
    var i = findElement(item, "name", name);

    return i["value"];
}
function findWeaponWithProperty(arr, propName, propValue) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == propName) {
            if (arr[i].value.indexOf(propValue) >= 0) {
                return true;
            }
        }
    }

    return false;
}

// Load file from local server
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}


// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
//    console.log(strData);
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
    (
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
    ){

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push( [] );

    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
        );

    } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[ 3 ];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

function createTimeTable()
{
    // create <table> and a <tbody>
    var tbl = document.createElement("table");
    tbl.className = "battleTimeTable";
    tbl.id = "battleTimeTable";

    var tblBody = document.createElement("tbody");
    
    {
        var headerRow = document.createElement("tr");

        // add the "Player" columnn header
        {
            var cell = document.createElement("th");
            cell.innerText = "Player Name";
            cell.className = "battlePlayerHeader";
            headerRow.appendChild(cell);
        }
        battleTime = new Date(BATTLE_START_DATE);

        // create a day's worth of columns
        for (var hourIdx = 0; hourIdx < 24; hourIdx += 2)
        {
            var cell = document.createElement("th");
            hoursValue = battleTime.getHours();
            cell.innerText = (battleTime.getMonth()+1) + "/" + battleTime.getDate() + " ";
            if (hoursValue > 12)
            {
                cell.innerText += (hoursValue - 12) + ":00 PM";
            }
            else
            {
                cell.innerText += (hoursValue) + ":00 AM";
            }
            battleTime.setTime(battleTime.getTime() + 2 * 3600 * 1000);
            cell.className = "battleHourHeader";
            headerRow.appendChild(cell);
        }

        var tblHead = document.createElement("thead");
        tblHead.appendChild(headerRow);
        tbl.appendChild(tblHead);
    }

    // cypsig-todo -- remove this when we have proper data loading in
    // create some sample player data
    let players = [];
    players.push(["Cy", 1, 0, 0, 0, 0.5, 1, 0, 0, 0, 1, 1, 1]);
    players.push(["St", 1, 1, 1, 1,   1, 0, 0, 0, 0, 0, 0, 0]);
    players.push(["Ha", 1, 1, 1, 0,   0, 0, 0, 1, 0, 0, 0, 1]);
    players.push(["Dd", 0, 0, 0, 1,   1, 1, 1, 0, 0, 0, 0, 0]);

    const dateNow = new Date();
    msSinceBattleStart = dateNow.getTime() - BATTLE_START_DATE;
    if (msSinceBattleStart < 0)
    {
        msSinceBattleStart = 0;
    }
    hoursSinceBattleStart = msSinceBattleStart / (3600 * 1000);
    for (var playerIdx = 0; playerIdx < players.length; ++playerIdx)
    {
        var row = document.createElement("tr");
        {
            var cell = document.createElement("td");
            cell.innerText = players[playerIdx][0];
            row.appendChild(cell);
        }
        for (var hourIdx = 0; hourIdx < 24; hourIdx += 2)
        {
            let availability = players[playerIdx][(hourIdx / 2) + 1];
            var cell = document.createElement("td");
            cell.innerText = availability * 100 + "%";
            // console.log("availability of " + availability + " turned into text " + cell.innerText);
            if (hourIdx < hoursSinceBattleStart)
            {
                cell.className = "battlePast";
            }
            else if (availability == 0)
            {
                cell.className = "battleUnavailable";   
            }
            
            row.appendChild(cell);
        }
        tbl.appendChild(row);
    }
    

     document.getElementById('Output').appendChild(tbl);
}

function init()
{
    try
    {
        var body = document.getElementById('Output'); 

        const date = new Date();
        const minToMilli = 60 * 1000;
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * minToMilli)

        const paraUtcTime = document.createElement("p");
        paraUtcTime.innerText = "UTC time: " + date.toISOString();

        const paraGbTime = document.createElement("p");
        paraGbTime.innerText = "Battle start: " + (new Date(BATTLE_START_DATE)).toISOString();

        const paraLocalTime = document.createElement("p");
        paraLocalTime.innerText = "Local time: " + date.toLocaleString("en-US");

        body.appendChild(paraUtcTime);
        body.appendChild(paraGbTime);
        body.appendChild(paraLocalTime);

        createTimeTable();
    }
    catch (error)
    {
        console.log(error);
    }
}