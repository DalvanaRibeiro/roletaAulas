
const firebaseConfig = {
  apiKey: "AIzaSyCXKUpy5bXPPNrstc6ayHQTcXLjbwsNnEw",
  authDomain: "tasks-b52c5.firebaseapp.com",
  projectId: "tasks-b52c5",
  storageBucket: "tasks-b52c5.firebasestorage.app",
  messagingSenderId: "768498658017",
  appId: "1:768498658017:web:b1fb529cdd07669e22e5a0",
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const botaoGirar = document.getElementById("botaoGirar");
const botaoAdicionarTema = document.getElementById("botaoAdicionarTema");
const inputNovoTema = document.getElementById("novoTema");
const listaSorteios = document.getElementById("listaSorteios");
const botaoLimparHistorico = document.getElementById("botaoLimparHistorico");

let temas = [
  "A influência das redes sociais na saúde mental dos jovens",
  "Como combater o racismo estrutural nas escolas e na internet",
  "Fake news e os perigos da desinformação em tempos de crise",
  "Sustentabilidade no dia a dia: como pequenas ações fazem diferença",
  "Vício em celulares: problema moderno ou parte da evolução?",
  "A importância da leitura na era digital",
  "Desigualdade social e acesso à educação no Brasil",
  "Mudanças climáticas e o papel dos jovens no futuro do planeta",
  "Como a cultura brasileira pode combater a intolerância",
  "Privacidade na internet: você está realmente seguro?",
  "Bullying e cyberbullying: como prevenir e acolher",
  "Amazônia: riqueza natural ou alvo da destruição?",
  "Inteligência artificial: ameaça ou aliada?",
  "O papel do voto jovem na democracia brasileira",
  "Alimentação saudável e os impactos no aprendizado escolar",
  "Incluir não é favor: acessibilidade e respeito às diferenças",
  "O impacto do consumismo no meio ambiente",
  "Saúde mental e empatia na convivência escolar",
  "Como a juventude pode transformar a sociedade?"
];

let rotacaoAtual = 0;


function desenharRoleta() {
  const numeroFatias = temas.length;
  const angulo = (2 * Math.PI) / numeroFatias;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centroX = canvas.width / 2;
  const centroY = canvas.height / 2;
  const raio = Math.min(centroX, centroY);

  temas.forEach((tema, i) => {
    const anguloInicio = i * angulo;
    const anguloFim = anguloInicio + angulo;

    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.arc(centroX, centroY, raio, anguloInicio, anguloFim);
    ctx.fillStyle = `hsl(${i * (360 / numeroFatias)}, 70%, 70%)`;
    ctx.fill();
    ctx.stroke();

    // Texto(ver alguma solucao para melhorar na roleta ovtamanho)
    ctx.save();
    ctx.translate(centroX, centroY);
    ctx.rotate(anguloInicio + angulo / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = `${Math.floor(raio / 39)}px Arial`;
    ctx.fillText(tema, raio - 20, 10);
    ctx.restore();
  });
}


function redimensionarCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.width;
  desenharRoleta();
}

window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas();
desenharRoleta();

// salvando firestore
async function salvarNoFirebase(grupo, tema) {
  try {
    const docRef = await db.collection("sorteios").add({
      grupo: grupo,
      tema: tema,
      data: new Date()
    });
    console.log("Documento salvo com ID:", docRef.id);
    // Atualiza lista após salvar
    carregarHistorico();
  } catch (erro) {
    console.error("Erro ao salvar no Firestore:", erro);
  }
}

// preciso carregar o historico li na tela
async function carregarHistorico() {
  try {
    const snapshot = await db.collection("sorteios").orderBy("data", "desc").get();
    listaSorteios.innerHTML = ""; // limpa lista

    snapshot.forEach(doc => {
      const dataFormatada = doc.data().data.toDate().toLocaleString("pt-BR");
      const li = document.createElement("li");
      li.textContent = `${dataFormatada} - Grupo: ${doc.data().grupo} | Tema: ${doc.data().tema}`;
      listaSorteios.appendChild(li);
    });
  } catch (erro) {
    console.error("Erro ao carregar histórico:", erro);
  }
}

// Ajustar para limpar no firbase
async function limparHistoricoFirebase() {
  const confirmacao = confirm("Tem certeza que deseja limpar todo o histórico? Essa ação não pode ser desfeita(inclusive no firebase kkkk)");
  if (!confirmacao) return;

  try {
    const colecao = db.collection("sorteios");
    const snapshot = await colecao.get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    listaSorteios.innerHTML = "";
    alert("Histórico limpo com sucesso!");
  } catch (erro) {
    console.error("Erro ao limpar histórico:", erro);
    alert("Erro ao limpar histórico. Veja o console para detalhes.");
  }
}


botaoGirar.addEventListener("click", () => {
  const giros = Math.floor(Math.random() * 5) + 5;
  const graus = giros * 360 + Math.floor(Math.random() * 360);
  rotacaoAtual += graus;

  canvas.style.transition = "transform 3s ease-out"; //3s melhor
  canvas.style.transform = `rotate(${rotacaoAtual}deg)`;

  const indiceTema = Math.floor(((360 - (rotacaoAtual % 360)) / 360) * temas.length) % temas.length;
  const temaEscolhido = temas[indiceTema];

  setTimeout(() => {
    const grupo = prompt(`👀 Tema sorteado: "${temaEscolhido}"!\nDigite o nome do grupo:`);

    if (grupo) {
      alert(`Tema "${temaEscolhido}" salvo para o grupo "${grupo}"! Boa sorte pessoal ✌😎`);
      salvarNoFirebase(grupo, temaEscolhido);
    }

    canvas.style.transition = "none";
  }, 3200);
});


botaoAdicionarTema.addEventListener("click", () => {
  const novoTema = inputNovoTema.value.trim();
  if (novoTema) {
    temas.push(novoTema);
    inputNovoTema.value = "";
    desenharRoleta();
  }
});

// Para limpar historico...testar no firebase
botaoLimparHistorico.addEventListener("click", limparHistoricoFirebase);


carregarHistorico();
