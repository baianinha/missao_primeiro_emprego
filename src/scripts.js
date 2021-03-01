// escrevendo as regras do css no javascript
const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

// --agora vou apendar as propriedades
const root = document.documentElement; // --elemento global
root.style.setProperty('--tile-size',`${TILE_SIZE}px`); // 48px
root.style.setProperty('--helmet-offset',`${HELMET_OFFSET}px`); // 12px
root.style.setProperty('--game-size',`${GAME_SIZE}px`); // 48*20 = 960px


// ------ criando uma função para fazer o jogo rodar

function createBoard(){
  const boardElement = document.getElementById('board');
  const elements = []; // lista vazia

  function createElement(options) {
    let { item, top, left } = options;

    const currentElement = { item, currentPosition: { top, left}}; // top e left são uma unidade
    elements.push(currentElement); // puxa todos elementos

    // console.log(elements);


    // criar do zero uma div para renderizar nossos personagens
    const htmlElement = document.createElement('div');
    htmlElement.className = item;
    htmlElement.style.top =  `${top}px`;
    htmlElement.style.left =  `${left}px`;
    // apendar (colocar a classe html no codigo)
    boardElement.appendChild(htmlElement);

    function getNewDirection(buttonPressed, position) {
      switch (buttonPressed){
        case 'ArrowUp':
          return {top: position.top - TILE_SIZE, left: position.left}; // manipular o top e o left para movimentzção
        case 'ArrowRight':
          return {top: position.top, left: position.left + TILE_SIZE};
        case 'ArrowDown':
          return {top: position.top + TILE_SIZE, left: position.left};   
        case 'ArrowLeft':
          return {top: position.top, left: position.left - TILE_SIZE}; 
        default:
          return position; // se não tiver nenhum dos casoas acima, vai retornar ao inicial
      }
    }

    function validateMoviment(position, conflictItem) { //retorna um boleano 
      return (
        position.left >= 48 &&
        position.left <= 864 &&
        position.top >= 96 &&
        position.top <= 816  && 
        conflictItem?.item  !== 'forniture' // o ? significa que se a variavel conflictItem tiver conflito, ela vai procurar o item
      )
    }

    function getMovimentConflict(position, els) {
      const conflictItem = els.find((currentElement) => {
        return (
          currentElement.currentPosition.top === position.top && //true
          currentElement.currentPosition.left === position.left 
        )
      });

      return conflictItem;

    }

    function validateConflicts( currentEl, conflictItem) {
      function finishGame(message){
        setTimeout(() => {
          alert(message);
          location.reload();
        }, 100);
        
      }
      if(!conflictItem) {
        return;
      }

      if (currentEl.item === 'hero') {
        if (
          conflictItem.item === 'mini-demon' ||  // conflictitem?.item valida o coflito(outra forma)
          conflictItem.item === 'trap'
        ) { 
          finishGame( 'você morreu'); 
        }

        if (conflictItem.item === 'chest') {
          finishGame('você ganhou!');
        }

      } 
      
      if (currentEl.item === 'mini-demon' && conflictItem.item === 'hero') {
        finishGame('você morreu'); // se mini demon passa por cima do hero, o hero tbm morre
      }

    }

    function move(buttonPressed) {
      // console.log('move', buttonPressed);
      // console.log(elements)

      const newPosition = getNewDirection(buttonPressed, currentElement.currentPosition);
      const conflictItem = getMovimentConflict(newPosition, elements); // aqui vou mapear as areas de conflito
      const isValidMoviment = validateMoviment(newPosition, conflictItem); // validando movimentações no eixo x

      // console.log(isValidMoviment)

      if (isValidMoviment) {  // condição
        currentElement.currentPosition = newPosition;
        htmlElement.style.top =  `${newPosition.top}px`;
        htmlElement.style.left =  `${newPosition.left}px`;

        validateConflicts( currentElement, conflictItem);
      }  
    } 

    return {
      move: move
    } //externaliza a função move
  }

  function createItem(options) {
    createElement(options);
  }

  function createHero(options) {
    const hero = createElement({
      item: 'hero',
      top: options.top,
      left: options.left
    });

    document.addEventListener('keydown', (event) => {
      console.log('keydown foi pressionado', event.key);
      hero.move(event.key);
    }); // coloca varios eventos
  }

  function createEnemy(options) {
    const enemy = createElement({
      item: 'mini-demon',
      top: options.top,
      left: options.left
    });
    // ele vai se movimentar aleatoriamente num determinado tempo
    setInterval(() => {
      const direction = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']; //4 posições = 0 a 3
      const randomIndex = Math.floor(Math.random() * direction.length); //remover as casas dos numeros gerados
      const randomDirection = direction[randomIndex];
      
      enemy.move(randomDirection);
    }, 1000)
  }

  


  return {
    createItem: createItem,  // externalizar
    createHero: createHero,
    createEnemy: createEnemy

  }
}

const board = createBoard();
// item que vai ser renderizado(item) -> mini-demom| chest | hero | trap
// posição x(top) - number
// posição y(left) - number
board.createItem({ item: 'trap', top: TILE_SIZE * 10, left: TILE_SIZE * 10});
board.createItem({ item: 'chest', top: TILE_SIZE * 2, left: TILE_SIZE * 18});

board.createItem({ item: 'forniture', top: TILE_SIZE * 17, left: TILE_SIZE * 2});
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 8});
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 16});
board.createItem({ item: 'forniture', top: TILE_SIZE * 2, left: TILE_SIZE * 3});

board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});
board.createEnemy({  top: TILE_SIZE * 5, left: TILE_SIZE * 5});

board.createHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2});
