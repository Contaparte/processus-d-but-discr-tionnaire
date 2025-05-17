import React, { useState, useEffect } from 'react';

const PermitForm = () => {
  // États pour les sélections de l'utilisateur
  const [category, setCategory] = useState('');
  const [nature, setNature] = useState('');
  const [showDiscretionaryWarning, setShowDiscretionaryWarning] = useState(false);
  const [needsDiscretionaryRequest, setNeedsDiscretionaryRequest] = useState(false);
  const [natureOptions, setNatureOptions] = useState([]);
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  const [redirectToDiscretionary, setRedirectToDiscretionary] = useState(false);

  // Données simulées pour la grille de zonage (basées sur l'adresse des travaux)
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
      { value: 'evenement-special', label: "Évènement spécial" },
      { value: 'installation-cirque', label: "Installation d'un cirque" },
      { value: 'tenue-foire', label: "Tenue d'une foire" },
      { value: 'parc-amusement', label: "Un parc d'amusement" },
      { value: 'vente-arbre-noel', label: "Vente d'arbres de Noël" },
      { value: 'vente-horticulture', label: "Vente d'articles saisonniers d'horticulture" },
      { value: 'vente-trottoir', label: "Vente sous la tente et/ou vente trottoir" },
    ],
    'construction-agricole': [
      { value: 'agrandissement-agricole', label: "Agrandissement d'un bâtiment agricole" },
      { value: 'demolition-principal-comite', label: "Démolition d'un bâtiment principal avec autorisation du comité de démolition" },
      { value: 'demolition-principal-non-assujetie', label: "Démolition d'un bâtiment principal non assujetti au comité de démolition" },
      { value: 'installation-cloture', label: "Installation d'une clôture" },
      { value: 'nouvelle-construction-agricole', label: "Nouvelle construction d'un bâtiment agricole" },
      { value: 'ouvrage-rive', label: "Ouvrage dans la rive, le littoral ou la plaine inondable" },
      { value: 'transformation-renovation', label: "Transformation ou rénovation d'un bâtiment agricole" },
      { value: 'travaux-branchement', label: "Travaux de branchement privé au réseau d'aqueduc et/ou d'égout municipal" },
      { value: 'travaux-remblai', label: "Travaux de remblai ou déblai" },
      { value: 'trottoir-bordure', label: "Trottoir ou bordure de rue, demande de modification" },
    ],
    'construction-residentielle': [
      { value: 'agrandissement-batiment', label: "Agrandissement d'un bâtiment principal" },
      { value: 'ajout-portes-fenetres', label: "Ajout, modification ou retrait de porte(s) et/ou fenêtre(s)" },
      { value: 'amenagement-stationnement', label: "Aménagement, réaménagement ou agrandissement d'une aire de stationnement" },
      { value: 'construction-abri-auto', label: "Construction d'un abri d'auto permanent" },
      { value: 'construction-garage', label: "Construction d'un garage isolé" },
      { value: 'construction-vestibule', label: "Construction d'un vestibule ou d'un escalier encloisonné, salle de boue" },
      { value: 'construction-veranda', label: "Construction d'une véranda ou installation d'un solarium" },
      { value: 'construction-balcon-06', label: "Construction ou modification d'un balcon, galerie, perron et autre plate-forme situés à 0,6 mètre et moins du sol" },
      { value: 'construction-balcon-15', label: "Construction ou modification d'un balcon, galerie, perron et autre plate-forme situés à plus de 1,5 mètre du sol" },
      { value: 'construction-balcon-06-15', label: "Construction ou modification d'un balcon, galerie, perron et autre plate-forme situés entre 0,6 et 1,5 mètre du sol" },
      { value: 'construction-piscine-creusee', label: "Construction, installation ou remplacement d'une piscine creusée incluant les travaux d'excavation" },
      { value: 'construction-piscine-hors-terre', label: "Construction, installation ou remplacement d'une piscine hors terre ou démontable incluant les travaux d'excavation" },
      { value: 'demolition-reservoir', label: "Démolir tout ou partie d'un réservoir ou d'une piscine creusée" },
      { value: 'demolition-accessoire-comite', label: "Démolition d'un bâtiment accessoire avec autorisation du comité de démolition" },
      { value: 'demolition-accessoire-non-assujetie', label: "Démolition d'un bâtiment accessoire non assujetti au comité de démolition" },
      { value: 'demolition-principal-comite', label: "Démolition d'un bâtiment principal avec autorisation du comité de démolition" },
      { value: 'demolition-principal-non-assujetie', label: "Démolition d'un bâtiment principal non assujetti au comité de démolition" },
      { value: 'deplacement-batiment', label: "Déplacement d'un bâtiment sur un autre propriété" },
      { value: 'drain-francais', label: "Drain Français" },
      { value: 'installation-conteneur', label: "Installation d'un conteneur à matières résiduelles au sol" },
      { value: 'installation-poulailler', label: "Installation d'un poulailler urbain" },
      { value: 'installation-reservoir', label: "Installation d'un réservoir de gaz propane ou autres combustibles" },
    ],
    'construction-commerciale': [
      { value: 'addition-equipement', label: "Addition d'un équipement ou d'une construction accessoire commerciale" },
      { value: 'agrandissement-batiment', label: "Agrandissement d'un bâtiment principal" },
      { value: 'amenagement-stationnement', label: "Aménagement ou réaménagement d'une aire de stationnement" },
      { value: 'construction-piscine', label: "Construction, installation ou remplacement d'une piscine creusée incluant les travaux d'excavation" },
      { value: 'demolition-accessoire-comite', label: "Démolition d'un bâtiment accessoire avec autorisation du comité de démolition" },
      { value: 'demolition-accessoire-non-assujetie', label: "Démolition d'un bâtiment accessoire non assujetti au comité de démolition" },
      { value: 'demolition-principal-comite', label: "Démolition d'un bâtiment principal avec autorisation du comité de démolition" },
      { value: 'demolition-principal-non-assujetie', label: "Démolition d'un bâtiment principal non assujetti au comité de démolition" },
      { value: 'enseigne-petite', label: "Enseigne de moins de 2,5m² (installation, modification, agrandissement, enlèvement, réinstallation)" },
      { value: 'enseigne-grande', label: "Enseigne de plus de 2,5m² (installation, modification, agrandissement, enlèvement, réinstallation)" },
      { value: 'installation-conteneur', label: "Installation d'un contenant de récupération de textiles" },
      { value: 'installation-cloture', label: "Installation d'une clôture" },
      { value: 'installation-terrasse-saisonniere', label: "Installation d'une terrasse saisonnière ou permanente" },
      { value: 'installation-terrasse-temporaire', label: "Installation d'une terrasse temporaire dans l'emprise" },
      { value: 'installation-septique', label: "Installation septique" },
      { value: 'nouvelle-construction', label: "Nouvelle construction d'un bâtiment principal" },
      { value: 'nouvelle-construction-mixte', label: "Nouvelle construction d'un bâtiment principal à usage mixte" },
      { value: 'ouvrage-rive', label: "Ouvrage dans la rive, le littoral ou la plaine inondable" },
      { value: 'transformation-renovation', label: "Transformation ou rénovation d'un bâtiment principal" },
      { value: 'travaux-branchement', label: "Travaux de branchement privé au réseau d'aqueduc et/ou d'égout municipal" },
      { value: 'travaux-remblai', label: "Travaux de remblai ou déblai" },
      { value: 'trottoir-bordure', label: "Trottoir ou bordure de rue, demande de modification" },
    ],
    'construction-industrielle': [
      { value: 'addition-equipement', label: "Addition d'un équipement accessoire tel que dépoussiéreur, compacteur, pont-roullant, etc." },
      { value: 'agrandissement-batiment', label: "Agrandissement d'un bâtiment principal" },
      { value: 'amenagement-espace', label: "Aménagement d'un espace de chargement ou de déchargement" },
      { value: 'amenagement-stationnement', label: "Aménagement, réaménagement ou agrandissement d'une aire de stationnement" },
      { value: 'demolition-accessoire-comite', label: "Démolition d'un bâtiment accessoire avec autorisation du comité de démolition" },
      { value: 'demolition-accessoire-non-assujetie', label: "Démolition d'un bâtiment accessoire non assujetti au comité de démolition" },
      { value: 'demolition-principal-comite', label: "Démolition d'un bâtiment principal avec autorisation du comité de démolition" },
      { value: 'demolition-principal-non-assujetie', label: "Démolition d'un bâtiment principal non assujetti au comité de démolition" },
      { value: 'enseigne-petite', label: "Enseigne de moins de 2,5m² (installation, modification, agrandissement, enlèvement, réinstallation)" },
      { value: 'enseigne-grande', label: "Enseigne de plus de 2,5m² (installation, modification, agrandissement, enlèvement, réinstallation)" },
      { value: 'installation-conteneur', label: "Installation d'un contenant de récupération de textiles" },
      { value: 'installation-cloture', label: "Installation d'une clôture" },
      { value: 'nouvelle-construction', label: "Nouvelle construction d'un bâtiment principal" },
      { value: 'ouvrage-rive', label: "Ouvrage dans la rive, le littoral ou la plaine inondable" },
      { value: 'transformation-renovation', label: "Transformation ou rénovation d'un bâtiment principal" },
      { value: 'travaux-branchement', label: "Travaux de branchement privé au réseau d'aqueduc et/ou d'égout municipal" },
      { value: 'travaux-remblai', label: "Travaux de remblai ou déblai" },
      { value: 'trottoir-bordure', label: "Trottoir ou bordure de rue, demande de modification" },
    ],
    'construction-institutionnelle': [
      { value: 'addition-equipement', label: "Addition d'un équipement accessoire tel que composteur, compacteur, aire de jeux, etc." },
      { value: 'agrandissement-batiment', label: "Agrandissement d'un bâtiment principal" },
      { value: 'amenagement-espace', label: "Aménagement d'un espace de chargement ou de déchargement" },
      { value: 'amenagement-stationnement', label: "Aménagement, réaménagement ou agrandissement d'une aire de stationnement" },
      { value: 'demolition-accessoire-comite', label: "Démolition d'un bâtiment accessoire avec autorisation du comité de démolition" },
      { value: 'demolition-accessoire-non-assujetie', label: "Démolition d'un bâtiment accessoire non assujetti au comité de démolition" },
      { value: 'demolition-principal-comite', label: "Démolition d'un bâtiment principal avec autorisation du comité de démolition" },
      { value: 'demolition-principal-non-assujetie', label: "Démolition d'un bâtiment principal non assujetti au comité de démolition" },
      { value: 'enseigne-petite', label: "Enseigne de moins de 2,5m² (installation, modification, agrandissement, enlèvement, réinstallation)" },
      { value: 'enseigne-grande', label: "Enseigne de plus de 2,5m² (installation, modification, agrandissement, enlèvement, réinstallation)" },
      { value: 'installation-conteneur', label: "Installation d'un contenant de récupération de textiles" },
      { value: 'installation-cloture', label: "Installation d'une clôture" },
      { value: 'nouvelle-construction', label: "Nouvelle construction d'un bâtiment principal" },
      { value: 'ouvrage-rive', label: "Ouvrage dans la rive, le littoral ou la plaine inondable" },
      { value: 'transformation-renovation', label: "Transformation ou rénovation d'un bâtiment principal" },
      { value: 'travaux-branchement', label: "Travaux de branchement privé au réseau d'aqueduc et/ou d'égout municipal" },
      { value: 'travaux-remblai', label: "Travaux de remblai ou déblai" },
      { value: 'trottoir-bordure', label: "Trottoir ou bordure de rue, demande de modification" },
    ],
    'construction-subvention': [
      { value: 'demolition-principal-comite', label: "Démolition d'un bâtiment principal avec autorisation du comité de démolition" },
      { value: 'demolition-principal-non-assujetie', label: "Démolition d'un bâtiment principal non assujetti au comité de démolition" },
      { value: 'nouvelle-construction-acceslogis', label: "Nouvelle construction résidentielle avec programme AccèsLogis" },
      { value: 'renovation-acceslogis', label: "Rénovation avec programme AccèsLogis" },
      { value: 'renovation-adaptation', label: "Rénovation avec programme d'adaptation de domicile" },
      { value: 'renovation-petits-etablissements', label: "Rénovation avec programme petits établissements admissibles" },
      { value: 'renovation-quebec', label: "Rénovation avec programme Rénovation Québec" },
    ],
    'demande-analyse': [
      { value: 'analyse-generale', label: "Analyse générale" },
      { value: 'analyse-ppcmoi', label: "Analyse particulier de construction, de modification ou d'occupation d'un immeuble (PPCMOI)" },
      { value: 'analyse-usage-conditionnel', label: "Analyse pour approbation d'un usage conditionnel" },
      { value: 'analyse-derogation', label: "Analyse pour dérogation mineure" },
      { value: 'analyse-derogation-programme', label: "Analyse pour dérogation mineure avec programme S.H.Q., P.A.D. ou accès Logis" },
      { value: 'analyse-modification-plan', label: "Analyse pour modification au plan d'urbanisme" },
      { value: 'analyse-zonage', label: "Analyse pour modification aux règlements de zonage" },
      { value: 'analyse-zonage-programme', label: "Analyse pour modification aux règlements de zonage avec programme S.H.Q., P.A.D. ou accès Logis" },
      { value: 'analyse-ppcmoi-programme', label: "Analyse pour PPCMOI avec programme S.H.Q., P.A.D. ou accès Logis" },
    ],
    'demande-discretionnaire': [
      { value: 'approbation-usage', label: "Approbation d'un usage conditionnel" },
      { value: 'autorisation-demolition-accessoire', label: "Autorisation de démolition d'un bâtiment accessoire pour un immeuble patrimonial" },
      { value: 'autorisation-demolition-accessoire-programme', label: "Autorisation de démolition d'un bâtiment accessoire pour un immeuble patrimonial avec programme S.H.Q., P.A.D. ou accès Logis" },
      { value: 'autorisation-demolition-1940', label: "Autorisation de démolition d'un immeuble construit avant 1940" },
      { value: 'autorisation-demolition-1940-programme', label: "Autorisation de démolition d'un immeuble construit avant 1940 avec programme S.H.Q., P.A.D. ou accès Logis" },
      { value: 'autorisation-demolition-1-3-log', label: "Autorisation de démolition d'un immeuble de 1 à 3 log. dans un quartier identifié" },
      { value: 'autorisation-demolition-1-3-log-programme', label: "Autorisation de démolition d'un immeuble de 1 à 3 log. dans un quartier identifié avec programme S.H.Q,., P.A.D. ou accès Logis" },
      { value: 'autorisation-demolition-patrimonial', label: "Autorisation de démolition d'un immeuble patrimonial ou à valeur patrimoniale potentielle" },
      { value: 'autorisation-demolition-patrimonial-programme', label: "Autorisation de démolition d'un immeuble patrimonial ou à valeur patrimoniale potentielle avec programme S.H.Q., P.A.D. ou accès Logis" },
      { value: 'derogation-mineure', label: "Dérogation mineure" },
      { value: 'derogation-mineure-programme', label: "Dérogation mineure avec programme S.H.Q., P.A.D. ou accès Logis" },
      { value: 'derogation-mineure-residence', label: "Dérogation mineure sur un bâtiment résidentiel unifamiliale, bifamiliale ou trifamiliale (travaux déjà exécutés)" },
      { value: 'modification-zonage', label: "Modification aux règlements de zonage" },
      { value: 'modification-zonage-programme', label: "Modification aux règlements de zonage avec programme S.H.Q., P.A.D. ou accès Logis" },
      { value: 'piia-affichage', label: "P.I.I.A. Affichage" },
      { value: 'piia-aire-contraintes', label: "P.I.I.A. Aire extérieure-zone de contraintes sonore" },
      { value: 'piia-programme', label: "P.I.I.A. avec programme de subvention S.H.Q., P.A.D. ou accès Logis" },
      { value: 'piia-construction-mixte', label: "P.I.I.A. Construction et agrandissement d'un bâtiment mixte" },
      { value: 'piia-chargement', label: "P.I.I.A. D'une aire de chargement et déchargement" },
      { value: 'piia-non-residentiel-construction', label: "P.I.I.A. Non résidentiel - Construction et agrandissement" },
      { value: 'piia-non-residentiel-modification', label: "P.I.I.A. Non résidentiel - Modification ou transformation" },
      { value: 'piia-non-residentiel-arbre', label: "P.I.I.A. Non-résidentiel - Abattage d'arbre(s)" },
      { value: 'piia-residentiel-construction', label: "P.I.I.A. Résidentiel - Construction et agrandissement" },
      { value: 'piia-residentiel-cadastre', label: "P.I.I.A. Résidentiel - Opération Cadastrale" },
      { value: 'piia-residentiel-arbre', label: "P.I.I.A. Résidentiel- Abattage d'arbre(s)" },
      { value: 'piia-residentiel-modification', label: "P.I.I.A. Résidentiel -Modification ou transformation" },
      { value: 'piia-non-residentiel-stationnement', label: "PIIA Non-résidentiel - Aménagement agrandissement d'un stationnement" },
      { value: 'piia-residentiel-stationnement', label: "PIIA Résidentiel - Aménagement agrandissement d'un stationnement" },
      { value: 'ppcmoi', label: "Projet particulier de construction, de modification ou d'occupation d'un immeuble (PPCMOI)" },
      { value: 'ppcmoi-programme', label: "Projet particulier de construction, de modification ou d'occupation d'un immeuble avec programme S.H.Q., P.A.D. ou accès Logis" },
      { value: 'revision-decision', label: "Révision d'une décision du comité de démolition" },
      { value: 'sites-patrimoniaux', label: "Sites patrimoniaux" },
    ],
    'demande-subvention': [
      { value: 'pea', label: "PEA-Petits établissements accessibles" },
      { value: 'programme-aide', label: "Programme d'aide complémentaire AccèsLogis" },
    ],
    'eau-potable': [
      { value: 'arrosage-pelouse', label: "Permis arrosage nouvelle pelouse" },
      { value: 'borne-fontaine', label: "Utilisation d'une borne fontaine (adresse à proximité)" },
    ],
    'occupation-temporaire': [
      { value: 'emprise-rue', label: "De l'emprise de rue" },
      { value: 'fermeture-50', label: "Fermeture de rue de 50 Km/h et plus" },
      { value: 'fermeture-moins-50', label: "Fermeture de rue de moins de 50 Km/h" },
      { value: 'occupation-3m', label: "Occupation de plus de 3 mètres dans la rue" },
      { value: 'parc-espace', label: "Parc et espace vert" },
      { value: 'piste-cyclable', label: "Piste cyclable hors-rue et sentier polyvalent" },
      { value: 'prolongation', label: "Prolongation de l'autorisation d'occupation" },
      { value: 'rue-50-3m', label: "Rue de 50 Km/h et plus, occupation de 3 mètres et moins" },
      { value: 'rue-50-3m-trottoir', label: "Rue de 50 Km/h et plus, occupation de 3 mètres et moins incluant trottoir" },
      { value: 'rue-moins-50-3m', label: "Rue de moins de 50 Km/h, occupation de 3 mètres et moins" },
      { value: 'rue-moins-50-3m-trottoir', label: "Rue de moins de 50 Km/h, occupation de 3 mètres et moins incluant trottoir" },
      { value: 'trottoir-public', label: "Trottoir public" },
    ],
    'permis-lotissement': [
      { value: 'lotissement', label: "Permis de lotissement" },
      { value: 'lotissement-programme', label: "Permis de lotissement avec programme" },
    ],
    'permis-vendeur': [
      { value: 'vendeur-osbl-greenfield', label: "Vendeur itinérant - OSBL- / Utiliser - 001 dans le champ \"numéro de lot\" pour arr. Greenfield Park" },
      { value: 'vendeur-osbl-hubert', label: "Vendeur itinérant - OSBL- / Utiliser - 002 dans le champ \"numéro de lot\" pour arr. St-Hubert" },
      { value: 'vendeur-osbl-longueuil', label: "Vendeur itinérant - OSBL- / Utiliser - 003 dans le champ \"numéro de lot\" pour arr. Longueuil" },
      { value: 'vendeur-greenfield', label: "Vendeur itinérant / Utiliser - 001 dans le champ \"numéro de lot\" pour arr. Greenfield Park" },
      { value: 'vendeur-hubert', label: "Vendeur itinérant / Utiliser - 002 dans le champ \"numéro de lot\" pour arr. St-Hubert" },
      { value: 'vendeur-longueuil', label: "Vendeur itinérant / Utiliser - 003 dans le champ \"numéro de lot\" pour arr. Longueuil" },
    ],
    'intervention-rtu': [
      { value: 'consentement-hydro', label: "1.1 RTU - Demande de consentement municipal - Hydro-Québec" },
      { value: 'consentement-energir', label: "1.2 RTU - Demande de consentement municipal - Energir" },
      { value: 'consentement-bell', label: "1.3 RTU - Demande de consentement municipal - Bell" },
      { value: 'consentement-videotron', label: "1.4 RTU - Demande de consentement municipal - Vidéotron" },
      { value: 'consentement-rogers', label: "1.5 RTU - Demande de consentement municipal - Rogers" },
      { value: 'consentement-telus', label: "1.6 RTU - Demande de consentement municipal - Telus" },
      { value: 'consentement-autre', label: "1.7 RTU - Demande de consentement municipal - Autre" },
      { value: 'avis-hydro-avec', label: "2.1 RTU - Avis d'intervention - Hydro-Québec avec consentement" },
      { value: 'avis-hydro-sans', label: "2.1 RTU - Avis d'intervention - Hydro-Québec sans consentement" },
      { value: 'avis-energir-avec', label: "2.2 RTU - Avis d'intervention - Energir avec consentement" },
      { value: 'avis-energir-sans', label: "2.2 RTU - Avis d'intervention - Energir sans consentement" },
      { value: 'avis-bell-avec', label: "2.3 RTU - Avis d'intervention - Bell avec consentement" },
      { value: 'avis-bell-sans', label: "2.3 RTU - Avis d'intervention - Bell sans consentement" },
      { value: 'avis-videotron-avec', label: "2.4 RTU - Avis d'intervention - Vidéotron avec consentement" },
      { value: 'avis-videotron-sans', label: "2.4 RTU - Avis d'intervention - Vidéotron sans consentement" },
      { value: 'avis-rogers-avec', label: "2.5 RTU - Avis d'intervention - Rogers avec consentement" },
      { value: 'avis-rogers-sans', label: "2.5 RTU - Avis d'intervention - Rogers sans consentement" },
      { value: 'avis-telus-avec', label: "2.6 RTU - Avis d'intervention - Telus avec consentement" },
      { value: 'avis-telus-sans', label: "2.6 RTU - Avis d'intervention - Telus sans consentement" },
      { value: 'avis-autre-avec', label: "2.7 RTU - Avis d'intervention - Autre avec consentement" },
      { value: 'avis-autre-sans', label: "2.7 RTU - Avis d'intervention - Autre sans consentement" },
    ],
  };

  // Vérifie si la catégorie est liée à la construction
  const isConstructionCategory = (cat) => {
    const constructionCategories = [
      'construction-agricole',
      'construction-subvention',
      'construction-commerciale',
      'construction-industrielle',
      'construction-institutionnelle',
      'construction-residentielle'
    ];
    
    return constructionCategories.includes(cat);
  };
  
  // Fonction de débogage pour afficher les options disponibles
  const debugCategoryOptions = (cat) => {
    console.log(`Catégorie sélectionnée: ${cat}`);
    console.log(`Options disponibles:`, natureOptionsMap[cat] || []);
  };

  // Convertir les noms de catégories et de natures pour l'affichage dans la console
  const getDebugNames = () => {
    console.log("Catégories:");
    categories.forEach(cat => {
      console.log(`${cat.value}: ${cat.label}`);
    });
    
    console.log("Options de nature par catégorie:");
    Object.keys(natureOptionsMap).forEach(catKey => {
      console.log(`${catKey}:`);
      natureOptionsMap[catKey].forEach(opt => {
        console.log(`  ${opt.value}: ${opt.label}`);
      });
    });
  };
  
  // Appeler cette fonction une fois au début pour vérifier les correspondances
  useEffect(() => {
    getDebugNames();
  }, []);

  // Mise à jour des options de nature quand la catégorie change
  useEffect(() => {
    if (category) {
      console.log(`Mise à jour pour la catégorie: ${category}`);
      
      // Vérifier si des options existent pour cette catégorie
      const options = natureOptionsMap[category] || [];
      console.log(`Nombre d'options trouvées: ${options.length}`);
      
      setNatureOptions(options);
      setNature(''); // Réinitialiser la nature lorsque la catégorie change
      
      // Vérifier si nous devons afficher un avertissement pour une demande discrétionnaire
      const requiresDiscretionary = isConstructionCategory(category) && mockZoningGrid.hasPIIA;
      setShowDiscretionaryWarning(requiresDiscretionary);
      setNeedsDiscretionaryRequest(requiresDiscretionary);
      
      // Si l'utilisateur sélectionne la catégorie demande discrétionnaire, 
      // on désactive le blocage de demande discrétionnaire
      if (category === 'demande-discretionnaire') {
        setNeedsDiscretionaryRequest(false);
        setShowDiscretionaryWarning(false);
      }
    }
  }, [category]);

  // Activer/désactiver le bouton Suivant en fonction de la sélection de la nature
  // et de la nécessité d'une demande discrétionnaire
  useEffect(() => {
    setIsNextButtonEnabled(!!nature && !needsDiscretionaryRequest);
  }, [nature, needsDiscretionaryRequest]);

  // Gestionnaire de changement de catégorie
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    
    // Déboguer pour voir les options disponibles
    debugCategoryOptions(newCategory);
    
    // Si l'utilisateur essaie de sélectionner une catégorie de construction alors qu'une demande
    // discrétionnaire est nécessaire et n'a pas encore été réalisée
    if (isConstructionCategory(newCategory) && mockZoningGrid.hasPIIA && !redirectToDiscretionary) {
      setCategory(newCategory);
    } else {
      setCategory(newCategory);
    }
  };

  // Gestionnaire de changement de nature
  const handleNatureChange = (e) => {
    setNature(e.target.value);
  };

  // Gestionnaire pour rediriger vers le formulaire de demande discrétionnaire
  const handleDiscretionaryRequest = () => {
    // En situation réelle, on redirigerait vers un autre formulaire
    // Pour cette simulation, on change juste la catégorie
    setCategory('demande-discretionnaire');
    setRedirectToDiscretionary(true);
    setNeedsDiscretionaryRequest(false);
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
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-yellow-700">
                  Selon l'indication à la rangée « P.I.I.A. » dans la grille de zonage associée à l'adresse des travaux, 
                  une demande discrétionnaire est requise avant de pouvoir déposer une demande de permis de construction.
                </p>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleDiscretionaryRequest}
                    className="text-sm px-3 py-1 font-medium bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Déposer une demande discrétionnaire
                  </button>
                </div>
              </div>
            </div>
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
            {category && natureOptions.length > 0 && nature && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
            )}
          </div>
          {/* Indicateur d'aide si aucune option n'est disponible */}
          {category && natureOptions.length === 0 && (
            <p className="mt-2 text-sm text-red-600">
              Aucune option disponible pour cette catégorie. Données attendues pour {category}.
            </p>
          )}
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
