PRD — Delva ROI Estimator (Lead Magnet LinkedIn)

0) Résumé

Un mini-produit web qui permet à un PM / Head of Product de produire en < 3 minutes un business case sponsor-ready (Profit, Payback, ROI/NPV optionnel) à partir de métriques produit, avec :
	•	un P&L bridge explicite (métrique produit → driver → ligne P&L),
	•	des templates par business model (SaaS, e-commerce, B2B sales-led, Cost reduction),
	•	des scénarios + un confidence score + des risques,
	•	un rapport partageable (lien + export).

Positionnement : “Stop shipping guesses → start landing profit”.

⸻

1) Contexte & problème

Dans la majorité des organisations, les décisions roadmap sont encore défendues par :
	•	des arguments qualitatifs,
	•	des frameworks de priorisation sans traduction finance,
	•	des business cases longs, incomplets, non comparables, et rarement “finance-friendly”.

Problème à résoudre :
	•	Les équipes produit savent estimer des métriques produit (conversion, churn, adoption, temps de traitement, etc.) mais peinent à les relier de façon simple et crédible au P&L.
	•	Les sponsors (DAF/BU/Direction) veulent des chiffres comparables : profit incrémental, payback, risques, coûts run.

⸻

2) Objectifs

Objectifs utilisateur
	1.	Quantifier l’impact business d’un projet en partant de métriques produit.
	2.	Obtenir une sortie lisible par un sponsor (P&L + payback + risques).
	3.	Avoir un format partageable et réutilisable pour plusieurs initiatives (portfolio).

Objectifs business (Delva)
	1.	Générer des leads qualifiés (Head/Lead PM, CPO, BU owners) via LinkedIn.
	2.	Capturer des signaux de qualification (type de projet, maturité, tailles, hypothèses).
	3.	Créer un pont naturel vers une offre : “audit flash business case / arbitrage roadmap”.

⸻

3) Non-objectifs (MVP)
	•	Remplacer un modèle finance complet (taxes, amortissements, compta analytique avancée).
	•	Offrir un workspace collaboratif complet.
	•	Fournir des benchmarks sectoriels “officiels”.
	•	Faire de la prévision/IA automatique (on part d’hypothèses humaines).

⸻

4) Personas
	1.	Head of / Lead PM (cible principale)
Besoin : arbitrer, défendre budget, prioriser avec crédibilité.
	2.	PM senior
Besoin : cadrer et convaincre (sponsor + alignement interne).
	3.	CPO / Directeur BU (secondaire)
Besoin : un “one-pager” rapide, comparable et actionnable.

⸻

5) JTBD
	•	“Quand je propose une initiative produit, je veux convertir des métriques produit en impact P&L (avec scénarios et risques) afin de prioriser et de sécuriser l’adhésion du sponsor.”

⸻

6) Principes produit
	1.	2 minutes → un chiffre : friction minimale, inputs limités.
	2.	Finance-friendly : marge, run cost, payback; pas seulement “ROI %”.
	3.	Explicable : P&L bridge visible, pas une boîte noire.
	4.	Scénarios + confiance : l’incertitude est gérée, pas cachée.
	5.	Template-driven : configurable sans re-développer (via templates).

⸻

7) Parcours utilisateur (UX)

Flow principal (MVP)
	1.	Créer une initiative
	•	Nom du projet (optionnel)
	•	Type d’outcome (4 drivers) : Productivity / Attention / Transactions / Satisfaction
	2.	Choisir un template business model
	•	SaaS
	•	E-commerce
	•	B2B sales-led
	•	Cost reduction / automation
	3.	Saisir 6–10 inputs
	•	Baseline (métrique actuelle)
	•	Reach / volume
	•	Uplift attendu
	•	Valeur unitaire (ARPA/AOV/ACV ou coût unitaire)
	•	Marge / contribution
	•	Coût delivery (People/Time/Money)
	•	Coût run (licences/infra/support)
	•	Adoption / ramp-up (simple)
	4.	Risques + confiance
	•	Sliders : Market risk / Technical risk / Time-to-market risk
	•	Confidence inputs (qualité data : mesurée vs estimée)
	5.	Résultats
	•	Profit incrémental (annuel) + contribution
	•	ROI (12/24/36 mois), payback (mois)
	•	Scénarios (Conservative/Base/Aggressive)
	•	Graph “cumulative cashflow”
	•	Carte “Return vs Investment” (si mode portfolio)
	6.	Partage
	•	Copier le résumé “sponsor-ready”
	•	Générer un lien de rapport
	•	Export PDF (V1) / Export texte (MVP)

Flow portfolio (MVP+)
	•	Ajouter plusieurs initiatives → vue portfolio :
	•	tableau comparatif (Profit, Payback, Confidence)
	•	matrice Return vs Investment
	•	tri par “value now” (option CoD)

⸻

8) Fonctionnalités (requirements)

Must-have (MVP)
	•	Library de 4 templates (SaaS / Ecom / B2B sales / Cost reduction)
	•	Formulaire 1 page (progress + exemples)
	•	3 scénarios auto (C/Base/A)
	•	Confidence score (simple)
	•	Risk sliders (simple)
	•	Résumé copiable + lien partageable (rapport)
	•	Télémetrie (complétion, temps, template usage)

Should-have (V1)
	•	Export PDF propre (“one-pager”)
	•	Sensitivity hints : “Top 3 inputs qui pilotent le résultat”
	•	Template builder interne (admin) pour créer de nouveaux templates
	•	Mode “budget cap” + recommandations (re-scope / split / stop)
	•	Tracking plan post-launch généré (mesures à suivre)

Could-have (V2)
	•	NPV (discount rate configurable)
	•	Collaboration / workspace / historique
	•	Benchmarks sectoriels (si données internes)
	•	“GTM cost” plus détaillé + enablement B2B
	•	API / intégration Jira/Linear (auto effort/time)

⸻

9) Modèle de calcul (Core Engine)

P&L bridge universel

Profit incrémental (sur période T) =
	•	(ΔRevenus × marge brute)

	•	ΔOPEX évités (productivité / automation)
	•	ΔPertes évitées (risques : churn, fraude, pénalités)
− (Coût delivery + Coût run sur T)

Scénarios
	•	Base = uplift saisi
	•	Conservative = uplift × (0.5–0.7) + ramp-up plus lent + risques plus pénalisants
	•	Aggressive = uplift × (1.2–1.5) + ramp-up plus rapide + risques moins pénalisants

Adoption / ramp-up (simplifié MVP)
	•	Choix : “Instant / 3 mois / 6 mois / 12 mois”
→ applique un coefficient progressif sur ΔRevenus/ΔOPEX.

Confidence score (0–100)

Score simple pondéré :
	•	Qualité data : mesurée / partiellement / estimée
	•	Dépendances : aucune / 1–2 / 3+
	•	Nature uplift : A/B historique / analogie / intuition
Le score influence :
	•	l’intervalle Conservative/Aggressive,
	•	un badge “High/Medium/Low confidence” dans le rapport.

Risques (sliders)
	•	Market risk, Technical risk, Time-to-market
→ pénalisent les scénarios via un facteur (ex : probabilité d’atteindre l’uplift).

Outputs
	•	Profit incrémental annuel + sur T
	•	Contribution margin incrémentale
	•	ROI 12/24/36
	•	Payback
	•	Graph cashflow cumulatif
	•	Insights texte auto : “3 leviers”, “hypothèses critiques”, “risques dominants”

⸻

10) Templates MVP — inputs attendus (spéc “champ”)

Template 1 — SaaS (MRR/ARR)

Inputs (exemple) :
	•	Base clients payants / MRR actuel
	•	Churn mensuel (%) ou Net retention
	•	ΔChurn ou ΔNRR attendu
	•	ARPA / MRR moyen
	•	Marge brute (%)
	•	Ramp-up (3/6/12 mois)
	•	Delivery cost (FTE × mois × coût)
	•	Run cost (€/mois)

Template 2 — E-commerce
	•	Trafic/mois
	•	Taux de conversion (%)
	•	ΔConversion attendu (pp)
	•	AOV
	•	Marge brute (%)
	•	Ramp-up
	•	Delivery cost
	•	Run cost

Template 3 — B2B sales-led (pipeline)
	•	Leads/mois (ou SQL/mois)
	•	SQL rate / Win rate
	•	ΔSQL rate ou ΔWin rate
	•	ACV
	•	Marge brute (%)
	•	Cycle time (option)
	•	Ramp-up
	•	Delivery cost
	•	Run cost (+ enablement option V1)

Template 4 — Cost reduction / automation
	•	Volume (tickets, ops, tâches)
	•	Temps moyen (AHT) / coût unitaire actuel
	•	ΔTemps ou % deflection
	•	Coût horaire chargé
	•	Qualité / recontact (option)
	•	Ramp-up
	•	Delivery cost
	•	Run cost

⸻

11) Données & configuration (Template-driven)

Format de template (exigence)

Un template est un objet config (JSON) contenant :
	•	inputs[] : id, label, unité, default, bornes, aide
	•	assumptions_defaults : marge, coût chargé, horizon
	•	formulas : mapping des inputs → ΔRevenue / ΔCost / ΔRisk
	•	scenario_rules : multipliers conservative/aggressive
	•	output_layout : blocs à afficher

Objectif : ajouter/éditer un template sans toucher au moteur.

⸻

12) Analytics (mesure produit)

Funnel
	•	View landing → Start
	•	Start → Completed
	•	Completed → Share link
	•	Completed → Export (si gating)
	•	Completed → “Demander un audit”

Events clés
	•	Template choisi
	•	Temps de complétion
	•	Champs modifiés (drop-offs)
	•	Valeurs agrégées (anonymisées) : taille projet, payback, confidence

⸻

13) Architecture (haut niveau)
	•	Front : web app (Next.js par ex)
	•	Core Engine : module de calcul (typescript) + tests unitaires
	•	Templates : stockés en DB ou fichiers versionnés
	•	Rapports : page statique partageable (ID unique)
	•	Exports : génération PDF (V1)
	•	Tracking : analytics + consent

Partage & privacy
	•	Par défaut : lien partageable non indexé.
	•	Données sensibles : option “anonymiser” (pas de nom de projet).
	•	RGPD : consentement, suppression sur demande, rétention limitée.

⸻

14) Go-to-market (LinkedIn Lead Magnet)
	•	Post “tool drop” + démo vidéo (30–45 sec)
	•	CTA : “Obtiens ton payback en 2 minutes”
	•	Variante : “Stop building ROI-less features”
	•	Upsell soft : “Si payback < X / confidence low → audit flash 45 min”

⸻

15) Milestones

MVP (focus conversion)
	•	4 templates + moteur + scénarios + confidence + share link + résumé copiable

V1 (focus sponsor-ready)
	•	Export PDF + sensitivity + budget cap + tracking plan

⸻

16) Questions ouvertes à trancher (sans bloquer)
	1.	Output principal : Profit incrémental vs Contribution margin (je recommande contribution par défaut, profit en toggle).
	2.	Gating email :
	•	Option A : résultat sans email, export/lien via email
	•	Option B : tout sans email (max viral, moins de leads)
	3.	Niveau de NPV : MVP ou V1 (je recommande V1).
