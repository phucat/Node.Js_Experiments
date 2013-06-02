/* ======================================================================
	INIT
======================================================================== */
var sql = require('node-sqlserver');
var conn_str = "Driver={SQL Server Native Client 11.0};Server={tcp:192.168.11.220,1433};UID={trinko};PWD={trinko};Encrypt={No};Database={AsianBook_NEW_TESTPROD}";

var restify = require('restify');
var server = restify.createServer();
var io = require("socket.io");
var sio = io.listen(server);
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});

/* ======================================================================
	Hello Controller
======================================================================== */
function respond(req, res, next) {
    res.end("<html><head></head><body>Chander Dhall " + req.params.name + "<body></html>");
}
server.get('/hello/:name', respond);

/* ======================================================================
	Employess Controller
======================================================================== */
function Employees(req, res, next) {
    res.header("Content-Type: application/json");
    
    sql.open(conn_str, function (err, conn) {
        if (err) {           
            console.log("Error opening the database connection!");
			res.send('error');
            return;
        }
		
        console.log("before query!");
        conn.queryRaw("exec race_getbetcount 6683, 27353, 1357", function (err, results) {
            if (err) {    
                console.log("Error running query!");
                return;
            }
			
            var result = [];             
           	for (var i = 0; i < results.rows.length; i++) {						
				result.push({
					id: results.rows[i][0], 
					lastName: results.rows[i][1] 
				});
			}					
			res.send(result);
		});
		console.log("after query!");
	});
}
server.get('/Employees', Employees);



/* ======================================================================
	Get All Race based on Event ID
======================================================================== */
function GetRace(req, res, next) {
    res.header("Content-Type: application/json");
    console.log("req.query.eventID:" + req.params.eventID);
	var eventID = req.params.eventID;
    sql.open(conn_str, function (err, conn) {
        if (err) {           
            console.log("Error opening the database connection!");
			res.send('error');
            return;
        }
		
        conn.queryRaw("exec get_races " + eventID, function (err, results) {
            if (err) {    
                console.log("Error running query!");
                return;
            }
			
            var result = [];             
           	for (var i = 0; i < results.rows.length; i++) {						
				result.push({
					race_id: results.rows[i][0], 
					race_num: results.rows[i][1],
					race_name: results.rows[i][2],
					race_status: results.rows[i][3],
					start_date: results.rows[i][4],
					start_time: results.rows[i][5],
				});
			}		
			console.log(result);			
			res.send(result);
		});
	});
}
server.get('/GetRace/:eventID/', GetRace);


/* ======================================================================
	Get Agent by ID
======================================================================== */
function GetAgent(req, res, next) {
    res.header("Content-Type: application/json");
    console.log("req.query.eventID:" + req.params.agentID);
	var agentID = req.params.agentID;
    sql.open(conn_str, function (err, conn) {
        if (err) {           
            console.log("Error opening the database connection!");
			res.send('error');
            return;
        }
		
        conn.queryRaw("exec usp_agent_getby_id " + agentID, function (err, results) {
            if (err) {    
                console.log("Error running query!");
                return;
            }
			
            var result = [];             
           	for (var i = 0; i < results.rows.length; i++) {						
				result.push({
					agent_id: results.rows[i][0], 
					company_id: results.rows[i][1],
					topusername: results.rows[i][2],
					top_agent_id: results.rows[i][3],
					prefix: results.rows[i][4],
					suffix: results.rows[i][5],
					agent_category_id: results.rows[i][6],
					currency_id: results.rows[i][7],
					agent_name: results.rows[i][8],
					account_number: results.rows[i][9],
					contact_number : results.rows[i][10],
					user_status_id: results.rows[i][11],
					credit_balance : results.rows[i][12],
					credit_limit : results.rows[i][13],
					credit_loss_limit : results.rows[i][14],
					user_name : results.rows[i][15],
					user_pin : results.rows[i][16],
					line_loss : results.rows[i][17],
					user_status : results.rows[i][18],
					agent_category_code : results.rows[i][19],
					agent_category_name : results.rows[i][20]
				});
			}		
			console.log(result);			
			res.send(result);
		});
	});
}
server.get('/GetAgent/:agentID/', GetAgent);





/* ======================================================================
	Get All Race based on Event ID
======================================================================== */
function TestIO(req, res, next) {
    res.header("Content-Type: application/json");
    console.log("req.params.message:" + req.params.message);
	var message = req.params.message;
    sio.sockets.emit("metrics:update", message);
    res.end();
}
server.get('/TestIO/:message/', TestIO);

