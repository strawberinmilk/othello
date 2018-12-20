'use strict'
const othello = []
let nextUser = "rotateY(0deg)",
    notNextUser = "rotateY(180deg)";

const first = ()=>{
  for(let i=0;i<10;i++){
    othello.push([])
    let flag = (i==0||i==9) ? true : false
    for(let ii=0;ii<10;ii++){
      let push = flag || ii==0 || ii==9 ? "out" : null
      if((i==4&&ii==5)||(i==5&&ii==4))push = "rotateY(0deg)"
      if((i==4&&ii==4)||(i==5&&ii==5))push = "rotateY(180deg)"
      othello[othello.length-1].push(push)
    }
  }
}
first()
//othello[6][6] = "black"
const print = ()=>{
  for(let i=1;i<9;i++){
    for(let ii=1;ii<9;ii++){
      if(othello[i][ii]!=null){
        $(`#s${i}${ii}`).css('transform',othello[i][ii])
      }
    }
  }
}
print()

const search = (y,x)=>{
  if(othello[y][x]!=null)return []
  let ans = []
  let xx = x
  let yy = y
  let tmp = []
  //右
  xx = x
  yy = y
  tmp = []
  while(true){
    xx++
    if(othello[yy][xx]==notNextUser){
      tmp.push({"y":yy,"x":xx})
    }else{
      if(othello[yy][xx]==nextUser){
        for(let s of tmp) ans.push(s)
      }
      break
    }
  }
  //左
  xx = x
  yy = y
  tmp = []
  while(true){
    xx--
    if(othello[yy][xx]==notNextUser){
      tmp.push({"y":yy,"x":xx})
    }else{
      if(othello[yy][xx]==nextUser){
        for(let s of tmp) ans.push(s)
      }
      break
    }
  }
  //下
  xx = x
  yy = y
  tmp = []
  while(true){
    yy++
    if(othello[yy][xx]==notNextUser){
      tmp.push({"y":yy,"x":xx})
    }else{
      if(othello[yy][xx]==nextUser){
        for(let s of tmp) ans.push(s)
      }
      break
    }
  }
  //上
  xx = x
  yy = y
  tmp = []
  while(true){
    yy--
    if(othello[yy][xx]==notNextUser){
      tmp.push({"y":yy,"x":xx})
    }else{
      if(othello[yy][xx]==nextUser){
        for(let s of tmp) ans.push(s)
      }
      break
    }
  }
  //右下
  xx = x
  yy = y
  tmp = []
  while(true){
    xx++
    yy++
    if(othello[yy][xx]==notNextUser){
      tmp.push({"y":yy,"x":xx})
    }else{
      if(othello[yy][xx]==nextUser){
        for(let s of tmp) ans.push(s)
      }
      break
    }
  }
  //右上
  xx = x
  yy = y
  tmp = []
  while(true){
    xx++
    yy--
    if(othello[yy][xx]==notNextUser){
      tmp.push({"y":yy,"x":xx})
    }else{
      if(othello[yy][xx]==nextUser){
        for(let s of tmp) ans.push(s)
      }
      break
    }
  }
  //左下
  xx = x
  yy = y
  tmp = []
  while(true){
    xx--
    yy++
    if(othello[yy][xx]==notNextUser){
      tmp.push({"y":yy,"x":xx})
    }else{
      if(othello[yy][xx]==nextUser){
        for(let s of tmp) ans.push(s)
      }
      break
    }
  }
  //左上
  xx = x
  yy = y
  tmp = []
  while(true){
    xx--
    yy--
    if(othello[yy][xx]==notNextUser){
      tmp.push({"y":yy,"x":xx})
    }else{
      if(othello[yy][xx]==nextUser){
        for(let s of tmp) ans.push(s)
      }
      break
    }
  }
  return(ans)
}


$(".square").on('click', function() {
  let clickId = $(this).find(".stone").attr('id').replace(/s/,"").split("")
  let searchResult = search(clickId[0],clickId[1])
  $(this).removeClass("available");
  if(!searchResult[0]){
    generateAndPlaySound("error");
    return false;
  }
  othello[clickId[0]][clickId[1]] = nextUser
  console.log(nextUser);
  print()
  for(let s of searchResult) othello[s.y][s.x] = nextUser
  print()
  generateAndPlaySound("place");
  let tmp = nextUser
  nextUser = notNextUser
  notNextUser = tmp
});

$(".square").mouseenter(function(){
  let clickId = $(this).find(".stone").attr('id').replace(/s/,"").split("");
  let searchResult = search(clickId[0],clickId[1])
  if(!searchResult[0]){
    return false;
  }else{
    $(this).addClass("available");
  }
});

$(".square").mouseout(function(){
  $(this).removeClass("available");
});

function generateAndPlaySound(sound){
  sound = new Audio("./sounds/" + sound + ".mp3");
  sound.play();
};