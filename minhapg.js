var cnpj = document.getElementById('cnpj');
var nomeEmpresa = document.getElementById('nomeEmpresa');
var nomeResponsavel = document.getElementById('nomeResponsavel');
var telefone = document.getElementById('telefone');
var celular = document.getElementById('celular');
var email = document.getElementById('email');
var senha = document.getElementById('senha');
var confirma = document.getElementById('confirma');

function SomenteNumero(e){
    var tecla=(window.event)?event.keyCode:e.which;   
    if((tecla>47 && tecla<58)) return true;
    else{
    	if (tecla==8 || tecla==0) return true;
        else return false;
    }
}

function SomenteLetra(e){
    var tecla=(window.event)?event.keyCode:e.which;   
    if((tecla>47 && tecla<58)) return false;
    else return true;
    
}

function validaCnpj (cnpj){
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

 
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

 
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}

function validarTelefone(n){
    if(Number(n.length) == 10){
        return true
    } else {
        return false
    }
}

function validarSenha(n){
    if(Number(n.length) >= 6){
        return true
    } else {
        return false
    }
}

function validarCelular(n){
    if(Number(n.length) >= 10 && Number(n.length) <= 11){
        return true
    } else {
        return false
    }
}

function validar(n){
    if (Number(n.length) == 0){
        return false
    } else {
        return true
    }
}

function checkNomeEmpresa(){
    if (validar(nomeEmpresa.value)){
        return true
    } else {
        alert("Nome da Empresa inválido, digite novamente.")
        return false
    }
    
}

function checkNomeResponsavel(){
    if (validar(nomeResponsavel.value)){
        return true
    } else {
        alert("Nome do Responsável inválido, digite novamente.")
        return false
    }
    
}

function checkTelefone(){
    if (validarTelefone(telefone.value)){
        return true
    } else {
        alert("Número de Telefone inválido, digite novamente.")
        return false
    }
    
}

function checkCelular(){
    if (validarCelular(celular.value)){
        return true
    } else {
        alert("Número de Celular inválido, digite novamente.")
        return false
    }
       
}

function checkSenha(){
    if (validarSenha(senha.value)){
        return true
    } else {
        alert("A senha deve conter 6 ou mais caracteres.")
        return false
    }
       
}

function checkConfirma(){
    if (senha.value == confirma.value && validarSenha(senha.value)){
        return true
    } else {
        alert("A senha e sua confirmação não coincidem.")
        return false
    }
       
}

function checkEmail(){
    if (validar(email.value)){
        return true
    } else {
        alert("E-mail incorreto. ")
        return false
    }
       
}

function checkCnpj(){ 
    if (validaCnpj(cnpj.value) && validar(cnpj.value)){
        return true
    } else {
        alert("CNPJ inválido, digite novamente / somente números.")
        return false
    }   

}

function comecar(){
    if (!checkCnpj()) 
        return;

    if (!checkNomeEmpresa())
       return;

    if (!checkNomeResponsavel())
       return;

    if (!checkTelefone())
         return;

    if (!checkCelular())
         return;

    if (!checkSenha())
         return;

    if (!checkConfirma())
         return;

    if (!checkEmail())
         return;

    chamarAjax();
}

var urlPadrao = 'https://dev.shopi.com.br'

function chamarAjax(){
    var urlPadrao = 'https://dev.shopi.com.br';
    var pathShopi = '/api/register/cadastro-empresa.php';
    var objetoJson = funcaoObjetos();

    var params = new URLSearchParams();
    params.append('empresa', JSON.stringify(objetoJson));

    axios({
        method: 'post',
        url: urlPadrao + pathShopi,
        data: params
    })
    .then(function (response) {
        alert(response.data[0].ret_ds_msg);
        limparTela();
    });
}

function funcaoObjetos(){
    var objetoPadronizado = {
        Empresa: {
          nrCnpj:     funcaoCnpj()               ,
          nmEmp:      funcaoNomeEmpresa()        ,
          nmResp:     funcaoNomeResponsavel()    ,
          nrDddtel:   funcaoDddTel()             ,
          nrTel:      funcaoTelefone()           ,
          nrDddcel:   funcaoDddCel()             ,
          nrCel:      funcaoCelular()            ,
          nmEmail:    funcaoEmail()              ,
          dsSenha:    funcaoSenha()              ,
        }
    };
    
    return objetoPadronizado;
}

function funcaoCnpj(){
    return cnpj.value != null ? cnpj.value : null;
}

function funcaoNomeEmpresa(){
    return nomeEmpresa.value != null ? nomeEmpresa.value : null;
}

function funcaoNomeResponsavel(){
    return nomeResponsavel.value != null ? nomeResponsavel.value : null;
}

function funcaoTelefone(){
    var telSemDdd = telefone.value.substr(2, 10);
    return telSemDdd != null ? telSemDdd : null;

}

function funcaoDddTel(){
    var dddTel = telefone.value.substr(0, 1);
    return dddTel != null ? dddTel : null;
}

function funcaoCelular(){
    var celSemDDD = celular.value.substr(2, 11)
    return celSemDDD != null ? celSemDDD : null;

}

function funcaoDddCel(){
    var dddCel = celular.value.substr(0, 1);
    return dddCel != null ? dddCel : null;
}

function funcaoSenha(){
    return senha.value != null ? btoa(senha.value) : null;
}

function funcaoEmail(){
    return email.value != null ? email.value : null;
}

function limparTela(){
    cnpj.value = [];
    nomeEmpresa.value = [];
    nomeResponsavel.value = [];
    telefone.value = [];
    celular.value = [];
    senha.value = [];
    confirma.value = [];
    email.value = [];
}