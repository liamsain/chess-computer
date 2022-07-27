import './style.css'
import { createBoard, printBoardOffsets, getCoordFromOffset, getOffsetFromCoord, getKingMoves, getBishopMoves, getRookMoves, getKnightMoves, getQueenMoves } from './chess';
import  blackBishop  from '../assets/bB.png';

const board = createBoard();
const renderBoard = () => {
  const boardOffsets = printBoardOffsets(board);
  const rows = boardOffsets.split('\n');
  let result = '<div>';
  rows.forEach(row => {
    result += '<div style="display: flex;">';
    row.split('\t').forEach((s, i) => {
      // const classes = `class="square ${Number(s) !== 0 && i % 2 === 0 ? 'square--black' : ''}"`
      const classes = `class="square" `
       result += `<div ${classes} offset="${s}" ondragover="ev => ev.preventDefault()">${(Number(s))}</div>` 
    });
    result += '</div>';
  });
  result += '</div>';
  return result;
};

const boardHtml = renderBoard();

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = boardHtml;
app.innerHTML += `<img class="grabbable" src=${blackBishop} height="35px" draggable="true"/>`;

document.querySelectorAll('.square')
  .forEach(x => {
    x.addEventListener('click', (ev) => {
       const offset = (ev.target.getAttribute('offset') )
      console.log('offset: ', offset, getKingMoves(Number(offset ), board));
      }
    )
});
