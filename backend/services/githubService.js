const axios = require('axios');
require('dotenv').config();

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
            watchers_count: data.watchers_count,
            open_issues_count: data.open_issues_count,
            size: data.size,
            avatar_url: data.owner.avatar_url
        };

        return objetProjet;

    } catch (e) {
        console.error(`❌ Erreur lors de la récupération de ${name} :`, e.response ? e.response.data.message : e.message);
       
        return null; 
    }
}

// Fonction pour récupérer les localisations via GraphQL
async function getStargazersLocations(owner, repoName) {
    const endpoint = 'https://api.github.com/graphql';
    
    const query = `
        query getLocations($owner: String!, $name: String!, $cursor: String) {
            repository(owner: $owner, name: $name) {
                stargazers(last: 100, before: $cursor) {
                    pageInfo {
                        startCursor
                        hasPreviousPage
                    }
                    nodes {
                        location
                    }
                }
            }
        }
    `;

    try {
        let allNodes = []; // Le "panier" pour stocker TOUTES les pages
        let hasPreviousPage = true;
        let cursor = null;
        let pagesFetched = 0;
        const MAX_PAGES = 5; // 5 pages de 100 = 500 stargazers max

        // 2. L'appel POST avec Axios dans UNE SEULE boucle
        while (hasPreviousPage && pagesFetched < MAX_PAGES) {
            const reponse = await axios.post(
                endpoint,
                {
                    query: query,
                    variables: { owner: owner, name: repoName, cursor: cursor }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // On cible l'objet stargazers de CETTE page
            const stargazersData = reponse.data.data.repository.stargazers;
            
            // On ajoute (concatène) les 100 nouveaux profils dans notre grand panier "allNodes"
            allNodes = allNodes.concat(stargazersData.nodes);

            // On met à jour les variables pour le prochain tour de boucle
            hasPreviousPage = stargazersData.pageInfo.hasPreviousPage;
            cursor = stargazersData.pageInfo.startCursor;
            pagesFetched++;
        }

        // 3. Nettoyage : On filtre sur le grand panier final
        const validLocations = allNodes
            .filter(node => node.location !== null && node.location !== "")
            .map(node => node.location);

        console.log(`🎯 Trouvé ${validLocations.length} localisations valides pour ${owner}/${repoName} sur ${allNodes.length} profils scannés.`);
        
        return validLocations; 

    } catch (erreur) {
        console.error("Erreur GraphQL :", erreur.response ? erreur.response.data : erreur.message);
        return [];
    }
}

module.exports = {
    fetchGithubData,
    getStargazersLocations
};