document.getElementById("ecoForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const banhos = parseInt(document.getElementById("banhos").value);
    const lampadas = document.getElementById("lampadas").value;
    const lixo = document.getElementById("lixo").value;
    const aparelhos = document.getElementById("aparelhos").value;
    const sacola = document.getElementById("sacola").value;
    const reuso = document.getElementById("reuso").value;
  
    let dicas = [];
  
    if (banhos > 2) {
      dicas.push("💧 Reduza o número ou tempo dos banhos para economizar água.");
    } else {
      dicas.push("✅ Ótimo! Você já economiza água com seus banhos.");
    }
  
    if (lampadas === "nao") {
      dicas.push("💡 Troque suas lâmpadas por LED para economizar energia.");
    } else {
      dicas.push("✅ Muito bem! Lâmpadas LED são eficientes.");
    }
  
    if (lixo === "nao") {
      dicas.push("♻️ Comece a separar o lixo reciclável.");
    } else {
      dicas.push("✅ Separar o lixo é um hábito excelente!");
    }
  
    if (aparelhos === "nao") {
      dicas.push("🔌 Desligue aparelhos da tomada para evitar consumo fantasma de energia.");
    } else {
      dicas.push("✅ Muito bem! Você evita o consumo desnecessário de energia.");
    }
  
    if (sacola === "nao") {
      dicas.push("🛍️ Use sacolas reutilizáveis para evitar o uso de plástico.");
    } else {
      dicas.push("✅ Mandou bem usando sacolas reutilizáveis!");
    }
  
    if (reuso === "nao") {
      dicas.push("🚿 Reutilizar água da chuva ou da máquina pode ajudar muito.");
    } else {
      dicas.push("✅ Reaproveitar água é uma prática sustentável.");
    }
  
    const falaTico = document.getElementById("falaTico");
    if (dicas.filter(d => d.includes("✅")).length >= 4) {
      falaTico.textContent = "Uau! Você está arrasando nas atitudes sustentáveis! 🌟";
    } else {
      falaTico.textContent = "Vamos melhorar juntos? Cada passo conta! 🐢";
    }
  
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "<h3>Dicas personalizadas:</h3><ul>" + dicas.map(dica => `<li>${dica}</li>`).join('') + "</ul>";
    resultado.classList.remove("hidden");
  
    window.dicasAtuais = dicas;
  });
  
  // GERAR PDF
  async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    const imgUrl = "https://cdn-icons-png.flaticon.com/512/616/616408.png";
  
    const getBase64ImageFromUrl = async (url) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    };
  
    const ticoImg = await getBase64ImageFromUrl(imgUrl);
    doc.addImage(ticoImg, "PNG", 80, 10, 50, 50);
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Suas Dicas Sustentáveis", 105, 70, { align: "center" });
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
  
    let y = 85;
  
    if (window.dicasAtuais && window.dicasAtuais.length > 0) {
      const dicasSemEmojis = window.dicasAtuais.map(dica =>
        dica.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      );
  
      dicasSemEmojis.forEach((dica, index) => {
        const texto = `${index + 1}. ${dica}`;
        const linhas = doc.splitTextToSize(texto, 170);
        linhas.forEach((linha) => {
          doc.text(linha, 20, y);
          y += 8;
        });
        y += 5;
      });
  
      // Texto extra
      const textoExtra = `Além de contribuir com o planeta, suas ações sustentáveis também refletem positivamente no seu bolso. Economizar água, energia e reduzir o desperdício são atitudes que ajudam a diminuir as contas no final do mês, promovendo um estilo de vida mais equilibrado e consciente.
  
  Com pequenas mudanças diárias, você cuida do meio ambiente e ainda melhora sua qualidade de vida. Que tal continuar nessa jornada e inspirar outras pessoas a fazerem o mesmo? Sustentabilidade é uma escolha poderosa!`;
  
      const paragrafos = doc.splitTextToSize(textoExtra, 170);
      paragrafos.forEach((linha) => {
        doc.text(linha, 20, y);
        y += 8;
      });
  
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Links úteis:", 20, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      const links = [
        { texto: "1. Trocar lâmpadas por LED", url: "https://www.akatu.org.br/consumo-consciente-de-energia/#lampadas" },
        { texto: "2. Separar lixo reciclável", url: "https://www.ecycle.com.br/coleta-seletiva/" },
        { texto: "3. Reutilizar água", url: "https://www.sabesp.com.br/site/interna/Default.aspx?secaoId=180" },
      ];
  
      links.forEach(link => {
        const linhasLink = doc.splitTextToSize(`${link.texto}: ${link.url}`, 170);
        linhasLink.forEach(linha => {
          doc.textWithLink(linha, 20, y, { url: link.url });
          y += 8;
        });
      });
  
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Obrigado por contribuir com um futuro melhor", 105, 280, { align: "center" });
  
      doc.save("dicas_sustentaveis.pdf");
    } else {
      alert("Preencha o formulário primeiro!");
    }
  }
  