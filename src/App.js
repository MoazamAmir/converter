import React from 'react';
import useConverter from './hooks/useConverter';
import ConverterUI from './components/ConverterUI';

function App() {
  const vm = useConverter();
  return <ConverterUI {...vm} />;
}

export default App;