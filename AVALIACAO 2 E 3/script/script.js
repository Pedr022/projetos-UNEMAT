document.addEventListener("DOMContentLoaded", () => {
  
  const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a[href]").forEach((link) => {
    if (link.getAttribute("href") === paginaAtual) link.setAttribute("aria-current", "page");
  });

  
  document.querySelectorAll("main table").forEach((tabela, indice) => {
    const legenda = tabela.querySelector("caption")?.textContent.trim() || `Tabela ${indice + 1}`;
    const id = `filtro-tabela-${indice + 1}`;
    const area = document.createElement("div");
    area.className = "table-filter";
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = `Pesquisar em: ${legenda}`;
    const campo = document.createElement("input");
    campo.type = "search";
    campo.id = id;
    campo.placeholder = "Digite para filtrar as linhas...";
    campo.autocomplete = "off";
    campo.setAttribute("aria-describedby", `${id}-status`);
    const status = document.createElement("p");
    status.className = "filter-status";
    status.id = `${id}-status`;
    status.setAttribute("aria-live", "polite");
    const linhas = Array.from(tabela.querySelectorAll("tbody tr"));
    status.textContent = `Mostrando todos os ${linhas.length} registros.`;
    area.append(label, campo, status);
    tabela.parentNode.insertBefore(area, tabela);

    campo.addEventListener("input", () => {
      const termo = campo.value.trim().toLocaleLowerCase("pt-BR");
      let encontrados = 0;
      linhas.forEach((linha) => {
        const corresponde = termo === "" || linha.textContent.toLocaleLowerCase("pt-BR").includes(termo);
        linha.hidden = !corresponde;
        if (corresponde) encontrados++;
      });
      if (!termo) status.textContent = `Mostrando todos os ${linhas.length} registros.`;
      else if (!encontrados) status.textContent = "Nenhum resultado encontrado. Tente outro termo.";
      else status.textContent = `${encontrados} de ${linhas.length} registros encontrados.`;
    });
  });

  
  const formulario = document.querySelector("main form");
  if (formulario) {
    const feedback = document.createElement("p");
    feedback.className = "form-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    formulario.appendChild(feedback);
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      feedback.textContent = "";
      if (!formulario.checkValidity()) {
        formulario.reportValidity();
        feedback.textContent = "Confira os campos destacados antes de continuar.";
        return;
      }
      const apelido = formulario.querySelector("#apelido")?.value.trim();
      feedback.textContent = apelido
        ? `Tudo certo, ${apelido}! Seus dados foram validados nesta demonstração; nada foi enviado ou armazenado.`
        : "Formulário validado! Esta é uma demonstração local; nada foi enviado ou armazenado.";
      feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    formulario.addEventListener("reset", () => { feedback.textContent = ""; });
  }
});
