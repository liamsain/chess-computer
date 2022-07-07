import './style.css'
import { createBoard, printBoardOffsets } from './chess';

const board = createBoard();

const renderBoard = () => {
  const boardOffsets = printBoardOffsets(board);
  const rows = boardOffsets.split('\n');
  let result = '<div>';
  rows.forEach(row => {
    result += '<div style="display: flex;">';
    row.split('\t').forEach(s => { result += `<div class="square"><p>${s}</p></div>` });
    result += '</div>';
  });
  result += '</div>';
  return result;
};

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = renderBoard();
