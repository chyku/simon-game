var moves, pattern, lock, userMove, current, strict, sync, flash, unflash;
var color1 = ["#00cc00", "#00ccff", "#db00cc", "#ff6600"];
var color2 = ["#00ff00", "#00ffff", "#ff00d4", "#ffae00"];
var audio = document.getElementsByTagName("audio");


function add(){
  lock = true;
  moves++;
  pattern.push(Math.floor(Math.random()*4));
  glow();
  $("#count").html(moves);
}

function glow(){
  // depending on the color, changes to another color?
  lock = true;
  userMove = 0;
  var i = 0;
  // turn it back to normal after delay
  // play sound
  flash = setInterval(function(){
    $(".b" + pattern[i]).css("background-color", color2[pattern[i]]);
    audio[pattern[i]].currentTime = 0;
    audio[pattern[i]].play();
    unflash = setTimeout(function(){
      $(".b" + pattern[i]).css("background-color", color1[pattern[i]]);
      audio[pattern[i]].pause();
      if (i == moves -1){
        clearInterval(flash);
        lock = false;
      } else {
        i++;
      }
    }, 460);
    
  }, 1000);
}

function clear(){
  lock = true;
  pattern = [];
  moves = 0;
  $("#count").html(moves);
  userMove = 0;
}

$(document).ready(function(){
  clear();
  $("#restart, .results").hide();
  
  $("#start, #restart").click(function(){
    if ($(this).html() == "Start"){
      $(this).fadeOut();
      $("#restart").fadeIn();
    } else {
      if (lock){
        clearInterval(flash);
        clearTimeout(unflash);
      }
      $(".results").html("Restarting...");
      $(".results").fadeIn().delay(230).fadeOut();
    }
    clear();
    add();
  });
  
  $("#strict").click(function(){
    strict = !strict;
    if ($("#strict span").html() == "on"){
      $("#strict span").html("off");
    } else {
      $("#strict span").html("on");
    }
  });

  $(".box")
    .mousedown(function(){
      if (!lock){
        sync = true;
        current = parseInt($(this).attr('class').slice(5));
        $(this).css("background-color", color2[current]);
        audio[current].currentTime = 0;
        audio[current].play();
      } else {
        sync = false;
      }
    })

    .mouseup(function(){
      // then check if they lost
      if (!lock && sync){
        $(this).css("background-color", color1[current]);
        
        if (pattern[userMove] == current){
          userMove++;
          if (userMove == moves){ //check logic of this with usermove++ after last one
            if (moves == 20){
              $(".results").html("You won!");
              clear();
            } else {
              $(".results").html("Nice job!");
            }
            $(".results").fadeIn().delay(230).fadeOut();
            add();
          }
        } else {
          // repeat the pattern
          if (strict){
            $(".results").html("You lost! Try again!");
            $(".results").fadeIn().delay(230).fadeOut();
            clear();
            add();
          } else {
            $(".results").html("Try again!");
            $(".results").fadeIn().delay(230).fadeOut();
            glow();
          }
        }
      }
    });
});

// when mousedown during glow after mistake
// user is user input; check if it's the same or iterate through the thing
