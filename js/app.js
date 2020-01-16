var removeClass = (elem,className)=>{
    elem.forEach(function(i){
        i.classList.remove(className);
     });
}
var showLogin = (elem)=>{
    document.getElementsByClassName('email-login')[0].style.display="block";
    document.getElementsByClassName('email-signup')[0].style.display="none";
    var allElem = document.querySelectorAll('.lb-header a');
    removeClass(allElem,'active');
    elem.classList.add("active");

}
var showSignUp = (elem)=>{
    document.getElementsByClassName('email-login')[0].style.display="none";
    document.getElementsByClassName('email-signup')[0].style.display="block";
    var allElem = document.querySelectorAll('.lb-header a');
    removeClass(allElem,'active');
    elem.classList.add("active");
}


var userUniqueId = "";
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementsByClassName('welcomeNote')[0].style.display="block";
      document.getElementsByClassName('login-box')[0].style.display="none";
      if(user !=null){
          userUniqueId = user.uid;
          document.getElementById('welcomNote').innerHTML= "Welcome "+user.email;
      }
    } else {
      // No user is signed in.
      document.getElementsByClassName('welcomeNote')[0].style.display="none";
      document.getElementsByClassName('login-box')[0].style.display="block";
    }
});

/*
function for Normal login 
*/
var logIn = ()=>{
   var email =  document.getElementById('logInEmail').value;
   var pass  =  document.getElementById('logInPass').value;
//    console.log(email, pass);
   firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
  });   
}
var signUp = ()=>{
    var email =  document.getElementById('regEmail').value;
    var pass  =  document.getElementById('regPass').value;
    // console.log(email, pass);
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
        // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
    }); 
 }


var logOut = ()=>{
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
        alert("Sign Out successfully")
    }).catch(function(error) {
    // An error happened.
        alert(error);
    });
}



//function for google login 
var googleLogin = ()=>{
    alert("abcd");
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().useDeviceLanguage();
    
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user);
    }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    });
}







//fucntion for 
var getDataFormDatabse= ()=>{    
    var arr = [];
    var leadsRef = firebase.database().ref('messages');
    leadsRef.on('value', function(snapshot) {
        var lenth = snapshot.length;
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            // console.log(childData);
            arr.push(childData);
        });  
        // console.log(arr);
        // return arr;
    });
}
var commentsRef = firebase.database().ref('usersMsg/');
commentsRef.on('child_added', function(data) {
    // alert("aa");

    var myUserId = firebase.auth().currentUser.uid;
    var myUserEmail = firebase.auth().currentUser.email;
    var to = document.getElementById("senderName").getAttribute('data-email');
    var xx= data.val().msg;
    if(data.val().from == myUserEmail && data.val().to == to ){        
        var x = `<div class="message parker">${xx}</div>`;
    }else if(data.val().to == myUserEmail && data.val().from == to){
        var x = `<div class="message stark">${xx}</div>`;
    }else{
        var x = "";
    }
    document.getElementById("chat").innerHTML+=x;

    // console.log(myUserEmail, data.val());

    
    // addCommentElement(postElement, data.key, data.val().text, data.val().author);
    scrollToar();
});
commentsRef.on('child_changed', function(data) {
    alert("change");
    // setCommentValues(postElement, data.key, data.val().text, data.val().author);
});
commentsRef.on('child_removed', function(data) {
    deleteComment(postElement, data.key);
});
// commentsRef.on('child_changed', function(data) {
//     setCommentValues(postElement, data.key, data.val().text, data.val().author);
// });



makeChat = ()=>{
    var dataArr = getDataFormDatabse(); 
    console.log(dataArr);
    // document.getElementById("chat").innerHTML = 
}
makeChat();


/*
===============================
only for chat making 
===============================
*/
var chatingPerson = window.prompt("Please Enter a Email Address");
document.getElementById("senderName").setAttribute("data-email", chatingPerson);

var chatKeyUp = (e, tables)=>{
    var x = e.which || e.keyCode;
    var val = tables.value;
    if(x==13){
        sendMessage(val, tables);
    }
}
var sendMessage = (val, tables)=>{
    console.log(tables);
    tables.value = "";
    // Get a reference to the database service
    var senderEmailTo = document.getElementById("senderName").getAttribute('data-email');
    var myUserId = firebase.auth().currentUser.email;
    function writeUserData(userId, email, val) {
        firebase.database().ref('usersMsg/').push().set({
          to: userId,          
          msg: val,
          from: email,         
        });
      }writeUserData(senderEmailTo,  myUserId, val);
}

function scrollToar(){
    function autoScroll(thisCLs=''){
        // Add smooth scrolling to all links
        $('html, body').animate({
          scrollTop: thisCLs.offset().top
        }, 800, function(){
        });
      }
}