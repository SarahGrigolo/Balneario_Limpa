// ============================================
// SISTEMA DE ABAS
// ============================================
function mostrarAba(nomeAba) {
  // Oculta todas as abas
  const abas = document.querySelectorAll('.aba-content');
  abas.forEach(aba => aba.classList.remove('aba-ativa'));

  // Mostra a aba selecionada
  document.getElementById(nomeAba).classList.add('aba-ativa');

  // Atualiza botões
  const botoes = document.querySelectorAll('.tab-btn');
  botoes.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Atualiza subtítulo dinamicamente
  const subtitulo = document.getElementById('subtitle-dinamico');
  if (nomeAba === 'app') {
    subtitulo.textContent = 'Solicite sua coleta de forma sustentável';
  } else {
    subtitulo.textContent = 'Testes com Usuários Reais';
  }
}

// ============================================
// ARMAZENAMENTO LOCAL (LOCALSTORAGE)
// ============================================
class GerenciadorSolicitacoes {
  constructor() {
    this.chave = 'balneario_limpa_solicitacoes';
  }

  // Adiciona nova solicitação
  adicionar(dados) {
    const solicitacoes = this.obter();
    const novaId = solicitacoes.length + 1;
    
    const novaSolicitacao = {
      id: novaId,
      tipo: dados.tipo,
      endereco: dados.endereco,
      telefone: dados.telefone,
      data: new Date().toLocaleString('pt-BR'),
      status: 'Pendente'
    };

    solicitacoes.push(novaSolicitacao);
    localStorage.setItem(this.chave, JSON.stringify(solicitacoes));
    return novaSolicitacao;
  }

  // Obtém todas as solicitações
  obter() {
    const dados = localStorage.getItem(this.chave);
    return dados ? JSON.parse(dados) : [];
  }

  // Limpa o histórico
  limpar() {
    localStorage.removeItem(this.chave);
  }
}

const gerenciador = new GerenciadorSolicitacoes();

// ============================================
// FUNÇÃO: SOLICITAR COLETA
// ============================================
function solicitarColeta(event) {
  event.preventDefault();

  // Coleta dados do formulário
  const residuo = document.getElementById('residuo').value;
  const endereco = document.getElementById('endereco').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const statusDiv = document.getElementById('status-message');

  // Validações
  if (!residuo || !endereco || !telefone) {
    exibirMensagem(
      statusDiv, 
      '❌ Por favor, preencha todos os campos!', 
      'erro'
    );
    return false;
  }

  // Valida telefone básico
  if (telefone.replace(/\D/g, '').length < 10) {
    exibirMensagem(
      statusDiv, 
      '❌ Telefone inválido! Digite um telefone com pelo menos 10 dígitos.', 
      'erro'
    );
    return false;
  }

  // Valida endereço
  if (endereco.length < 5) {
    exibirMensagem(
      statusDiv, 
      '❌ Endereço muito curto! Digite um endereço completo.', 
      'erro'
    );
    return false;
  }

  // Cria a solicitação
  const solicitacao = gerenciador.adicionar({
    tipo: residuo,
    endereco: endereco,
    telefone: telefone
  });

  // Exibe mensagem de sucesso
  exibirMensagem(
    statusDiv, 
    `✅ Coleta solicitada com sucesso!\n📦 Tipo: ${getResiduoLabel(residuo)}\n📍 Endereço: ${endereco}\n📱 Telefone: ${telefone}\n\nUm coletor entrará em contato em breve!`, 
    'sucesso'
  );

  // Limpa o formulário
  document.querySelector('form').reset();

  // Atualiza histórico
  atualizarHistorico();

  // Scroll para histórico
  setTimeout(() => {
    document.querySelector('.historico-container').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest' 
    });
  }, 500);

  return false;
}

// ============================================
// FUNÇÃO: EXIBIR MENSAGEM
// ============================================
function exibirMensagem(elemento, mensagem, tipo) {
  elemento.innerHTML = mensagem.replace(/\n/g, '<br>');
  elemento.className = `status-message ${tipo}`;
  elemento.style.display = 'block';

  // Remove a mensagem após 6 segundos
  setTimeout(() => {
    elemento.style.display = 'none';
  }, 6000);
}

// ============================================
// FUNÇÃO: OBTER LABEL DO RESÍDUO
// ============================================
function getResiduoLabel(valor) {
  const labels = {
    'plastico': '🔵 Plástico',
    'papel': '📄 Papel e Papelão',
    'vidro': '🟢 Vidro',
    'metal': '⚪ Metal e Alumínio'
  };
  return labels[valor] || valor;
}

// ============================================
// FUNÇÃO: ATUALIZAR HISTÓRICO
// ============================================
function atualizarHistorico() {
  const solicitacoes = gerenciador.obter();
  const listDiv = document.getElementById('historico-list');

  if (solicitacoes.length === 0) {
    listDiv.innerHTML = '<p class="empty-message">Nenhuma solicitação realizada ainda</p>';
    return;
  }

  let html = '';
  solicitacoes.forEach(sol => {
    html += `
      <div class="historico-item">
        <div class="historico-item-header">
          <span class="historico-item-tipo">${getResiduoLabel(sol.tipo)}</span>
          <span class="historico-item-data">${sol.data}</span>
        </div>
        <div style="color: #666; font-size: 0.9em;">
          <p><strong>Endereço:</strong> ${sol.endereco}</p>
          <p><strong>Telefone:</strong> ${sol.telefone}</p>
          <p><strong>Status:</strong> <span style="color: var(--primary-green); font-weight: 600;">${sol.status}</span></p>
        </div>
      </div>
    `;
  });

  listDiv.innerHTML = html;
}

// ============================================
// FUNÇÃO: SIMULAR TESTE (VALIDAÇÃO)
// ============================================
function simularTeste() {
  const messageElement = document.getElementById('test-message');
  
  if (!messageElement) return;

  const mensagens = [
    '✓ Teste realizado com sucesso! Usuário conseguiu fazer uma solicitação em 2 minutos.',
    '✓ Teste realizado com sucesso! Interface aprovada por 100% dos usuários.',
    '✓ Teste realizado com sucesso! Usuário achou o app intuitivo e fácil de usar.',
    '✓ Teste realizado com sucesso! Feedback positivo coletado com êxito.',
    '✓ Teste realizado com sucesso! MVP validado e pronto para próxima fase!'
  ];
  
  const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
  
  messageElement.textContent = mensagem;
  messageElement.classList.remove('show');
  
  void messageElement.offsetWidth;
  messageElement.classList.add('show');
  
  setTimeout(() => {
    messageElement.classList.remove('show');
  }, 5000);
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Atualiza histórico ao carregar
  atualizarHistorico();

  // Configura observador de interseção para animações
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Aplica animação aos elementos
  const elements = document.querySelectorAll('.card, .step, .result-card, .improvement-item, .info-card');
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });

  // Suavizar scroll para links âncora
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});