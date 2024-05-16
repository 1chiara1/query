const mysql = require("mysql2"); //uso la libreria mysql

var con // creo un variabile per la connessione, che uso per tutte le query che farò. alla fine chiudo
        //la connessione

exports.dbConnection = function (){
    //config database connection
    con = mysql.createConnection({
    user: 'root',
    password: 'root',
    host: 'localhost',
    port: '3306',
    database: 'quiz_def'
    });

// test connection
return new Promise((resolve, reject)=>{
    con.connect(function(err){
        if(err){
            console.log('problem: ' + err)
            return reject(err)
        }
        else{
            console.log("connected")
            return resolve()
        }
    });
}); 
}

//numero quiz svolti
exports.countQuiz= function (user){
    var query = "Select count(*)from svolgimento_quiz where email='"+user+"'"
    return new Promise((resolve, reject)=>{
        con.query(query, (err, records) =>{
            if(err){
                console.log("problem: " + err)
                return reject(err)
            }
            else{
                console.log("db count quiz call success")
                return resolve(records[0])
            }
            //console.log('Data fetched:', records);
        });
    });
}
 // quiz superati (meno di 2 errori)
exports.quizPassed= function (user){
    var query = "Select count(*) from svolgimento_quiz where email='"+ user+"' and numero_errori<2"
    return new Promise((resolve, reject)=>{
        con.query(query, (err, records) =>{
            if(err){
                console.log("problem: " + err)
                return reject(err)
            }
            else{
                console.log("db quiz passed call success")
                return resolve(records[0])
            }
            //console.log('Data fetched:', records);
        });
    });
}

//percentuali errori media dato un utente
exports.percError= function (user){
    var query = "select email, avg((numero_errori*100)/numerodomande) from svolgimento_quiz join quiz on svolgimento_quiz.codquiz=quiz.codquiz where email='" + user + "'group by email"
    return new Promise((resolve, reject)=>{
        con.query(query, (err, records) =>{
            if(err){
                console.log("problem: " + err)
                return reject(err)
            }
            else{
                console.log("db perc call success")
                return resolve(records[0])
            }
            //console.log('Data fetched:', records);
        });
    });
}

//il quiz con ris migliore 
exports.resBest= function (user){
    var query = "Select codquiz from svolgimento_quiz where email = '"+user+"' and numero_errori = (select min(numero_errori)from svolgimento_quiz where email='"+user+"')"
    return new Promise((resolve, reject)=>{
        con.query(query, (err, records) =>{
            if(err){
                console.log("problem: " + err)
                return reject(err)
            }
            else{
                console.log("db best quiz call success")
                return resolve(records)
            }
            //console.log('Data fetched:', records);
        });
    });
}

//il quiz con ris peggiore
exports.resWorst= function (user){
    var query = "Select codquiz from svolgimento_quiz where email = '"+user+"' and numero_errori = (select max(numero_errori) from svolgimento_quiz where email='"+user+"')"
    return new Promise((resolve, reject)=>{
        con.query(query, (err, records) =>{
            if(err){
                console.log("problem: " + err)
                return reject(err)
            }
            else{
                console.log("db worst quiz call success")
                return resolve(records)
            }
            //console.log('Data fetched:', records);
        });
    });
}

//l'elenco delle categorie delle domande, in ordine decrescente in base ai punteggi conseguiti
exports.catList= function (user){
    var query = "select categoria, sum(esitodomanda) AS punteggio from domande join svolgimento_domande_quiz on domande.codquiz = svolgimento_domande_quiz.codquiz where email='" + user+ "'group by categoria order by punteggio desc"
    return new Promise((resolve, reject)=>{
        con.query(query, (err, records) =>{
            if(err){
                console.log("problem: " + err)
                return reject(err)
            }
            else{
                console.log("db list call success")
                return resolve(records)
            }
            //console.log('Data fetched:', records);
        });
    });
}

//elenco dei quiz
exports.getQuizList= function(){
    var query = "select * from quiz"
    return new Promise((resolve, reject)=>{
        con.query(query, (err, records) =>{
            if(err){
                console.log("problem: " + err)
                return reject(err)
            }
            else{
                console.log("db list quiz call success")
                return resolve(records)
            }
            //console.log('Data fetched:', records);
        });
    });
}

//elenco domande di un quiz

exports.getQuestions= function(quizNumber){
    var query = "SELECT * FROM domande WHERE codQuiz=" + quizNumber
    return new Promise((resolve, reject)=>{
        con.query(query, (err, records) =>{
            if(err){
                console.log("problem: " + err)
                return reject(err)
            }
            else{
                console.log("db list questions call success")
                return resolve(records)
            }
            //console.log('Data fetched:', records);
        });
    });
}





