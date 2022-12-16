/* Requête générale, permettant de rechercher par nom uniquement */

function rechercher(name) {
  rechercherNom(name);
  // rechercherDomaine(name);
}

function rechercherNom(name) {
  var debut_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
                              PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                              PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                              PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                              PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                              PREFIX dc: <http://purl.org/dc/elements/1.1/>
                              PREFIX : <http://dbpedia.org/resource/>
                              PREFIX dbpedia2: <http://dbpedia.org/property/>
                              PREFIX dbpedia: <http://dbpedia.org/>
                              PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                              \n
                              SELECT DISTINCT ?p ?resume ?birthday (GROUP_CONCAT(DISTINCT ?nomDiscipline; separator = ", ") AS ?disciplines) WHERE {
                                ?p a dbo:Species .

                                { ?p foaf:name ?name . }
                                  UNION
                                { ?p dbp:name ?name . }
                              
                                ?p dbo:abstract ?resume .
                                FILTER LANGMATCHES(lang(?resume), 'en') 
                              
                                { ?p dbo:academicDiscipline ?discipline .
                                  ?discipline rdfs:label ?nomDiscipline . 
                                  FILTER LANGMATCHES(lang(?nomDiscipline), 'en')
                                }

                                  UNION
                                   
                                { ?p gold:hypernym ?hypernym 
                                  FILTER(regex(?hypernym, dbr:Philosopher) || regex(?hypernym, dbr:Inventor))
                                }
                              
                                FILTER(regex(?name, "`
                                
  var contenu_requete = name;
  var fin_requete =             `", "i"))
                              }`;

  var requete = debut_requete + contenu_requete + fin_requete;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function () {
    $.ajax({
      //L'URL de la requête 
      url: url_base,

      //La méthode d'envoi (type de requête)
      method: "GET",

      //Le format de réponse attendu
      dataType: "json",
      data: { query: requete },
      beforeSend: afficherChargement($("#zone-resultats-recherche"), "Chargement")
    })

      /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done().
        On peut par exemple convertir cette réponse en chaine JSON et insérer
        cette chaine dans un div id="res"
      */
      .done(function (response) {
        // let data = (response);
        afficherResultats(response, "nom");
      })

      /* Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
        On peut afficher les informations relatives à la requête et à l'erreur 
      */
      .fail(function (error) {
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })

      // Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function () {
        //alert("Requête effectuée");
      });
  });
}

function rechercherTout(sujet, predicat, objet, callback) {
  var debut_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
                          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                          PREFIX dc: <http://purl.org/dc/elements/1.1/>
                          PREFIX : <http://dbpedia.org/resource/>
                          PREFIX dbpedia2: <http://dbpedia.org/property/>
                          PREFIX dbpedia: <http://dbpedia.org/>
                          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                          \n
                          SELECT * WHERE {
                          `;

  var sujet_requete = (sujet == null) ? "?s" : sujet;
  var predicat_requete = (predicat == null) ? "?p" : predicat;
  var objet_requete = (objet == null) ? "?o" : objet
  var fin_requete = ` 
                          }`;

  var requete = debut_requete + " " + sujet_requete + " " + predicat_requete + " " + objet_requete + fin_requete;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function () {
    $.ajax({
      //L'URL de la requête 
      url: url_base,

      //La méthode d'envoi (type de requête)
      method: "GET",

      //Le format de réponse attendu
      dataType: "json",
      data: { query: requete }
    })
      /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
        On peut par exemple convertir cette réponse en chaine JSON et insérer
        cette chaine dans un div id="res"
      */
      .done(function (response) {
        callback(response);
      })

      /* Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
        On peut afficher les informations relatives à la requête et à l'erreur
      */
      .fail(function (error) {
        resultats = null;
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })
      //Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function () {
        //alert("Requête effectuée");
      });
  });
}

function rechercherDomaine(domaine) {
  var debut_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
                          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                          PREFIX dc: <http://purl.org/dc/elements/1.1/>
                          PREFIX : <http://dbpedia.org/resource/>
                          PREFIX dbpedia2: <http://dbpedia.org/property/>
                          PREFIX dbpedia: <http://dbpedia.org/>
                          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                          \n

                          SELECT DISTINCT ?type ?name ?label WHERE {
                            ?n dbo:academicDiscipline ?type .
                            ?type rdfs:label ?label ;
                                  gold:hypernym ?hypernym .
                            
                            filter(regex(?label, "`
                            
  var contenu_requete = domaine;
                            
  var fin_requete = `", "i") && langMatches(lang(?label),"en"))
                      filter(!regex(?hypernym, dbr:System, "i") && !regex(?hypernym, dbr:Journal, "i") && !regex(?hypernym, dbr:Studies, "i")  && !regex(?hypernym, dbr:Name, "i"))
                    }`;

  var requete = debut_requete + contenu_requete + fin_requete;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";

  $(document).ready(function () {
    $.ajax({
      //L'URL de la requête 
      url: url_base,

      //La méthode d'envoi (type de requête)
      method: "GET",

      //Le format de réponse attendu
      dataType: "json",
      data: { query: requete }
    })
      // Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
      // On peut par exemple convertir cette réponse en chaine JSON et insérer
      // cette chaine dans un div id="res"
      .done(function (response) {
        console.log(response);
        afficherResultats(response, "domaine");
      })

      //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
      //On peut afficher les informations relatives à la requête et à l'erreur
      .fail(function (error) {
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
    })
    //Ce code sera exécuté que la requête soit un succès ou un échec
    .always(function(){
        //alert("Requête effectuée");
    });
});
}


function rechercherScientifique(objet, callback){
  var requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
                          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                          PREFIX dc: <http://purl.org/dc/elements/1.1/>
                          PREFIX : <http://dbpedia.org/resource/>
                          PREFIX dbpedia2: <http://dbpedia.org/property/>
                          PREFIX dbpedia: <http://dbpedia.org/>
                          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                          \n
                          SELECT ?s, (COUNT(?p) as ?count) WHERE {
                          ?s dbo:academicDiscipline ${objet}.
                          ?s rdf:type foaf:Person.               
                          ?s dbo:wikiPageWikiLink ?p.
                          }
                          ORDER BY desc(?count)`;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function(){
      $.ajax({
          //L'URL de la requête 
          url: url_base,

          //La méthode d'envoi (type de requête)
          method: "GET",

          //Le format de réponse attendu
          dataType : "json",
          data : {query : requete}
      })
      //Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
      /*On peut par exemple convertir cette réponse en chaine JSON et insérer
      * cette chaine dans un div id="res"*/
      .done(function(response){
          callback(response);
      })

      //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
      //On peut afficher les informations relatives à la requête et à l'erreur
      .fail(function(error){
        resultats = null;
          alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })
      //Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function(){
          //alert("Requête effectuée");
      });
  });
}

function rechercherInventeur(sujet, callback){
  var requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
                          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                          PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                          PREFIX dc: <http://purl.org/dc/elements/1.1/>
                          PREFIX : <http://dbpedia.org/resource/>
                          PREFIX dbpedia2: <http://dbpedia.org/property/>
                          PREFIX dbpedia: <http://dbpedia.org/>
                          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                          \n
                          SELECT ?o, ?p2, (COUNT(?p) as ?count) WHERE {
                            {
                              ${sujet} dbo:wikiPageWikiLink ?o.
                              ?o rdf:type foaf:Person.               
                              ?o dbo:wikiPageWikiLink ?p.
                            }
                            UNION
                            {
                              ${sujet} dbo:wikiPageWikiLink ?o1.
                              ?o1 dbo:wikiPageRedirects ?p2.
                              ?p2 rdf:type foaf:Person.               
                              ?p2 dbo:wikiPageWikiLink ?p.
                              FILTER(?p2 != ?o1)
                            }

                          ORDER BY desc(?count)
                          `;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function(){
      $.ajax({
          //L'URL de la requête 
          url: url_base,

          //La méthode d'envoi (type de requête)
          method: "GET",

          //Le format de réponse attendu
          dataType : "json",
          data : {query : requete}
      })
      //Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
      /*On peut par exemple convertir cette réponse en chaine JSON et insérer
      * cette chaine dans un div id="res"*/
      .done(function(response){
          callback(response);
      })

      //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
      //On peut afficher les informations relatives à la requête et à l'erreur
      .fail(function(error){
        resultats = null;
          alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })
      //Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function(){
          //alert("Requête effectuée");
      });
  });
}

function afficherChargement(zone, texte) {
  zone.html(
  ` <div>
    <div class="spinner-border spinner-border-sm" role="status">
     <span class="visually-hidden">${texte}...</span>
    </div>
    ${texte}...
    </div>`);

}

// Affichage des résultats dans un tableau
function afficherResultats(data, typeRecherche) {
  // Tableau pour mémoriser l'ordre des variables
  console.log(data);

  var contenuTableau = "";

  if(typeRecherche == "nom") {
    data.results.bindings.forEach(r => {
      disciplines = r.disciplines.value.split(", ");
      contenuTableau +=
        `<div class='col mb-3'>
          <div class='card'>
            <!-- <img src="..." class="card-img-top" alt="..."> -->
            <div class='card-body'>
              <h5 class='card-title text-center'>
                <a class="link-dark text-decoration-none" href="/scientist/${r.p.value.substring(r.p.value.lastIndexOf("/")+1)}>"${r.p.value.substring(r.p.value.lastIndexOf("/")+1)}">${r.p.value.substring(r.p.value.lastIndexOf("/") + 1).replaceAll("_", " ")}</a>
              </h5>
              <div class="card-subtitle mb-2 text-center">`;
        disciplines.forEach(element => {
          contenuTableau += 
            `<span class="badge bg-secondary mx-1">
              <a href="/domaine/${element.replaceAll(" ", "_")}" class="link-light">
              ${element}
              </a>
            </span>`;
        });      
        contenuTableau +=
              `</div>
              <p class='card-text'><span class='more'> ${r.resume.value} </span></p>
              <div class="text-center">
                <a href='${r.p.value}' class='btn btn-primary' target='_blank'>DBpedia</a>
              </div>
            </div>
          </div>
        </div>`
    });
  } 
  else {
    data.results.bindings.forEach(r => {
      contenuTableau +=
        `<div class='col mb-3'>
          <div class='card'>
            <div class='card-body'>
              <h5 class='card-title text-center'>
                <a class="link-dark text-decoration-none" href="/domaine/${r.type.value.substring(r.type.value.lastIndexOf("/")+1)}">${r.type.value.substring(r.type.value.lastIndexOf("/") + 1).replaceAll("_", " ")}</a>
              </h5>
              <div class="card-subtitle mb-2 text-center">`;
             
        contenuTableau +=
              `</div>
            </div>
          </div>
        </div>`;
    });
  }
  
  if(contenuTableau == "") {
    $("#zone-resultats-recherche").html("Aucun résultat.");
  }
  else {
    $("#zone-resultats-recherche").html(contenuTableau);
  }
  activerCollapsibleTexts();
}
