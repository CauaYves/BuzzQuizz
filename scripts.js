//Começo - JS TELAS 3.1/3.2/3.3/3.4

let objQuizFinal = {};
let qtdPerguntas;
let qtdNiveis;

function sucessoEdicaoQuiz(resposta){
    document.querySelector(".image-quizz").style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${resposta.data.image}), url(imagens/BuzzFeed-Logo.jpeg)`;
    document.querySelector(".image-quizz h2").innerHTML = resposta.data.title;
    document.querySelector(".done-quizz button").setAttribute("onclick",`iniciarQuizz(${resposta.data.id});`);

    mudarTela(".done-quizz");
    window.scrollTo(0,0);
}

function erroEdicaoQuiz(){
    alert("Ocorreu um erro durante a edição desse quiz");
    window.location.reload();
}

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

function validarDescricao(inputDescricao, numLevel){
    let descricao = inputDescricao.value;

    if (descricao.trim() != "" && descricao.length >= 30){
        inputDescricao.style.backgroundColor = "#FFFFFF";
        if (document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(4)`).classList.contains("validation-failed")){
            document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(4)`).classList.remove("validation-failed")
        }
        return true;
    }else{
        inputDescricao.style.backgroundColor = "#FFE9E9";
        document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(4)`).classList.add("validation-failed");
        return false;
    }
}

function validarPorcentagemMinima(inputMinValue, numLevel){
    const minValue = inputMinValue.value;

    if (numLevel == 1){
        if(parseFloat(minValue) == 0 && minValue.trim() != "" && isNaN(parseFloat(minValue)) == false){
            inputMinValue.style.backgroundColor = "#FFFFFF";
            if (document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(2)`).classList.contains("validation-failed")){
                document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(2)`).classList.remove("validation-failed")
            }
            return true;
        }else{
            inputMinValue.style.backgroundColor = "#FFE9E9";
            document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(2)`).classList.add("validation-failed");
            return false;
        }
    }else{
        if(parseFloat(minValue) > 0 && parseFloat(minValue) <= 100 &&
        minValue.trim() != "" && isNaN(parseFloat(minValue)) == false){
            inputMinValue.style.backgroundColor = "#FFFFFF";
            if (document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(2)`).classList.contains("validation-failed")){
                document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(2)`).classList.remove("validation-failed")
            }
            return true;
        }else{
            inputMinValue.style.backgroundColor = "#FFE9E9";
            document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(2)`).classList.add("validation-failed");
            return false;
        }
    }
}

function validarTituloNivel(inputTitulo, numLevel){
    const titulo = inputTitulo.value;

    if (titulo.trim() != "" && titulo.length >= 20){
        inputTitulo.style.backgroundColor = "#FFFFFF";
        if (document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(1)`).classList.contains("validation-failed")){
            document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(1)`).classList.remove("validation-failed")
        }
        return true;
    }else{
        inputTitulo.style.backgroundColor = "#FFE9E9";
        document.querySelector(`.level:nth-of-type(${numLevel})>p:nth-of-type(1)`).classList.add("validation-failed");
        return false;
    }

}

function finalizarQuiz(){
    let arrayLevels = [];
    let objLevelAtual = {};
    let formularioValido = true;

    for (let i = 0; i < qtdNiveis; i++){
        let questionAtual = document.querySelectorAll(`.area-level .level:nth-of-type(${i+1})>input`);

        let checkTitulo = validarTituloNivel(questionAtual[0], (i+1));
        let checkMinValue = validarPorcentagemMinima(questionAtual[1], (i+1));
        let checkImage = validarUrl(questionAtual[2], "níveis", i+1);
        let checkDescription = validarDescricao(document.querySelector(`.area-level .level:nth-of-type(${i+1})>textarea`), (i+1));

        if (checkTitulo && checkMinValue && checkImage && checkDescription){
            objLevelAtual.title = questionAtual[0].value;
            objLevelAtual.minValue = parseFloat(questionAtual[1].value);
            objLevelAtual.image = questionAtual[2].value;
            objLevelAtual.text = document.querySelector(`.area-level .level:nth-of-type(${i+1})>textarea`).value;
    
            arrayLevels.push(JSON.parse(JSON.stringify(objLevelAtual)));
        }else{
            formularioValido = false;
        }
    }

    if (formularioValido){
        objQuizFinal.levels = arrayLevels;

        if (modoEdicao){
            let objsQuizzes;
    
            if (localStorage.getItem('quizzesUsuario') !== null){
                objsQuizzes = JSON.parse(localStorage.getItem('quizzesUsuario'));
            }
        
            for (let i = 0; i < objsQuizzes.length; i++){
                if (objsQuizzes[i].id === quizEdicao.id){
                    const quizEditado = axios.put(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${quizEdicao.id}`, objQuizFinal, {headers: {'Secret-Key': objsQuizzes[i].key}});
                    document.querySelector(".screen-loading").classList.add("active");
                    quizEditado.then(sucessoEdicaoQuiz);
                    quizEditado .catch(erroEdicaoQuiz);
                    break;
                }
            }
        }else{
            const novoQuiz = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", objQuizFinal);
            document.querySelector(".screen-loading").classList.add("active");
            novoQuiz.then(sucessoCriacaoQuiz);
            novoQuiz.catch(falhaCriacaoQuiz);
        }
    }else{
        window.scrollTo(0,0);
    }
}

function validarCor(inputCor, numQuestion){
    const cor = inputCor.value;

    if(cor.trim() != ""){
        const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;
        if (regex.test(cor)){
            inputCor.style.backgroundColor = "#FFFFFF";
            if (document.querySelector(`.question:nth-of-type(${numQuestion}) .text-validation:nth-of-type(3)`).classList.contains("validation-failed")){
                document.querySelector(`.question:nth-of-type(${numQuestion}) .text-validation:nth-of-type(3)`).classList.remove("validation-failed")
            }
            return true;
        }else{
            inputCor.style.backgroundColor = "#FFE9E9";
            document.querySelector(`.question:nth-of-type(${numQuestion}) .text-validation:nth-of-type(3)`).classList.add("validation-failed");
            return false;
        }
    }else{
        inputCor.style.backgroundColor = "#FFE9E9";
        document.querySelector(`.question:nth-of-type(${numQuestion}) .text-validation:nth-of-type(3)`).classList.add("validation-failed");
        return false;
    }
}

function validarTituloPerguntas(inputTituloPergunta, numQuestion){
    const tituloPergunta = inputTituloPergunta.value;

    if (tituloPergunta.trim() != "" && tituloPergunta.length >= 20){
        inputTituloPergunta.style.backgroundColor = "#FFFFFF";
        if (document.querySelector(`.question:nth-of-type(${numQuestion}) .text-validation:nth-of-type(2)`).classList.contains("validation-failed")){
            document.querySelector(`.question:nth-of-type(${numQuestion}) .text-validation:nth-of-type(2)`).classList.remove("validation-failed")
        }
        return true;
    }else{
        inputTituloPergunta.style.backgroundColor = "#FFE9E9";
        document.querySelector(`.question:nth-of-type(${numQuestion}) .text-validation:nth-of-type(2)`).classList.add("validation-failed");
        return false;
    }
}

function validarResposta(inputTexto, inputURL, numInput, numQuestion){
    const texto = inputTexto.value;
    let valido = true;

    if (texto.trim() != ""){
        inputTexto.style.backgroundColor = "#FFFFFF";
        if(numInput === 2){
            if (document.querySelector(`.question:nth-of-type(${numQuestion})>p:nth-of-type(5)`).classList.contains("validation-failed")){
                document.querySelector(`.question:nth-of-type(${numQuestion})>p:nth-of-type(5)`).classList.remove("validation-failed");
            }
        }else{
            if (document.querySelector(`.question:nth-of-type(${numQuestion})>p:nth-of-type(${numInput+4})`).classList.contains("validation-failed")){
                document.querySelector(`.question:nth-of-type(${numQuestion})>p:nth-of-type(${numInput+4})`).classList.remove("validation-failed");
            }
        }
    }else{
        inputTexto.style.backgroundColor = "#FFE9E9";
        if(numInput === 2){
            document.querySelector(`.question:nth-of-type(${numQuestion})>p:nth-of-type(5)`).classList.add("validation-failed");
        }else{
            document.querySelector(`.question:nth-of-type(${numQuestion})>p:nth-of-type(${numInput+4})`).classList.add("validation-failed");
        }
        valido = false;
    }

    const url = validarUrl(inputURL, "perguntas", numQuestion, numInput);

    if (url && valido){
        return true;
    }else{
        return false;
    }
}

function criarPerguntas(proxPagina){
    let arrayQuestions = [];
    let objQuestionAtual = {};
    let respostasAtuais = [];
    let objRespostasAtuais = {};
    let formularioValido = true;
    let questionAtualValido;

    for (let i = 0; i < qtdPerguntas; i++){
        questionAtualValido = true;
        let questionAtual = document.querySelectorAll(`.area-question .question:nth-of-type(${i+1})>input`);

        let checkTitulo = validarTituloPerguntas(questionAtual[0], (i+1));
        let checkColor = validarCor(questionAtual[1], (i+1));
        if (checkTitulo && checkColor){
            objQuestionAtual.title = questionAtual[0].value;
            objQuestionAtual.color = questionAtual[1].value;
        }else{
            formularioValido = false;
            questionAtualValido = false;
        }

        respostasAtuais = [];
        for (let j = 2; j <= 9; j = j+2){
            if (j === 2){
                if (validarResposta(questionAtual[j], questionAtual[j+1], j, i+1)){
                    objRespostasAtuais.text = questionAtual[j].value;
                    objRespostasAtuais.image = questionAtual[j+1].value;
                    objRespostasAtuais.isCorrectAnswer = true;
                    if (questionAtualValido){
                        respostasAtuais.push(JSON.parse(JSON.stringify(objRespostasAtuais)));
                    }
                }else{
                    formularioValido = false;
                    questionAtualValido = false;
                }
            }else if(questionAtual[j].value.trim() != "" && questionAtual[j+1].value.trim() != "" ||
            questionAtual[j].value.trim() != "" && questionAtual[j+1].value.trim() == "" ||
            questionAtual[j].value.trim() == "" && questionAtual[j+1].value.trim() != "") {
                if(validarResposta(questionAtual[j], questionAtual[j+1], j, i+1)){
                    objRespostasAtuais.text = questionAtual[j].value;
                    objRespostasAtuais.image = questionAtual[j+1].value;
                    objRespostasAtuais.isCorrectAnswer = false;
                    if (questionAtualValido){
                        respostasAtuais.push(JSON.parse(JSON.stringify(objRespostasAtuais)));
                    }
                }else{
                    formularioValido = false;
                    questionAtualValido = false;
                }
            }
        }

        if(respostasAtuais.length < 2){
            questionAtualValido = false;
            document.querySelector(`.question:nth-of-type(${i+1})>p:nth-of-type(1)`).classList.add("validation-failed");
        }else{
            if (document.querySelector(`.question:nth-of-type(${i+1})>p:nth-of-type(1)`).classList.contains("validation-failed")){
                document.querySelector(`.question:nth-of-type(${i+1})>p:nth-of-type(1)`).classList.remove("validation-failed");
            }
        }

        if (questionAtualValido){
            objQuestionAtual.answers = respostasAtuais;
            arrayQuestions.push(JSON.parse(JSON.stringify(objQuestionAtual)));
        }
    }

    if (formularioValido){
        objQuizFinal.questions = arrayQuestions;
        mudarTela(proxPagina);
        window.scrollTo(0,0);
    }else{
        window.scrollTo(0,0);
    }

}

function validarQtd(inputQtd, tipo){
    const qtd = inputQtd.value;

    if (tipo === "perguntas" && qtd.trim() != "" && !isNaN(parseInt(qtd)) && parseInt(qtd) >= 3){
        inputQtd.style.backgroundColor = "#FFFFFF";
        if (document.querySelector(".info-quizz p:nth-of-type(3)").classList.contains("validation-failed")){
            document.querySelector(".info-quizz p:nth-of-type(3)").classList.remove("validation-failed")
        }
        return true;
    }else if (tipo === "níveis" && qtd.trim() != "" && !isNaN(parseInt(qtd)) && parseInt(qtd) >= 2){
        inputQtd.style.backgroundColor = "#FFFFFF";
        if (document.querySelector(".info-quizz p:nth-of-type(4)").classList.contains("validation-failed")){
            document.querySelector(".info-quizz p:nth-of-type(4)").classList.remove("validation-failed")
        }
        return true;
    }else{
        inputQtd.style.backgroundColor = "#FFE9E9";
        if (tipo === "perguntas"){
            document.querySelector(".info-quizz p:nth-of-type(3)").classList.add("validation-failed");
        }else{
            document.querySelector(".info-quizz p:nth-of-type(4)").classList.add("validation-failed");
        }
        return false;
    }
}

function validarUrl(inputURL, tela, numElemento = 0, numPerguntas = 0){
    const url = inputURL.value;
    if (url != null && url.trim() != '') {
        let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        if(regex.test(url)){
            inputURL.style.backgroundColor = "#FFFFFF";
            if (tela === "info-inicial"){
                if (document.querySelector(".info-quizz p:nth-of-type(2)").classList.contains("validation-failed")){
                    document.querySelector(".info-quizz p:nth-of-type(2)").classList.remove("validation-failed");
                }
            }else if(tela === "perguntas"){
                if (numPerguntas == 2){
                    if (document.querySelector(`.question:nth-of-type(${numElemento})>p:nth-of-type(6)`).classList.contains("validation-failed")){
                        document.querySelector(`.question:nth-of-type(${numElemento})>p:nth-of-type(6)`).classList.remove("validation-failed");
                    }
                }else{
                    if (document.querySelector(`.question:nth-of-type(${numElemento})>p:nth-of-type(${numPerguntas+5})`).classList.contains("validation-failed")){
                        document.querySelector(`.question:nth-of-type(${numElemento})>p:nth-of-type(${numPerguntas+5})`).classList.remove("validation-failed");
                    }
                }
            }else{
                if (document.querySelector(`.level:nth-of-type(${numElemento})>p:nth-of-type(3)`).classList.contains("validation-failed")){
                    document.querySelector(`.level:nth-of-type(${numElemento})>p:nth-of-type(3)`).classList.remove("validation-failed");
                }
            }
            return true;
        }else{
            inputURL.style.backgroundColor = "#FFE9E9";
            if (tela === "info-inicial"){
                document.querySelector(".info-quizz p:nth-of-type(2)").classList.add("validation-failed");
            }else if(tela === "perguntas"){
                if (numPerguntas == 2){
                    document.querySelector(`.question:nth-of-type(${numElemento})>p:nth-of-type(6)`).classList.add("validation-failed");
                }else{
                    document.querySelector(`.question:nth-of-type(${numElemento})>p:nth-of-type(${numPerguntas+5})`).classList.add("validation-failed");
                }
            }else{
                document.querySelector(`.level:nth-of-type(${numElemento})>p:nth-of-type(3)`).classList.add("validation-failed");
            }
            return false;
        }
    }else{
        inputURL.style.backgroundColor = "#FFE9E9";
        if (tela === "info-inicial"){
            document.querySelector(".info-quizz p:nth-of-type(2)").classList.add("validation-failed");
        }else if(tela === "perguntas"){
            if (numPerguntas == 2){
                document.querySelector(`.question:nth-of-type(${numElemento})>p:nth-of-type(6)`).classList.add("validation-failed");
            }else{
                document.querySelector(`.question:nth-of-type(${numElemento})>p:nth-of-type(${numPerguntas+5})`).classList.add("validation-failed");
            }
        }else{
            document.querySelector(`.level:nth-of-type(${numElemento})>p:nth-of-type(3)`).classList.add("validation-failed");
        }
        return false;
    }
}

function validarTitulo(inputTitulo){
    const titulo = inputTitulo.value;
    if(titulo.trim() != "" && titulo.length >= 20 && titulo.length <= 65){
        inputTitulo.style.backgroundColor = "#FFFFFF";
        if (document.querySelector(".info-quizz p:nth-of-type(1)").classList.contains("validation-failed")){
            document.querySelector(".info-quizz p:nth-of-type(1)").classList.remove("validation-failed")
        }
        return true;
    }else{
        inputTitulo.style.backgroundColor = "#FFE9E9";
        document.querySelector(".info-quizz p:nth-of-type(1)").classList.add("validation-failed");
        return false;
    }
}

function informacoesIniciaisQuiz(proxPagina){
    const arrayInput = document.querySelectorAll(".info-quizz input");

    const checkTitulo = validarTitulo(arrayInput[0]);
    const checkURL = validarUrl(arrayInput[1],"info-inicial");
    const checkPerguntas = validarQtd(arrayInput[2], "perguntas");
    const checkNiveis = validarQtd(arrayInput[3], "níveis");

    if (checkTitulo && checkURL && checkPerguntas && checkNiveis){
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
                </div>
                <p class="text-validation">É necessário ter pelo menos duas respostas, sendo uma delas a resposta correta.</p>
                <input type="text" placeholder="Texto da pergunta">
                <p class="text-validation">O título da sua pergunta precisa ter, pelo menos, 20 caracteres.</p>
                <input type="text" placeholder="Cor de fundo da pergunta">
                <p class="text-validation">A cor de fundo da sua pergunta precisa estar no formato hexadecimal.</p>
                <p>Resposta correta</p>
                <input type="text" placeholder="Resposta correta">
                <p class="text-validation">Este campo não pode ficar vazio.</p>
                <input type="text" placeholder="URL da imagem">
                <p class="text-validation">O valor informado não é uma URL válida.</p>
                <p>Respostas incorretas</p>
                <input type="text" placeholder="Resposta incorreta 1">
                <p class="text-validation">Este campo não pode ficar vazio, caso tenha digitado uma URL.</p>
                <input type="text" placeholder="URL da imagem 1">
                <p class="text-validation">O valor informado não é uma URL válida.</p>
                <input type="text" placeholder="Resposta incorreta 2">
                <p class="text-validation">Este campo não pode ficar vazio, caso tenha digitado uma URL.</p>
                <input type="text" placeholder="URL da imagem 2">
                <p class="text-validation">O valor informado não é uma URL válida.</p>
                <input type="text" placeholder="Resposta incorreta 3">
                <p class="text-validation">Este campo não pode ficar vazio, caso tenha digitado uma URL.</p>
                <input type="text" placeholder="URL da imagem 3">
                <p class="text-validation">O valor informado não é uma URL válida.</p>
            </form>`
        }

        areaQuestion.innerHTML += `<button onclick="criarPerguntas(${"'.quizzlvl'"});">Prosseguir pra criar níveis</button>`;
        
        for (let j = 0; j < qtdNiveis; j++){
            areaLevel.innerHTML += `<form class="level">
                <div class="title-form">
                    <p>Nível ${j+1}</p>
                </div>
                <input type="text" placeholder="Titulo do nível">
                <p class="text-validation">O título do nível do seu quizz precisa ter, pelo menos, 20 caracteres.</p>
                <input type="text" placeholder="% de acerto mínima">
                <p class="text-validation">Digite apenas valores entre 0 e 100. Lembre-se, o nível 1 precisa ter, obrigatoriamente, 0 como porcentagem mínima.</p>
                <input type="text" placeholder="URL da imagem do nível">
                <p class="text-validation">O valor informado não é uma URL válida.</p>
                <textarea class="text-box" cols="30" rows="10" placeholder="Descrição do nível"></textarea>
                <p class="text-validation">A descrição do nível do seu quizz precisa ter, pelo menos, 30 caracteres.</p>
            </form>`
        }

        areaLevel.innerHTML += `<button onclick="finalizarQuiz(${"'.done-quizz'"});">Finalizar Quizz</button>`;

        if (modoEdicao){
            let menorQtd;
            const questionsEdicao = quizEdicao.questions;
            if (qtdPerguntas <= questionsEdicao.length){
                menorQtd = qtdPerguntas;
            }else{
                menorQtd = questionsEdicao.length;
            }
            for (let k = 0; k < menorQtd; k++){
                let inputs = document.querySelectorAll(`.question:nth-of-type(${k+1})>input`);
                inputs[0].value = questionsEdicao[k].title;
                inputs[1].value = questionsEdicao[k].color;
                let cont = 0;
                for (let l = 0; l < questionsEdicao[k].answers.length*2; l += 2){
                    inputs[l+2].value = questionsEdicao[k].answers[cont].text;
                    inputs[l+3].value = questionsEdicao[k].answers[cont].image;
                    cont++;
                }
            }

            const levelsEdicao = quizEdicao.levels;
            if (qtdNiveis <= levelsEdicao.length){
                menorQtd = qtdNiveis;
            }else{
                menorQtd = levelsEdicao.length;
            }
            for (let m = 0; m < menorQtd; m++){
                let inputsLevels = document.querySelectorAll(`.level:nth-of-type(${m+1})>input`);
                let textArea = document.querySelector(`.level:nth-of-type(${m+1})>textarea`);

                inputsLevels[0].value = levelsEdicao[m].title;
                inputsLevels[1].value = levelsEdicao[m].minValue;
                inputsLevels[2].value = levelsEdicao[m].image;
                textArea.value = levelsEdicao[m].text;
            }
        }

        mudarTela(proxPagina);
    }
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

let modoEdicao = false;
let quizEdicao;

function mudarTela(classe){
    
    const telaAtual = document.querySelectorAll('.active');
    telaAtual.forEach((telaAtual) => {
    telaAtual.classList.remove('active');
    });
    document.querySelector(classe).classList.add("active");
}

function sucessoRecuperacaoQuizz(resposta){
    const arrayInput = document.querySelectorAll(".info-quizz input");

    arrayInput[0].value = resposta.data.title;
    arrayInput[1].value = resposta.data.image;
    arrayInput[2].value = resposta.data.questions.length;
    arrayInput[3].value = resposta.data.levels.length;

    quizEdicao = resposta.data;
    mudarTela(".info-quizz");
}

function falhaRecuperacaoQuizz(){
    alert("Ocorreu uma falha durante a recuperação do quiz");
    window.location.reload();
}

function editarQuizz(id, event){
    modoEdicao = true;

    const quizAtual = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);
    quizAtual.then(sucessoRecuperacaoQuizz);
    quizAtual.catch(falhaRecuperacaoQuizz);
    event.stopPropagation();
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
            areaUsuarioQuizzes.innerHTML += `<div class="card-quizz" onclick="iniciarQuizz(${quizzesUsuario[j].id});"> <h2>${quizzesUsuario[j].title}</h2> <div class="options-quizzes"> <div onclick="editarQuizz(${quizzesUsuario[j].id}, event)"><img src="imagens/Edit.png"/></div> <div onclick="excluirQuizz(${quizzesUsuario[j].id}, event)"><img src="imagens/Trash.png"/></div></div></div>`;
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

    modoEdicao = false;
    document.querySelector(".screen-loading").classList.add("active");

    quizzes.then(sucessoRequisicaoQuizzes);
    quizzes.catch(falhaRequisicaoQuizzes);
}

obterQuizzesServidor();
//Fim - JS TELA 1