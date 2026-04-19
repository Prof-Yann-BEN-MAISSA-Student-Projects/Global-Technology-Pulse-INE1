import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function App() {

  const [projets, setProjets] = useState([]);
  const [erreur, setErreur] = useState(null);
  //const [projetSelectionne, setprojetSelectionne] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    const recupererDonnees = async () => {
      try {

        const reponse = await axios.get('http://localhost:2500/api/projects');


        setProjets(reponse.data);
      } catch (err) {
        console.error("Erreur de connexion :", err);
        setErreur("Impossible de joindre le serveur Backend.");
      }
    };

    recupererDonnees();
  }, []);



  /*
    async function ouvrirDetails(projet){
        //window.location.href = `http://localhost:2500/api/projects/${project_full_name}`;
        
        const nomProjet = projet.full_name;
        const oneProject = await axios(`http://localhost:2500/api/projects/${encodeURIComponent(nomProjet)}`)
        const project = oneProject.data;
  
        navigate(`/${encodeURIComponent(nomProjet)}`);
        setprojetSelectionne(project);
    }
  -*/

  function rediriger(projet) {

    const nomProjet = projet.full_name;
    let url = `/espace-visualisation/${encodeURIComponent(nomProjet)}`;
    navigate(url, { state: { projet } });
    //setprojetSelectionne(projet);
  }

  /*
    function fermerModal(){
      setprojetSelectionne(null);
    }
  */


  return (
    <div className="bigDiv">
      <h1 style={{ textAlign: 'center' }}>📊 Dashboard Tech Pulse INPT</h1>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {projets.length === 0 && !erreur && <p>Chargement des projets depuis MongoDB...</p>}

      <ul className="allProjects">
        {projets.map((projet) => (

          <div key={projet._id} className="projectCard" onClick={() => { rediriger(projet) }}>
            <ul style={{ marginBottom: '10px' }}>
              <img src={projet.avatar_url} alt={projet.full_name} width="60px" height="50px" ></img>
            </ul>
            <ul style={{ marginBottom: '10px' }}>
              <strong>{projet.full_name}</strong>
            </ul>
            <ul style={{ marginBottom: '10px' }}>
              Etoiles : {projet.stargazers_count}  ⭐
            </ul>
            <ul style={{ marginBottom: '10px' }}>
              Forks : {projet.forks_count} ✂️
            </ul>
            <ul style={{ marginBottom: '10px' }}>
              Language : {projet.language}  🖋️
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;