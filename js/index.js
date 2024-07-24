// See https://www.npmjs.com/package/parse-yarn-lock documentation.
/* import parse as parseYarnLock from 'https://cdn.jsdelivr.net/npm/yarn-lockfile@latest/+esm'; */
import {
  Terminal
} from 'xterm';

import * as handlebarsESMshImport from 'handlebars';
import moment from 'moment';
const handlebars = handlebarsESMshImport.default;

function showTimes() {
  let now = moment().format('YYYYMMDD-hhmmss');
  // console.log(now);
  document.getElementById('datetime1').innerText = now;
  let currentDate = new Date();
  let format = "YYYY-MM-DDTHH:mm:ss.SSSSZ";
  // Based on Intersection of RFC 3339 and ISO 8601 formats
  // https://ijmacd.github.io/rfc3339-iso8601/
  let dockerOCITimestamp = moment(currentDate).utc().format(format);
  // console.log(dockerOCITimestamp);
  document.getElementById('datetime2').innerText = dockerOCITimestamp;
}

var intervalId = window.setInterval(showTimes, 1000);

function pauseInterval() {
  if (intervalId != null) {
    clearInterval(intervalId);
    intervalId = null;
    document.getElementById('pause-button').classList.add('pauseActive');
  } else {
    intervalId = window.setInterval(showTimes, 1000);
    document.getElementById('pause-button').classList.remove('pauseActive');
  }
}

document.getElementById('pause-button').addEventListener('click', pauseInterval);

const PS1 = "docker@date-fiddle.js \x1B[1;3;31mxterm.js\x1B[0m $ ";
const terminal = new Terminal({ cursorBlink: 'block' });
/* const ws = new WebSocket("ws://localhost:3000", "echo-protocol"); */

function handlebarsDateFormat(dockerMetadataActionTagInputFormat) {
  // Compile the Handlebars template from input
  let template = handlebars.compile(dockerMetadataActionTagInputFormat);
  
  let currentDate = new Date();
  const context = {
    date: function (format) {
      return moment(currentDate).utc().format(format);
    }
  };
  // Execute the compiled template with the context
  const result = template(context);
  console.log(result);
  terminal.write(result);
  terminal.write("\r\n");
  return result;
}

/* handlebarsDateFormat("{{ date 'YYYYMMDD A' }}"); */

// Return number of printable ASCII chars in PS1
function promptLength(ps1) {
  const ANSIRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g ;
  const printableASCIIRegex = /[\x20-\x7E]*/g ;
  /* console.log( ps1.replace(ANSIRegex, '') ); */
  return ps1.replace(ANSIRegex, '').match(printableASCIIRegex).join("").length
}

var curr_line = "";
var cmd_history = [];

terminal.prompt = () => {
  if (curr_line) {
    let data = null
    if (/^{{.*}}$/.test(curr_line)) {
      data = { method: "handlebars", format: curr_line }
      handlebarsDateFormat(data.format);
    } else {
      data = { method: "command", command: curr_line };
    }
    
    // Possible to send command to websocket here
    /* ws.send(JSON.stringify(data)) ;*/
    console.log(data);
    terminal.write(PS1);
    console.log("length of PS1: " + PS1.length);
    /* terminal._core.buffer.x = PS1.length; */
  }
};

// Possible to receive data from websocket here
/* ws.onmessage = msg => {
  terminal.write("\r\n" + JSON.parse(msg.data).data);
  curr_line = "";
}; */

terminal.onKey((key) => {
  //Enter
  //console.log(key);
  let ev = key.domEvent;
  const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey && /^[\x20-\x7E]*$/.test(key.key);
  
  /* if (ev.key == '\r') xterm.write('\n'); */
  if (ev.keyCode === 13) {
    if (curr_line) {
      cmd_history.push(curr_line);
      terminal.write("\r\n");
      terminal.prompt();
      curr_line = "";
    }
  } else if (ev.keyCode === 8) {
    // Backspace
    // Don't delete the prompt
    // TODO: Fix buffer cursor so it starts after PS1
    console.log("xterm.js buffer x: " + terminal._core.buffer.x);
    console.log("xterm.js buffer y: " + terminal._core.buffer.y);
    console.log("PS1 length: " + promptLength(PS1));
    if (terminal._core.buffer.y > 0 || terminal._core.buffer.x > promptLength(PS1)) {
      // Always write the backspace sequence **before** forcibly moving the
      // (x, y) buffer location
      // Otherwise, it leaves blinking cursors on the left side,
      // and fails to delete the last char on the righthand side
      // of each line
      terminal.write('\b \b');
      // TODO: Implement xterm-readline instead of this hack
      if (terminal._core.buffer.x === 0 && terminal._core.buffer.y > 0)       {
        // Reinventing the square wheel... we'll call it 'rheedlyne'
        // It's like the Kroger brand version of readline, I guess...
        terminal._core.buffer.y--;
        terminal._core.buffer.x = terminal.cols;
        /* console.log(terminal._core); */
      }
      if (curr_line) {
        curr_line = curr_line.slice(0, curr_line.length - 1);
      }
    }
  } else if (printable) {
    curr_line += key.key;
    terminal.write(key.key);
  }
});

// paste values
// TODO: Figure out how to avoid the parse error on backspace
// TODO: Figure out how to process \x0D\x0A \r\n carriage return & newline without breaking prompt alignment 
/* terminal.onData( (data) => {
  // Check for printable ACII chars
  if (/^[\x20-\x7E]*$/.test(data)) {
    console.log("printable chars!");
    curr_line += data;
    terminal.write(data);
  } else {
    console.log('non printable char: ');
  }
  console.log(data);
}); */

/* terminal.onData( (data) => {
  console.log(data) ;
  console.log(/^[\x20-\x7E]*$/.test(data));
  console.log(data.charCodeAt(0));
  // If char is within printable range,
  // add to current line and write to xterm
if (/^[\x20-\x7E]*$/.test(data)) {
    console.log('non printable char: ');
  } else {
    curr_line += data;
    terminal.write(data);
  //}
}); */

// Initialize the terminal & print first prompt
terminal.open(document.getElementById('xterm1'));
terminal.write(PS1);

