//successful responses
const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;

//redirection messages
const MOVED = 301;
const FOUND = 302;

//client error
const BAD = 400;
const UNAUTH = 401;
const FORBIDDEN = 403;
const NOTFOUND = 404;
const NOTALLOWED = 405;
const NOTACCEPT = 406;
const TIMEOUT = 408;
const TOOMANY = 429;

//internal errors
const INTERROR = 500;
const BADGATE = 502;
const UNAVAIL = 503;
const AUTHREQ = 511;

module.exports = {
	OK,
	CREATED,
	ACCEPTED,
	MOVED,
	FOUND,
	BAD,
	UNAUTH,
	FORBIDDEN,
	NOTFOUND,
	NOTALLOWED,
	NOTACCEPT,
	TIMEOUT,
	TOOMANY,
	INTERROR,
	BADGATE,
	UNAVAIL,
	AUTHREQ
};
