/**
 * Tracking data analyzer core class
 *
 * Some data structure:
 *
 * 	setFilter(filterRules: FilterRules)
 * 		FilterRules: {
 * 			project: [...],
 * 			computer: [...],
 * 			language: [...],
 * 			file: [...]
 * 		}
 *
 * 	Result data structure:
 * 		{
 * 			total: {coding: TIME_YOU_CODING_FINGER_ON_KEYBOARD, watching: TIME_YOU_WATCHING_YOUR_CODE},
 * 			groupBy: {
 *				project: {
 * 					project1: {coding: ..., watching: ...},
 * 					...
 * 				},
 * 				...
 * 			}
 * 		}
 *
 * Using example:
 *
 * var core = new AnalyzeCore('./database');
 * core.setFilter({ fileType: ['javascript', 'json'] });
 * core.setGroupBy(AnalyzeCore.GroupBy.DAY | Analyze.GroupBy.PROJECT | Analyze.GroupBy.COMPUTER);
 *
 * var today = new Date();
 * var before30days = new Date(today);
 * before30days = before30days.setDate(before30days.getDate() - 29);
 *
 * var success = core.analyze(today, before30days);
 * if(success) {
 * 	console.log(core.getResult());
 * } else {
 * 	console.error(core.getError());
 * }
 * console.warn(core.getWarning());
 *
 * More example you can see
 * 	utility script `utils/analyzer` source codes
 * 	in the #main function(It is very short and clear)
 */

const path = require('path'),
	fs = require('fs');

//a version list which analyze action in this class supported
const SUPPORT_VERSION = ['3.0'];

/**
 * Analyze group by enum
 * Your can using it like following:
 *
 * GroupBy.DAY
 * GroupBy.DAY | GroupBy.FILE
 */
const GroupBy = {
	DAY: 1,
	HOUR: 2,
	LANGUAGE: 16,
	FILE: 32,
	PROJECT: 128,
	COMPUTER: 256,
	ALL: 512 - 1,
	NONE: 0
};

/**
 * A map from filter rules name to column
 */
const FilterRulesMapToColumn = {
	language: 3,
	file: 4,
	project: 5,
	computer: 6
};

/**
 * Echo column description
 */
const ColumnInfo = {
	TYPE: 0,
	TIME: 1,
	LONE: 2,
	LANG: 3,
	FILE: 4,
	PROJ: 5,
	PCID: 6
};
const ColumnsCount = 7;

const MonthCharacter = '123456789ABC';

//Spliter Regex to split columns and lines
const ColumnsSpliter = /\s+/; 
const LineSpliter = /[\r\n]+/;

const MS_1_HOUR = 3600 * 1000;
const MS_1_DAY = 24 * MS_1_HOUR;

function AnalyzeCore(databaseFolder) {	
		//error detail list
	var errorList = [],
		//warning detail list	
		warningList = [],
		//a filter function be generate from #setFilter rules
		filterFunction = null,
		//a group by rules object be generate from #setGroupBy
		groupByRules = {},
		//analyze timestamp range [new Date(xxxx,xx,xx,0,0,0).getTime(), new Date(xxxx,xx,xx,23,59,59).getTime()]
		analyzeTimestampRange = [0, 0],
		//analyze result object
		resultObject = getBaseResultObject();

	//clean all associated variable before analyze
	function _cleanVariableBeforeAnalyze() {
		errorList = [];
		warningList = [];
		analyzeTimestampRange = [0, 0];
		filterFunction = filterFunction || generateFilterFunction();
		groupByRules = groupByRules || convertGroupRulesNumberToObject(0);
		resultObject = getBaseResultObject();
	}	


	/**
	 * Analyze database files.
	 * 	and get report from tracking data recorded in time range
	 * 	[startDayDate:00:00:00, endDayDate:23:59:59]
	 * @param {Date} startDayDate
	 * @param {Date} endDayDate
	 * @returns {Object}
	 */
	function analyze(startDayDate, endDayDate) {
		_cleanVariableBeforeAnalyze();
		
		//rest start and end date to 00:00:00 and 23:59:59
		//set analyzeTime stamp range
		startDayDate = new Date(startDayDate.getFullYear(), startDayDate.getMonth(), startDayDate.getDate(), 0, 0, 0);
		endDayDate = new Date(endDayDate.getFullYear(), endDayDate.getMonth(), endDayDate.getDate(), 23, 59, 59);
		analyzeTimestampRange = [startDayDate.getTime(), endDayDate.getTime()];

		//date loop cursor		
		var dateCursor = new Date(startDayDate.getTime());
		dateCursor.setDate(dateCursor.getDate() - 1);
		//loop end timestamp
		var timestampEndBoundary = new Date(endDayDate);
		timestampEndBoundary = timestampEndBoundary.setDate(timestampEndBoundary.getDate() + 1);

		//build a database file name list for prepare to analyze
		var scanFileNameList = [];
		while (dateCursor.getTime() < timestampEndBoundary) {
			scanFileNameList.push(getFileNameFromDateObject(dateCursor));
			dateCursor.setDate(dateCursor.getDate() + 1);
		}
		
		//start analyze each file
		for (let i = 0, j = scanFileNameList.length; i < j; i++)
			if (!_analyzeOneFile(scanFileNameList[i],
				i < 2 || i >= j - 2
				/*if the database file is near by the date range boundary, must check time range in sub function*/))
					return false;
		return true;
	}
	

	// Analyze one database file
	function _analyzeOneFile(fileName, needCheckTimeRange) {
		var filePath = path.join(databaseFolder, fileName);
		//If this file is not exists, just ignore
		if (!fs.existsSync(filePath))
			return true;
		var content = ''
		try {
			content = fs.readFileSync(filePath, 'utf8');
		} catch (err) {
			//read file error
			errorList.push(`${fileName} read file error`);
			errorList.push(err.stack);
			return false;
		}
		var lines = content.split(LineSpliter);
		if (lines.length == 0)
			return errorList.push(`${fileName} is a empty content file`), false;
		if (SUPPORT_VERSION.indexOf(lines[0].trim()) == -1)
			return errorList.push(`${fileName} is a nonsupport file with version ${lines[0]}`), false;
		for (let i = 1; i < lines.length; i++)
			if (!_analyzeOneLine(lines[i], fileName, i, needCheckTimeRange))
				return false;
		return true;
	}

	//analyze one line in a database file
	//and put this line analyze result to the `resultObject`
	function _analyzeOneLine(line, fileName, lineNo, needCheckTimeRange) {
		var cols = line.split(ColumnsSpliter);
		//If it is a empty line, just ignore
		if (!line)
			return true;
		if (cols.length > ColumnsCount)
			warningList.push(`${fileName}:${lineNo} has too many columns(${cols.length})`);	
		if (cols.length < ColumnsCount)
			return errorList.push(`${fileName}:${lineNo} columns length less than ${ColumnsCount} (${cols.length})`), false;
		//Ignore line
		if (!filterFunction(cols))
			return true;
		//Convert startTime and howLong columns to number
		var startTime = Number(cols[1]),
			howLong = Number(cols[2]);
		if (isNaN(startTime) || isNaN(howLong))
			return errorList.push(`${fileName}:${lineNo} param "start time" or param "how long" is not a number`), false;	
		//check is startTime in the analyze range 
		if (needCheckTimeRange) {
			if (startTime > analyzeTimestampRange[1]) return true;//ignore
			if (startTime + howLong > analyzeTimestampRange[1]) {
				//fix start time and how long (because it across boundary)
				howLong = analyzeTimestampRange[1] - startTime;
			}
			if (startTime < analyzeTimestampRange[0]) {
				if (startTime + howLong < analyzeTimestampRange[0]) return true;//ignore
				//fix start time and how long (because it across boundary)
				howLong -= analyzeTimestampRange[0] - startTime;
				startTime = analyzeTimestampRange[0];
			}
		}
		//Is this line a coding record, else is a watching record
		var isCodingRecord = cols[0] == '2',
			groupByResult = resultObject.groupBy;
		resultObject.total[isCodingRecord ? 'coding' : 'watching'] += howLong;
		
		//groupByRule
		if (groupByRules.hasComputer)
			addOneRecordToAGroupBy(resultObject.groupBy.computer, cols[6]/*computer*/, howLong, isCodingRecord);
		if (groupByRules.hasProject)
			addOneRecordToAGroupBy(resultObject.groupBy.project, cols[5]/*project*/, howLong, isCodingRecord);
		if (groupByRules.hasFile) 
			addOneRecordToAGroupBy(resultObject.groupBy.file, cols[4]/*fileName*/, howLong, isCodingRecord);
		if (groupByRules.hasLanguage)
			addOneRecordToAGroupBy(resultObject.groupBy.language, cols[3]/*languageId*/, howLong, isCodingRecord);
		
		if (groupByRules.hasHour) {
			//If need group by hours

			//loop start with first second in the Hour which startTime in
			let pointerTimestamp = new Date(startTime).setMinutes(0, 0, 0),
				//loop end with end time
				endTimestamp = startTime + howLong,
				
				lastCountTimestamp = startTime,
				nextCountTimestamp = -1,
				
				context = resultObject.groupBy.hour;
			
			for (; pointerTimestamp < endTimestamp; pointerTimestamp += MS_1_HOUR) {
				nextCountTimestamp = Math.min(endTimestamp, pointerTimestamp + MS_1_HOUR);
				let howLongInThisHour = nextCountTimestamp - lastCountTimestamp;
				addOneRecordToAGroupBy(context, dateToYYYYMMDDHHString(new Date(pointerTimestamp)),
					howLongInThisHour, isCodingRecord);
				
				lastCountTimestamp = nextCountTimestamp;
			}
		}
		if (groupByRules.hasDay) {
			//If need group by days

			//loop start with first second in the Day which startTime in
			let pointerTimestamp = new Date(startTime).setHours(0, 0, 0, 0),
				//loop end with end time			
				endTimestamp = startTime + howLong,
				
				lastCountTimestamp = startTime,
				nextCountTimestamp = -1,
				
				context = resultObject.groupBy.day;
			
			for (; pointerTimestamp < endTimestamp; pointerTimestamp += MS_1_DAY) {
				nextCountTimestamp = Math.min(endTimestamp, pointerTimestamp + MS_1_DAY);
				let howLongInThisDay = nextCountTimestamp - lastCountTimestamp;
				addOneRecordToAGroupBy(context, dateToYYYYMMDDString(new Date(pointerTimestamp)),
					howLongInThisDay, isCodingRecord);
				
				lastCountTimestamp = nextCountTimestamp;
			}
		}
		return true;
	}	

	//Add one record to groupBy result
	//context: for example: resultObject/groupBy.day
	//name: group name, such as "PC1", "2017-01-26"
	//howLong:
	//isCodingRecord: true=>CodingRecord false=>WatchingRecord
	function addOneRecordToAGroupBy(context, name, howLong, isCodingRecord) {
		if (context[name]) context[name][isCodingRecord?'coding':'watching'] += howLong;
		else context[name] = { coding: isCodingRecord ? howLong : 0, watching: isCodingRecord ? 0 : howLong };
	}
	
	//Convert a date object to a string as format "YYYY-MM-DD HH:00"
	function dateToYYYYMMDDHHString(date) {
		return `${date.getFullYear()}-${padZeroMax99(date.getMonth()+1)}-${padZeroMax99(date.getDate())} ${padZeroMax99(date.getHours())}:00`
	}
	//Convert a date object to a string as format "YYYY-MM-DD"	
	function dateToYYYYMMDDString(date) {
		return `${date.getFullYear()}-${padZeroMax99(date.getMonth()+1)}-${padZeroMax99(date.getDate())}`		
	}

	//Analyze/Convert a groupBy number to a Object with fields started with "has"
	function convertGroupRulesNumberToObject(groupByRulesNumber) {
		return {
			hasDay: groupByRulesNumber & 1,
			hasHour: groupByRulesNumber & 2,
			hasLanguage: groupByRulesNumber & 16,
			hasFile: groupByRulesNumber & 32,
			hasProject: groupByRulesNumber & 128,
			hasComputer: groupByRulesNumber & 256,
		};
	}

	//Get empty record and basic result object
	function getBaseResultObject() {
		return {
			total: { coding: 0, watching: 0 },
			groupBy: {
				computer: {},
				day: {},
				hour: {},
				language: {},
				file: {},
				project: {}
			}
		};
	}

	/**
	 * generate filter function from given filter rules object
	 */
	function generateFilterFunction(filterRules) {
		/**
		 * rules: [ col, [colFilter...], col2, [col2Filter...], ....] 
		 */
		var rules = [];
		//default value is a empty array (no any filter) 
		if (!filterRules)
			filterRules = [];	
		for (let ruleName in filterRules) {
			let ruleColumn = FilterRulesMapToColumn[ruleName];
			if (typeof ruleColumn == 'undefined')
				throw new Error(`Filter rule "${ruleName}" is not exists!`);
			rules.push(ruleColumn);
			//Array to Object(Map)
			let colFilter = {};
			filterRules[ruleName].forEach(v => colFilter[v] = 1);
			rules.push(colFilter);
		}
		return !rules.length ? () => true :
			row => {
				for (let i = 0; i < rules.length; i += 2) {
					//If special column in row be included in rules, then verify the next rule.
					if (rules[i + 1][row[rules[i]]])
						continue;
					return false;
				}
				return true;
			};
	}
	
	/** 
	 * get database file name from given date object
	 */
	function getFileNameFromDateObject(date) {
		return `${date.getFullYear() % 100}${MonthCharacter[date.getMonth()]}${
			padZeroMax99(date.getDate())}.db`;
	}

	//Pad zero to left side for number. Max number to 99.
	//Such as pasZeroMax99(5) == '05'
	function padZeroMax99(num) { return num >= 10 ? `${num}` : (num == 0 ? '00' : `0${num}`);}	

	/**
	 * Set a filter rules object to analyzer
	 */
	this.setFilter = filterRules => filterFunction = generateFilterFunction(filterRules);

	/**
	 * Set a group by rules number to analyzer
	 */
	this.setGroupBy = groupBy => groupByRules = convertGroupRulesNumberToObject(groupBy);
	
	/**
	 * analyze function
	 * 	return a boolean
	 *  true as success
	 *  false as failure(if you get false, you can call #getError to get failed reason)
	 */
	this.analyze = analyze;

	/**
	 * get error descriptions array
	 */
	this.getError = () => errorList;
	/**
	 * get warning descriptions array
	 */
	this.getWarning = () => warningList;

	/**
	 * get analyze result
	 * what data structure returned you could find in the front of this file 
	 */
	this.getResult = () => resultObject;

	//This exports for testing private functions	
	this._test = {
		generateFilterFunction: generateFilterFunction,
	};
}
//export GroupBy enums
AnalyzeCore.GroupBy = GroupBy;

module.exports = AnalyzeCore;