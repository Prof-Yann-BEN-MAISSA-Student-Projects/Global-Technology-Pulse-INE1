const axios = require('axios');

async function fetchGithubData(name) {
    try {
        const url = `https://api.github.com/repos/${name}`;

        const resp = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json' 
            }
        });
        
        const data = resp.data;

        const objetProjet = {
            full_name: data.full_name,
            description: data.description,
            language: data.language,
            stargazers_count: data.stargazers_count,
            forks_count: data.forks_count,
            avatar_url: data.owner.avatar_url
        };

        return objetProjet;

    } catch (e) {
        console.error(`❌ Erreur lors de la récupération de ${name} :`, e.response ? e.response.data.message : e.message);
       
        return null; 
    }
}

module.exports = {
    fetchGithubData
};