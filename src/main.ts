import './style.css'
import { createBoard, printBoardState } from './pieces';

const board = createBoard();
console.log(printBoardState(board));

// const app = document.querySelector<HTMLDivElement>('#app')!

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `
