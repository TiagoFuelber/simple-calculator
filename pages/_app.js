import { useState } from 'react';
import '../styles/globals.css'

function MyApp() {
  let [output, setOutput] = useState('');
  const handleInput = input => () => setOutput(output + input);

  const equals = () => {};

  const clear = () => setOutput('');
  
  return (
    <div className="App">
      <div className="calculator">
        <div className="output">{output}</div>
        <div className="keyboard">
          <button onClick={handleInput('1')} className="digit-1">1</button>
          <button onClick={handleInput('2')} className="digit-2">2</button>
          <button onClick={handleInput('3')} className="digit-3">3</button>
          <button onClick={handleInput('4')} className="digit-4">4</button>
          <button onClick={handleInput('5')} className="digit-5">5</button>
          <button onClick={handleInput('6')} className="digit-6">6</button>
          <button onClick={handleInput('7')} className="digit-7">7</button>
          <button onClick={handleInput('8')} className="digit-8">8</button>
          <button onClick={handleInput('9')} className="digit-9">9</button>
          <button onClick={handleInput('0')} className="digit-0">0</button>
          <button onClick={handleInput('+')} className="op-add">+</button>
          <button onClick={handleInput('-')} className="op-sub">-</button>
          <button onClick={handleInput('*')} className="op-mul">*</button>
          <button onClick={handleInput('/')} className="op-div">/</button>
          <button onClick={equals} className="equal">=</button>
          <button onClick={clear} className="clear">C</button>
        </div>
      </div>
    </div>
  );
}

export default MyApp
