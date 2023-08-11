import {Message} from 'element-ui'

export function debounce(fn, delay) {
  var delay = delay || 200;
  var timer;
  return function () {
    var th = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(th, args);
    }, delay);
  };
}

export function throttle(fn, delay) {
  var last;
  var timer;
  var interval = interval || 200;
  return function () {
    var th = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  }
}
export async function valiFunc(arr) {
  let res = true
  for (let item of arr) {
    if (!item.data || item.data.length === 0) {
      res = false
      Message({
        message: item.msg,
        type: 'error',
        offset: 60
      })
      break
    }
  }
  return res
}

export function bottomHandle (isScroll, callback) {
  // window.onscroll = throttle(scrollChange.bind(null, isScroll, callback), 200)
  window.addEventListener('scroll', throttleScroll(isScroll, callback), 200)
}

export function clearBottomHandle () {
  window.removeEventListener('scroll', throttleScroll)
}


function scrollChange (isScroll, callback) {
  if (!isScroll()) return
  const scrollTop = Math.ceil(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset)
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || window.scrollHeight
  if (scrollTop + windowHeight >= scrollHeight) {
    // console.log(scrollTop, windowHeight, scrollHeight)
    callback()
  }
}

// 节流滚动方法
const throttleScroll = (isScroll, callback) => throttle(scrollChange.bind(null, isScroll, callback), 200)

/** 数组转化为字符串*/
export function arrayToString(arr, field, isTrans) {
  isTrans = typeof isTrans !== 'undefined' ? isTrans : false;
  var idr = [];
  for (var i = 0; i < arr.length; i++) {
    idr.push(arr[i][field]);
  }
  if (isTrans === true) {
    return idr.join(",");
  } else {
    return idr;
  }
}

export function timeFormat(timestamp) {
  const now = new Date();
  const datetime = new Date(timestamp);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today - 24 * 60 * 60 * 1000);
  const weekStart = new Date(today - (today.getDay() - 1) * 24 * 60 * 60 * 1000);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  if ( datetime >= today) {
    return date('H:i', timestamp / 1000)
  } else if (datetime >= yesterday && datetime < today) {
    return '昨天'
  } else if (datetime >= weekStart && datetime < yesterday) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[datetime.getDay()];
  }else if (datetime >= yearStart && datetime < weekStart) {
    return date('m-d', timestamp / 1000)
  } else {
    return date('Y-m-d', timestamp / 1000)
  }
}

export function generateRandId(){
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}

export function searchObject(array, field, keywords) {
  if (typeof array !== 'object') {
    return false;
  } else {
    var found = [];
    for (var i = 0; array.length > i; i++) {
      if (typeof field == 'object') {
        for (var j = 0; field.length > j; j++) {
          var field_str = field[j];
          var str = array[i][field_str];
          // 只需要匹配到一个即可
          if (str.indexOf(keywords) != -1) {
            found.push(array[i]);
            break;
          }
        }
      } else {
        var str = array[i][field];
        if (str.indexOf(keywords) != -1) {
          found.push(array[i]);
        }
      }
    }
    return found;
  }
}

export function delArrValue(arr, field, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

/**
 * 和PHP一样的时间戳格式化函数
 * @param {string} format 格式
 * @param {int} timestamp 要格式化的时间 默认为当前时间
 * @return {string}   格式化的时间字符串
 */
export function date(format, timestamp) {
  var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
  var pad = function(n, c) {
    if ((n = n + "").length < c) {
      return new Array(++c - n.length).join("0") + n;
    } else {
      return n;
    }
  };
  var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var txt_ordin = { 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st" };
  var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var f = {
    // Day
    d: function() { return pad(f.j(), 2) },
    D: function() { return f.l().substr(0, 3) },
    j: function() { return jsdate.getDate() },
    l: function() { return txt_weekdays[f.w()] },
    N: function() { return f.w() + 1 },
    S: function() { return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th' },
    w: function() { return jsdate.getDay() },
    z: function() { return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0 },

    // Week
    W: function() {
      var a = f.z(),
          b = 364 + f.L() - a;
      var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
      if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
        return 1;
      } else {
        if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
          nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
          return date("W", Math.round(nd2.getTime() / 1000));
        } else {
          return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
        }
      }
    },

    // Month
    F: function() { return txt_months[f.n()] },
    m: function() { return pad(f.n(), 2) },
    M: function() { return f.F().substr(0, 3) },
    n: function() { return jsdate.getMonth() + 1 },
    t: function() {
      var n;
      if ((n = jsdate.getMonth() + 1) === 2) {
        return 28 + f.L();
      } else {
        if (n & 1 && n < 8 || !(n & 1) && n > 7) {
          return 31;
        } else {
          return 30;
        }
      }
    },

    // Year
    L: function() { var y = f.Y(); return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0 },
    //o not supported yet
    Y: function() { return jsdate.getFullYear() },
    y: function() { return (jsdate.getFullYear() + "").slice(2) },

    // Time
    a: function() { return jsdate.getHours() > 11 ? "pm" : "am" },
    A: function() { return f.a().toUpperCase() },
    B: function() {
      // peter paul koch:
      var off = (jsdate.getTimezoneOffset() + 60) * 60;
      var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
      var beat = Math.floor(theSeconds / 86.4);
      if (beat > 1000) beat -= 1000;
      if (beat < 0) beat += 1000;
      if ((String(beat)).length === 1) beat = "00" + beat;
      if ((String(beat)).length === 2) beat = "0" + beat;
      return beat;
    },
    g: function() { return jsdate.getHours() % 12 || 12 },
    G: function() { return jsdate.getHours() },
    h: function() { return pad(f.g(), 2) },
    H: function() { return pad(jsdate.getHours(), 2) },
    i: function() { return pad(jsdate.getMinutes(), 2) },
    s: function() { return pad(jsdate.getSeconds(), 2) },
    //u not supported yet

    // Timezone
    //e not supported yet
    //I not supported yet
    O: function() {
      var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
      if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
      else t = "+" + t;
      return t;
    },
    P: function() { var O = f.O(); return (O.substr(0, 3) + ":" + O.substr(3, 2)) },
    //T not supported yet
    //Z not supported yet

    // Full Date/Time
    c: function() { return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P() },
    //r not supported yet
    U: function() { return Math.round(jsdate.getTime() / 1000) }
  };
  let ret = '';
  return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
    if (t !== s) {
      // escaped
      ret = s;
    } else if (f[s]) {
      // a date function exists
      ret = f[s]();
    } else {
      // nothing special
      ret = s;
    }
    return ret;
  });
}