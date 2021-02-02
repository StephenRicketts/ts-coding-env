import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin'
import CodeEditor from './components/code-editor';
import Preview from './components/preview'

const App = () => {

  const ref = useRef<any>();
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });
    
  };

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    });
    
    setCode(result.outputFiles[0].text);
    


      
  };

  useEffect(() => {
    startService();
  }, []);




  return (
  <div>
    <CodeEditor 
    onChange={(value) => setInput(value)} 
    initialValue="" />
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <Preview code={code} />
  </div>
  );
};


ReactDom.render(
  <App/>,
  document.querySelector('#root')
);