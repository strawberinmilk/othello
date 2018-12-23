'use strict';

const othello = [];
let nextUser = 'rotateY(0deg)';
let notNextUser = 'rotateY(180deg)';

const first = () => {
  for(let i=0; i < 10; i++){
    othello.push([]);
    let flag = (i === 0 || i === 9);
    for (let ii = 0; ii < 10; ii++) {
      let push = (flag || ii === 0 || ii === 9) ? 'out' : null;
      if((i === 4 && ii === 5) || (i === 5 && ii === 4)) push = 'rotateY(0deg)';
      if((i === 4 && ii === 4) || (i === 5 && ii === 5)) push = 'rotateY(180deg)';
      othello[othello.length-1].push(push);
    }
  }
};

first();

//othello[6][6] = 'black'

const print = () => {
  for(let i = 1; i < 9; i++) for(let ii = 1; ii < 9; ii++) if(othello[i][ii] != null) $(`#s${i}${ii}`).css('transform',othello[i][ii])
};
print();

const search = (y, x) => {
  if(othello[y][x] != null) return [];
  let ans = [];

  //右
  let xx = x;
  let yy = y;
  let tmp = [];

  while(true){
    xx++;
    if(othello[yy][xx] === notNextUser){
      tmp.push({'y': yy, 'x': xx});
    }else{
      if(othello[yy][xx] === nextUser) for(let s of tmp) ans.push(s);
      break
    }
  }

  //左
  xx = x;
  yy = y;
  tmp = [];

  while(true){
    xx--;
    if(othello[yy][xx] === notNextUser){
      tmp.push({'y': yy, 'x': xx});
    }else{
      if(othello[yy][xx] === nextUser) for(let s of tmp) ans.push(s);
      break;
    }
  }

  //下
  xx = x;
  yy = y;
  tmp = [];

  while(true){
    yy++;
    if(othello[yy][xx] === notNextUser){
      tmp.push({'y': yy, 'x': xx});
    }else{
      if(othello[yy][xx] === nextUser) for(let s of tmp) ans.push(s);
      break;
    }
  }

  //上
  xx = x;
  yy = y;
  tmp = [];

  while(true){
    yy--;
    if(othello[yy][xx] === notNextUser){
      tmp.push({'y': yy,'x': xx});
    }else{
      if(othello[yy][xx] === nextUser) for(let s of tmp) ans.push(s);
      break
    }
  }

  //右下
  xx = x;
  yy = y;
  tmp = [];

  while(true){
    xx++;
    yy++;
    if(othello[yy][xx] === notNextUser){
      tmp.push({'y': yy, 'x': xx});
    }else{
      if(othello[yy][xx] === nextUser) for(let s of tmp) ans.push(s);
      break;
    }
  }

  //右上
  xx = x;
  yy = y;
  tmp = [];

  while(true){
    xx++;
    yy--;
    if(othello[yy][xx] === notNextUser){
      tmp.push({'y': yy, 'x': xx});
    }else{
      if(othello[yy][xx] === nextUser) for(let s of tmp) ans.push(s);
      break;
    }
  }

  //左下
  xx = x;
  yy = y;
  tmp = [];

  while(true){
    xx--;
    yy++;
    if(othello[yy][xx] === notNextUser){
      tmp.push({'y': yy, 'x': xx});
    }else{
      if(othello[yy][xx] === nextUser) for(let s of tmp) ans.push(s);
      break;
    }
  }
  //左上
  xx = x;
  yy = y;
  tmp = [];
  while(true){
    xx--;
    yy--;
    if(othello[yy][xx] === notNextUser){
      tmp.push({'y':yy,'x':xx});
    }else{
      if(othello[yy][xx] === nextUser) for(let s of tmp) ans.push(s);
      break
    }
  }
  return(ans)
};

const sound = {
  place: new Audio('./sounds/place.mp3'),
  error: new Audio('./sounds/error.mp3')
};

const hrefInf = new URI(location.href);
const hrefQuery = hrefInf.query(true);

let socket;

let remote = false;
// let subClient = false;
let wOrB = '';
if (typeof(io) !== 'undefined') {
  socket = io.connect();

  socket.emit('idToColor', hrefQuery['id'], color => {
    wOrB = color;
  });

  /*
  setInterval(() => {
    socket.emit('subClient', null, client => {
      subClient = client;
      console.log(client);
    });
  }, 100);
  */

  socket.on('reversed', s => {
    remote = true;
    $(`#${s}`).click();
  });
}

let turn = 1;

const squareJq = $('.square');

squareJq.on('click', function () {
  let clickId = $(this).find('.stone').attr('id').replace(/s/, '').split('');
  let searchResult = search(clickId[0], clickId[1]);
  if (!searchResult[0] || (!remote && typeof(io) !== 'undefined' && wOrB === 'white' && turn%2 !== 0) || (!remote && typeof(io) !== 'undefined' && wOrB === 'black' && turn%2 === 0)) {
    sound.error.currentTime = 0;
    sound.error.play();
    return false;
  }
  if (!remote && typeof(io) !== 'undefined') socket.emit('reverse', {id: hrefQuery['id'], s: $(this).children('div').prop('id')});
  othello[clickId[0]][clickId[1]] = nextUser;
  console.log(searchResult[0].x);
  print();
  for(let s of searchResult) othello[s.y][s.x] = nextUser;
  print();
  sound.place.play();
  let tmp = nextUser;
  nextUser = notNextUser;
  notNextUser = tmp;
  turn++;
  remote = false;
});

squareJq.mouseenter(function () {
  let clickId = $(this).find('.stone').attr('id').replace(/s/,'').split('');
  let searchResult = search(clickId[0],clickId[1]);
  if(!searchResult[0]){
    return false;
  }else{
    $(this).addClass('available');
  }
});

squareJq.mouseout(function () {
  $(this).removeClass('available');
});

const wrapperJq = $('.wrapper');

$(window).click(function (e) {
  console.log(e.target);

  if(e.target === $('main')[0]){
    wrapperJq.toggleClass('black');
    wrapperJq.toggleClass('white');
  }
});
