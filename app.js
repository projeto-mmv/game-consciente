/* ================== QUIZ ESTILO KAHOOT ================== */
const PERGUNTAS = [
  { p: "Um amigo começa a participar de um desafio online que pede para ele realizar tarefas perigosas. O que você faria?",
    o: ["Incentivaria, pois é apenas uma brincadeira.", "Conversaria com ele e procuraria ajuda de um adulto de confiança.", "Participaria também para não ficar de fora."], c: 1,
    e: "Desafios perigosos podem causar danos reais. Conversar e buscar um adulto de confiança é a atitude mais segura." },
  { p: "Você percebe que um jogo está causando ansiedade, medo ou prejudicando seu sono. Qual seria a melhor atitude?",
    o: ["Continuar jogando normalmente.", "Reconhecer o problema, estabelecer limites e conversar com alguém.", "Esconder o que está acontecendo."], c: 1,
    e: "Reconhecer o problema é o primeiro passo. Limites de horário e apoio de alguém ajudam muito." },
  { p: "Uma pessoa desconhecida em um jogo começa a pedir informações pessoais e fotos. O que você deve fazer?",
    o: ["Enviar para conquistar a confiança dela.", "Ignorar os riscos porque ela parece legal.", "Não compartilhar, bloquear e contar a um adulto de confiança."], c: 2,
    e: "Nunca compartilhe dados ou fotos com desconhecidos. Bloqueie, denuncie e conte a um adulto. Isso pode ser aliciamento." },
  { p: "Um grupo virtual pressiona você a fazer algo que considera errado ou perigoso. Como agir?",
    o: ["Fazer para ser aceito pelo grupo.", "Recusar e sair da situação, procurando apoio se necessário.", "Fazer escondido dos responsáveis."], c: 1,
    e: "Quem gosta de você não te pressiona a fazer algo errado. Dizer “não” é um sinal de força." },
  { p: "Um colega demonstra tristeza e isolamento depois de sofrer situações desagradáveis em um jogo online. O que você faria?",
    o: ["Ignoraria, pois é um problema pessoal dele.", "Faria piadas para tentar animá-lo.", "Conversaria com ele sem julgamentos e o incentivaria a buscar ajuda."], c: 2,
    e: "Escutar sem julgar faz muita diferença. Incentivar a busca por ajuda pode proteger seu colega." },
  { p: "Você recebe um convite para participar de um desafio que envolve automutilação. Qual é a atitude correta?",
    o: ["Participar para descobrir do que se trata.", "Não participar, afastar-se do conteúdo e procurar ajuda de um adulto de confiança.", "Compartilhar o desafio com outros amigos."], c: 1,
    e: "Nunca participe nem compartilhe. Afaste-se, denuncie e busque ajuda. O CVV atende pelo 188, 24h." },
  { p: "Um jogo mostra: “OFERTA SÓ HOJE! Skin lendária por 2.000 moedas”. O que é mais consciente?",
    o: ["Comprar na hora antes que acabe.", "Pensar se realmente precisa e quanto isso vale em reais.", "Usar o cartão dos pais sem avisar.", "Pedir dinheiro emprestado a amigos."], c: 1,
    e: "Ofertas com tempo limitado criam urgência artificial. Converta as moedas para reais e reflita antes de comprar." },
  { p: "Por que as “loot boxes” (caixas de recompensa aleatória) são consideradas arriscadas?",
    o: ["Porque são sempre gratuitas.", "Porque funcionam de forma parecida com apostas.", "Porque deixam o jogo mais lento.", "Porque só existem em jogos antigos."], c: 1,
    e: "Recompensas aleatórias ativam o mesmo mecanismo das apostas e podem levar a gastos impulsivos." },
  { p: "Qual é um sinal de que o jogo pode estar virando um problema?",
    o: ["Jogar com amigos no fim de semana.", "Ficar irritado quando não pode jogar e deixar de lado estudos e amizades.", "Gostar de um jogo novo.", "Assistir a vídeos sobre jogos às vezes."], c: 1,
    e: "Irritação, perda de controle e abandono de outras atividades são sinais de alerta do transtorno de jogo." },
  { p: "Qual é uma boa estratégia para jogar de forma equilibrada?",
    o: ["Jogar até o sono chegar.", "Definir horários e fazer pausas a cada hora.", "Jogar durante as aulas.", "Pular refeições para terminar a partida."], c: 1,
    e: "Combinar horários e fazer pausas protege o sono, a visão, o corpo e os estudos." }
];
const TEMPO = 20;
const FORMAS = ["▲", "◆", "●", "■"];
let qi = 0, pontos = 0, acertos = 0, seq = 0, tRest = TEMPO, timerId = null, nome = "", ordem = [];
const box = document.getElementById("quizBox");

function telaInicial() {
  const rank = JSON.parse(localStorage.getItem("gc_rank") || "[]");
  box.innerHTML = `
    <div class="quiz-centro">
      <h3>🎮 Pronto para jogar?</h3>
      <p style="color:var(--muted)">${PERGUNTAS.length} perguntas · ${TEMPO} segundos cada · até 1000 pontos por pergunta</p>
      <input id="nomeJog" placeholder="Digite seu apelido" maxlength="18">
      <br><button class="btn btn-prim" onclick="iniciarQuiz()">▶ Começar</button>
      ${rank.length ? `<h4 style="margin-top:28px">🏆 Ranking (neste dispositivo)</h4><ol class="ranking">${rank.map((r,i)=>`<li><span>${i+1}. ${esc(r.n)}</span><b>${r.p}</b></li>`).join("")}</ol>` : ""}
    </div>`;
}
function iniciarQuiz() {
  nome = (document.getElementById("nomeJog").value || "Jogador").trim();
  qi = 0; pontos = 0; acertos = 0; seq = 0;
  ordem = PERGUNTAS.map((_, i) => i).sort(() => Math.random() - .5);
  mostrarPergunta();
}
function mostrarPergunta() {
  const q = PERGUNTAS[ordem[qi]];
  const ops = q.o.map((t, i) => ({ t, i })).sort(() => Math.random() - .5);
  box.innerHTML = `
    <div class="quiz-topo"><span>Pergunta ${qi + 1}/${PERGUNTAS.length}</span><div class="timer" id="timer">${TEMPO}</div><span>⭐ ${pontos} pts</span></div>
    <div class="barra"><div style="width:${(qi / PERGUNTAS.length) * 100}%"></div></div>
    <div class="pergunta">${q.p}</div>
    <div class="opcoes">${ops.map((o, k) => `<button class="op c${k}" data-i="${o.i}" onclick="responder(${o.i})"><span class="forma">${FORMAS[k]}</span>${o.t}</button>`).join("")}</div>
    <div id="fb"></div>`;
  tRest = TEMPO;
  clearInterval(timerId);
  timerId = setInterval(() => {
    tRest--;
    const el = document.getElementById("timer");
    if (el) el.textContent = tRest;
    if (tRest <= 0) responder(-1);
  }, 1000);
}
function responder(i) {
  clearInterval(timerId);
  const q = PERGUNTAS[ordem[qi]];
  const certo = i === q.c;
  let ganho = 0;
  if (certo) { seq++; acertos++; ganho = Math.round(500 + 500 * (tRest / TEMPO)) + (seq > 1 ? 100 : 0); pontos += ganho; } else seq = 0;
  document.querySelectorAll(".op").forEach(b => {
    b.disabled = true;
    const bi = +b.dataset.i;
    if (bi === q.c) b.classList.add("certo"); else b.classList.add("errado");
  });
  const msg = i === -1 ? "⏰ Tempo esgotado!" : certo ? `✅ Correto! +${ganho} pts${seq > 1 ? ` (🔥 sequência de ${seq})` : ""}` : "❌ Não foi dessa vez.";
  document.getElementById("fb").innerHTML = `<div class="feedback ${certo ? "ok" : "no"}">${msg}<br><span style="font-weight:400">${q.e}</span></div>
    <div style="text-align:center;margin-top:16px"><button class="btn btn-prim" onclick="proxima()">${qi + 1 < PERGUNTAS.length ? "Próxima ➜" : "Ver resultado 🏁"}</button></div>`;
}
function proxima() { qi++; qi < PERGUNTAS.length ? mostrarPergunta() : fimQuiz(); }
function fimQuiz() {
  const rank = JSON.parse(localStorage.getItem("gc_rank") || "[]");
  rank.push({ n: nome, p: pontos });
  rank.sort((a, b) => b.p - a.p);
  localStorage.setItem("gc_rank", JSON.stringify(rank.slice(0, 5)));
  const pct = acertos / PERGUNTAS.length;
  const frase = pct === 1 ? "Perfeito! Você é um(a) verdadeiro(a) Gamer Consciente! 🏆" : pct >= .7 ? "Muito bem! Você sabe se proteger no mundo dos games. 👏" : pct >= .4 ? "Bom começo! Revise as dicas do site e tente de novo. 💪" : "Que tal ler as seções do site e jogar de novo? Você consegue! 🙌";
  box.innerHTML = `<div class="quiz-centro">
    <h3>🏁 Fim de jogo, ${esc(nome)}!</h3>
    <div class="pontos">${pontos} pts</div>
    <p>${acertos} de ${PERGUNTAS.length} acertos</p>
    <p style="margin:14px 0;color:var(--muted)">${frase}</p>
    <h4>🏆 Ranking</h4>
    <ol class="ranking">${JSON.parse(localStorage.getItem("gc_rank")).map((r, i) => `<li><span>${i + 1}. ${esc(r.n)}</span><b>${r.p}</b></li>`).join("")}</ol>
    <button class="btn btn-prim" onclick="telaInicial()">Jogar novamente</button>
  </div>`;
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
telaInicial();

/* ================== TABS ================== */
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("ativo"));
  document.querySelectorAll(".painel").forEach(x => x.classList.remove("ativo"));
  t.classList.add("ativo");
  document.getElementById("tab-" + t.dataset.tab).classList.add("ativo");
}));
const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ===== Calculadora de gastos ===== */
function calcGastos() {
  const v = +document.getElementById("gValor").value || 0, q = +document.getElementById("gQtd").value || 0;
  const mes = v * q, ano = mes * 12;
  const equiv = [["🍔 lanches (R$ 30)", 30], ["🎬 idas ao cinema (R$ 40)", 40], ["👟 tênis (R$ 300)", 300], ["📱 celulares (R$ 1.500)", 1500]];
  document.getElementById("gRes").innerHTML = `
    <div class="res-grid">
      <div class="res-item"><b>${brl(mes)}</b>por mês</div>
      <div class="res-item"><b>${brl(ano)}</b>por ano</div>
      <div class="res-item"><b>${brl(ano * 5)}</b>em 5 anos</div>
    </div>
    <p style="margin-top:16px">Com ${brl(ano)} por ano daria para comprar:</p>
    <div class="res-grid">${equiv.map(([n, p]) => `<div class="res-item"><b>${Math.floor(ano / p)}</b>${n}</div>`).join("")}</div>
    <div class="dica">💡 Dica: antes de comprar, espere 24 horas. Se ainda quiser, pense se vale o valor em reais — não em moedas do jogo.</div>`;
}
calcGastos();

/* ===== Tempo de tela ===== */
const tH = document.getElementById("tHoras");
function calcTempo() {
  const h = +tH.value;
  document.getElementById("tHorasTxt").textContent = h;
  const ano = h * 365, dias = ano / 24;
  let nivel, cor;
  if (h <= 2) { nivel = "🟢 Equilibrado! Continue mantendo pausas e horários."; cor = "var(--verde)"; }
  else if (h <= 4) { nivel = "🟡 Atenção: veja se sobra tempo para sono, estudos, amigos e atividade física."; cor = "var(--amar)"; }
  else { nivel = "🔴 Muito tempo! Isso pode afetar sono, saúde e estudos. Que tal criar limites?"; cor = "var(--verm)"; }
  document.getElementById("tRes").innerHTML = `
    <div class="res-grid">
      <div class="res-item"><b>${(h * 7).toFixed(1)}h</b>por semana</div>
      <div class="res-item"><b>${ano.toFixed(0)}h</b>por ano</div>
      <div class="res-item"><b>${dias.toFixed(0)} dias</b>inteiros por ano</div>
      <div class="res-item"><b>${Math.floor(ano / 2)}</b>filmes que daria para ver</div>
    </div>
    <div class="dica" style="border-color:${cor}">${nivel}<br>Recomendação geral: adolescentes devem dormir de 8 a 10 horas por noite e evitar telas 1 hora antes de dormir.</div>`;
}
tH.addEventListener("input", calcTempo); calcTempo();

/* ===== Verdadeiro ou falso ===== */
const VF = [
  ["Todo jogo violento torna a pessoa violenta.", false, "Não há prova de que jogos, sozinhos, causem violência. Mas o contexto, a idade e o tempo de exposição importam — por isso existe a classificação indicativa."],
  ["A OMS reconhece o vício em jogos como uma condição de saúde.", true, "Desde 2019, o “transtorno de jogo” (gaming disorder) faz parte da CID-11."],
  ["Moedas virtuais ajudam a perceber melhor quanto se está gastando.", false, "É o contrário: elas “disfarçam” o valor real, o que facilita gastar mais."],
  ["Jogos podem melhorar habilidades como raciocínio e trabalho em equipe.", true, "Com moderação, jogos estimulam lógica, estratégia, reflexos e cooperação."],
  ["Jogar até tarde não afeta o desempenho na escola.", false, "A luz das telas e a agitação atrapalham o sono, o que prejudica memória, atenção e humor."],
  ["Loot boxes são proibidas ou reguladas em alguns países.", true, "Bélgica e Holanda, por exemplo, já restringiram loot boxes por se parecerem com apostas."],
  ["Se alguém no jogo pede segredo sobre a conversa de vocês, isso é um sinal de alerta.", true, "Pedir segredo, fotos ou dados pessoais são táticas comuns de aliciadores. Bloqueie e conte a um adulto."],
  ["Fazer pausas durante o jogo é perda de tempo.", false, "Pausas a cada hora protegem visão, postura e ajudam a manter o controle do tempo."]
];
let vfI = 0, vfPts = 0;
function mostrarVF() {
  const card = document.getElementById("vfCard");
  if (vfI >= VF.length) {
    card.innerHTML = `<p class="frase">Você acertou ${vfPts} de ${VF.length}! 🎉</p><button class="btn btn-prim" onclick="vfI=0;vfPts=0;mostrarVF()">Jogar de novo</button>`;
    return;
  }
  card.innerHTML = `<p style="color:var(--muted)">${vfI + 1} / ${VF.length}</p><p class="frase">“${VF[vfI][0]}”</p>
    <div class="btns"><button class="btn btn-v" onclick="respVF(true)">Verdade</button><button class="btn btn-f" onclick="respVF(false)">Mito</button></div><div id="vfFb"></div>`;
}
function respVF(r) {
  const [, c, e] = VF[vfI]; const ok = r === c; if (ok) vfPts++;
  document.querySelectorAll("#vfCard .btns button").forEach(b => b.disabled = true);
  document.getElementById("vfFb").innerHTML = `<div class="feedback ${ok ? "ok" : "no"}">${ok ? "✅ Acertou!" : "❌ Errou!"} É ${c ? "VERDADE" : "MITO"}.<br><span style="font-weight:400">${e}</span></div>
    <button class="btn btn-prim" style="margin-top:14px" onclick="vfI++;mostrarVF()">Próxima ➜</button>`;
}
mostrarVF();

/* ===== Autoavaliação ===== */
const ITENS = [
  "Muitas vezes jogo por mais tempo do que tinha planejado.",
  "Fico irritado(a) ou ansioso(a) quando não posso jogar.",
  "Já deixei de fazer tarefas, estudar ou dormir para jogar.",
  "Já menti sobre quanto tempo jogo ou quanto gasto.",
  "Já gastei dinheiro em jogos e me arrependi depois.",
  "Penso no jogo mesmo quando estou fazendo outras coisas.",
  "Uso o jogo para fugir de problemas ou sentimentos ruins.",
  "Deixei de encontrar amigos ou família para jogar.",
  "Já tentei diminuir o tempo de jogo e não consegui."
];
document.getElementById("testeLista").innerHTML = ITENS.map((t, i) => `<label><input type="checkbox" value="${i}">${t}</label>`).join("");
function avaliar() {
  const n = document.querySelectorAll("#testeLista input:checked").length;
  let txt;
  if (n <= 2) txt = "🟢 <b>Relação saudável.</b> Parece que você mantém um bom equilíbrio. Continue assim!";
  else if (n <= 5) txt = "🟡 <b>Fique atento(a).</b> Alguns hábitos merecem atenção. Tente definir horários, fazer pausas e controlar os gastos.";
  else txt = "🔴 <b>Sinal de alerta.</b> O jogo pode estar ocupando um espaço grande demais na sua vida. Converse com um adulto de confiança, um professor ou um psicólogo. Pedir ajuda é coragem!";
  document.getElementById("testeRes").innerHTML = `<div class="dica">Você marcou ${n} de ${ITENS.length} frases.<br>${txt}<br><small>Este teste é apenas educativo e não substitui avaliação profissional.</small></div>`;
}

/* ===== Loot box ===== */
let lCaixas = 0, lGasto = 0, lAchou = false;
const ITENS_LOOT = [["Spray comum", 60], ["Emote comum", 25], ["Skin rara", 10], ["Skin épica", 4], ["⭐ LENDÁRIO ⭐", 1]];
function sortear() {
  let r = Math.random() * 100;
  for (const [n, p] of ITENS_LOOT) { if (r < p) return n; r -= p; }
  return ITENS_LOOT[0][0];
}
function abrirCaixa(qtd) {
  const cx = document.getElementById("caixa");
  cx.classList.remove("abrindo"); void cx.offsetWidth; cx.classList.add("abrindo");
  let item;
  for (let k = 0; k < qtd; k++) {
    lCaixas++; lGasto += 10; item = sortear();
    if (item.includes("LENDÁRIO") && !lAchou) { lAchou = true; break; }
  }
  document.getElementById("lCaixas").textContent = lCaixas;
  document.getElementById("lGasto").textContent = brl(lGasto);
  document.getElementById("lItem").innerHTML = item.includes("LENDÁRIO") ? `<span class="lend">${item}</span>` : item.includes("rara") || item.includes("épica") ? `<span class="raro">${item}</span>` : item;
  const res = document.getElementById("lRes");
  if (lAchou) res.innerHTML = `<div class="dica">🎉 Você conseguiu o lendário depois de <b>${lCaixas} caixas</b> e gastou <b>${brl(lGasto)}</b>!<br>Repare: com 1% de chance, em média são necessárias <b>100 caixas (R$ 1.000)</b>. É assim que as loot boxes fazem as pessoas gastarem muito sem perceber — igual a uma aposta.</div>`;
  else if (lGasto >= 100) res.innerHTML = `<div class="dica">😬 Já foram ${brl(lGasto)} e nada do lendário... Percebe como a vontade de “tentar só mais uma” aparece? Esse é o mecanismo das apostas.</div>`;
}
function resetLoot() { lCaixas = 0; lGasto = 0; lAchou = false; ["lCaixas", "lGasto", "lItem", "lRes"].forEach((id, i) => document.getElementById(id).innerHTML = ["0", "R$ 0", "—", ""][i]); }
document.getElementById("caixa").addEventListener("click", () => abrirCaixa(1));

/* ================== REFLEXÃO ================== */
const REFLEXOES = [
  "Por que você joga? O que sente durante e depois de jogar?",
  "Você já comprou algo em um jogo por impulso ou por influência de alguém? Como se sentiu depois?",
  "Quantas horas por dia você acha que joga? E quantas acha que seria o ideal?",
  "Você já viveu ou presenciou alguma situação ruim em um jogo online (ofensas, golpes, pressão)? O que fez?",
  "O que você faria se percebesse que um amigo está jogando demais ou gastando muito?",
  "Que outras atividades te fazem bem além dos jogos?"
];
document.getElementById("reflexoes").innerHTML = REFLEXOES.map((q, i) => `
  <div class="reflexao"><h4>${i + 1}. ${q}</h4>
  <textarea data-k="gc_ref_${i}" placeholder="Escreva aqui...">${esc(localStorage.getItem("gc_ref_" + i) || "")}</textarea>
  <div class="salvo" id="sv${i}"></div></div>`).join("");
document.querySelectorAll(".reflexao textarea").forEach((t, i) => t.addEventListener("input", () => {
  localStorage.setItem(t.dataset.k, t.value);
  const s = document.getElementById("sv" + i); s.textContent = "✓ salvo"; clearTimeout(t._t); t._t = setTimeout(() => s.textContent = "", 1200);
}));

/* ================== CHAT (assistente educativo) ================== */
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const RESPOSTAS = [
  { k: ["me matar", "suicid", "nao quero mais viver", "quero morrer", "me cortar", "automutil", "me machucar", "tirar minha vida"], r:
    "💜 Sinto muito que você esteja se sentindo assim. Você não está sozinho(a) e merece ajuda agora.\n\n📞 Ligue 188 (CVV) — gratuito, 24 horas, ou acesse cvv.org.br para conversar por chat.\n🚑 Em emergência, ligue 192 (SAMU).\n\nConte também para um adulto de confiança: pai, mãe, responsável, professor(a). Falar sobre isso é um ato de coragem." },
  { k: ["triste", "deprimid", "sozinh", "ansios", "ansiedade", "chorar", "angustia", "me sinto mal", "estou mal", "to mal"], r:
    "Obrigado por compartilhar isso comigo. 💜 Sentir-se assim às vezes é normal, mas não precisa enfrentar sozinho(a).\n\n• Converse com alguém de confiança (família, amigos, professor).\n• Tente fazer pausas das telas e algo que te acalme: caminhar, ouvir música, respirar fundo.\n• Se o sentimento durar muito, procure um psicólogo — muitas escolas e postos de saúde (CAPS) oferecem atendimento.\n\nSe quiser conversar com alguém agora, o CVV atende pelo 188, 24h." },
  { k: ["vicio", "viciado", "viciada", "dependen", "nao consigo parar", "parar de jogar", "jogo demais", "jogando demais"], r:
    "Desde 2019 a OMS reconhece o “transtorno de jogo”. Alguns sinais: perder o controle do tempo, priorizar o jogo acima de tudo e continuar mesmo com prejuízos.\n\nDicas para retomar o controle:\n⏰ Defina horários e use alarmes\n📵 Deixe o celular/console fora do quarto à noite\n🏃 Troque parte do tempo por outras atividades\n🗣️ Converse com sua família ou um psicólogo\n\nQuer fazer a Autoavaliação na seção Programinhas?" },
  { k: ["gast", "dinheiro", "comprar", "compra", "skin", "microtrans", "v-buck", "robux", "moeda", "passe"], r:
    "💸 Os jogos usam várias estratégias para incentivar compras: moedas virtuais que escondem o preço real, ofertas por tempo limitado e itens raros.\n\nAntes de comprar, pergunte-se:\n1. Eu realmente preciso disso?\n2. Quanto isso custa em reais?\n3. Vou continuar querendo daqui a 24 horas?\n4. Meus responsáveis sabem?\n\nTeste a Calculadora de Gastos nos Programinhas!" },
  { k: ["loot", "caixa", "gacha", "aposta", "bet", "cassino", "roleta", "tigrinho"], r:
    "🎰 Loot boxes e mecânicas de sorte funcionam como apostas: você paga sem saber o que vai receber. Isso ativa a dopamina e a vontade de “tentar só mais uma vez”.\n\nApostas online (bets, “tigrinho”) são proibidas para menores de 18 anos e podem causar dívidas e dependência. Experimente o Simulador de Loot Box aqui no site para ver na prática!" },
  { k: ["desconhecid", "estranho", "foto", "nude", "informac", "endereco", "aliciament", "assedi", "pediu"], r:
    "🚨 Atenção! Nunca envie fotos, endereço, telefone, senhas ou dados da escola para desconhecidos — mesmo que pareçam legais.\n\nSe alguém pedir isso ou pedir segredo:\n1. Não responda e não envie nada\n2. Bloqueie e denuncie no jogo\n3. Salve prints\n4. Conte para um adulto de confiança\n\nVocê também pode denunciar na SaferNet (new.safernet.org.br) ou pelo Disque 100." },
  { k: ["bullying", "xingar", "xingou", "xingam", "ofend", "humilh", "zoar", "zoam", "toxic", "hate"], r:
    "😔 Cyberbullying é sério e não é culpa de quem sofre.\n\n• Não responda às provocações\n• Use as ferramentas de silenciar, bloquear e denunciar\n• Guarde prints como prova\n• Conte para alguém de confiança\n\nE se você vir alguém sofrendo, apoie essa pessoa. Às vezes, uma mensagem gentil faz toda a diferença." },
  { k: ["desafio", "challenge", "baleia", "momo", "perigos"], r:
    "⚠️ Desafios online perigosos podem causar ferimentos graves. Nenhum like ou aceitação vale sua saúde.\n\nSe receber um desafio assim: não participe, não compartilhe, denuncie e converse com um adulto de confiança." },
  { k: ["sono", "dormir", "insonia", "madrugada", "cansad"], r:
    "😴 Adolescentes precisam de 8 a 10 horas de sono. A luz das telas atrapalha a produção de melatonina, o hormônio do sono.\n\nDicas: pare de jogar 1 hora antes de dormir, ative o modo noturno e deixe o aparelho fora do quarto." },
  { k: ["escola", "nota", "estud", "prova", "dever", "tarefa"], r:
    "📚 Equilibrar jogos e estudos é possível!\n\n• Primeiro as tarefas, depois o jogo (use o jogo como recompensa)\n• Defina um tempo fixo para jogar\n• Use técnicas como Pomodoro (25 min de estudo + 5 de pausa)\n\nE sabia que alguns jogos ajudam a aprender idiomas e lógica?" },
  { k: ["violen", "agressiv", "raiva", "irritad", "estress"], r:
    "😤 Estudos mostram que jogos, sozinhos, não tornam ninguém violento, mas podem aumentar a irritação em algumas situações (derrotas, tempo excessivo, ambiente tóxico).\n\nSe perceber que está ficando com raiva: pause, respire fundo, beba água e volte depois. Respeite também a classificação indicativa dos jogos." },
  { k: ["beneficio", "faz bem", "positiv", "vantage", "lado bom"], r:
    "🎮 Jogos têm muitos benefícios quando usados com equilíbrio: raciocínio lógico, estratégia, coordenação, trabalho em equipe, criatividade e até aprendizado de idiomas. O segredo é a moderação!" },
  { k: ["influenc", "streamer", "youtuber", "propaganda", "publicidade", "fomo"], r:
    "📣 Influenciadores muitas vezes são pagos para divulgar jogos e itens. A vontade de ter o que todo mundo tem (FOMO — medo de ficar de fora) é uma das estratégias de marketing mais fortes.\n\nLembre-se: o valor de uma pessoa não está na skin que ela usa!" },
  { k: ["quanto tempo", "horas", "limite", "tempo de tela", "ideal"], r:
    "⏰ A Sociedade Brasileira de Pediatria recomenda, para adolescentes de 11 a 18 anos, de 2 a 3 horas por dia de tela para lazer, sem virar a noite.\n\nUse o programinha “Tempo de tela” para ver quanto isso dá em um ano!" },
  { k: ["pais", "mae", "pai", "familia", "responsave"], r:
    "👨‍👩‍👧 Conversar com a família sobre jogos ajuda muito! Mostre os jogos de que você gosta, combinem horários juntos e expliquem regras de gastos. Os responsáveis também podem usar o controle parental para ajudar." },
  { k: ["oi", "ola", "eai", "e ai", "bom dia", "boa tarde", "boa noite", "hey", "salve"], r:
    "Oi! 👋 Eu sou o Gui, o assistente do GameConsciente. Posso falar sobre vício em jogos, gastos, loot boxes, segurança online, cyberbullying, sono, estudos e emoções. Sobre o que você quer conversar?" },
  { k: ["obrigad", "valeu", "vlw", "brigad", "thanks"], r: "De nada! 😄 Sempre que quiser conversar, estou aqui. Jogue com consciência! 🎮" },
  { k: ["quem e voce", "quem e vc", "voce e", "seu nome"], r: "Sou o Gui 🤖, um assistente educativo criado para ajudar adolescentes a terem uma relação saudável com os jogos. Não sou uma pessoa nem psicólogo, mas posso te dar informações e dicas!" }
];
const SUGESTOES = ["Acho que jogo demais", "Gasto muito com skins", "O que são loot boxes?", "Um estranho me pediu fotos", "Sofro bullying no jogo", "Quanto tempo posso jogar?"];
const msgs = document.getElementById("chatMsgs");
function addMsg(txt, quem) {
  const d = document.createElement("div"); d.className = "msg " + quem; d.textContent = txt;
  msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d;
}
function responderBot(t) {
  const n = norm(t);
  for (const item of RESPOSTAS) if (item.k.some(k => n.includes(k))) return item.r;
  return "Hmm, não sei se entendi bem. 🤔 Posso te ajudar com temas como:\n• vício em jogos e tempo de tela\n• gastos, skins e loot boxes\n• segurança e desconhecidos\n• cyberbullying\n• sono, estudos e emoções\n\nTente perguntar de outro jeito!";
}
function enviarChat(e, texto) {
  if (e) e.preventDefault();
  const inp = document.getElementById("chatInput");
  const t = (texto || inp.value).trim(); if (!t) return;
  addMsg(t, "user"); inp.value = "";
  const dig = addMsg("Gui está digitando...", "bot digitando");
  setTimeout(() => { dig.remove(); addMsg(responderBot(t), "bot"); }, 700 + Math.random() * 600);
}
document.getElementById("chatSug").innerHTML = SUGESTOES.map(s => `<button type="button">${s}</button>`).join("");
document.querySelectorAll("#chatSug button").forEach(b => b.addEventListener("click", () => enviarChat(null, b.textContent)));
addMsg("Oi! 👋 Eu sou o Gui, o assistente do GameConsciente. Pode me perguntar qualquer coisa sobre jogos, gastos, segurança online ou como você está se sentindo. 💬", "bot");
