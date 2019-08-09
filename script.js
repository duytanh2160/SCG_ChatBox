var DATE,SOCKET;

var OBJECT = {
    "message" : {	"senderId":"",
					"senderName":"",
					"sendToAll":true,
					"image":false,
					"receiverId":"",
            		"receiverName":"",
					"datetime":"",
                    "message":"",
                    "action" : "REG",
              },
	"users" : "Duy|Nhan|Van|Tuan|Linh|Cong"
}



window.onload = function(){
    SOCKET = new WebSocketClient('ws','10.0.33.82','8080','/WebSocketServer/endpoint');


    var nameTemp = '';
    while(nameTemp === ''){
        nameTemp = prompt("What's your name ?");
        if(nameTemp !== '' && nameTemp !== null){
            OBJECT.message.senderName = nameTemp;
            setTimeout(function(){
                SOCKET.send(JSON.stringify(OBJECT.message));
                displayUsers(OBJECT.users);
            },1000);


        }else if(nameTemp == null){
            window.location.href = "./sad.jpg";
        }
    }
    
}


/*----------------------------Event Here*/

$('.msg_send_btn').click(function(){
    sendMessage();
});

$('.write_msg').bind("enterKey",function(e){
    sendMessage();
 });
 $('.write_msg').keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
    }
});






$('.write_msg')[0].onchange = function(){
    OBJECT.message.message = this.value;
};

$('.search-bar')[0].onchange = function(e){
    var result = '';

    var val = $('.search-bar').val();
    var users = OBJECT.users.split('|');
    var search =  users.filter(x => x.toLowerCase().indexOf(val.toLowerCase().trim()) !== -1);

    if(search.length > 0){
        for(var a of search){
            result += a + '|';
        }
        //console.log("Search: "+ result.substr(0,result.length - 1));
        displayUsers(result.substr(0,result.length - 1));
    }
};


/*----------------------------Method Here*/

function sendMessage(){
    var DATE = new Date(); 
    if(OBJECT.message.message === ""){
        myAlert("Please type something !",0,800);
    }else if(SOCKET.getStatus() === WebSocket.CLOSED){
        myAlert("Server is closed !",0,800);
    }
    else{
        if(document.getElementsByClassName('msg_history')[0].children[document.getElementsByClassName('msg_history')[0].children.length - 1].classList[0] !== 'outgoing_msg'){
            $('.msg_history').append(`
            <div class="outgoing_msg">
                <div class="sent_msg">
                <p>${OBJECT.message.message}</p>
                <span class="time_date"> ${DATE.getHours()}:${DATE.getMinutes()} | ${DATE.getDate()}/${DATE.getMonth()+1}/${DATE.getFullYear()}</span> 
                </div>
            </div>`);
        }else{
            document.getElementsByClassName('msg_history')[0].children[document.getElementsByClassName('msg_history')[0].children.length - 1].children[0].children[0].innerText +=
            '\n ' + OBJECT.message.message;
        }
        
        OBJECT.message.action = "SEND";
        SOCKET.send(JSON.stringify(OBJECT.message));
        document.getElementsByClassName('msg_history')[0].scrollBy(0,document.getElementsByClassName('msg_history')[0].scrollHeight);
    }

    $('.write_msg').val('');
    OBJECT.message.message = '';
}



function receiveMessage(msg){
    if(document.getElementsByClassName('msg_history')[0].children[document.getElementsByClassName('msg_history')[0].children.length - 1].classList[0] !== 'incoming_msg'){
        $('.msg_history').append(
            `
            <div class="incoming_msg">
                <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                    <div class="received_msg">
                        <div class="received_withd_msg">
                            <p>${msg}</p>
                            <span class="time_date"> 11:01 AM    |    Today</span>
                        </div>
                    </div>
            </div>
            `);
    }else{
        document.getElementsByClassName('msg_history')[0].children[document.getElementsByClassName('msg_history')[0].children.length - 1].children[1].children[0].children[0].innerText +=
        '\n ' + msg;
    }
    document.getElementsByClassName('msg_history')[0].scrollBy(0,document.getElementsByClassName('msg_history')[0].scrollHeight);
}



function displayUsers(names){
    var users = names.split("|");
    var currentUsers = $('.inbox_chat')[0].innerText.split('\n');
    
    if(currentUsers[0] === ""){
        for(let a of users){
            $('.inbox_chat').append(`
                    <div class="chat_list">
                        <div class="chat_people">
                            <div class="chat_img">
                                <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> 
                            </div>
                            <div class="chat_ib">
                                <h5>${a}</h5>
                            </div>
                        </div>
                    </div>
                        
            `);
        }
    }else{
        
        var deleteList = currentUsers.filter(x => users.includes(x) === false);
        var addList = users.filter(x => currentUsers.includes(x) === false);

        //Delete old Users
        console.log("DeleteList: ",deleteList);
        for(var j = 0 ; j < deleteList.length ; j++){
            for(var i = 0; i < $('.inbox_chat').find('.chat_list').find('h5').length ; i++){
                if(deleteList.includes($('.inbox_chat').find('.chat_list').find('h5')[i].innerText) == true){
                    $('.inbox_chat').find('.chat_list')[i].remove();
                }
            }
        }
        
        
        //Add new Users
        console.log("AddList: ",addList);
        for(let a of addList){
            $('.inbox_chat').append(`
                    <div class="chat_list">
                        <div class="chat_people">
                            <div class="chat_img">
                                <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> 
                            </div>
                            <div class="chat_ib">
                                <h5>${a}</h5>
                            </div>
                        </div>
                    </div>
                        
            `);
        }

    }
    
}







function myAlert(msg,type,timeInMil){
    var showConfirmButton = false;
    if(type == 1){
        type = 'success';
    }else if(type == 0){
        type = 'error'
    }else if(type == 0.1){
        type = 'error';
        showConfirmButton = true;
    }

    Swal.fire({
        position: 'center',
        type: type,
        title: msg,
        showConfirmButton: showConfirmButton,
        timer: timeInMil
    })
}