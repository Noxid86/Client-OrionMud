var time = 1;
$(document).ready(function(){
  let ws = new WebSocket('ws://localhost:4001');
  const ansi = new AnsiUp;
  function output(type, msg){
    let message = "<p class="+type+">"+msg+"</p>"
    $("#output").append(message);
    $("#output").scrollTop($("#output").prop("scrollHeight"));
  }

  function echo(msg){
    console.log(ansi.ansi_to_html({'use_classes':true, 'message':msg}));
    output('echo', ansi.ansi_to_html(msg))
  }


  ws.onopen = () => echo('connected')
  ws.onclose = () => echo('disconnected')
  ws.onerror = (e) => console.log(e)
  ws.onmessage = (m) => {
    if (JSON.parse(m.data).message) {
      echo(JSON.parse(m.data).message);
    } else if(JSON.parse(m.data).group == "attributes") {
      console.log(JSON.parse(m.data).data)
    } else {
      echo('unknown message detect');
    }
  }
  // socket.send = ws.send.bind(ws)
  // socket.close = ws.close.bind(ws)
  // socket.isReady = () => ws.readyState === ws.OPEN

  $("#prompt").on('keyup', function (e) {
      // If Enter is pressed
      if (e.keyCode === 13) {
        // Clear the prompt and echo the input value
        let input = $("#prompt").val();
        $("#prompt").val(" ")
        output('input_echo', input);
        ws.send(input);
      };
  });
});
