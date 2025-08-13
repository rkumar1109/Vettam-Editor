import React from 'react';
import TiptapEditor from './src/components/Editor/TiptapEditor';
import './app.css';

function App() {
  return (
    <div className="App">
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Legal Document Editor</h1>
        <p className="text-gray-300 text-sm mt-1">Tiptap Pagination Demo</p>
      </header>
      <main className="flex-1 bg-gray-100 min-h-screen">
        <TiptapEditor />
      </main>
    </div>
  );
}

export default App;