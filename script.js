const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items;

// MODAL AVISO (PREENCHA TODOS OS CAMPOS)

const btnavisoOK = document.getElementById("btnavisoOK");
const modalaviso = document.getElementById("modalaviso");

btnNew.onclick = () => {
    if (descItem.value === "" || amount.value === "" || type.value === "") {
        return modalaviso.style.display = "block",
        btnavisoOK.onclick = () => {
            modalaviso.style.display = "none";
        };
    }

    // SALVA OS ITENS NA TABELA

    items.push({
        desc: descItem.value,
        amount: Math.abs(amount.value).toFixed(2),
        type: type.value,
    });

    setItensBD();

    loadItens();

    descItem.value = "";
    amount.value = "";
}

// FUNÇÃO PARA DELETAR UM ITEM DA TABELA
function deleteItem(index) {
    items.splice(index, 1);
    setItensBD();
    loadItens();
}

// FUNÇÃO PARA INSERIR UM ITEM NA TABELA
function insertItem(item, index) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${item.desc}</td>
        <td>R$ ${item.amount}</td>
        <td class="columnType">${
            item.type === "Entrada"
            ? '<i class="bx bxs-plus-circle" title="ENTRADA"></i>'
            : '<i class="bx bxs-minus-circle" title="SAÍDA"></i>'
        }</td>
        <td class="columnAction">
            <button onclick="deleteItem(${index})"><i class="bx bx-trash" style="cursor: pointer" title="EXCLUIR"></i></button>
        </td>
    `;

    tbody.appendChild(tr);
}

// FUNÇÃO PARA CARREGAR OS ITENS NA TABELA

function loadItens() {
    items = getItensBD();
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        insertItem(item, index);   
    });

    getTotals();
}

// FUNÇÃO PARA SOMAR OS TOTAIS

function getTotals() {

    const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const amountIncomes = items
        .filter((item) => item.type === "Entrada")
        .map((transaction) => Number(transaction.amount));
        
    const amountExpenses = items
        .filter((item) => item.type === "Saída")
        .map((transaction) => Number(transaction.amount));

    const totalIncomes = amountIncomes
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2);

    const totalExpenses = Math.abs(
        amountExpenses.reduce((acc, cur) => acc + cur, 0)
    ).toFixed(2); 
    
    const totalItems = (totalIncomes - totalExpenses).toFixed(2); 
    
    // VALORES NÃO FORMATADOS
    // incomes.innerHTML = totalIncomes;
    // expenses.innerHTML = totalExpenses;
    // total.innerHTML = totalItems;

    // VALORES FORMATADOS
    incomes.innerHTML = formatador.format(totalIncomes);
    expenses.innerHTML = formatador.format(totalExpenses);
    total.innerHTML = formatador.format(totalItems);

    // FORMATAR O TOTAL PARA QUE O SINAL DE MENOS APAREÇA APÓS O R$
    total.innerHTML = totalItems < 0 
        ? formatador.format(Math.abs(totalItems)).replace("R$", "R$ -") 
        : formatador.format(totalItems);

    // VERIFICAÇÃO PARA A COR CORRETA
    if (totalItems >= 0) {
        total.style.color = "#00C9A7"; // verde
    } else {
        total.style.color = "#D83121"; // vermelho
    }
}

// LOCAL STORAGE

const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () =>
    localStorage.setItem("db_items", JSON.stringify(items));

loadItens();

// PARTE PARA LIMPAR O LOCALSTORAGE -------- E PARTE DOS MODAIS

const btnClear = document.getElementById("limparlocalstorage");
const modal = document.getElementById("modal");
const modalConfirm = document.getElementById("modalconfirm")
const confirmClear = document.getElementById("confirmClear");
const cancelClear = document.getElementById("cancelClear");
const btnOK = document.getElementById("btnOK");

// Abrir o modal PERGUNTA ao clicar no botão "Limpar Dados"
btnClear.onclick = () => {
    modal.style.display = "block";
};

//  ABRE O MODAL CONFIRMAÇÃO
btnOK.onclick = () => {
    modalConfirm.style.display = "none"; 
}

// Ação de confirmação para limpar dados
confirmClear.onclick = () => {
    localStorage.clear(); // Limpa todo o Local Storage
    loadItens();
    modal.style.display = "none"; // Fecha o modal
    modalConfirm.style.display = "block"; //Abre o modal de confirmação
};

// Ação de cancelamento
cancelClear.onclick = () => {
    modal.style.display = "none"; // Fecha o modal
    loadItens();
};

// Abre MODAL DE SAIBAMAIS

const btnsaibamais = document.getElementById("btnsaibamais");
const modalsaibamais = document.getElementById("modalsaibamais");
const btnsaibamaisOK = document.getElementById("btnsaibamaisOK");

btnsaibamais.onclick = () => {
    modalsaibamais.style.display = "block";
}

btnsaibamaisOK.onclick = () => {
    modalsaibamais.style.display = "none";
}

// inclui coisa na lista apertando enter

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {     
        document.getElementById("btnNew").click();      
    }
});

// CONFIGURAÇÕES

const btnconfig = document.getElementById("btnconfig");
const modalconfig = document.getElementById("modalconfig");
const btnconfigfechar = document.getElementById("btconfigfechar");

btnconfig.onclick = () => {
    modalconfig.style.display = "block";
};

btnconfigfechar.onclick = () => {
    modalconfig.style.display = "none";
}

// SALVA O VALOR DO CHECKBOX NO LOCALSTORAGE
// DARK AND LIGHT MODE

const darkmode = document.getElementById("toggle");
const body = document.getElementById("body");
const resumeDivs = document.querySelectorAll(".resume > div");
const inputs = document.querySelectorAll(".newItem input"); // Seleciona todos os inputs
const selects = document.querySelectorAll(".newItem select"); // Seleciona todos os selects
const modalmode = document.querySelectorAll(".modal-content"); // Seleciona todos os modais

// Função para buscar o estado do dark mode
const getDarkModeState = () => localStorage.getItem("dark_mode") === "true";

// Função para definir o estado do dark mode
const setDarkModeState = (state) => {
    localStorage.setItem("dark_mode", state);
}

// Ao carregar a página, restaurar o estado do dark mode
window.addEventListener("load", () => {
    const isDarkMode = getDarkModeState();
    body.className = isDarkMode ? "darkmodebody" : "whitemodebody"; 
    
    modalmode.forEach(modal => {
        modal.className = isDarkMode ? "modal-content darkmodemodal" : "modal-content whitemodemodal"; // Aplica a classe a cada modal
    });

    resumeDivs.forEach(div => {
        div.className = isDarkMode ? "darkmoderesumediv" : "whitemoderesumediv"; // Aplica a classe a cada div
    });

    // Aplica a classe para inputs
    inputs.forEach(input => {
        input.className = isDarkMode ? "darkmodeinput" : "whitemodeinput"; // Aplica a classe para cada input
    });

    // Aplica a classe para selects
    selects.forEach(select => {
        select.className = isDarkMode ? "darkmodeselect" : "whitemodeselect"; // Aplica a classe para cada select
    });

    darkmode.checked = isDarkMode;  // Define o estado do checkbox
});

darkmode.addEventListener("change", () => {
    const isChecked = darkmode.checked;
    body.className = isChecked ? "darkmodebody" : "whitemodebody"; // Troca a classe do body
    
    modalmode.forEach(modal => {
        modal.className = isChecked ? "modal-content darkmodemodal" : "modal-content whitemodemodal"; // Aplica a classe a cada modal
    });

    resumeDivs.forEach(div => {
        div.className = isChecked ? "darkmoderesumediv" : "whitemoderesumediv"; // Aplica a classe a cada div
    });

    // Aplica a classe para inputs
    inputs.forEach(input => {
        input.className = isChecked ? "darkmodeinput" : "whitemodeinput"; // Aplica a classe para cada input
    });

    // Aplica a classe para selects
    selects.forEach(select => {
        select.className = isChecked ? "darkmodeselect" : "whitemodeselect"; // Aplica a classe para cada select
    });

    setDarkModeState(isChecked); // Salva o estado no localStorage
});