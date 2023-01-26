// Começo - JS Yves
//Fim - JS Yves

// Começo - JS Fernando
//Fim - JS Fernando



//Começo - JS Barci

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
    const areaQuizzes = document.querySelector(".area-all-quizzes>div");
    areaQuizzes.innerHTML = "";

    for (let i = 0; i < resposta.data.length; i++){
        quizzes.push(resposta.data[i]);
    }

    if (quizzesUsuario.length === 0){
        document.querySelector(".screen-list-quizzes").classList.add("active");
        document.querySelector(".area-creation-quizz").classList.add("active");
    }

    for (let k = 0; k < quizzes.length; k++){
        areaQuizzes.innerHTML += `<div class="card-quizz"> <h2>${quizzes[k].title}</h2> </div>`;
        document.querySelector(".area-all-quizzes .card-quizz:nth-last-child(1)").style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzes[k].image})`;
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