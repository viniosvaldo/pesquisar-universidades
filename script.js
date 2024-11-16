const universitiesList = document.getElementById("universities-list");
const searchInput = document.getElementById("search");

let universities = []; // Lista completa de universidades

// Mapeamento de siglas para nomes completos
const siglas = {
    "ufmg": "Universidade Federal de Minas Gerais",
    "usp": "Universidade de São Paulo",
    "unicamp": "Universidade Estadual de Campinas",
    // Adicione mais siglas conforme necessário
};

// Função debounce otimizada
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// Função para exibir a lista de universidades com quadrinhos
function displayUniversities(universitiesListData) {
    universitiesList.innerHTML = ""; // Limpa a lista
    universitiesListData.slice(0, 50).forEach((university, index) => {
        const universityItem = document.createElement("div");
        universityItem.className = "university-item";
        universityItem.innerHTML = `
            <h2>${university.name}</h2>
            <p><strong>País:</strong> ${university.country}</p>
            <div id="embed-${index}"</div>
            <button onclick="showEmbed(${index}, '${university.web_pages[0]}')">Carregar Site</button>
        `;
        universitiesList.appendChild(universityItem);
    });
}

// Função para carregar o site no quadrinho correspondente
function showEmbed(index, website) {
    const embedDiv = document.getElementById(`embed-${index}`);
    embedDiv.innerHTML = `
        <iframe 
            src="${website}" 
            width="100%" 
            height="300" 
            style="border: none;">
        </iframe>`;
}

// Função de busca com suporte a siglas
function searchUniversities() {
    let searchTerm = searchInput.value.toLowerCase().trim();
    
    // Verifica se o termo de busca é uma sigla e substitui pelo nome completo, se necessário
    if (siglas[searchTerm]) {
        searchTerm = siglas[searchTerm].toLowerCase();
    }

    if (!searchTerm) {
        displayUniversities(universities.slice(0, 50)); // Exibe 50 universidades se o termo estiver vazio
        return;
    }

    const filteredUniversities = universities.filter((university) =>
        university.name.toLowerCase().includes(searchTerm) ||
        university.country.toLowerCase().includes(searchTerm)
    );

    displayUniversities(filteredUniversities);
}

// Adiciona o evento de input com debounce de 300ms
searchInput.addEventListener("input", debounce(searchUniversities, 300));

// Função para carregar dados da API
async function fetchUniversities() {
    try {
        const response = await fetch("http://universities.hipolabs.com/search");
        universities = await response.json();
        displayUniversities(universities.slice(0, 50)); // Exibe os primeiros 50 inicialmente
    } catch (error) {
        console.error("Erro ao buscar universidades:", error);
    }
}

// Chama a função para buscar os dados
fetchUniversities();

// Objeto com as notas de qualidade do ensino
const universityRatings = {
    "Universidade de São Paulo": 95,
    "Universidade Estadual de Campinas": 92,
    "Universidade Federal do Rio de Janeiro": 88,
    // Adicione mais universidades aqui
};

// Função para exibir a lista de universidades com qualidade do ensino
function displayUniversities(universitiesListData) {
    universitiesList.innerHTML = ""; // Limpa a lista
    universitiesListData.slice(0, 50).forEach((university, index) => {
        const universityItem = document.createElement("div");
        universityItem.className = "university-item";

        // Obtém a nota de qualidade do ensino (ou define como padrão)
        const rating = universityRatings[university.name] || Math.floor(Math.random() * 40) + 60;

        // Determina a cor com base na nota
        let color;
        if (rating === "N/A") {
            color = "gray";
        } else if (rating > 80) {
            color = "green";
        } else if (rating >= 60) {
            color = "yellow";
        } else {
            color = "red";
        }

        // Gera o HTML para o quadrinho
        universityItem.innerHTML = `
            <h2>${university.name}</h2>
            <p><strong>País:</strong> ${university.country}</p>
            <p><strong>Qualidade do Ensino:</strong> <span style="color: ${color};">${rating}%</span></p>
            <div id="embed-${index}" class="embed-content">Clique no botão para carregar o site.</div>
            <button onclick="showEmbed(${index}, '${university.web_pages[0]}')">Carregar Site</button>
        `;
        universitiesList.appendChild(universityItem);
    });
}

