import React, { useState, useEffect } from 'react';

const PermitForm = () => {
  // États pour les sélections de l'utilisateur
  const [category, setCategory] = useState('');
  const [nature, setNature] = useState('');
  const [showDiscretionaryWarning, setShowDiscretionaryWarning] = useState(false);
  const [natureOptions, setNatureOptions] = useState([]);
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);

  // Données simulées pour la grille de zonage
  const mockZoningGrid = {
    // Simuler si cette adresse a une indication P.I.I.A.
    hasPIIA: true
  };

  // Données des catégories de permis
  const categories = [
    { value: 'abattage-arbres', label: "Certificat d'autorisation - Abattage d'arbre(s)" },
    { value: 'usages', label: "Certificat d'autorisation - Usages" },
    { value: 'construction-agricole', label: "Construction et/ou rénovation agricole" },
    { value: 'construction-subvention', label: "Construction et/ou rénovation avec programme subvention" },
    { value: 'construction-commerciale', label: "Construction et/ou rénovation commerciale" },
    { value: 'construction-industrielle', label: "Construction et/ou rénovation industrielle" },
    { value: 'construction-institutionnelle', label: "Construction et/ou rénovation institutionnelle" },
    { value: 'construction-residentielle', label: "Construction et/ou rénovation résidentielle" },
    { value: 'demande-analyse', label: "Demande d'analyse" },
    { value: 'demande-subvention', label: "Demande de subvention" },
    { value: 'demande-discretionnaire', label: "Demande discrétionnaire" },
    { value: 'occupation-temporaire', label: "Occupation temporaire du domaine public" },
    { value: 'permis-lotissement', label: "Permis de lotissement" },
    { value: 'permis-vendeur', label: "Permis vendeur itinérant (sollicitation)" },
    { value: 'intervention-rtu', label: "Traitement d'une demande d'intervention RTU" },
    { value: 'eau-potable', label: "Utilisation de l'eau potable" },
  ];

  // Mapping des options de nature pour chaque catégorie
  const natureOptionsMap = {
    'abattage-arbres': [
      { value: 'arbre-mort', label: "Abattage d'arbre mort malade ou dangereux" },
      { value: 'arbre-sain-20cm', label: "Abattage d'arbre(s) sain(s) de 20 cm de diamètre et plus" },
      { value: 'arbre-sain-5-20cm', label: "Abattage d'arbre(s) sain(s) de 5 cm à 20 cm de diamètre" },
      { value: 'frene', label: "Abattage d'un frêne" },
    ],
    'usages': [
      { value: 'activites-communautaires', label: "Activités communautaires extérieures" },
      { value: 'bazars', label: "Bazars" },
      { value: 'certificat-complementaire', label: "Certificat d'autorisation complémentaire à un usage résidentiel" },
      { value: 'certificat-place-affaires', label: "Certificat d'autorisation de place d'affaires (usage)" },
      // Plus d'options ici
    ],
    // Ajoutez les options pour les autres catégories selon les captures d'écran
    'construction-residentielle': [
      { value: 'agrandissement', label: "Agrandissement d'un bâtiment principal" },
      { value: 'ajout-portes-fenetres', label: "Ajout, modification ou retrait de porte(s) et/ou fenêtre(s)" },
      { value: 'amenagement-stationnement', label: "Aménagement, réaménagement ou agrandissement d'une aire de stationnement" },
      // Plus d'options résidentielles
    ],
    'eau-potable': [
      { value: 'arrosage-pelouse', label: "Permis arrosage nouvelle pelouse" },
      { value: 'borne-fontaine', label: "Utilisation d'une borne fontaine (adresse à proximité)" },
    ],
    // Autres catégories avec leurs options
  };

  // Vérifie si la catégorie est liée à la construction
  const isConstructionCategory = (cat) => {
    return cat.startsWith('construction-');
  };

  // Mise à jour des options de nature quand la catégorie change
  useEffect(() => {
    if (category) {
      setNatureOptions(natureOptionsMap[category] || []);
      setNature(''); // Réinitialiser la nature lorsque la catégorie change
      
      // Vérifier si nous devons afficher un avertissement pour une demande discrétionnaire
      if (isConstructionCategory(category) && mockZoningGrid.hasPIIA) {
        setShowDiscretionaryWarning(true);
      } else {
        setShowDiscretionaryWarning(false);
      }
    }
  }, [category]);

  // Activer/désactiver le bouton Suivant en fonction de la sélection de la nature
  useEffect(() => {
    setIsNextButtonEnabled(!!nature);
  }, [nature]);

  // Gestionnaire de changement de catégorie
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Gestionnaire de changement de nature
  const handleNatureChange = (e) => {
    setNature(e.target.value);
  };

  // Simuler le passage à l'étape suivante
  const handleNext = () => {
    if (isNextButtonEnabled) {
      alert('Passage à l\'étape suivante du formulaire');
      // Ici, vous ajouteriez la logique pour passer à l'étape suivante
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Demande en ligne - Adresse de la demande</h1>
      
      <div className="bg-white p-5 rounded border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Type de demande</h2>
        
        {/* Sélection de la catégorie */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Sélectionnez...</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Message d'avertissement pour demande discrétionnaire */}
        {showDiscretionaryWarning && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-yellow-700">
              Selon l'indication à la rangée « P.I.I.A. » dans la grille de zonage associée à l'adresse des travaux, 
              une demande discrétionnaire est requise avant de pouvoir déposer une demande de permis de construction.
            </p>
          </div>
        )}
        
        {/* Sélection de la nature de la demande */}
        <div className="mb-6">
          <label htmlFor="nature" className="block text-gray-700 font-medium mb-2">
            Nature de la demande <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="nature"
              value={nature}
              onChange={handleNatureChange}
              disabled={!category}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Sélectionnez...</option>
              {natureOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {category && natureOptions.length > 0 && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Informations supplémentaires */}
        <div className="text-gray-500 text-sm italic flex items-center mt-8">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
          </svg>
          Le texte de cette page ne remplace pas celui du ou des règlements en vigueur.
        </div>
      </div>
      
      {/* Bouton Suivant */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isNextButtonEnabled}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            isNextButtonEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default PermitForm;