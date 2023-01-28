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