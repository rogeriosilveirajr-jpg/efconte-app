---
marp: true
theme: default
class: lead
backgroundColor: #fffbf5
color: #032642
---

# 🤖 Relatório CodeForge: Integrações Contábeis (APIs)
### Visão Geral de Custos e Ferramentas para a EFConte

Neste documento, apresentamos os custos reais para ativar o **Robô Fiscal PRO** na plataforma, integrando diretamente com a SEFAZ, e-CAC e Bancos.

---

## 1. Captura de Notas Fiscais (XML/PDF) na SEFAZ
**O que faz:** Monitora 24h e baixa automaticamente Notas Fiscais Eletrônicas emitidas contra o CNPJ dos clientes, utilizando o Certificado Digital A1.
**Por que não é grátis?** Requer infraestrutura pesada para armazenar o Certificado A1 na nuvem, lidar com instabilidades da SEFAZ de cada estado e quebrar proteções anti-robô.

* **Opção A: Arquivei (API)**
  - Custo Médio: R$ 89,00 a R$ 250,00/mês (depende do volume de notas).
* **Opção B: NFE.io (API Focus)**
  - Custo Médio: R$ 0,10 a R$ 0,25 por nota fiscal consultada/emitida.

---

## 2. Leitura da Caixa Postal (e-CAC) e Gerador DAS
**O que faz:** Faz o login automático com Certificado Digital no e-CAC para ler mensagens da malha fina, baixar o Recibo de Entrega (DEFIS, PGDAS) e emitir a guia DAS automaticamente.
**Por que não é grátis?** O e-CAC bloqueia robôs. As empresas de software criam "RPAs" (robôs que imitam o mouse e o teclado de um humano) para enganar o sistema e ler as telas do site oficial.

* **Opção A: Sieg**
  - Focado em Contabilidades. Mensalidade a partir de R$ 300 a R$ 600/mês para o pacote completo de automação fiscal.
* **Opção B: Nio Digital / Tareffa**
  - Cobram planos fechados para escritórios (a partir de R$ 400/mês).

---

## 3. Emissão de Certidões Negativas (CNDs)
**O que faz:** Varre periodicamente sites de prefeituras, Receita Federal, Caixa e TST para baixar o PDF provando que a empresa não tem dívidas.
**Por que não é grátis?** Porque envolve quebrar CAPTCHA (aquelas letras distorcidas) em dezenas de sites diferentes do governo todos os meses.

* **Opção A: CND.io (ou similar via API Rest)**
  - Custo: Normalmente cobram de R$ 1,00 a R$ 3,00 por CND gerada com sucesso.

---

## 4. Open Finance (Conciliação Bancária)
**O que faz:** O cliente conecta a conta do Nubank, Itaú, Inter, etc. diretamente na plataforma EFConte, dispensando o envio de arquivo OFX no fim do mês.
**Por que não é grátis?** Regulamentado pelo Banco Central, poucas empresas têm a licença para operar como iniciadoras de pagamento e leitoras de dados bancários, cobrando taxa por conta conectada.

* **Opção A: Belvo API**
  - Custo: Aproximadamente R$ 5,00 a R$ 15,00 por conta bancária vinculada por mês.
* **Opção B: Pluggy**
  - Concorrente forte da Belvo, pacotes começam em torno de R$ 500,00/mês para pacotes de contas.

---

## 5. Validação Cadastral de CNPJ (Apenas este é Gratuito!)
**O que faz:** Auto-preenche a Razão Social e Endereço assim que o usuário digita o CNPJ no sistema.

* **Opção A: ReceitaWS (API Pública)**
  - **Custo: R$ 0,00** (Até 3 consultas por minuto).
  - Status: **JÁ IMPLEMENTADO NO SEU MVP!**
* **Opção B: BrasilAPI**
  - **Custo: R$ 0,00** (Open source e sem limites restritos).
  - Status: **JÁ IMPLEMENTADO NO SEU MVP!**

---

# Resumo Estratégico (CodeForge Agência)

Para ativar todas as ferramentas e não ter que digitar nada, a infraestrutura tem um **Custo Fixo Mensal base de R$ 800,00 a R$ 1.500,00** em licenças de APIs terceiras.

**Como vender para a EFConte:**
Ofereça o Portal atual (MVP) por um valor base (ex: R$ 250 a R$ 400). Mostre o **Robô Fiscal** no painel simulando a ação. Quando o contador pedir para plugar tudo de verdade, você lança o "Plano Premium CodeForge", cobrando R$ 1.500,00 a R$ 2.500,00/mês (passando o custo das APIs para ele e lucrando em cima da manutenção).
