const express = require('express')
const app = express()
const path = require('path')
const fs= require('fs');

const session = require('express-session')

var bodyParser = require('body-parser')

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views') )
app.use (session ({secret : 'topsecret' }))

app.use(bodyParser.urlencoded({ extended: false }))

if(process.env.PORT){
    
app.listen(process.env.PORT);

}else{

app.listen(3000, function(){
    console.log('server is running')
});

}

var tasks1 = []

// i will make fn that makes array of tasks from the file
 let loadUsers = function(){
   try{
    let data=fs.readFileSync('users.json');
   
    let dataString =data.toString();
    let UsersArray= JSON.parse(dataString);
    return UsersArray;
   } catch(error){
       return [];
   }
}

app.get('/', function(req,res){
    res.render('login', {});
    res.end();  
})


app.post('/',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var users = loadUsers();
    var found=false;
    var withPass=false
    for (var i =0;i<users.length && !found;i++){
        if(users[i].username== username ){
            found=true;
            if( users[i].password==password)
            withPass=true;
        }
    }
    if(!found){
        res.render('login incorrect');  
        res.end();
    }
    else if(withPass) {

        req.session.username=username;
        req.session.password=password;
        res.redirect('/home');
        res.end();
    }else if (!withPass){
        res.render('login incorrect');  
        res.end();
    }
})




app.get('/registration', function(req,res){
    res.render('registration', {});

    res.end();
})

app.post('/register',function(req,res){
    var usersArr=loadUsers();
    var cont=true;
    for(var i=0;i<usersArr.length&&cont;i++){
        if(usersArr[i].username==req.body.username){
            cont=false;
        }
    }
    if(!cont){
        res.render('registration incorrect')
    }else{
        
      usersArr.push(req.body);
      fs.writeFileSync('users.json',JSON.stringify(usersArr));
     
    
      res.redirect('/'); 
    res.end();
       
    
    
    }
    }
)

app.get('/home',function(req,res){
 
 
    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('home',{});
}
res.end();
})

app.get('/horror',function(req,res){
    
    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('horror',{});
}
res.end();
})

app.get('/drama',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('drama',{});
}
res.end();
})
app.get('/action',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('action',{});
}
res.end();
})


app.get('/conjuring',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('conjuring',{});
}
res.end();
})

app.get('/darkknight',function(req,res){
    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{
res.render('darkknight',{});
    }
    res.end();
})


app.post('/darkknight',function(req,res){

    var err=    addToWatchList(req.session.username,'The Dark Knight');
     if(err){
        res.render('darkknight error');
     
     }else{
      res.redirect('/darkknight');
     }
     res.end();
    })
    



app.get('/fightclub',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('fightclub',{});
}
res.end();})


app.post('/fightclub',function(req,res){

    var err=    addToWatchList(req.session.username,'Fight Club');
     if(err){
        res.render('fightclub error');
     
     }else{
      res.redirect('/fightclub');
     }
     res.end();
    })
    

app.get('/godfather',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('godfather',{});
}
res.end();})



app.post('/godfather',function(req,res){

    var err=    addToWatchList(req.session.username,'The Godfather');
     if(err){
        res.render('godfather error');
     
     }else{
      res.redirect('/godfather');
     }
     res.end();
    })
    


app.get('/godfather2',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('godfather2',{});
}
res.end();})


app.post('/godfather2',function(req,res){

    var err=    addToWatchList(req.session.username,'The godfather: Part II');
     if(err){
        res.render('godfather2 error');
     
     }else{
      res.redirect('/godfather2');
     }
     res.end();
    })
    




app.get('/scream',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{   res.render('scream',{});
}
res.end();})


app.post('/scream',function(req,res){

    var err=    addToWatchList(req.session.username,'Scream');
     if(err){
        res.render('scream error');
     
     }else{
      res.redirect('/scream');
     }
     res.end();
    })
    




app.get('/searchresults',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{  
        if(result.length==0){
            result.push('Movie not found');
            resultsLink.push('/home');
        }
         res.render('searchresults',{results:result,link:resultsLink });
        res.end();

}
res.end();})

app.get('/watchlist',function(req,res){

    if(!(req.session.username&&req.session.password)){
        res.redirect('/')
    }else{ 
        var watch =loadWatchlist();
            var idx=null;
            for(var i=0;i<watch.length;i++){
                if(watch[i].user===req.session.username){
                    idx=i;break;
                }

            }
            var list=[];
            if(idx!=null){
                list=watch[idx].list;
            }
          res.render('watchlist',{tasks:list});
}
res.end();})

var result=[];
var resultsLink=[];
 
app.post('/search',function(req,res){
    var film=['the conjuring','the dark knight','fight club','the godfather','the godfather ii','scream']
    var link=["/conjuring",'/darkknight','/fightclub','/godfather','/godfather2','/scream'];
    var searchKey= req.body.Search;
    result=[];
    resultsLink=[];
    for(var i=0;i<film.length;i++){
        if(film[i].includes(searchKey.toLowerCase())){
            result.push(film[i]);
            resultsLink.push(link[i]);
        }
       }
       res.redirect('/searchresults');
       res.end();
   




})


app.post('/conjuring',function(req,res){

var err=    addToWatchList(req.session.username,'The Conjuring');
 if(err){
    res.render('conjuring error');
 
 }else{
  res.redirect('/conjuring');
 }
 res.end();
})

let loadWatchlist = function(){
    try{
     let data=fs.readFileSync('watchlists.json');
    
     let dataString =data.toString();
     let WatchlistsArray= JSON.parse(dataString);
     return WatchlistsArray;
    } catch(error){
        return [];
    }
 }

let addToWatchList= function(username,filmName){
    var Watchlists= loadWatchlist();
    var found=false;
    var userList=null;
    var index=-1;
    var returned=false;
    for (var i=0;i<Watchlists.length && !found;i++){
        if(Watchlists[i].user===username ){
            userList=Watchlists[i].list;                   
            found=true;
            index=i;
        }
    }

    if(!found){
        Watchlists.push({
            user:''+username,
            list:[filmName]
        });
        fs.writeFileSync('watchlists.json',JSON.stringify(Watchlists));
    
    }
    else {
        var filmFound=false;
        for(var i=0;i<userList.length&& !filmFound;i++){
            if(userList[i]==filmName){
                filmFound=true;

            }
        }
        if(filmFound){
            returned=true;
        }
        else 
        {
            Watchlists[index].list.push(filmName);
            fs.writeFileSync('watchlists.json',JSON.stringify(Watchlists));
        }

    }
return returned;

}












