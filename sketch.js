let altura = 500;
let tempoEmbaralhamento = 60;

// Numero de tiles
let N = 4;
let tam;
let cor;
let frameAtual = 0;


let board = [];

//----------------------MAIN----------------------

function setup() {
	createCanvas(500, 500);
	let valor = 1;
	tam = altura/N;
	cor = "#addcff";

	for(let i = 0; i < N; i++){
		board[i] = [];
		for(let j = 0; j < N; j++){
			board[i][j] = new Tile(i, j, valor);
			valor++;
		}
	}
	board[N-1][N-1] = null;

	frameRate(50);
}

function draw() {
	background(cor);

	// desenha os quadrados com os numeros da matriz board

	for(let i = 0; i < N; i++){
		for(let j = 0; j < N; j++){
			if(board[i][j] != null){
				board[i][j].draw();
			}
		}
	}

	if(frameCount - frameAtual < N*tempoEmbaralhamento){
		embaralha();
	} else if(checa()){
		cor = "#38ff67";
		fill('purple');
		rectMode(CENTER);
		rect(250,250, 500, 100);
		textSize(36);
		fill(0);

		if(N == 2){
			text('Eu fazia isso com 1 ano', 250, 250);
		} else if(N == 3){
			text('Eu fazia isso com 3 anos', 250, 250);
		} else if(N == 4){
			text('4 eh facil, esperava mais', 250, 250);
		} else if(N == 5){
			text('Harvard: Mano quer um curso?', 250, 250);
		} else if(N == 6){
			text('Quer ser meu parente?', 250, 250);
		} else if(N >= 7){
			text('BOA ja pode ganhar nobel', 250, 250);

		}
	}
}



//------------------FUNCOES IMPORTANTES----------------

function keyPressed() {
	let iant, inovo, jant, jnovo;

	inovo = tileVazio()[0];
	jnovo = tileVazio()[1];

  if (keyCode === DOWN_ARROW) {
		// move o tile e atualiza o board
		iant = inovo - 1;
		jant = jnovo;
    moveTile(iant, jant, inovo, jnovo);

  } else if(keyCode === UP_ARROW){
		// move o tile e atualiza o board
		iant = inovo + 1;
		jant = jnovo;
    moveTile(iant, jant, inovo, jnovo);

	} else if(keyCode === RIGHT_ARROW){
		// move o tile e atualiza o board
		iant = inovo;
		jant = jnovo - 1;
    moveTile(iant, jant, inovo, jnovo);

	} else if(keyCode === LEFT_ARROW){
		// move o tile e atualiza o board
		iant = inovo;
		jant = jnovo + 1;
    moveTile(iant, jant, inovo, jnovo);

	}

}

function keyTyped(){
	if(key === 'r'){
		reset();
	} else if(key === 't' && N < 15){
		N++;
		reset();
	} else if(key === 'e' && N > 2){
		N--;
		reset();
	}
}

function reset(){
	let valor = 1;
	frameAtual = frameCount;
	tam = altura/N;
	cor = "#addcff";

	for(let i = 0; i < N; i++){
		board[i] = [];
		for(let j = 0; j < N; j++){
			board[i][j] = new Tile(i, j, valor);
			valor++;
		}
	}
	board[N-1][N-1] = null;

}

function embaralha(){
	let vazio = tileVazio(), possibilidades = [], coord = [], alvo = [], ultimo = [];
	// encontra o espaco vazio e guarda o lugar dele! Move para uma direcao aleatoria
	//for(let n = 0; n < 100; n++){
		coord = [vazio[0], vazio[1] + 1];
		if(coord[0] >= 0 && coord[0] < N && coord[1] >= 0 && coord[1] < N && coord != ultimo){
			possibilidades.push(coord);
		}

		coord = [vazio[0], vazio[1] - 1];
		if(coord[0] >= 0 && coord[0] < N && coord[1] >= 0 && coord[1] < N && coord != ultimo){
			possibilidades.push(coord);
		}

		coord = [vazio[0] + 1, vazio[1]];
		if(coord[0] >= 0 && coord[0] < N && coord[1] >= 0 && coord[1] < N && coord != ultimo){
			possibilidades.push(coord);
		}

		coord = [vazio[0] - 1, vazio[1]];
		if(coord[0] >= 0 && coord[0] < N && coord[1] >= 0 && coord[1] < N && coord != ultimo){
			possibilidades.push(coord);
		}

		alvo = random(possibilidades);

		moveTile(alvo[0], alvo[1], vazio[0], vazio[1]);

		ultimo = vazio;
		vazio = alvo;
	//}
}

function checa(){
	let n = 1, numero;
	for(let i = 0; i < N; i++){
		for(let j = 0; j < N; j++){
			if(board[i][j] != null){
				if(board[i][j].getNum() != n){
					return false;
				}
				n++;
			} else if (n != N*N){
				return false;
			}
		}
	}
	return true;
}


//----------------------FUNCOES AUXILIARES-----------------

function indexToPixel(i){
	return(i*tam + tam/2);
}

function moveTile(iant, jant, inovo, jnovo){
	board[iant][jant].move(inovo, jnovo);
	board[inovo][jnovo] = board[iant][jant];
	board[iant][jant] = null;
}

function tileVazio(){
	// retorna a coord. [i,j] do espaco vazio
	let espaco = [0,0];
	for(let i = 0; i < N; i++){
		for(let j = 0; j < N; j++){
			if(board[i][j] == null){
				espaco = [i,j];
				return espaco;
			}
		}
	}
}

//--------------------------CLASSES-------------------

class Tile{
	constructor(i0, j0, numero){
		this.x = indexToPixel(j0);
		this.y = indexToPixel(i0);
		this.valor = numero;
	}

	draw(){
		strokeWeight(4);
		stroke(0);
		rectMode(CENTER);
		fill('yellow');
		rect(this.x, this.y, tam-10, tam-10);

		textSize(tam/3);
		textAlign(CENTER, CENTER);
		noStroke();
		fill(42);
		text(this.valor, this.x, this.y);
	}

	move(inovo, jnovo){
		if(inovo >= 0 && inovo < N && jnovo >= 0 && jnovo < N){
		this.x = indexToPixel(jnovo);
		this.y = indexToPixel(inovo);
		}
	}

	getNum(){ return(this.valor); }
}
