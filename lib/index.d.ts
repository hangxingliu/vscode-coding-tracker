type LoggerFunction = (...fields) => void;
type Logger = {
	e: LoggerFunction;
	w: LoggerFunction;
	d: LoggerFunction;
	setDebug: (isDebug: boolean) => boolean;
}