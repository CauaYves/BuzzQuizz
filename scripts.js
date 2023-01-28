// Começo - JS Yves
//variáveis correspondidas a criação do quizz (tela 3.1)
let titulo;
let urlImagem;
let perguntas;
let niveis;


function mudarTela(classe){
    
    const telaAtual = document.querySelectorAll('.active');
    telaAtual.forEach((telaAtual) => {
    telaAtual.classList.remove('active');
    });
    document.querySelector(classe).classList.add("active");
}


function ehUrl(url){

    let https = 'https://'
    let http = 'http://'

    for(let i = 0; i < http.length; i++){
        
        if(url[i] === https[i] || url[i] === http[i]){
            return true
        }
        return false

    }
}

let formCriacao = document.querySelector('.form-info').childNodes[3];

function inputsCheio(){
    for(let i = 0; i < formCriacao.length; i++){ //quando tiver funcionando, remover o laço for

        if(formCriacao[i].value !== '' && ehUrl(formCriacao[1].value) && formCriacao[2].value >= 3 && formCriacao[3].value >= 2){

            titulo = formCriacao[1];
            urlImagem = formCriacao[2];
            perguntas = formCriacao[3]
            niveis = formCriacao [4]

            // mudarTela('#creation-quizz');            
            finishQuizz()
        }else{
            alert('campo inválido')
            return
        }

    }
    
}

let quizzInfo = {

        pergunta:{

        textPerg: '',
        fundoPerg: '',

        respostaCorreta:{

            resCorreta: '',
            ulrImg: '',
        },
        respostasIncorretas:{

            resIncorreta: '',
            ulrImg: '',

            resIncorreta2: '',
            ulrImg2: '',

            resIncorreta3: '',
            ulrImg3: '',

        }
        
    }

}

function finishQuizz(){
    let i = 1;
    let quizzMain = document.querySelector('#perguntas');
    while( i < perguntas + 1 ){

    quizzMain.innerHTML +=  `
    <form class="question">
            <div class="title-form">
                <h4>pergunta ${i}</h4>
                <ion-icon name="open-outline" id="open-icon"></ion-icon>
            </div>
            <input type="text" placeholder="Texto da pergunta">
            <input type="text" placeholder="Cor de fundo da pergunta">
            <div class="title-form">
                <h4>Resposta correta</h4>
            </div>
            <input type="text" placeholder="Resposta correta">
            <input type="text" placeholder="URL da imagem">
            <div class="title-form">
                <h4>Respostas incorretas</h4>
            </div>
            <input type="text"  placeholder="Resposta incorreta 1">
            <input type="text"  placeholder="URL da imagem 1">
            <br>
            <br>
            <input type="text"  placeholder="Resposta incorreta 2">
            <input type="text"  placeholder="URL da imagem 2">
            <br>
            <br>
            <input type="text"  placeholder="Resposta incorreta 3">
            <input type="text"  placeholder="URL da imagem 3">
            <br>
            <br>
        </form>
    `
       i++
    }
    console.log(quizzMain.innerHTML);


    //validação pegar o nodeChilds do form e inserir as verificações
    //rodar um loop para verificar se todos os campos estão preenchidos, caso estejam, 
}


//Fim - JS Yves

// Começo - JS Fernando

let arrTelaQuizzDados = [];
let acertosQuizz = 0;
/*
Função para recomeçar o quizz. Ela zera o valor dos acertos, e reutiliza os dados já armazenados
do quizz para montar a página. Esconde os resultados e as opções no fim, que serão reescritas
na montagem da página. Scrolla para o subtítulo (começo da página)
*/
function reiniciarQuizz(){
    montarQuizz(arrTelaQuizzDados);
    document.querySelector('.results-box').classList.remove('active');
    document.querySelector('.quizz-end').classList.remove('active');
    document.querySelector('.title-quizz h2').scrollIntoView({behavior: "smooth"});
}
/*
Função que só ocorre depois que todos question-box estão disabled, após responderQuizz(). (Ou seja, todas
as perguntas foram respondidas). Calcula a porcentagem de acertos, e procura no array de levels (nível
do resultado) o maior nível que ultrapassa o score da pessoa. Após isso, pega o level anterior a este.
Caso não haja nível maior, significa que foi alcançado level máximo.
Monta a tela de resultados. Exibe a tela de resultados e os botões de reiniciar/retornar.
*/
function mostrarResultados(){
    const porcentagemAcertos = Math.round(acertosQuizz/arrTelaQuizzDados.questions.length*100);
    //Verificar qual colocação o usuário tirou
    const level = arrTelaQuizzDados.levels;
    let colocacaoIndex = level.findIndex(function(level){
        if(level.minValue>porcentagemAcertos){
            return true;
        }
    });
    //Se certifica se, se não houver valores maiores, está na última colocação
    if (colocacaoIndex == -1) colocacaoIndex=level.length;
    const resultado = level[colocacaoIndex-1];
    const telaResultado = document.querySelector('.results-box');
    telaResultado.innerHTML = `<div class="results-title">${porcentagemAcertos}% de acerto: ${resultado.title}</div>
                                <div class="results-content">
                                    <img src="${resultado.image}" alt="">
                                    <p>${resultado.text}</p>
                                </div>`;
    //Dois segundos de delay para ativar a tela de resultados e scrollar até ela
    setTimeout(() => {
        telaResultado.classList.add('active');
        document.querySelector('.quizz-end').classList.add('active');
        telaResultado.scrollIntoView({behavior: "smooth"});      
    }, 2000);    
}

/*
//Função que funciona ao escolher alguma resposta do quizz. Revela qual a resposta verdadeira,
e torna o question-box em disabled. Scrolla para o próximo elemento (nextSibling).
Irá contabilizar os pontos
*/
function responderQuizz(escolha){
    const respostaEscolhida = escolha.getAttribute('iscorrectanswer');
    if(respostaEscolhida=='true') acertosQuizz ++;        
    //Desabilita o container. A CLASSE DISABLED DESABILITA EVENTOS DE CLIQUE PELO CSS
    const respostaDesabilitada = escolha.parentNode;   
    respostaDesabilitada.classList.add('disabled');
    const respostaLiberada = respostaDesabilitada.querySelector('[iscorrectanswer="true"]');
    respostaLiberada.setAttribute('id', 'correct');
    const perguntasRespondidas = document.querySelectorAll('.disabled');
    //Se o número de perguntas respondidas for igual ao número total de questões, scrolla para resultados
    //Se não, scrolla para próxima pergunta
    if(perguntasRespondidas.length==arrTelaQuizzDados.questions.length)
    {
        mostrarResultados();
    }
    else{
        //Dois segundos para o scroll
        setTimeout(() => {
            try {
                respostaDesabilitada.parentNode.nextSibling.scrollIntoView({behavior: "smooth"});
            } catch (err) {
                document.querySelector('.question-box').scrollIntoView({behavior: "smooth"}); 
            }                  
        }, 2000);
    }
    //Posso tratar o erro dessa forma? Volta ao primeiro se responder o último.
    //Tem a propriedade scroll-margin-top no CSS para compensar o scroll do header
}

//Função comparadora para misturar as respostas;
function comparador() { 
	return Math.random() - 0.5; 
}

/*
Função para montar cada pergunta dentro do quizz. O bloco question-box inteiro é montado.
Primeiro as respostas são recuperadas e randomizadas dentro do arrRespostas.
Depois, todas as respostas de uma vez são inseridas no question-box.
O atributo isCorrectAnswers indica se a resposta é correta ou não, retirado do próprio axios.get
*/
function montaCaixaPergunta(blocoPerguntas, pergunta){    
    //Tratamento perguntas
    const arrRespostas = pergunta.answers
    arrRespostas.sort(comparador);
    let element = "";
    arrRespostas.forEach(resposta => {
        element += `<div iscorrectanswer="${resposta.isCorrectAnswer}" onclick="responderQuizz(this)"><img src="${resposta.image}" alt=""><p>${resposta.text}</p></div>`;
    });
    blocoPerguntas.innerHTML += `<div class="question-box">
                                    <div class="question-title" style="background-color:${pergunta.color}">${pergunta.title}</div>
                                    <div class="answers">
                                    ${element}                                       
                                    </div>
                                </div>`;
}

/*
Função para montar a página do quizz. Primeiro é montada a parte do título com seu background.
Depois, chama outra função para montar as perguntas. Após isso, monta o resultado.
COMO MONTAR O RESULTADO ainda deve ser definido.
*/
function montarQuizz(quizzData){
    arrTelaQuizzDados = [];
    acertosQuizz = 0;
    const tituloQuizz = document.querySelector('.title-quizz h2');
    tituloQuizz.innerHTML = quizzData.title;    
    tituloQuizz.style.background = `linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url("${quizzData.image}")`;
    //Monta as perguntas
    const blocoPerguntas = document.querySelector('.questions');
    blocoPerguntas.innerHTML = "";
    quizzData.questions.forEach(function (pergunta){
        montaCaixaPergunta(blocoPerguntas,pergunta);
    });
    //Monta o resultado
    const resultado = document.querySelector('.results-box');
    //INSERIR AQUI FUNÇÃO PARA CALCULAR O RESULTADO FINAL
    resultado.innerHTML = "";
    arrTelaQuizzDados = quizzData; //transfere dados para a var global
}
/*
Função para ativar a página do quizz escolhido. Recebe um id, e requisita ao servidor.
Caso dê erro, TRATAR DA VOLTA À PÁGINA PRINCIPAL. Com acerto, segue para a montagem do quizz.
*/
function iniciarQuizz(id){    
    //Faz requisição para pegar dados do quizz
    const quizz = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`)
    quizz.then(quizzOk => {
        console.log(quizzOk);
        const desativar = document.querySelectorAll('.active');
        desativar.forEach(elemento => (elemento.classList.remove('active')));
        document.querySelector('.screen-quizz').classList.add('active');
        montarQuizz(quizzOk.data);
    })
    .catch(err => {
        console.log(err);
        alert('Deu erro! Bota função de voltar pra página inicial');
    });
}

//Fim - JS Fernando



//Começo - JS Barci

/*Funções teste que serão apagadas ao final do projeto

const quizTeste = {title: "Título do quizz", image: "https://pop.proddigital.com.br/wp-content/uploads/sites/8/2022/10/f.jpg",questions: [{title: "Título da pergunta 1", color: "#123456", answers: [{ text: "Texto da resposta 1", image: "https://http.cat/411.jpg", isCorrectAnswer: true}, {text: "Texto da resposta 2", image: "https://http.cat/412.jpg", isCorrectAnswer: false}]},{title: "Título da pergunta 2", color: "#123456", answers: [{text: "Texto da resposta 1",image: "https://http.cat/411.jpg",isCorrectAnswer: true},{text: "Texto da resposta 2",image: "https://http.cat/412.jpg",isCorrectAnswer: false}]},{title: "Título da pergunta 3",color: "#123456",answers: [{text: "Texto da resposta 1",image: "https://http.cat/411.jpg",isCorrectAnswer: true},{text: "Texto da resposta 2",image: "https://http.cat/412.jpg",isCorrectAnswer: false}]}],levels: [{title: "Título do nível 1",image: "https://http.cat/411.jpg",text: "Descrição do nível 1",minValue: 0},{title: "Título do nível 2",image: "https://http.cat/412.jpg",text: "Descrição do nível 2",minValue: 50}]};

function sucessoCriacaoQuiz(resposta){
    let arrayQuizzesUsuario = [];

    if (localStorage.getItem('quizzesUsuario') === null){
        arrayQuizzesUsuario.push(resposta.data);
        localStorage.setItem('quizzesUsuario', JSON.stringify(arrayQuizzesUsuario));
    }else{
        arrayQuizzesUsuario = JSON.parse(localStorage.getItem('quizzesUsuario'));
        arrayQuizzesUsuario.push(resposta.data);
        localStorage.setItem('quizzesUsuario', JSON.stringify(arrayQuizzesUsuario));
    }

    obterQuizzesServidor();
}

function falhaCriacaoQuiz(){
    alert("Ocorreu um erro durante a criação desse quiz");
    window.location.reload();
}

function criarQuiz(){
    const novoQuiz = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", quizTeste);
    novoQuiz.then(sucessoCriacaoQuiz);
    novoQuiz.catch(falhaCriacaoQuiz);
}*/

function sucessoExclusaoQuiz(){
    window.location.reload();
}

function erroExclusaoQuiz(){
    alert("Ocorreu algum erro durante a exclusão desse quiz. Por favor, tente novamente!");
    window.location.reload();
}

function excluirQuizz(id){
    let objsQuizzes;
    
    if (localStorage.getItem('quizzesUsuario') !== null){
        objsQuizzes = JSON.parse(localStorage.getItem('quizzesUsuario'));
    }

    for (let i = 0; i < objsQuizzes.length; i++){
        if (objsQuizzes[i].id === id){
            if (confirm("Você tem certeza que deseja excluir este quizz?") == true) {
                const exclusaoQuiz = axios.delete(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`, {headers: {'Secret-Key': objsQuizzes[i].key}});
                exclusaoQuiz.then(sucessoExclusaoQuiz);
                exclusaoQuiz.catch(erroExclusaoQuiz);
            }else {
                break;
            }
        }
    }

}

/*
Caso o servidor retorne a lista de quizzes sem nenhum erro,
essa função será responsável por tratar os dados de cada quiz, dividindo eles
entre quizzes feitos pelo usuário e quizzes gerais, exibindo eles na tela
*/
function sucessoRequisicaoQuizzes(resposta){
    let quizzesUsuario = [];
    let quizzes = [];
    let arrayId = [];
    const areaQuizzes = document.querySelector(".area-all-quizzes>div");
    const areaUsuarioQuizzes = document.querySelector(".my-quizzes");
    areaQuizzes.innerHTML = "";
    areaUsuarioQuizzes.innerHTML = "";

    const telaAtual = document.querySelectorAll('.active');
    telaAtual.forEach((telaAtual) => {
    telaAtual.classList.remove('active');
    });

    if (localStorage.getItem('quizzesUsuario') !== null){
        arrayId = JSON.parse(localStorage.getItem('quizzesUsuario'));
    }
    
    for (let i = 0; i < resposta.data.length; i++){
        if (arrayId.some(item => item.id === resposta.data[i].id)){
            quizzesUsuario.push(resposta.data[i]);
        }else{
            quizzes.push(resposta.data[i]);
        }
    }

    if (quizzesUsuario.length === 0){
        document.querySelector(".screen-list-quizzes").classList.add("active");
        document.querySelector(".area-creation-quizz").classList.add("active");
    }else{
        for (j = 0; j < quizzesUsuario.length; j++){
            areaUsuarioQuizzes.innerHTML += `<div class="card-quizz"> <h2>${quizzesUsuario[j].title}</h2> <div class="options-quizzes"> <img src="imagens/Edit.png"/> <img onclick="excluirQuizz(${quizzesUsuario[j].id})" src="imagens/Trash.png"/></div></div>`;
            document.querySelector(".my-quizzes .card-quizz:nth-last-child(1)").style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzesUsuario[j].image}), url(imagens/BuzzFeed-Logo.jpeg)`;
        }
        document.querySelector(".screen-list-quizzes").classList.add("active");
        document.querySelector(".area-my-quizzes").classList.add("active");
    }

    for (let k = 0; k < quizzes.length; k++){
        areaQuizzes.innerHTML += `<div class="card-quizz"> <h2>${quizzes[k].title}</h2> </div>`;
        document.querySelector(".area-all-quizzes .card-quizz:nth-last-child(1)").style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzes[k].image}), url(imagens/BuzzFeed-Logo.jpeg)`;
    }
}

/*
Caso ocorra algum erro ao recuperar os quizzes que estão
no servidor, essa função irá enviar um alert e depois disso atualizar
a página para tentar realizar uma nova requisição
*/
function falhaRequisicaoQuizzes(){
    alert("Ocorreu um erro no servidor");
    window.location.reload();
}

/*
Função responsável por fazer a requisição ao servidor
solicitando todos os quizzes já feitos 
*/
function obterQuizzesServidor(){
    const quizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    document.querySelector(".screen-loading").classList.add("active");

    quizzes.then(sucessoRequisicaoQuizzes);
    quizzes.catch(falhaRequisicaoQuizzes);
}

//obterQuizzesServidor();
//Fim - JS Barci
