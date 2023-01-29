//Começo - JS TELAS 3.1/3.2/3.3/3.4

let objQuizFinal = {};
let qtdPerguntas;
let qtdNiveis;

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

    document.querySelector(".image-quizz").style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${resposta.data.image}), url(imagens/BuzzFeed-Logo.jpeg)`;
    document.querySelector(".image-quizz h2").innerHTML = resposta.data.title;
    document.querySelector(".done-quizz button").setAttribute("onclick",`iniciarQuizz(${resposta.data.id});`);


    mudarTela(".done-quizz");
    window.scrollTo(0,0);
}

function falhaCriacaoQuiz(){
    alert("Ocorreu um erro durante a criação desse quiz");
    window.location.reload();
}

function finalizarQuiz(){
    let arrayLevels = [];
    let objLevelAtual = {};

    for (let i = 0; i < qtdNiveis; i++){
        let questionAtual = document.querySelectorAll(`.area-level .level:nth-of-type(${i+1})>input`);

        console.log(questionAtual);
        objLevelAtual.title = questionAtual[0].value;
        objLevelAtual.minValue = parseFloat(questionAtual[1].value);
        objLevelAtual.image = questionAtual[2].value;
        objLevelAtual.text = document.querySelector(`.area-level .level:nth-of-type(${i+1})>textarea`).value;

        arrayLevels.push(JSON.parse(JSON.stringify(objLevelAtual)));
    }

    objQuizFinal.levels = arrayLevels;

    const novoQuiz = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", objQuizFinal);
    document.querySelector(".screen-loading").classList.add("active");
    novoQuiz.then(sucessoCriacaoQuiz);
    novoQuiz.catch(falhaCriacaoQuiz);
}

function criarPerguntas(proxPagina){
    let arrayQuestions = [];
    let objQuestionAtual = {};
    let objRespostasAtuais = {};
    let respostasAtuais = [];

    for (let i = 0; i < qtdPerguntas; i++){
        let questionAtual = document.querySelectorAll(`.area-question .question:nth-of-type(${i+1})>input`);
        objQuestionAtual.title = questionAtual[0].value;
        objQuestionAtual.color = questionAtual[1].value;
        respostasAtuais = [];
        for (let j = 2; j <= 9; j = j+2){
            if(questionAtual[j].value.trim() != "" && questionAtual[j+1].value.trim() != ""){
                objRespostasAtuais.text = questionAtual[j].value;
                objRespostasAtuais.image = questionAtual[j+1].value;
                if (j == 2){
                    objRespostasAtuais.isCorrectAnswer = true;
                }else{
                    objRespostasAtuais.isCorrectAnswer = false;
                }
                respostasAtuais.push(JSON.parse(JSON.stringify(objRespostasAtuais)));
            }
        }

        objQuestionAtual.answers = respostasAtuais;
        arrayQuestions.push(JSON.parse(JSON.stringify(objQuestionAtual)));
    }

    objQuizFinal.questions = arrayQuestions;

    const telaAtual = document.querySelectorAll('.active');
    telaAtual.forEach((telaAtual) => {
    telaAtual.classList.remove('active');
    });

    document.querySelector(proxPagina).classList.add("active");
    window.scrollTo(0,0);
}

function informacoesIniciaisQuiz(proxPagina){
    const arrayInput = document.querySelectorAll(".info-quizz input");

    //Precisa fazer as validações

    objQuizFinal.title = arrayInput[0].value;
    objQuizFinal.image = arrayInput[1].value;
    qtdPerguntas = parseInt(arrayInput[2].value);
    qtdNiveis = parseInt(arrayInput[3].value);

    const areaQuestion = document.querySelector(".area-question");
    const areaLevel = document.querySelector(".area-level");

    for (let i = 0; i < qtdPerguntas; i++){
        areaQuestion.innerHTML += `<form class="question">
            <div class="title-form">
                <p>Pergunta ${i+1}</p>
                <ion-icon name="open-outline"></ion-icon>
            </div>
            <input type="text" placeholder="Texto da pergunta">
            <input type="text" placeholder="Cor de fundo da pergunta">
            <p>Resposta correta</p>
            <input type="text" placeholder="Resposta correta">
            <input type="text" placeholder="URL da imagem">
            <p>Respostas incorretas</p>
            <input type="text" placeholder="Resposta incorreta 1">
            <input type="text" placeholder="URL da imagem 1">
            <input type="text" placeholder="Resposta incorreta 2">
            <input type="text" placeholder="URL da imagem 2">
            <input type="text" placeholder="Resposta incorreta 3">
            <input type="text" placeholder="URL da imagem 3">
        </form>`
    }

    areaQuestion.innerHTML += `<button onclick="criarPerguntas(${"'.quizzlvl'"});">Prosseguir pra criar níveis</button>`;
    
    for (let j = 0; j < qtdNiveis; j++){
        areaLevel.innerHTML += `<form class="level">
            <div class="title-form">
                <p>Nível ${j+1}</p>
                <ion-icon name="open-outline"></ion-icon>
            </div>
            <input type="text" placeholder="Titulo do nível">
            <input type="text" placeholder="% de acerto mínima">
            <input type="text" placeholder="URL da imagem do nível">
            <textarea class="text-box" cols="30" rows="10" placeholder="Descrição do nível"></textarea>
        </form>`
    }

    areaLevel.innerHTML += `<button onclick="finalizarQuiz(${"'.done-quizz'"});">Finalizar Quizz</button>`;

    const telaAtual = document.querySelectorAll('.active');
    telaAtual.forEach((telaAtual) => {
    telaAtual.classList.remove('active');
    });

    document.querySelector(proxPagina).classList.add("active");
}

//Fim - JS TELAS 3.1/3.2/3.3/3.4

// Começo - JS TELA 2

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
    document.querySelector(".screen-loading").classList.add("active");
    quizz.then(quizzOk => {
        console.log(quizzOk);
        const desativar = document.querySelectorAll('.active');
        desativar.forEach(elemento => (elemento.classList.remove('active')));
        document.querySelector('.screen-quizz').classList.add('active');
        window.scrollTo(0,0);
        montarQuizz(quizzOk.data);
    })
    .catch(err => {
        console.log(err);
        alert('Deu erro! Bota função de voltar pra página inicial');
    });
}

//Fim - JS TELA 2


//Começo - JS TELA 1

function mudarTela(classe){
    
    const telaAtual = document.querySelectorAll('.active');
    telaAtual.forEach((telaAtual) => {
    telaAtual.classList.remove('active');
    });
    document.querySelector(classe).classList.add("active");
}

function sucessoExclusaoQuiz(){
    window.location.reload();
}

function erroExclusaoQuiz(){
    alert("Ocorreu algum erro durante a exclusão desse quiz. Por favor, tente novamente!");
    window.location.reload();
}

function excluirQuizz(id, event){
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

    event.stopPropagation();
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
            areaUsuarioQuizzes.innerHTML += `<div class="card-quizz" onclick="iniciarQuizz(${quizzesUsuario[j].id});"> <h2>${quizzesUsuario[j].title}</h2> <div class="options-quizzes"> <div><img src="imagens/Edit.png"/></div> <div onclick="excluirQuizz(${quizzesUsuario[j].id}, event)"><img src="imagens/Trash.png"/></div></div></div>`;
            document.querySelector(".my-quizzes .card-quizz:nth-last-child(1)").style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzesUsuario[j].image}), url(imagens/BuzzFeed-Logo.jpeg)`;
        }
        document.querySelector(".screen-list-quizzes").classList.add("active");
        document.querySelector(".area-my-quizzes").classList.add("active");
    }

    for (let k = 0; k < quizzes.length; k++){
        areaQuizzes.innerHTML += `<div class="card-quizz" onclick="iniciarQuizz(${quizzes[k].id});"> <h2>${quizzes[k].title}</h2> </div>`;
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

obterQuizzesServidor();
//Fim - JS TELA 1