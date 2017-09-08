type LoggerFunction = (...fields) => void;
type Logger = {
	e: LoggerFunction;
	w: LoggerFunction;
	d: LoggerFunction;
	debugMode: boolean;
}