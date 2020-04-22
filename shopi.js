
//initializeFocus();

var _uTableCartaoDebito;
var _uTableCartaoCredito;
var _uTablePagamentoConvencional;
var _uTablePagamentosSelecionados;

var _uValorTotalVenda;
var _uValorTotalPagamentos;
var _uValorFaltaPagar;
var _uValorTroco;
var _uTotalDesconto = 0;
var _uTotalAcrescimo = 0;

var _uTipoPagamento = null;

/* Vale presente */
var _uValorValePresente = 0;

var _uProdutos;
var _uVendedor;
var _uCliente;

var _uMaquinaCartaoPadrao;
var _uMaquinaCartaoSelecionada;

function initializeModalPagamento(ValorTotalVenda, Produtos, Vendedor, Cliente) {
  _uTipoPagamento = 'Venda';
  _uValorTotalVenda = ValorTotalVenda;
  _uValorFaltaPagar = ValorTotalVenda;
  _uProdutos = Produtos;
  _uVendedor = Vendedor;
  _uCliente = Cliente;

  _uMaquinaCartaoPadrao = fncConsultaMaquinaCartaoPadrao();
  _uMaquinaCartaoSelecionada = _uMaquinaCartaoPadrao;

  changeTelaPagamento();

  initializeDatatablePagamentoSelecionado();
  initializeDatatablePagamentoDebito();
  initializeDatatablePagamentoCredito();
  initializeDatatablePagamentoConvencional();
  inicializaValorFrete();
  inicializaValorTotalDesconto();
  inicializaValorTotalAcrescimo();
  inicializaValorTotalAcrescimo();

  configuraInputPagamentoConvencional();
  configuraTotalizadores();
  configuraMaquinaCartaoPadrao();
  configuraChangeValorFrete();
  configuraChangeValorDesconto();
  configuraChangeValorAcrescimo();

  eventMascaraValorPagamento();
  eventBtnSelecionarMaquinaCartao();
  eventBtnFinalizarVenda();
}

function initializeModalPagamentoValePresente(ValorValePresente, Vendedor, Cliente) {
  _uTipoPagamento = 'Vale presente';
  _uValorValePresente = ValorValePresente;
  _uValorFaltaPagar = ValorValePresente;
  _uVendedor = Vendedor;
  _uCliente = Cliente;

  _uMaquinaCartaoPadrao = fncConsultaMaquinaCartaoPadrao();
  _uMaquinaCartaoSelecionada = _uMaquinaCartaoPadrao;

  initializeDatatablePagamentoSelecionado();
  initializeDatatablePagamentoDebito();
  initializeDatatablePagamentoCredito();
  initializeDatatablePagamentoConvencional();
  inicializaValorFrete();
  inicializaValorTotalDesconto();
  inicializaValorTotalAcrescimo();
  inicializaValorTotalAcrescimo();

  configuraInputPagamentoConvencional();
  configuraTotalizadoresValePresente();
  configuraMaquinaCartaoPadrao();

  eventMascaraValorPagamento();
  eventBtnSelecionarMaquinaCartao();
  eventBtnFinalizarVenda();

  changeTelaPagamentoValePresente();
}

function changeTelaPagamento() {
  $("#FH00SF0099ATitulo").html("Pagamento da venda");

  $("#FH00SF0099A_DIV_VALORES").attr("style", "");

  /*$("#FH00SF0099A_VALOR_TOTAL_DESCONTO").attr("style", "text-align: right; font-weight: bold;");
  $("#FH00SF0099A_VALOR_TOTAL_ACRESCIMO").attr("style", "text-align: right; font-weight: bold;");
  $("#FH00SF0099A_VALOR_FRETE").attr("style", "text-align: right; font-weight: bold;");

  $("#FH00SF0099A_LABEL_VALOR_TOTAL_DESCONTO").attr("style", "text-align: right; font-size: 12px; font-weight: bold;");
  $("#FH00SF0099A_LABEL_VALOR_TOTAL_ACRESCIMO").attr("style", "text-align: right; font-size: 12px; font-weight: bold;");
  $("#FH00SF0099A_LABEL_VALOR_FRETE").attr("style", "text-align: right; font-size: 12px; font-weight: bold;");*/

  $("#FH00SF0099A_LABEL_VALOR_TOTAL_VENDA").html("Total da venda");
  $("#FH00SF0099A_VALOR_TOTAL_VENDA").prop('readonly', true);
  $("#FH00SF0099A_VALOR_TOTAL_VENDA").unbind("change");

  eventBtnFinalizarVenda();
}

function changeTelaPagamentoValePresente() {
  $("#FH00SF0099ATitulo").html("Pagamento do vale presente");

  $("#FH00SF0099A_DIV_VALORES").attr("style", "display:none;");

  /*$("#FH00SF0099A_VALOR_TOTAL_DESCONTO").attr("style", "display:none");
  $("#FH00SF0099A_VALOR_TOTAL_ACRESCIMO").attr("style", "display:none;");
  $("#FH00SF0099A_VALOR_FRETE").attr("style", "display:none;");

  $("#FH00SF0099A_LABEL_VALOR_TOTAL_DESCONTO").attr("style", "display:none;");
  $("#FH00SF0099A_LABEL_VALOR_TOTAL_ACRESCIMO").attr("style", "display:none;");
  $("#FH00SF0099A_LABEL_VALOR_FRETE").attr("style", "display:none;");*/

  $("#FH00SF0099A_LABEL_VALOR_TOTAL_VENDA").html("Valor do vale presente");
  $("#FH00SF0099A_VALOR_TOTAL_VENDA").prop('readonly', false);
  $("#FH00SF0099A_VALOR_TOTAL_VENDA").focus().select();

  $("#FH00SF0099A_VALOR_TOTAL_VENDA").unbind("change");
  $("#FH00SF0099A_VALOR_TOTAL_VENDA").change(function() {
    var _rTable = $('#tablePagamentosSelecionados').DataTable();
    atualizaTotalizadores(_rTable);
  });

  eventBtnFinalizarValePresente();
}

function eventBtnFinalizarValePresente() {
  $("#FH00SF0099A_FINALIZAR_VENDA").unbind("click");
  $("#FH00SF0099A_FINALIZAR_VENDA").click(function() {
    if (!fncConsisteValorValePresente())
      return;

    if (!fncConsisteVendedor())
      return;

    if (!fncConsistePagamentos())
      return;

    //realizaVenda();
    realizaValePresente();
  });
}

function fncConsisteValorValePresente() {
  var _rRetorno = true;
  var _rValor = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
  _rValor = parseFloat(_rValor);

  if (_rValor == null || _rValor == 0) {
    _rRetorno = false;

    toastr.error(
      '<b>O valor do vale presente deve ser maior que zero</b>',
      {timeOut: 10000}
    );
  }

  return _rRetorno
}

function realizaValePresente() {
  var _rPath = '/api/vale-presente/cadastro-vale-presente.php';

  var _rObjeto = getObjetoValePresente();

  $('#divPrincipal').block({ message: '<b>Realizando vale presente - Aguarde um momento</b>...'}); 

  $.post(getBaseUrl() + _rPath,
    { 
      vale_presente: JSON.stringify(_rObjeto)
    },
    function (Data, status) {
      var _rResponse = $.parseJSON(Data);

      $('#divPrincipal').unblock();

      if (_rResponse.codigo > 0) {
        toastr.success(
          _rResponse.mensagem,
          {timeOut: 10000}
        );
      }
      else {
        toastr.error(
          _rResponse.mensagem,
          {timeOut: 10000}
        );
      }

      $("#FH00SF0099AModalPagamento").modal('hide');
      $("#LFH00SF0002AModalOPCAO_VALE_PRESENTE").modal('hide'); 
      eventLimparTelaModal();
    }
  )
  .done(function(Data) {
    $('#divPrincipal').unblock();
    eventLimparTelaModal();
    //pesquisaProdutosMaisVendidos();
  })
  .fail(function(xhr, status, error) {
    $('#divPrincipal').unblock();
  });
}

function inicializaValorFrete() {
  $("#FH00SF0099A_VALOR_FRETE").val("0,00");
}

function inicializaValorTotalDesconto() {
  $("#FH00SF0099A_VALOR_TOTAL_DESCONTO").val("0,00");
}

function inicializaValorTotalAcrescimo() {
  $("#FH00SF0099A_VALOR_TOTAL_ACRESCIMO").val("0,00");
}

function configuraChangeValorFrete() {
  $("#FH00SF0099A_VALOR_FRETE").change(function() {
    var _rValor = $(this).autoNumeric('get');

    if ($(this).val() == "" || _rValor == 0) {
      $(this).val("0,00");
      $(this).refresh();

      eventMascaraValorPagamento();
      return;
    }
  });
}

function fncValidaValorDesconto(ValorDesconto) {
  var _rRetorno = true;
  var _rValorTotalPagar = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');

  if (ValorDesconto > _rValorTotalPagar) {
    _rRetorno = false;

    toastr.error(
      'O valor do desconto não pode ser maior que o valor total a pagar',
      {timeOut: 10000}
    );
  }

  return _rRetorno; 
}

function configuraChangeValorDesconto() {
  $("#FH00SF0099A_VALOR_TOTAL_DESCONTO").unbind("change");
  $("#FH00SF0099A_VALOR_TOTAL_DESCONTO").change(function() {
    var _rValorDesconto = $(this).autoNumeric('get');
    //var _rValorTotalVenda = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
    //var _rValorTotalVenda = _uValorTotalVenda;
    var _rValorTotalVenda = _uValorTotalVenda;
    _rValorTotalVenda = parseFloat(_rValorTotalVenda);

    if ($(this).val() == "" || _rValorDesconto == 0) {
      _rValorDesconto = 0;
    }
    else {
      _rValorDesconto = parseFloat(_rValorDesconto);
    }

    if (!fncValidaValorDesconto(_rValorDesconto)) {
      //$(this).val("0,00");
      var _rValor = _uTotalDesconto;
      _rValor = parseFloat(_rValor);
      _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

      $(this).val(_rValor);
      $(this).focus().select();
      $(this).refresh();
      return;
    }

    _rValorTotalVenda = _rValorTotalVenda - _rValorDesconto;

    if (_rValorTotalVenda != null && _rValorDesconto != 0) {
      var _rValor = _rValorTotalVenda;
      _rValor = parseFloat(_rValor);
      _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

      _uTotalDesconto = _rValorDesconto;
      $("#FH00SF0099A_VALOR_TOTAL_VENDA").val(_rValor);
      $("#FH00SF0099A_VALOR_FALTA_PAGAR").val(_rValor);  
      //_uTotalVenda = _rValorTotalVenda;

      //_uTotalDesconto = _rValorDesconto;
    }
    else {
      var _rValor = _uValorTotalVenda;
      _rValor = parseFloat(_rValor);
      _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

      $("#FH00SF0099A_VALOR_TOTAL_VENDA").val(_rValor);  
      $("#FH00SF0099A_VALOR_FALTA_PAGAR").val(_rValor);  

      $(this).val("0,00");
      $(this).refresh();
    }

    eventMascaraValorPagamento();
  });
}

function configuraChangeValorAcrescimo() {
  $("#FH00SF0099A_VALOR_TOTAL_ACRESCIMO").unbind("change");
  $("#FH00SF0099A_VALOR_TOTAL_ACRESCIMO").change(function() {
    var _rValorAcrescimo = $(this).autoNumeric('get');
    //var _rValorTotalVenda = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
    //var _rValorTotalVenda = _uValorTotalVenda;
    var _rValorTotalVenda = _uValorTotalVenda;
    _rValorTotalVenda = parseFloat(_rValorTotalVenda);

    if ($(this).val() == "" || _rValorAcrescimo == 0) {
      _rValorAcrescimo = 0;
    }
    else {
      _rValorAcrescimo = parseFloat(_rValorAcrescimo);
    }

    _rValorTotalVenda = _rValorTotalVenda + _rValorAcrescimo;

    if (_rValorTotalVenda != null && _rValorAcrescimo != 0) {
      var _rValor = _rValorTotalVenda;
      _rValor = parseFloat(_rValor);
      _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

      $("#FH00SF0099A_VALOR_TOTAL_VENDA").val(_rValor);
    }
    else {
      var _rValor = _uValorTotalVenda;
      _rValor = parseFloat(_rValor);
      _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

      $("#FH00SF0099A_VALOR_TOTAL_VENDA").val(_rValor);  

      $(this).val("0,00");
      $(this).refresh();
    }

    eventMascaraValorPagamento();
  });
}

function eventBtnFinalizarVenda() {
  $("#FH00SF0099A_FINALIZAR_VENDA").unbind("click");
  $("#FH00SF0099A_FINALIZAR_VENDA").click(function() {
    //if (!fncConsisteVenda())
    //  return;
    if (!fncConsisteProdutos())
      return;

    if (!fncConsisteVendedor())
      return;

    if (!fncConsistePagamentos())
      return;

    realizaVenda();
  });
}

function fncConsistePagamentos() {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();
  var _rRetorno = true;

  if (!_rTable.data().any()) {
    toastr.error(
      '<b>É necessário informar os pagamentos</b>',
      {timeOut: 10000}
    );

    _rRetorno = false;
  }

  /* Valida pagamentos zerados */
  $.each(_rTable.rows().data(), function(Index, Objeto){ 
    if (Objeto.vl_pagame == null || Objeto.vl_pagame == 0) {
      toastr.error(
        '<b>Existem pagamentos com valor zerado, verifique por favor</b>',
        {timeOut: 10000}
      );

      _rRetorno = false;
    }
  });

  /* Valida se o total de pagamentos é maior que o valor da venda */
  var _rValorTotalVenda = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
  var _rValorTotalPagamentos = 0;
  var _rExisteDinheiro = false;

  /* Valida pagamentos zerados */
  $.each(_rTable.rows().data(), function(Index, Objeto){ 
    if (Objeto.cd_pagame != 10) {
      _rValorTotalPagamentos = parseFloat(_rValorTotalPagamentos) + parseFloat(Objeto.vl_pagame);
    }
    else
      _rExisteDinheiro = true;
  });

  _rValorTotalVenda = parseFloat(_rValorTotalVenda);
  _rValorTotalPagamentos = parseFloat(_rValorTotalPagamentos);

  if (_rValorTotalPagamentos > _rValorTotalVenda && !_rExisteDinheiro) {
    toastr.error(
      '<b>O total de pagamentos é maior que o valor total</b>',
      {timeOut: 10000}
    );

    _rRetorno = false;
  }

  var _rValorFaltaPagar = $("#FH00SF0099A_VALOR_FALTA_PAGAR").autoNumeric('get');
  _rValorFaltaPagar = parseFloat(_rValorFaltaPagar);

  if (_rTable.data().any() && _rValorFaltaPagar > 0) {
    _rRetorno = false;

    toastr.error(
      '<b>É necessário realizar o pagamento total</b>',
      {timeOut: 10000}
    );
  }

  return _rRetorno;
}

function fncConsisteVenda() {
  var _rRetorno = false;

  return true;
}

function eventBtnSelecionarMaquinaCartao() {
  $("#btnSelecionarMaquinaCartao").click(function() {
      var _rMaquinasDisponiveis = fncRetornaMaquinasCartaoDisponiveis();

      if (_rMaquinasDisponiveis != null && _rMaquinasDisponiveis.length > 0) {
        initializeDatatableMaquinaCartao(_rMaquinasDisponiveis);
        $("#FH00SF0099A_MODAL_MAQUINA_CARTAO").modal('show');
      }
      else {
        toastr.error(
          'Não existem máquinas de cartão parametrizadas para selecionar',
          {timeOut: 10000}
        );
      }
  });
}

function initializeDatatableMaquinaCartao(Data) {
  _uTableMaquinaCartao = $("#tableModalMaquinaCartao").DataTable({
    /* Parâmetros iniciais */
    destroy: true,
    "paging": false,
    filter: true,
    lengthChange: false,
    bInfo: false,
    pageLength: 1000,
    //scrollY: '370px',
    //"scrollX": true,
    //"bAutoWidth": true,
    "bAutoWidth": true,
    dom:
      "<'ui grid'"+
         "<'row'"+
            "<'four wide column'l>"+
            "<'center aligned eight wide column'B>"+
            "<'right aligned four wide column'f>"+
         ">"+
         "<'row dt-table'"+
            "<'sixteen wide column'tr>"+
         ">"+
         "<'row'"+
            "<'seven wide column'i>"+
            "<'right aligned nine wide column'p>"+
         ">"+
      ">",
    language: {
    emptyTable: "Nenhum máquina de cartão encontrada",
    zeroRecords: "Nenhum máquina de cartão encontrada",
    oPaginate: {
      sPrevious: "Anterior",
      sNext: "Próximo"
    },
    search : "",
    searchPlaceholder: "Pesquisar máquina de cartão"
    },
    data: Data,
    /* Definição das colunas */
    columns: [
      {
        mData: null,
        bSortable: false,
        className: "text-left",
        mRender: function (Objeto) { 
          var _rHTML;

          _rHTML = '<label style="font-size: 14px;"><b>' + Objeto.nm_maqcar + '</b></label>';

          return _rHTML;
        }
      },
      {
        mData: null,
        bSortable: false,
        className: "text-right",
        mRender: function (Objeto) { 
          var _rHTML;

          _rHTML = '<button type="button" style="font-weight: bold;" class="btn btn-sm btn-success btnAlterarMaquinaCartao"><i class="ti-check"></i>&nbsp;&nbsp;Selecionar</button>';

          return _rHTML;
        }
      }
    ]
  });

  $('#tableModalMaquinaCartao').DataTable().columns.adjust().draw();

  $('.dataTables_filter input').removeClass('input-sm');
  $('.dataTables_filter input').addClass('input-md');
  $('.dataTables_filter input').attr("style", "width: 400px;");

  //eventClickBtnUtilizarVale(_uTableValePresente);
  eventClickBtnAlterarMaquinaCartao(_uTableMaquinaCartao);
}

function eventClickBtnAlterarMaquinaCartao(Table) {
  $("#tableModalMaquinaCartao tbody").off("click", ".btnAlterarMaquinaCartao");
  $("#tableModalMaquinaCartao tbody").on("click", ".btnAlterarMaquinaCartao", function() {
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    _uMaquinaCartaoSelecionada = _rObjetoLinha;

    var _rMaquinasDisponiveis = fncRetornaMaquinasCartaoDisponiveis();

    initializeDatatablePagamentoDebito();
    initializeDatatablePagamentoCredito();
    $("#FH00SF0099A_MODAL_MAQUINA_CARTAO").modal('hide');
    configuraMaquinaCartaoSelecionada();
  });
}

function fncRetornaMaquinasCartaoDisponiveis() {
  var _rMaquinasCartao = [];
  var _rMaquinasCartaoLocal = [];

  var _rLocal = localStorage.getItem("MaquinaCartao");
  _rLocal = _rLocal.trim();

  if (_rLocal == null || _rLocal === "")
    return null;

  _rMaquinasCartaoLocal = JSON.parse(_rLocal);

  for (var i = 0; i < _rMaquinasCartaoLocal.length; i++) {
    if (_rMaquinasCartaoLocal[i].cd_maqcar != _uMaquinaCartaoSelecionada.cd_maqcar)
      _rMaquinasCartao.push(_rMaquinasCartaoLocal[i]);
  } 

  return _rMaquinasCartao;
}

function configuraMaquinaCartaoPadrao() {
  $("#btnSelecionarMaquinaCartao").html(_uMaquinaCartaoPadrao.nm_maqcar);
}

function configuraMaquinaCartaoSelecionada() {
  $("#btnSelecionarMaquinaCartao").html(_uMaquinaCartaoSelecionada.nm_maqcar);
}

function configuraTotalizadores() {
  if (_uValorTotalVenda != null) {
    var _rValor = _uValorTotalVenda;
    _rValor = parseFloat(_rValor);
    _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

    $("#FH00SF0099A_VALOR_TOTAL_VENDA").val(_rValor);  
    $("#FH00SF0099A_VALOR_FALTA_PAGAR").val(_rValor);  
  }
}

function configuraTotalizadoresValePresente() {
  if (_uValorValePresente != null) {
    var _rValor = _uValorValePresente;
    _rValor = parseFloat(_rValor);
    _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

    $("#FH00SF0099A_VALOR_TOTAL_VENDA").val(_rValor);  
    $("#FH00SF0099A_VALOR_FALTA_PAGAR").val(_rValor);  
  }
}

function configuraInputPagamentoConvencional() {
  var _rInputDinheiro = getInputDinheiro();
  var _rInputDeposito = getInputDeposito();
  var _rInputCheque   = getInputCheque();
  var _rInputValePresente = getInputValePresente();
  var _rInputValeTroca = getInputValeTroca();
  var _rInputValeFuncionario = getInputValeFuncionario();

  if (_rInputDinheiro != null)  {
    _rInputDinheiro.val("0,00");
    _rInputDinheiro.focus().select();
  }

  if (_rInputDeposito != null)
    _rInputDeposito.val("0,00");

  if (_rInputCheque != null)
    _rInputCheque.val("0,00");

  if (_rInputValePresente != null)
    _rInputValePresente.val("0,00");

  if (_rInputValeTroca != null)
    _rInputValeTroca.val("0,00");

  if (_rInputValeFuncionario != null)
    _rInputValeFuncionario.val("0,00"); 
}

function fncConsultaMaquinaCartaoPadrao() {
  var _rMaquinasCartao = [];
  var _rJsonMaquinasCartao;
  var _rCodigoMaquinaCartaoPadrao = null;

  var _rLocal = localStorage.getItem("MaquinaCartao");
  _rLocal = _rLocal.trim();

  if (_rLocal == null || _rLocal === "")
    return;

  _rJsonMaquinasCartao = _rLocal;

  _rMaquinasCartao = JSON.parse(_rJsonMaquinasCartao);

  for (var i = 0; i < _rMaquinasCartao.length; i++) {
    if (_rMaquinasCartao[i].id_maqpad == 1) {
      _rCodigoMaquinaCartaoPadrao = _rMaquinasCartao[i];
    }
  }

  return _rCodigoMaquinaCartaoPadrao;
}

function fncBandeirasMaquinaCartaoSelecionada(JsonBandeiras) {
  var _rBandeiras = [];
  var _rBandeirasMaquina = [];

  _rBandeiras = JSON.parse(JsonBandeiras);

  for (var i = 0; i < _rBandeiras.length; i++) {
    if (_rBandeiras[i].cd_maqcar == _uMaquinaCartaoSelecionada.cd_maqcar)
      _rBandeirasMaquina.push(_rBandeiras[i]);
  }

  return _rBandeirasMaquina;
}

function initializeDatatablePagamentoDebito() {
  var _rLocal = localStorage.getItem("BandeiraDebito");
  _rLocal = _rLocal.trim();

  if (_rLocal == null || _rLocal === "")
    return;

  //_uJsonCartaoDebito = _rLocal;
  var _rBandeirasDebitoMaquinaSelecionada = fncBandeirasMaquinaCartaoSelecionada(_rLocal);

  if (_uTableCartaoDebito != null)
    _uTableCartaoDebito.clear().draw();

  _uTableCartaoDebito = $("#tableDebito").DataTable({
    /* Parâmetros iniciais */
    destroy: true,
    bAutoWidth: false, 
    filter: false,
    lengthChange: false,
    bInfo: false,
    paging: false,
    "scrollY":        "350px",
    "scrollCollapse": true,
    pageLength: 100,
    ordering: false,
    dom:
      "<'ui grid'"+
         "<'row'"+
            "<'four wide column'l>"+
            "<'center aligned eight wide column'B>"+
            "<'right aligned four wide column'f>"+
         ">"+
         "<'row dt-table'"+
            "<'sixteen wide column'tr>"+
         ">"+
         "<'row'"+
            "<'seven wide column'i>"+
            "<'right aligned nine wide column'p>"+
         ">"+
      ">",
    //dom: '<"toolbar">frtip',
    /* Tradução da tabela */
    language: {
      emptyTable: "Nenhuma bandeira de cartão de débito",
      zeroRecords: "Nenhuma bandeira de cartão de débito",
      oPaginate: {
        sPrevious: "Anterior",
        sNext: "Próximo"
      },
      search : "",
      searchPlaceholder: "Pesquisar cartão de débito"
    },
    data: _rBandeirasDebitoMaquinaSelecionada,
    /* Definição das colunas */
    columns: [
      {
        mData: null,
        sWidth: '1px',
        bSortable: false,
        mRender: function(Objeto) {
          var _rHTML = "";

          //if (Objeto.selecionado != null && Objeto.selecionado == true) {
          if ((Objeto.selecionado != null && Objeto.selecionado == true) || fncValidaPagamentoSelecionado(20, Objeto)) {
            _rHTML = _rHTML + '<input class="border-checkbox colSelecionadoDebitoVista" type="checkbox" checked="true">';
          }
          else
            _rHTML = _rHTML + '<input class="border-checkbox colSelecionadoDebitoVista" type="checkbox">';

          /*if (fncValidaPagamentoSelecionado(20, Objeto))
            _rHTML = _rHTML + '<input class="border-checkbox colSelecionadoDebitoVista" type="checkbox" checked="true">';*/

          return _rHTML;
        }
      },
      {
        mData: null,
        sWidth: '1px',
        bSortable: false,
        mRender: function(Objeto) {
          return '<img src="' + Objeto.ds_imagem + '" height="32" width="48">&nbsp;&nbsp;&nbsp;<label style="font-weight: bold; font-size: 12px; cursor: pointer;">' + Objeto.nm_band + '</label>';
        }
      }
    ]
  });
  
  $('.dataTables_filter input').attr("style", "width: 500px;");

  eventClickRowDatatableDebito(_uTableCartaoDebito);
}

function refreshTablePagamento(Table) {
  Table.rows().invalidate().draw();
  eventMascaraValorPagamento();    
}

function eventMascaraValorPagamento() {
  //$("#IFH00SF0007AValor").autoNumeric('get')

  $(".currency").autoNumeric('init', 
    {
      aSign: ''
    }
  );
}

function eventClickRowDatatableDebito(Table) {
  $("#tableDebito tbody").off("click", "tr");
  $("#tableDebito tbody").on("click", "tr", function() {
    //var _rValor = $(this).autoNumeric('get');
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();
    //_rObjetoLinha.selecionado = $(this).is(':checked');
    if (_rObjetoLinha.selecionado == null)
      _rObjetoLinha.selecionado = true;
    else  
      _rObjetoLinha.selecionado = !_rObjetoLinha.selecionado;

    if (_rObjetoLinha.selecionado == true) {
      var _rPagamento = getPagamento(20, _rObjetoLinha, null);
      addPagamentoSelecionado(_rPagamento);
    }
    else {
      removePagamentoSelecionado(20, _rObjetoLinha);
    }

    refreshTablePagamento(Table);
  });
}

function eventClickRowDatatableCredito(Table) {
  $("#tableCredito tbody").off("click", "tr");
  $("#tableCredito tbody").on("click", "tr", function() {
    //var _rValor = $(this).autoNumeric('get');
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    console.log(_rObjetoLinha);

    //_rObjetoLinha.selecionado = $(this).is(':checked');
    if (_rObjetoLinha.selecionado == null)
      _rObjetoLinha.selecionado = true;
    else  
      _rObjetoLinha.selecionado = !_rObjetoLinha.selecionado;

    if (_rObjetoLinha.selecionado == true) {
      var _rPagamento = getPagamento(30, _rObjetoLinha, null);
      addPagamentoSelecionado(_rPagamento);
    }
    else {
      removePagamentoSelecionado(30, _rObjetoLinha);
    }


    refreshTablePagamento(Table);
  });
}

function getPagamento(CodigoPagamento, Objeto, ValorPagamento) {
  var _rPagamento = Objeto;

  _rPagamento.vl_pagame = 0;
  _rPagamento.cd_pagame = CodigoPagamento; // Débito

  // Dinheiro
  if (CodigoPagamento == 10) {
    _rPagamento.vl_pagame = ValorPagamento;
  }
  // Cartão de débito / crédito 
  else if (CodigoPagamento == 20 || CodigoPagamento == 30) {
    if (!_uTablePagamentosSelecionados.data().count()) {
      var _rValor = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
      _rPagamento.vl_pagame = _rValor;
      //_rPagamento.vl_pagame = _uValorTotalVenda;
    }

    if (CodigoPagamento == 30) {
      var _rValor = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
      _rPagamento.qt_presta = 1;
      //_rPagamento.vl_presta = _uValorTotalVenda;
      _rPagamento.vl_presta = _rValor;
    }
  }
  // Devolução
  else if (CodigoPagamento == 40) {
    _rPagamento.vl_pagame = ValorPagamento;
  }
  // Vale presente
  else if (CodigoPagamento == 41) {
    _rPagamento.vl_pagame = ValorPagamento;
  }
  // Cheque
  else if (CodigoPagamento == 61) {
    _rPagamento.vl_pagame = ValorPagamento;
  }
  // Deposito
  else if (CodigoPagamento == 70) {
    _rPagamento.vl_pagame = ValorPagamento;
  }

  return _rPagamento;
}

function removePagamentoSelecionado(TipoPagamento, Objeto) {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();
  var _rObjetos = [];

  _rObjetos = _rTable.rows().data();

  for (var i = 0; i < _rObjetos.length; i++) {
    // Dinheiro
    if (10 == _rObjetos[i].cd_pagame) {
      _rObjetos.splice(i, 1);
      break;
    }
    // Cheque
    else if (61 == _rObjetos[i].cd_pagame) {
      _rObjetos.splice(i, 1);
      break;
    }
    // Depósito
    else if (70 == _rObjetos[i].cd_pagame) {
      _rObjetos.splice(i, 1);
      break;
    }
    // Débito ou Crédito
    else if (TipoPagamento == _rObjetos[i].cd_pagame) {
      if (_rObjetos[i].cd_band == Objeto.cd_band && _rObjetos[i].cd_maqcar == Objeto.cd_maqcar) { 
        _rObjetos.splice(i, 1);
        break;
      }
    }
    // Débito ou Crédito
    else if (TipoPagamento == _rObjetos[i].cd_pagame) {
      if (_rObjetos[i].cd_band == Objeto.cd_band && _rObjetos[i].cd_maqcar == Objeto.cd_maqcar) { 
        _rObjetos.splice(i, 1);
        break;
      }
    }
  }

  _rTable.clear().draw();
  _rTable.rows.add(_rObjetos);
  _rTable.columns.adjust().draw();
}

function addPagamentoSelecionado(Objeto) {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();
  
  _rTable.row.add(Objeto).draw();
}

function initializeDatatablePagamentoCredito() {
  var _rLocal = localStorage.getItem("BandeiraCredito");
  _rLocal = _rLocal.trim();

  if (_rLocal == null || _rLocal === "")
    return;

  //_uJsonCartaoCredito = _rLocal;
  var _rBandeirasCreditoMaquinaSelecionada = fncBandeirasMaquinaCartaoSelecionada(_rLocal);

  if (_uTableCartaoCredito != null)
    _uTableCartaoCredito.clear().draw();

  _uTableCartaoCredito = $("#tableCredito").DataTable({
    /* Parâmetros iniciais */
    destroy: true,
    bAutoWidth: false, 
    filter: false,
    lengthChange: false,
    bInfo: false,
    paging: false,
    "scrollY":        "350px",
    "scrollCollapse": true,
    pageLength: 100,
    ordering: false,
    dom:
      "<'ui grid'"+
         "<'row'"+
            "<'four wide column'l>"+
            "<'center aligned eight wide column'B>"+
            "<'right aligned four wide column'f>"+
         ">"+
         "<'row dt-table'"+
            "<'sixteen wide column'tr>"+
         ">"+
         "<'row'"+
            "<'seven wide column'i>"+
            "<'right aligned nine wide column'p>"+
         ">"+
      ">",
    //dom: '<"toolbar">frtip',
    /* Tradução da tabela */
    language: {
      emptyTable: "Nenhuma bandeira de cartão de crédito",
      zeroRecords: "Nenhuma bandeira de cartão de crédito",
      oPaginate: {
        sPrevious: "Anterior",
        sNext: "Próximo"
      },
      search : "",
      searchPlaceholder: "Pesquisar cartão de crédito"
    },
    data: _rBandeirasCreditoMaquinaSelecionada,
    /* Definição das colunas */
    columns: [
      {
        mData: null,
        sWidth: '1px',
        bSortable: false,
        mRender: function(Objeto) {
          var _rHTML = "";

          if ((Objeto.selecionado != null && Objeto.selecionado == true) || fncValidaPagamentoSelecionado(30, Objeto)) {
            _rHTML = _rHTML + '<input class="border-checkbox colSelecionadoDebitoVista" type="checkbox" checked="true">';
          }
          else
            _rHTML = _rHTML + '<input class="border-checkbox colSelecionadoDebitoVista" type="checkbox">';

          /*if (fncValidaPagamentoSelecionado(30, Objeto))
            _rHTML = _rHTML + 'Heitor<input class="border-checkbox colSelecionadoDebitoVista" type="checkbox" checked="true">Maciel';*/

          return _rHTML;
        }
      },
      {
        mData: null,
        sWidth: '1px',
        bSortable: false,
        mRender: function(Objeto) {
          return '<img src="' + Objeto.ds_imagem + '" height="32" width="48">&nbsp;&nbsp;&nbsp;<label style="font-weight: bold; font-size: 12px; cursor: pointer;">' + Objeto.nm_band + '</label>';
        }
      }
    ]
  });
  
  $('.dataTables_filter input').attr("style", "width: 500px;");

  eventClickRowDatatableCredito(_uTableCartaoCredito);
}

function fncValidaPagamentoSelecionado(CodigoPagamento, Objeto) {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();
  var _rObjetos = [];
  var _rRetorno = false;

  _rPagamentos = _rTable.rows().data();

  for (var i = 0; i < _rPagamentos.length; i++) {
    var _rPagamento = _rPagamentos[i];

    if (_rPagamento.cd_pagame == CodigoPagamento  && 
        _rPagamento.cd_maqcar == Objeto.cd_maqcar && 
        _rPagamento.cd_band == Objeto.cd_band) {
      Objeto.selecionado = true;
      _rRetorno = true;
      return true;
    }
  }

  return _rRetorno;
}

function initializeDatatablePagamentoConvencional() {
  var _rPagamentos = getPagamentosConvencionais();

  if (_rPagamentos != null) {
    _uTablePagamentoConvencional = $("#tablePagamentoConvencional").DataTable({
      /* Parâmetros iniciais */
      destroy: true,
      bAutoWidth: false, 
      filter: false,
      lengthChange: false,
      bInfo: false,
      paging: false,
      "scrollY":        "350px",
      "scrollCollapse": true,
      pageLength: 100,
      ordering: false,
      dom:
        "<'ui grid'"+
           "<'row'"+
              "<'four wide column'l>"+
              "<'center aligned eight wide column'B>"+
              "<'right aligned four wide column'f>"+
           ">"+
           "<'row dt-table'"+
              "<'sixteen wide column'tr>"+
           ">"+
           "<'row'"+
              "<'seven wide column'i>"+
              "<'right aligned nine wide column'p>"+
           ">"+
        ">",
      //dom: '<"toolbar">frtip',
      /* Tradução da tabela */
      language: {
        emptyTable: "Nenhum tipo de pagamento encontrado",
        zeroRecords: "Nenhum tipo de pagamento encontrado",
        oPaginate: {
          sPrevious: "Anterior",
          sNext: "Próximo"
        },
        search : "",
        searchPlaceholder: "Pesquisar tipo de pagamento"
      },
      data: _rPagamentos,
      /* Definição das colunas */
      columns: [
        {
          mData: null,
          sWidth: '70%',
          bSortable: false,
          mRender: function(Objeto) {
            console.log(Objeto.cdPagame);
            console.log(_uTipoPagamento);

            if (Objeto.cdPagame == 10 || Objeto.cdPagame == 61 || Objeto.cdPagame == 70)
              return '<label style="font-size: 13px; padding: 5px 5px 5px 5px; cursor: pointer;">' + Objeto.dsPagame + '</label>';
            else if (_uTipoPagamento == 'Venda')
              return '<label style="font-size: 13px; padding: 5px 5px 5px 5px; cursor: pointer;">' + Objeto.dsPagame + '</label>';
            else
              return null;

            //return '<div class="row"><div class="form-group"><label class="control-label col-xs-9" style="font-size: 16px;">' + Objeto.dsPagame + '</label><div class="col-xs-3"><input type="text" class="form-control" value="0,00" style="text-align: right; width: 100px;" onClick="this.select();" /></div></div></div>';

            //return '<form class="form-horizontal"><div class="form-group"><label class="col-sm-2 control-label">' + Objeto.dsPagame + '</label><div class="col-sm-10"><input class="form-control" id="focusedInput" type="text" value="Click to focus"></div></div></form>';
          }
        },
        {
          mData: null,
          sWidth: '30%',
          bSortable: false,
          mRender: function(Objeto) {
            var _rSelector;

            // Dinheiro
            if (Objeto.cdPagame == 10)
              _rSelector = 'eDinheiro';
            // Cheque
            else if (Objeto.cdPagame == 61)
              _rSelector = 'eCheque';
            // Depósito
            else if (Objeto.cdPagame == 70)
              _rSelector = 'eDeposito';
            // Vale presente
            else if (Objeto.cdPagame == 41)
              _rSelector = 'eValePresente';
            // Vale troca
            else if (Objeto.cdPagame == 40)
              _rSelector = 'eValeTroca';
            // Vale funcionário
            else if (Objeto.cdPagame == 42)
              _rSelector = 'eValeFuncionario';

            if (Objeto.cdPagame == 10 || Objeto.cdPagame == 61 || Objeto.cdPagame == 70) {
              if (Objeto.vl_pagame != null) {
                _rValorPagamento = Objeto.vl_pagame;
                _rValorPagamento = parseFloat(_rValorPagamento);
                _rValorPagamento = _rValorPagamento.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

                return '<input type="text" class="form-control eValorPagamentoConvencional currency ' + _rSelector + '" value="' + _rValorPagamento + '" style="text-align: right; width: 100px; padding: 5px 5px 5px 5px;" onClick="this.select();" data-a-dec="," data-a-sep="."/>';
              }
              else
                return '<input type="text" class="form-control eValorPagamentoConvencional currency ' + _rSelector + '" value="0,00" style="text-align: right; width: 100px; padding: 5px 5px 5px 5px;" onClick="this.select();" data-a-dec="," data-a-sep="."/>';  
            }
            else if (Objeto.cdPagame == 41 && _uTipoPagamento == 'Venda')
              return '<img align="right" style="margin-bottom: 5px; margin-right: 5px;" src="./img/img-gift-2.png" height="32" width="32"/>';
            else if (Objeto.cdPagame == 40 && _uTipoPagamento == 'Venda')
              return '<img align="right" style="margin-bottom: 5px; margin-right: 5px;" src="./img/img-exchange.png" height="32" width="32"/>';
            else if (Objeto.cdPagame == 42 && _uTipoPagamento == 'Venda')
              return '<img align="right" style="margin-bottom: 5px; margin-right: 5px;" src="./img/img-employee.png" height="32" width="32"/>';
            else
              return null;
          }
        }
      ]
    });
    
    $('.dataTables_filter input').attr("style", "width: 500px;");

    eventClickRowDatatablePagamentoConvencional(_uTablePagamentoConvencional);
    eventChangeValorDinheiro(_uTablePagamentoConvencional);
    eventChangeValorCheque(_uTablePagamentoConvencional);
    eventChangeValorDeposito(_uTablePagamentoConvencional);
  }
}

function fncExisteFormaPagamentoSelecionada(CodigoPagamento) {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();
  var _rRetorno = false;

  $.each(_rTable.rows().data(), function(Index, Objeto){ 
    if (Objeto.cd_pagame == CodigoPagamento)
      _rRetorno = true;
  });

  return _rRetorno;
}

function alteraValorPagamento(CodigoPagamento, Valor) {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();

  $.each(_rTable.rows().data(), function(Index, Objeto){ 
    if (Objeto.cd_pagame == CodigoPagamento)
      Objeto.vl_pagame = Valor;
  });

  refreshTable(_rTable);
}

function eventChangeValorDinheiro(Table) {
  $("#tablePagamentoConvencional tbody").off("change", ".eDinheiro");
  $("#tablePagamentoConvencional tbody").on("change", ".eDinheiro", function() {
    var _rValor = $(this).autoNumeric('get');
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    console.log($(this));

    if ($(this).val() == "" || _rValor == 0) {
      _rObjetoLinha.vl_pagame = 0;
      $(this).val("0,00");

      removePagamentoSelecionado(10, null);

      //$(this).refresh();
      //refreshTable(Table);
      return;
    }

    _rObjetoLinha.vl_pagame = _rValor;
    _rObjetoLinha.ds_pagame = "Dinheiro";
    var _rPagamento = getPagamento(10, _rObjetoLinha, _rValor);

    if (fncExisteFormaPagamentoSelecionada(10))
      alteraValorPagamento(10, _rValor);
    else
      addPagamentoSelecionado(_rPagamento);
    
    refreshTable(Table);
  });
}

function eventChangeValorCheque(Table) {
  $("#tablePagamentoConvencional tbody").off("change", ".eCheque");
  $("#tablePagamentoConvencional tbody").on("change", ".eCheque", function() {
    var _rValor = $(this).autoNumeric('get');
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    if ($(this).val() == "" || _rValor == 0) {
      _rObjetoLinha.vl_pagame = 0;
      $(this).val("0,00");

      removePagamentoSelecionado(61, null);

      $(this).refresh();
      //refreshTable(Table);
      return;
    }

    _rObjetoLinha.vl_pagame = _rValor;
    _rObjetoLinha.ds_pagame = "Cheque";
    var _rPagamento = getPagamento(61, _rObjetoLinha, _rValor);

    if (fncExisteFormaPagamentoSelecionada(61))
      alteraValorPagamento(61, _rValor);
    else
      addPagamentoSelecionado(_rPagamento);
    
    refreshTable(Table);
  });
}

function eventChangeValorDeposito(Table) {
  $("#tablePagamentoConvencional tbody").off("change", ".eDeposito");
  $("#tablePagamentoConvencional tbody").on("change", ".eDeposito", function() {
    var _rValor = $(this).autoNumeric('get');
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    if ($(this).val() == "" || _rValor == 0) {
      _rObjetoLinha.vl_pagame = 0;
      $(this).val("0,00");

      removePagamentoSelecionado(70, null);

      $(this).refresh();
      //refreshTable(Table);
      return;
    }

    _rObjetoLinha.vl_pagame = _rValor;
    _rObjetoLinha.ds_pagame = "Depósito";
    var _rPagamento = getPagamento(70, _rObjetoLinha, _rValor);

    if (fncExisteFormaPagamentoSelecionada(70))
      alteraValorPagamento(70, _rValor);
    else
      addPagamentoSelecionado(_rPagamento);
    
    refreshTable(Table);
  });
}

function getInputDinheiro() {
  return $('.eDinheiro');
}

function getInputDeposito() {
  return $('.eDeposito');
}

function getInputCheque() {
  return $('.eCheque');
}

function getInputValePresente() {
  return $('.eValePresente');
}

function getInputValeTroca() {
  return $('.eValeTroca');
}

function getInputValeFuncionario() {
  return $('.eValeFuncionario');
}

function pesquisaValePresenteVenda(ExibeMensagemErro) {
  var _rPath = '/api/vale-presente/lista-vale-presente.php';

  $.ajax({
    url:  getBaseUrl() + _rPath,
    crossDomain: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    type: 'GET',
    dataType: "text",
    /*data: {
      cd_prod : _rData.cd_prod,
      cd_barras: _rData.cd_barras
    },*/
    beforeSend: function() {
      $('#divPrincipal').block({ message: '<b>Consultando vales presente</b>...'}); 
    },
    success: function(Data, Text, Request) {
      $('#divPrincipal').unblock();

      if (Data != null && Data.trim() != "") {
        var _rObjeto = JSON.parse(Data);

        var _rValesPresente = fncRemoveValeUtilizados(_rObjeto);

        if (_rValesPresente != null && _rValesPresente.length > 0) {
          initializeDatatableValePresentePagamento(_rValesPresente);
          $("#FH00SF0099A_MODAL_VALE_PRESENTE").modal('show');
        }
        else {
          toastr.error(
            'Não existem vales presentes a serem usados',
            {timeOut: 10000}
          );          
        }
      }
      else {
        $("#FH00SF0099A_MODAL_VALE_PRESENTE").modal('hide');

        if (ExibeMensagemErro) {
          toastr.error(
            'Não foram encontrados vales presente',
            {timeOut: 10000}
          );
        }
      }
    },
    error: function(request, status, error) {
      console.log('Erro ao consumir API: ');
      console.log('Request: ' + request); 
      console.log('Status: ' + status);
      console.log('Error: ' + error);
    }
  });
}

function pesquisaDevolucaoVenda(ExibeMensagemErro) {
  var _rPath = '/api/devolucao/lista-vale-troca.php';

  $.ajax({
    url:  getBaseUrl() + _rPath,
    crossDomain: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    type: 'GET',
    dataType: "text",
    /*data: {
      cd_prod : _rData.cd_prod,
      cd_barras: _rData.cd_barras
    },*/
    beforeSend: function() {
      $('#divPrincipal').block({ message: '<b>Consultando devoluções</b>...'}); 
    },
    success: function(Data, Text, Request) {
      $('#divPrincipal').unblock();

      if (Data != null && Data.trim() != "") {
        var _rObjeto = JSON.parse(Data);

        var _rDevolucoes = fncRemoveDevolucaoUtilizados(_rObjeto);

        if (_rDevolucoes != null && _rDevolucoes.length > 0) {
          initializeDatatableDevolucaoPagamento(_rDevolucoes);
          $("#FH00SF0099A_MODAL_DEVOLUCAO").modal('show');
        }
        else {
          toastr.error(
            'Não existem devoluções a serem usadas',
            {timeOut: 10000}
          );          
        }
      }
      else {
        $("#FH00SF0099A_MODAL_DEVOLUCAO").modal('hide');

        if (ExibeMensagemErro) {
          toastr.error(
            'Não foram encontradas devoluções',
            {timeOut: 10000}
          );
        }
      }
    },
    error: function(request, status, error) {
      console.log('Erro ao consumir API: ');
      console.log('Request: ' + request); 
      console.log('Status: ' + status);
      console.log('Error: ' + error);
    }
  });
}

function fncRemoveValeUtilizados(ValesPresente) {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();
  var _rObjetos = [];

  _rPagamentos = _rTable.rows().data();

  for (var j = 0; j < _rPagamentos.length; j++) {
    for (var i = 0; i < ValesPresente.length; i++) {
      if (_rPagamentos[j].cd_pagame == 41) {
        if (ValesPresente[i].nr_vale == _rPagamentos[j].nr_vale && ValesPresente[i].nr_seq == _rPagamentos[j].nr_seq)
          ValesPresente.splice(i, 1);
      }
    }
  }

  return ValesPresente;
}

function fncRemoveDevolucaoUtilizados(ValesPresente) {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();
  var _rObjetos = [];

  _rPagamentos = _rTable.rows().data();

  for (var j = 0; j < _rPagamentos.length; j++) {
    for (var i = 0; i < ValesPresente.length; i++) {
      if (_rPagamentos[j].cd_pagame == 40) {
        if (ValesPresente[i].nr_vale == _rPagamentos[j].nr_vale && ValesPresente[i].nr_seq == _rPagamentos[j].nr_seq)
          ValesPresente.splice(i, 1);
      }
    }
  }

  return ValesPresente;
}

function initializeDatatableValePresentePagamento(Data) {
  _uTableValePresente = $("#tableValePresentePagamento").DataTable({
    /* Parâmetros iniciais */
    destroy: true,
    "paging": false,
    filter: true,
    lengthChange: false,
    bInfo: false,
    pageLength: 1000,
    //scrollY: '370px',
    //"scrollX": true,
    //"bAutoWidth": true,
    "bAutoWidth": true,
    dom:
      "<'ui grid'"+
         "<'row'"+
            "<'four wide column'l>"+
            "<'center aligned eight wide column'B>"+
            "<'right aligned four wide column'f>"+
         ">"+
         "<'row dt-table'"+
            "<'sixteen wide column'tr>"+
         ">"+
         "<'row'"+
            "<'seven wide column'i>"+
            "<'right aligned nine wide column'p>"+
         ">"+
      ">",
    language: {
    emptyTable: "Nenhum vale presente encontrado",
    zeroRecords: "Nenhum vale presente encontrado",
    oPaginate: {
      sPrevious: "Anterior",
      sNext: "Próximo"
    },
    search : "",
    searchPlaceholder: "Pesquisar vale presente"
    },
    data: Data,
    /* Definição das colunas */
    columns: [
      {
        mData: 'nr_vale',
        bSortable: false,
        className: "text-center"
      },
      {
        mData: null,
        bSortable: false,
        className: "text-center",
        mRender: function (Objeto) { 
          if (Objeto.dt_valid != null) {
            var _rData = convertDateToInput(Objeto.dt_valid.toString());

            return _rData;
          }
        
          return null;
        }
      },
      {
        mData: null,
        bSortable: false,
        className: "text-right",
        mRender: function (Objeto) { 
          var _rHTML;

          if (Objeto.vl_vale != null) {
            var _rValor = Objeto.vl_vale;
            _rValor = parseFloat(_rValor);
            _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

            return _rValor;
          }
        
          return null;
        }
      },
      {
        mData: null,
        bSortable: false,
        className: "text-right",
        mRender: function (Objeto) { 
          var _rHTML;

          _rHTML = '<button type="button" style="font-weight: bold;" class="btn btn-sm btn-success btnUtilizarVale"><i class="ti-check"></i>&nbsp;&nbsp;Utilizar vale</button>';

          return _rHTML;
        }
      }
    ]
  });

  $('#tableValePresentePagamento').DataTable().columns.adjust().draw();

  $('.dataTables_filter input').removeClass('input-sm');
  $('.dataTables_filter input').addClass('input-md');
  $('.dataTables_filter input').attr("style", "width: 400px;");

  eventClickBtnUtilizarVale(_uTableValePresente);
  //$('#tableValePresentePagamento .dataTables_filter input').focus();
  //$('#tableValePresentePagamento_filter input:text').focus();
}

function initializeDatatableDevolucaoPagamento(Data) {
  _uTableDevolucaoVenda = $("#tableDevolucaoPagamento").DataTable({
    /* Parâmetros iniciais */
    destroy: true,
    "paging": false,
    filter: true,
    lengthChange: false,
    bInfo: false,
    pageLength: 1000,
    //scrollY: '370px',
    //"scrollX": true,
    //"bAutoWidth": true,
    "bAutoWidth": true,
    dom:
      "<'ui grid'"+
         "<'row'"+
            "<'four wide column'l>"+
            "<'center aligned eight wide column'B>"+
            "<'right aligned four wide column'f>"+
         ">"+
         "<'row dt-table'"+
            "<'sixteen wide column'tr>"+
         ">"+
         "<'row'"+
            "<'seven wide column'i>"+
            "<'right aligned nine wide column'p>"+
         ">"+
      ">",
    language: {
    emptyTable: "Nenhuma devolução encontrada",
    zeroRecords: "Nenhuma devolução encontrada",
    oPaginate: {
      sPrevious: "Anterior",
      sNext: "Próximo"
    },
    search : "",
    searchPlaceholder: "Pesquisar devolução"
    },
    data: Data,
    /* Definição das colunas */
    columns: [
      {
        mData: 'nr_vale',
        bSortable: false,
        className: "text-center"
      },
      {
        mData: null,
        bSortable: false,
        className: "text-center",
        mRender: function (Objeto) { 
          if (Objeto.dt_valid != null) {
            var _rData = convertDateToInput(Objeto.dt_valid.toString());

            return _rData;
          }
        
          return null;
        }
      },
      {
        mData: null,
        bSortable: false,
        className: "text-right",
        mRender: function (Objeto) { 
          var _rHTML;

          if (Objeto.vl_vale != null) {
            var _rValor = Objeto.vl_vale;
            _rValor = parseFloat(_rValor);
            _rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

            return _rValor;
          }
        
          return null;
        }
      },
      {
        mData: null,
        bSortable: false,
        className: "text-right",
        mRender: function (Objeto) { 
          var _rHTML;

          _rHTML = '<button type="button" style="font-weight: bold;" class="btn btn-sm btn-success btnUtilizarDevolucao"><i class="ti-check"></i>&nbsp;&nbsp;Utilizar devolução</button>';

          return _rHTML;
        }
      }
    ]
  });

  $('#tableDevolucaoPagamento').DataTable().columns.adjust().draw();

  $('.dataTables_filter input').removeClass('input-sm');
  $('.dataTables_filter input').addClass('input-md');
  $('.dataTables_filter input').attr("style", "width: 400px;");

  eventClickBtnUtilizarDevolucao(_uTableDevolucaoVenda);
}

function eventClickBtnUtilizarVale(Table) {
  $("#tableValePresentePagamento tbody").off("click", ".btnUtilizarVale");
  $("#tableValePresentePagamento tbody").on("click", ".btnUtilizarVale", function() {
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    _rObjetoLinha.vl_pagame = _rObjetoLinha.vl_vale;
    _rObjetoLinha.ds_pagame = "Vale presente<br/>" + _rObjetoLinha.nr_vale;

    var _rPagamento = getPagamento(41, _rObjetoLinha, _rObjetoLinha.vl_vale);
    addPagamentoSelecionado(_rPagamento);

    $("#FH00SF0099A_MODAL_VALE_PRESENTE").modal('hide');
  });
}

function eventClickBtnUtilizarDevolucao(Table) {
  $("#tableDevolucaoPagamento tbody").off("click", ".btnUtilizarDevolucao");
  $("#tableDevolucaoPagamento tbody").on("click", ".btnUtilizarDevolucao", function() {
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    _rObjetoLinha.vl_pagame = _rObjetoLinha.vl_vale;
    _rObjetoLinha.ds_pagame = "Devolução<br/>" + _rObjetoLinha.nr_vale;

    var _rPagamento = getPagamento(40, _rObjetoLinha, _rObjetoLinha.vl_vale);
    addPagamentoSelecionado(_rPagamento);

    $("#FH00SF0099A_MODAL_DEVOLUCAO").modal('hide');
  });
}

function eventClickRowDatatablePagamentoConvencional(Table) {
  $("#tablePagamentoConvencional tbody").off("click", "tr");
  $("#tablePagamentoConvencional tbody").on("click", "tr", function() {
    var _rLinha = $(this).closest('tr');
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    if (_rObjetoLinha.cdPagame == 10 || _rObjetoLinha.cdPagame == 61 || _rObjetoLinha.cdPagame == 70)
      _rLinha.find('.eValorPagamentoConvencional').focus().select();
    else if (_rObjetoLinha.cdPagame == 41)
      pesquisaValePresenteVenda(true);
    else if (_rObjetoLinha.cdPagame == 40)
      pesquisaDevolucaoVenda(true);
    //else if (_rObjetoLinha.cdPagame == 42)
    //  alert("Vale funcionário");
  });
}

function getPagamentosConvencionais() {
  var _rPagamentosConvencionais = [];
  var _rParametros = getParametrosApp();

  /* Utiliza pagamento em dinheiro */
  if (_rParametros[0].id_pagdin === 1) {
    var _rPagamento = {};
    _rPagamento.cdPagame = 10;
    _rPagamento.dsPagame = "Dinheiro";

    _rPagamentosConvencionais.push(_rPagamento);
  }

  /* Utiliza pagamento em cheque */
  if (_rParametros[0].id_pagche === 1) {
    var _rPagamento = {};
    _rPagamento.cdPagame = 61;
    _rPagamento.dsPagame = "Cheque";

    _rPagamentosConvencionais.push(_rPagamento);
  }

  /* Utiliza pagamento em depósito */
  if (_rParametros[0].id_pagdep === 1) {
    var _rPagamento = {};
    _rPagamento.cdPagame = 70;
    _rPagamento.dsPagame = "Depósito";

    _rPagamentosConvencionais.push(_rPagamento);
  }

  /* Utiliza pagamento em vale presente */
  if (_rParametros[0].id_pagvp === 1) {
    var _rPagamento = {};
    _rPagamento.cdPagame = 41;
    _rPagamento.dsPagame = "Vale presente";

    _rPagamentosConvencionais.push(_rPagamento);
  }

  /* Utiliza pagamento em vale troca */
  if (_rParametros[0].id_pagvt === 1) {
    var _rPagamento = {};
    _rPagamento.cdPagame = 40;
    _rPagamento.dsPagame = "Devolução";

    _rPagamentosConvencionais.push(_rPagamento);
  }

  /* Utiliza pagamento em vale funcionário */
  if (_rParametros[0].id_pagvf === 1) {
    var _rPagamento = {};
    _rPagamento.cdPagame = 42;
    _rPagamento.dsPagame = "Vale funcionário";

    _rPagamentosConvencionais.push(_rPagamento);
  }

  return _rPagamentosConvencionais;
}

function getDivDinheiro(ValorPagamento) {
  return '<input type="text" class="form-control currency eVlrPagamentoSelecionado" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." />';;
}

function getDivDebito(ValorPagamento) {
  return '<input type="text" class="form-control currency eVlrPagamentoSelecionado" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." />';;
}

function getDivCredito(ValorPagamento, Objeto) {
  var _rHTML = '';

  _rHTML = _rHTML + '<div class="row">';
  _rHTML = _rHTML + '<div class="col-md-12">';
  _rHTML = _rHTML + '<input type="text" class="form-control currency eVlrPagamentoSelecionado" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." />';
  _rHTML = _rHTML + '</div>';
  _rHTML = _rHTML + '</div>';


  var _rOpcoesParcelamento = getParcelamentoBandeira(Objeto.qt_presta, Objeto.vl_pagame, Objeto.cd_maqcar, Objeto.cd_band);
  var _rParcelamentoPadrao = getParcelamentoPadrao(Objeto.vl_pagame, Objeto.cd_maqcar, Objeto.cd_band);

  _rHTML = _rHTML + '<div class="row">';
  _rHTML = _rHTML + '<div class="col-md-12">';
  //_rHTML = _rHTML + '<select id="eQuantidadeParcelas" class="form-control form-control-sm" dir="rtl" style="font-weight: bold;"><option value="1" selected>1x R$ 20.200,96</option><option value="2">2x R$ 15.100,96</option><option value="3">3x R$ 10.289,96</option><option value="4">4x R$ 30.050,22</option></select>';
  _rHTML = _rHTML + '<select id="eQuantidadeParcelas" class="form-control form-control-sm eQuantidadeParcelas" style="font-weight: bold;">';
  
  if (_rOpcoesParcelamento != null && _rOpcoesParcelamento != '')
    _rHTML = _rHTML + _rOpcoesParcelamento;
  else
    _rHTML = _rHTML + _rParcelamentoPadrao;

  _rHTML = _rHTML + '</select>';
  _rHTML = _rHTML + '</div>';
  _rHTML = _rHTML + '</div>';

  return _rHTML;
  //return '<input type="text" class="form-control currency" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." />';;
}

function getParcelamentoPadrao(ValorPagamento, MaquinaCartao, Bandeira) {
  var _rHTML = '';

  _rValorPagamento = ValorPagamento;
  _rValorPagamento = parseFloat(_rValorPagamento);
  _rValorPagamento = _rValorPagamento.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

  _rHTML = _rHTML + '<option value="1" selected>1x R$ ' + _rValorPagamento + '</option>';
}

function getParcelamentoBandeira(NrParcela, ValorPagamento, MaquinaCartao, Bandeira) {
  var _rHTML = '';
  var _rLocal = localStorage.getItem("CreditoParcelamento");
  _rLocal = _rLocal.trim();

  if (_rLocal == null || _rLocal === "")
    return;

  var _rParcelamento = JSON.parse(_rLocal);

  _rParcelamento = _rParcelamento.filter(function(Objeto) {
    return Objeto.cd_maqcar == MaquinaCartao && Objeto.cd_band == Bandeira;
  });

  _rParcelamento = _rParcelamento.sort(function(Objeto, Novo) {
    var x = Objeto['nr_parc']; 
    var y = Novo['nr_parc'];

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });

  for (var i = 0; i < _rParcelamento.length; i++) {
    var _rValorParcela = null;
    var _rParcela = _rParcelamento[i];
    
    if (_rParcela.cd_maqcar == MaquinaCartao && _rParcela.cd_band == Bandeira) {
      _rValorParcela = ValorPagamento / _rParcela.nr_parc;

      if (_rParcela.tx_jurcli != null && _rParcela.tx_jurcli != 0) {
        _rValorJuros = _rValorParcela * (_rParcela.tx_jurcli / 100);

        _rValorParcela = _rValorParcela + _rValorJuros;
      }

      _rValorPagamento = _rValorParcela;
      _rValorPagamento = parseFloat(_rValorPagamento.toFixed(2));
      _rValorPagamento = _rValorPagamento.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

      if (_rParcela.nr_parc == NrParcela)
        _rHTML = _rHTML + '<option value="' + _rParcela.nr_parc + '" selected>' + _rParcela.nr_parc + 'x R$ ' + _rValorPagamento + '</option>';
      else
        _rHTML = _rHTML + '<option value="' + _rParcela.nr_parc + '">' + _rParcela.nr_parc + 'x R$ ' + _rValorPagamento + '</option>';
    }
  }

  return _rHTML;
}

function getDivValeTroca(ValorPagamento) {
  return '<input type="text" class="form-control currency eVlrPagamentoSelecionado" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." readOnly/>';;
}

function getDivValePresente(ValorPagamento) {
  return '<input type="text" class="form-control currency eVlrPagamentoSelecionado" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." readOnly/>';;
}

function getDivValeFuncionario(ValorPagamento) {
  return '<input type="text" class="form-control currency eVlrPagamentoSelecionado" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." readOnly/>';;
}

function getDivValeCheque(ValorPagamento) {
  return '<input type="text" class="form-control currency eVlrPagamentoSelecionado" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." />';;
}

function getDivDeposito(ValorPagamento) {
  return '<input type="text" class="form-control currency eVlrPagamentoSelecionado" style="text-align: right; width: 150px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + ValorPagamento + '" data-a-dec="," data-a-sep="." />';;
}

function initializeDatatablePagamentoSelecionado() {
  var _rPagamentosSelecionados = [];

  if (_uTablePagamentosSelecionados != null)
    _uTablePagamentosSelecionados.clear().draw();

  _uTablePagamentosSelecionados = $("#tablePagamentosSelecionados").DataTable({
    /* Parâmetros iniciais */
    destroy: true,
    bAutoWidth: false, 
    filter: false,
    lengthChange: false,
    bInfo: false,
    paging: false,
    "scrollY":        "350px",
    "scrollCollapse": true,
    pageLength: 100,
    ordering: false,
    dom:
      "<'ui grid'"+
         "<'row'"+
            "<'four wide column'l>"+
            "<'center aligned eight wide column'B>"+
            "<'right aligned four wide column'f>"+
         ">"+
         "<'row dt-table'"+
            "<'sixteen wide column'tr>"+
         ">"+
         "<'row'"+
            "<'seven wide column'i>"+
            "<'right aligned nine wide column'p>"+
         ">"+
      ">",
    //dom: '<"toolbar">frtip',
    /* Tradução da tabela */
    language: {
      emptyTable: "Nenhum pagamento selecionado",
      zeroRecords: "Nenhum pagamento selecionado",
      oPaginate: {
        sPrevious: "Anterior",
        sNext: "Próximo"
      },
      search : "",
      searchPlaceholder: "Pesquisar pagamento"
    },
    data: _rPagamentosSelecionados,
    "drawCallback": function(oSettings) { // run some code on table redraw
      var _rTable = this.api();

      atualizaTotalizadores(_rTable);
      //atualizaTooltip();
    },
    /* Definição das colunas */
    columns: [
      {
        mData: null,
        sWidth: '70%',
        bSortable: false,
        mRender: function(Objeto) {
          var _rTipoPagamento;

          if (Objeto.cd_pagame == 20)
            _rTipoPagamento = "Débito";
          else if (Objeto.cd_pagame == 30)
            _rTipoPagamento = "Crédito";

          if (Objeto.cd_pagame == 20 || Objeto.cd_pagame == 30)
            return '<img  src="' + Objeto.ds_imagem + '" height="32" width="48">&nbsp;&nbsp;&nbsp;<label style="font-weight: bold; font-size: 12px; cursor: pointer;">' + _rTipoPagamento + ' - ' + Objeto.nm_band + '</label>';
            //return '<label style="font-weight: bold; font-size: 12px; cursor: pointer;">' + _rTipoPagamento + ' - ' + Objeto.nm_band + '</label>';
          else
            return '<label style="font-weight: bold; font-size: 12px; cursor: pointer; margin-left: 5px;">' + Objeto.ds_pagame + '</label>';

          //return '<label style="font-weight: bold; font-size: 12px; cursor: pointer;">' + _rTipoPagamento + ' - ' + Objeto.nm_band + '</label>';
        }
      },
      {
        mData: null,
        sWidth: '30%',
        bSortable: false,
        mRender: function(Objeto) {
          var _rHTML;
          var _rValorPagamento;

          if (Objeto.vl_pagame != null) {
            _rValorPagamento = Objeto.vl_pagame;
            _rValorPagamento = parseFloat(_rValorPagamento);
            _rValorPagamento = _rValorPagamento.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

            // Dinheiro
            if (Objeto.cd_pagame == 10)
              _rHTML = getDivDinheiro(_rValorPagamento);
            // Débito
            else if (Objeto.cd_pagame == 20)
              _rHTML = getDivDebito(_rValorPagamento);
            // Crédito
            else if (Objeto.cd_pagame == 30)
              _rHTML = getDivCredito(_rValorPagamento, Objeto);
            // Vale troca
            else if (Objeto.cd_pagame == 40)
              _rHTML = getDivValeTroca(_rValorPagamento);
            // Vale presente
            else if (Objeto.cd_pagame == 41)
              _rHTML = getDivValePresente(_rValorPagamento);
            // Vale Funcionario
            else if (Objeto.cd_pagame == 42)
              _rHTML = getDivValeFuncionario(_rValorPagamento);
            // Cheque
            else if (Objeto.cd_pagame == 61)
              _rHTML = getDivValeCheque(_rValorPagamento);
            // Depósito
            else if (Objeto.cd_pagame == 70)
              _rHTML = getDivDeposito(_rValorPagamento);

            //_rHTML = '<input type="text" class="form-control currency" style="text-align: right; width: 100px; padding: 5px 5px 5px 5px;" onClick="this.select();" value="' + _rValorPagamento + '" data-a-dec="," data-a-sep="." />';;

            return _rHTML;
          }
          else {
            _rHTML = '<input type="text" class="form-control currency" value="0,00" style="text-align: right; width: 100px; padding: 5px 5px 5px 5px;" onClick="this.select();" data-a-dec="," data-a-sep="." />';;

            return _rHTML;
          }
        
          return null;

          //return '<input type="text" class="form-control currency" value="0,00" style="text-align: right; width: 100px; padding: 5px 5px 5px 5px;" onClick="this.select();" data-a-dec="," data-a-sep="." />';
        }
      },
      {
        mData: null,
        sWidth: '30%',
        bSortable: false,
        mRender: function(Objeto) {
          var _rHTML;
          var _rValorPagamento;

          return '<button id="btnExcluir" type="button" style="font-weight: bold;" class="btn btn-danger btn-sm btnExcluirPagamentoSelecionado ti-close pos-tip" data-toggle="tooltip" data-placement="bottom" title="Excluir"></button>'; 
          //return '<input type="text" class="form-control currency" value="0,00" style="text-align: right; width: 100px; padding: 5px 5px 5px 5px;" onClick="this.select();" data-a-dec="," data-a-sep="." />';
        }
      }
    ]
  });
  
  $('.dataTables_filter input').attr("style", "width: 500px;");

  eventChangeValorPagamentoSelecionado(_uTablePagamentosSelecionados);
  eventChangeQuantidadeParcelas(_uTablePagamentosSelecionados);
  eventBtnExcluir(_uTablePagamentosSelecionados);
  eventClickRowDatatablePagamentoSelecionado(_uTablePagamentosSelecionados);
}

function atualizaTooltip() {
  $(".pos-tip").tooltip();
}

function eventBtnExcluir(Table) {
  $("#tablePagamentosSelecionados tbody").off("click", ".btnExcluirPagamentoSelecionado");
  $("#tablePagamentosSelecionados tbody").on("click", ".btnExcluirPagamentoSelecionado", function() {
      var _rObjetoLinha = Table.row($(this).closest('tr')).data();
      var _rTableDebito = $('#tableDebito').DataTable();
      var _rTableCredito = $('#tableCredito').DataTable();

      Table.row($(this).parents('tr')).remove();

      // Dinheiro
      if (_rObjetoLinha.cd_pagame == 10) {
        removePagamentoDinheiro(_rObjetoLinha);
      }
      // Débito
      else if (_rObjetoLinha.cd_pagame == 20) {
        removePagamentoDebito(_rObjetoLinha);
      }
      // Crédito
      else if (_rObjetoLinha.cd_pagame == 30) {
        removePagamentoCredito(_rObjetoLinha);
      }
      // Cheque
      else if (_rObjetoLinha.cd_pagame == 61) {
        removePagamentoCheque(_rObjetoLinha);
      }
      // Depósito
      else if (_rObjetoLinha.cd_pagame == 70) {
        removePagamentoDeposito(_rObjetoLinha);
      }

      refreshTable(Table);
      refreshTable(_rTableDebito);
      refreshTable(_rTableCredito);
  });
}

function removePagamentoDinheiro(Objeto) {
  var _rInputDinheiro = getInputDinheiro();
  var _rTable = $('#tablePagamentoConvencional').DataTable();
  var _rObjetos = [];

  _rInputDinheiro.val("0,00");

  _rObjetos = _rTable.rows().data();

  for (var i = 0; i < _rObjetos.length; i++) {
    var _rPagamento = _rObjetos[i];

    if (_rPagamento.cd_pagame == 10)
      _rPagamento.vl_pagame = 0;
  }
}

function removePagamentoCheque(Objeto) {
  var _rTable = $('#tablePagamentoConvencional').DataTable();
  var _rInputCheque = getInputCheque();
  var _rObjetos = [];

  _rInputCheque.val("0,00");

  _rObjetos = _rTable.rows().data();

  for (var i = 0; i < _rObjetos.length; i++) {
    var _rPagamento = _rObjetos[i];

    if (_rPagamento.cd_pagame == 61)
      _rPagamento.vl_pagame = 0;
  }
}

function removePagamentoDeposito(Objeto) {
  var _rTable = $('#tablePagamentoConvencional').DataTable();
  var _rInputDeposito = getInputDeposito();
  var _rObjetos = [];
  
  _rInputDeposito.val("0,00");

  _rObjetos = _rTable.rows().data();

  for (var i = 0; i < _rObjetos.length; i++) {
    var _rPagamento = _rObjetos[i];

    if (_rPagamento.cd_pagame == 70)
      _rPagamento.vl_pagame = 0;
  }
}

function removePagamentoDebito(Objeto) {
  var _rTable = $('#tableDebito').DataTable();
  var _rObjetos = [];

  _rObjetos = _rTable.rows().data();

  for (var i = 0; i < _rObjetos.length; i++) {
    var _rPagamento = _rObjetos[i];

    if (_rPagamento.cd_maqcar == Objeto.cd_maqcar && _rPagamento.cd_band == Objeto.cd_band)
      _rPagamento.selecionado = false;
  }
}

function removePagamentoCredito(Objeto) {
  var _rTable = $('#tableCredito').DataTable();
  var _rObjetos = [];

  _rObjetos = _rTable.rows().data();

  for (var i = 0; i < _rObjetos.length; i++) {
    var _rPagamento = _rObjetos[i];

    if (_rPagamento.cd_maqcar == Objeto.cd_maqcar && _rPagamento.cd_band == Objeto.cd_band)
      _rPagamento.selecionado = false;
  }
}

function eventChangeValorPagamentoSelecionado(Table) {
  $("#tablePagamentosSelecionados tbody").off("change", ".eVlrPagamentoSelecionado");
  $("#tablePagamentosSelecionados tbody").on("change", ".eVlrPagamentoSelecionado", function() {
    var _rValor = $(this).autoNumeric('get');
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    console.log($(this));

    if ($(this).val() == "" || _rValor == 0) {
      _rObjetoLinha.vl_pagame = 0;
      $(this).val("0,00");
      $(this).refresh();

      refreshTable(Table);
      return;
    }

    _rObjetoLinha.vl_pagame = _rValor;
    _rObjetoLinha.vl_presta = _rObjetoLinha.vl_pagame / _rObjetoLinha.qt_presta;
    refreshTable(Table);
  });
}

function eventChangeQuantidadeParcelas(Table) {
  $("#tablePagamentosSelecionados tbody").off("change", ".eQuantidadeParcelas");
  $("#tablePagamentosSelecionados tbody").on("change", ".eQuantidadeParcelas", function() {
    var _rQuantidadeParcela = $(this).val();
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    _rObjetoLinha.qt_presta = parseInt(_rQuantidadeParcela);
    _rObjetoLinha.vl_presta = _rObjetoLinha.vl_pagame / _rObjetoLinha.qt_presta;
  });
}

function atualizaTotalizadores(Table) {
  _rValorTotalPagamentos = 0;
  _rValorFaltaPagar = 0;
  _rValorTroco = 0;

  $.each(Table.rows().data(), function(Index, Objeto){ 
    //console.log(obj.vl_conta);
    var _rValor = Objeto.vl_pagame;
    _rValor = parseFloat(_rValor);

    _rValorTotalPagamentos = _rValorTotalPagamentos + _rValor;
    //_rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});
  });

  atualizaValorTotalPagamento(_rValorTotalPagamentos);

  calculaValorFaltaPagar();
  calculaValorTroco(Table);
}

function atualizaValorTotalPagamento(ValorTotalPagamento) {
  var _rTotalInput = ValorTotalPagamento.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});

  $("#FH00SF0099A_VALOR_TOTAL_PAGAMENTOS").val(_rTotalInput);
}

function calculaValorFaltaPagar() {
  var _rTotalVenda = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
  var _rTotalPagamentos = $("#FH00SF0099A_VALOR_TOTAL_PAGAMENTOS").autoNumeric('get');

  var _rFaltaPagar = _rTotalVenda - _rTotalPagamentos;

  if (_rFaltaPagar > 0) {
    var _rTotalInput = _rFaltaPagar.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});
    $("#FH00SF0099A_VALOR_FALTA_PAGAR").val(_rTotalInput);
  }
  else
    $("#FH00SF0099A_VALOR_FALTA_PAGAR").val("0,00");
}

function calculaValorTroco(Table) {
  var _rTotalDinheiro = 0;
  var _rValorTroco = 0;
  var _rTotalPagamentos = 0;
  var _rTotalPagamentosSemDinheiro = 0;
  var _rExistePagamentoDinheiro = false;
  var _rTotalVenda = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
  var _rFaltaPagar = $("#FH00SF0099A_VALOR_FALTA_PAGAR").autoNumeric('get');

  _rTotalVenda = parseFloat(_rTotalVenda);

  $.each(Table.rows().data(), function(Index, Objeto){ 
    _rTotalPagamentos = parseFloat(_rTotalPagamentos) + parseFloat(Objeto.vl_pagame);

    if (Objeto.cd_pagame == 10) {
      _rExistePagamentoDinheiro = true;

      var _rValor = Objeto.vl_pagame;
      _rValor = parseFloat(_rValor);

      _rTotalDinheiro = _rTotalDinheiro + _rValor;
      //_rValor = _rValor.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});      
    }
    else 
      _rTotalPagamentosSemDinheiro = parseFloat(_rTotalPagamentosSemDinheiro) + parseFloat(Objeto.vl_pagame);
  });

  _rValorTroco = (_rTotalVenda - _rTotalPagamentosSemDinheiro) - _rTotalDinheiro;

  if (_rExistePagamentoDinheiro) {
    var _rTotalInput = _rValorTroco.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2});
    $("#FH00SF0099A_VALOR_TROCO").val(_rTotalInput);
  }
  else
    $("#FH00SF0099A_VALOR_TROCO").val("0,00");
}

function eventClickRowDatatablePagamentoSelecionado(Table) {
  $("#tablePagamentosSelecionados tbody").off("click", "tr");
  $("#tablePagamentosSelecionados tbody").on("click", "tr", function() {
    var _rLinha = $(this).closest('tr');
    var _rObjetoLinha = Table.row($(this).closest('tr')).data();

    _rLinha.find('.eVlrPagamentoSelecionado').focus().select();      
  });
}

function realizaVenda() {
  var _rPath = '/api/venda/cadastro-venda.php';

  var _rObjeto = getObjetoVenda();

  $('#divPrincipal').block({ message: '<b>Realizando venda - Aguarde um momento</b>...'}); 

  $.post(getBaseUrl() + _rPath,
    { 
      venda: JSON.stringify(_rObjeto)
    },
    function (Data, status) {
      var _rResponse = Data;

      $('#divPrincipal').unblock();

      if (_rResponse != null) {

        toastr.success(
          _rResponse[0].ret_ds_msg,
          {timeOut: 10000}
        );

        pesquisaVendasDia(_rResponse[0].ret_nr_venda);
        eventLimparTelaFH00SF0002A();
      }
      else {
        toastr.error(
          _rResponse[0].ret_ds_msg,
          {timeOut: 10000}
        );
      }

      $("#FH00SF0099AModalPagamento").modal('hide');
      eventLimparTelaModal();
    }
  )
  .done(function(Data) {
    $('#divPrincipal').unblock();
    eventLimparTelaModal();
    //pesquisaProdutosMaisVendidos();
  })
  .fail(function(xhr, status, error) {
    $('#divPrincipal').unblock();
  });
}

function eventLimparTelaFH00SF0002A() {
  var _rValorZerado = 0;

  _uVendaProdutos = [];
  _uVendaPagamentos = [];
  _uClienteVenda = null;
  _uTotalVenda = null;

  //$("#divProdutos").empty();
  var _rTableVenda = $('#tableProdutosVenda').DataTable();
  _rTableVenda.clear().draw();;
  //$("#tableProdutosVenda tbody").detach();

  $("#divTotalVenda").html(_rValorZerado.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
  $("#divTotalPagar").html(_rValorZerado.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
  $("#divTotalDesconto").html(_rValorZerado.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
  $("#divTotalAcrescimo").html(_rValorZerado.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
  $("#divTotalItens").html(_rValorZerado.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2}));              
}

function eventLimparTelaModal() {
  var _rValorZerado = 0;

  _uVendaProdutos = [];
  _uVendaPagamentos = [];
  _uClienteVenda = null;
  _uCliente = null;
  _uTotalVenda = null;

  //$("#divProdutos").empty();
  var _rTableVenda = $('#tableProdutosVenda').DataTable();
  _rTableVenda.clear().draw();;
  //$("#tableProdutosVenda tbody").detach();

  $("#ePesquisaProduto").val("");
  $("#ePesquisaCliente").val("");

  $("#divTotalVenda").html(_rValorZerado.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
  $("#divTotalPagar").html(_rValorZerado.toLocaleString("pt-BR", { style: "currency" , currency:"BRL"}));
  $("#divTotalItens").html(_rValorZerado.toLocaleString("pt-BR", { style: "decimal" , minimumFractionDigits: 2}));            
  $("#cbxModeloFiscal").val("65");
}

function getObjetoVenda() {
  /*
    10 - Somente Dinheiro
    20 - Somente Cartão de débito
    30 - Somente Cartão de crédito
  */

  var _rObjetoVenda = {
    Venda: {
      nrClient:   getClienteVenda()                ,
      nrVended:   getVendedorVenda()               ,
      nrCpfcnpj:  null                             ,
      nrModfis:   getModeloFiscal()                ,
      idEstr:     null                             ,
      vlTotal:    getVlrTotalVenda()               ,
      vlLiquido:  getVlrTotalVendaLiquido()        ,
      vlDesc:     getVlrTotalDesconto()            ,
      vlAcr:      getVlrTotalAcrescimo()           ,
      vlFrete:    getVlrTotalFrete()               ,
      vlTroco:    getValorTroco()                  ,
      Produtos:   getProdutosVenda()               ,
      Pagamentos: getPagamentosVenda()
    }
  };

  return _rObjetoVenda;
}

function getObjetoValePresente() {
  var _rObjetoValePresente = {
    ValePresente: {
      vlVale:     getValorValePresente(),
      Pagamentos: getPagamentosVenda()
    }
  };
  

  return _rObjetoValePresente;
}

function getClienteVenda() {
  return _uCliente != null ? _uCliente : null;
}

function getVendedorVenda() {
  return _uVendedor != null ? _uVendedor : null;
}

function getModeloFiscal() {
  return $("#cbxModeloFiscal").val();
}

function getProdutosVenda() {
  //var _rTableVenda = $('#tableProdutosVenda').DataTable();
  //var _rProdutos = [];

  //_rTableVenda.rows().data().each(function(value, index) {
  //  _rProdutos.push(value);
  //});

  return _uProdutos;
}

function getVlrTotalVenda() {
  return _uValorTotalVenda;
}

function getValorValePresente() {
  var _rValorValePresente = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
  _rValorValePresente = parseFloat(_rValorValePresente);
  return _rValorValePresente;    
}

function getVlrTotalVendaLiquido() {
  var _rValorLiquido = $("#FH00SF0099A_VALOR_TOTAL_VENDA").autoNumeric('get');
  return _rValorLiquido;  
}

function getVlrTotalDesconto() {
  var _rValorDesconto = $("#FH00SF0099A_VALOR_TOTAL_DESCONTO").autoNumeric('get');
  return _rValorDesconto;
}

function getVlrTotalAcrescimo() {
  var _rValorAcescimo = $("#FH00SF0099A_VALOR_TOTAL_ACRESCIMO").autoNumeric('get');
  return _rValorAcescimo;
}

function getVlrTotalFrete() {
  var _rValorFrete = $("#FH00SF0099A_VALOR_FRETE").autoNumeric('get');
  return _rValorFrete;
}

function getValorTroco() {
  var _rValorTroco = $("#FH00SF0099A_VALOR_TROCO").autoNumeric('get');
  return _rValorTroco;
}

function getPagamentosVenda() {
  var _rTable = $('#tablePagamentosSelecionados').DataTable();
  var _rPagamentos = [];
  var _rPagamentosSelecionados = [];
  
  _rPagamentos = _rTable.rows().data();

  for (var i = 0; i < _rPagamentos.length; i++) {
    var _rPagamento = _rPagamentos[i];

    if (_rPagamento.cd_pagame != null)
      _rPagamentosSelecionados.push(_rPagamento)
  }
  // Somente dinheiro
  /*if (TipoPagamento == 10) {
    var _rPagamento = {};
    _rPagamento.cdPagame = 10;
    _rPagamento.qtPresta = null;
    _rPagamento.vlPagame = getVlrTotalVenda();
    _rPagamento.vlPresta = null;

    _rPagamentos.push(_rPagamento);
  }*/

  return _rPagamentosSelecionados;
}

function fncConsisteProdutos() {
  var _rRetorno = true;

  //if (!_uProdutos.any()) {
  if (_uProdutos === null) {
    toastr.error(
      'É necessário ter produtos bipados para realizar a venda',
      {timeOut: 10000}
    );

    return false;
  }

  return _rRetorno;
}

function fncConsisteVendedor() {
  var _rRetorno = true;

  if (_uVendedor === "" || _uVendedor == null) {
    toastr.info(
      "Informe o vendedor que irá realizar a venda",
      {timeOut: 10000}
    );

    _rRetorno = false;
  }

  return _rRetorno;
}