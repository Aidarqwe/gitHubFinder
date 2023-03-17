const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', function (event) {
	event.preventDefault();
	const query = searchInput.value.trim();
	if (query.length < 3) {
		errorMessage.textContent = 'Введите поисковый запрос длиной не менее 3 символов';
		searchResults.innerHTML = '';
	} else {
		searchRepositories(query);
	}
});

async function searchRepositories(query) {
	const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=10`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		if (data.items.length === 0) {
			searchResults.innerHTML = '';
			errorMessage.textContent = 'Ничего не найдено';
		} else {
			displayResults(data.items);
			errorMessage.textContent = '';
		}
	} catch (error) {
		console.error(error);
		searchResults.innerHTML = '';
		errorMessage.textContent = 'Произошла ошибка при загрузке результатов поиска';
	}
}

function displayResults(repositories) {
	let html = '';
	repositories.forEach(repo => {
		html += `
      <div class="search-result">
        <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
           <p class="repo-description">${repo.description || 'No description'}</p>
        <p class="repo-stats">
          <span>${repo.language || 'Unknown language'}</span>
          <span>${repo.stargazers_count} stars</span>
          <span>${repo.forks_count} forks</span>
        </p>
      </div>
    `;
	});
	searchResults.innerHTML = html;
}