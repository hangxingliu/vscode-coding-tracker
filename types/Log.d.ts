declare interface LogClass {
	(t): void;
	success(t): void;
	warn(t): void;
	error(t): void;
	info(t): void;
	obj(obj): void;
}
declare var Log: LogClass;