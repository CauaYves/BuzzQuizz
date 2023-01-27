// Começo - JS Yves
//Fim - JS Yves

// Começo - JS Fernando
//Fim - JS Fernando



//Começo - JS Barci

/*Funções teste que serão apagadas ao final do projeto

const quizTeste = {title: "Título do quizz", image: "https://pop.proddigital.com.br/wp-content/uploads/sites/8/2022/10/f.jpg",questions: [{title: "Título da pergunta 1", color: "#123456", answers: [{ text: "Texto da resposta 1", image: "https://http.cat/411.jpg", isCorrectAnswer: true}, {text: "Texto da resposta 2", image: "https://http.cat/412.jpg", isCorrectAnswer: false}]},{title: "Título da pergunta 2", color: "#123456", answers: [{text: "Texto da resposta 1",image: "https://http.cat/411.jpg",isCorrectAnswer: true},{text: "Texto da resposta 2",image: "https://http.cat/412.jpg",isCorrectAnswer: false}]},{title: "Título da pergunta 3",color: "#123456",answers: [{text: "Texto da resposta 1",image: "https://http.cat/411.jpg",isCorrectAnswer: true},{text: "Texto da resposta 2",image: "https://http.cat/412.jpg",isCorrectAnswer: false}]}],levels: [{title: "Título do nível 1",image: "https://http.cat/411.jpg",text: "Descrição do nível 1",minValue: 0},{title: "Título do nível 2",image: "https://http.cat/412.jpg",text: "Descrição do nível 2",minValue: 50}]};

function sucessoCriacaoQuiz(resposta){
    let arrayId = [];

    if (localStorage.getItem('idQuizzesUsuario') === null){
        arrayId.push(resposta.data.id);
        localStorage.setItem('idQuizzesUsuario', JSON.stringify(arrayId));
    }else{
        arrayId = JSON.parse(localStorage.getItem('idQuizzesUsuario'));
        arrayId.push(resposta.data.id);
        localStorage.setItem('idQuizzesUsuario', JSON.stringify(arrayId));
    }
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

/*
Função responsável por mudar as telas ao apertar div/button
Recebe como parâmetro o nome da classe da tela que deseja abrir
*/
function mudarTela(classe){
    const telaAtual = document.querySelectorAll('.active');
    telaAtual.forEach((telaAtual) => {
    telaAtual.classList.remove('active');
    });
    document.querySelector(classe).classList.add("active");
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

    if (localStorage.getItem('idQuizzesUsuario') !== null){
        arrayId = JSON.parse(localStorage.getItem('idQuizzesUsuario'));
    }
    
    for (let i = 0; i < resposta.data.length; i++){
        if (arrayId.includes(resposta.data[i].id)){
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
            areaUsuarioQuizzes.innerHTML += `<div class="card-quizz"> <h2>${quizzesUsuario[j].title}</h2> </div>`;
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
    quizzes.then(sucessoRequisicaoQuizzes);
    quizzes.catch(falhaRequisicaoQuizzes);
}

//obterQuizzesServidor();
//Fim - JS Barci