const express = require('express')

var dt = require('./db.js');
//var sim = require("./simulation.js")

const app = express()
const port = 3000
dt.dbConnection()

app.get('/', (req, res) => {    
    res.send("hello world")
})

app.get('/countquiz/:name', async (req, res) =>{
    var n = req.params.name 
    try {
        console.log(await dt.countQuiz(n))
        res.send("numeri di quiz svolti")        
    } catch (error) {
        console.log(error)
    }

})

app.get('/quizpassed/', async (req, res) =>{
    console.log(await dt.quizPassed('poldi@gmail.com'))
    res.send("numeri di quiz superati")
})

app.get('/errorpercentage/', async (req, res) =>{
    console.log(await dt.percError('poldi@gmail.com'))
    res.send("percentuali di errori media")
})

app.get('/bestquiz/', async (req, res) =>{
    console.log(await dt.resBest('poldi@gmail.com') )
    res.send("quiz con risultato migliore")
})

app.get('/worstquiz/', async (req, res) =>{
    console.log(await dt.resWorst('poldi@gmail.com') )
    res.send("quiz con risultato peggiore")
})

app.get('/categories/', async (req, res) =>{
    console.log(await dt.catList('poldi@gmail.com') )
    res.send("l'elenco delle categorie delle domande, in ordine decrescente in base ai punteggi conseguiti")
})

// call per lista quiz
app.get( '/getQuizList/', async (req, res) =>{
    var quizList= await dt.getQuizList()
    var data={} 
    console.log("STAMPA RISULTATI")
    for (var i=0; i<quizList.length; i++){
        data[quizList[i].codQuiz]={"numeroDomande" : quizList[i].numeroDomande, "tempoSvolgimento" : quizList[i].tempoSvolgimento }
        console.log(quizList[i].codQuiz)
    }
    console.log("variabile di tipo: " + typeof(data))
    console.log(data)
    res.json(data)
    })

// dato un quiz, trovo elenco domande
app.get( '/questionsQuiz/:codQuiz', async (req, res) =>{
    var questionList= await dt.getQuestions(req.params.codQuiz)
        var data={} 
        console.log("STAMPA RISULTATI")
        // formatto i dati per react
        data["domande"]=[]
        for (var i=0; i<questionList.length; i++){
            data["domande"][i]={
                "id": questionList[i].codDomanda,
                "domanda":  questionList[i].testoDomanda,
                "risposte": [ questionList[i].risposta1, questionList[i].risposta2, questionList[i].risposta3 ], 
                "rispostaCorretta" : questionList[i].rispostaCorretta }
            console.log(questionList[i].codDomanda)
    }
    console.log("variabile di tipo: " + typeof(data))
    console.log(data)
    res.json(data)    
    })

    app.use(function(req, res, next) {
        res.status(404).send('Sorry cant find that!');
      });

app.listen(port, () =>{
    console.log(`Example app listening to port ${port}`)
})


  
  