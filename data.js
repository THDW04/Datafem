import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
const container = d3.select("#graph-contain");

// objet des boutons et fichiers
const btns = {
    actrices: "data/actrices.json",
    autrices: "data/autrices.json",
    chanteuses: "data/chanteuses.json",
    peintres: "data/peintres.json"
};

//Tableau des artistes
let artistes = [];

// écoute tous les boutons
let buttons = document.querySelectorAll('.btns button');
buttons.forEach((btn) => {
    btn.addEventListener('click', async e => {
        // Ajout ou suppression de la classe 'active'
        buttons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const profession = e.target.id;

        // Chargement JSON artistes
        const response = await fetch('data/cartes.json');
        let cartes = await response.json();
        artistes = [...cartes[profession].homme, ...cartes[profession].femme];

        // Lancer le graphique
        await graph(btns[profession]);
    });
});

//Fonction qui affiche le graph

async function graph(jsonFile) {

    //chargement du json
    const data = await d3.json(jsonFile);

    data.forEach(d => {
        d.decennie = new Date(parseInt(d.decennie), 0, 1);
        d.count = +d.count;
    });

    //dimension du svg
    const width = 1200, height = 750;
    const margin = { top: 30, right: 50, bottom: 30, left: 60 };

    const x = d3.scaleUtc()
        .domain([new Date("1800-01-01"), new Date("2020-01-01")])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(["Homme", "Femme"])
        .range(["#da4e55", "#ffe8c5"]);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text") // styliser la taille du texte
        .style("font-size", "14px")
        .style("fill", "#fff");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text") // styliser la taille du texte
        .style("font-size", "14px")
        .style("fill", "#fff");

    // Grouper par sexe
    const grouped = d3.group(data, d => d.sexe);

    const serie = svg.append("g")
        .selectAll("g")
        .data(Array.from(grouped))
        .join("g");

    // Lignes
    serie.append("path")
        .attr("fill", "none")
        .attr("stroke", d => color(d[0])) //couleur des lignes
        .attr("stroke-width", 2)
        .attr("d", d => d3.line()
            .x(d => x(d.decennie))
            .y(d => y(d.count))(d[1])
        )
        .each(function () {
            const path = d3.select(this);
            const length = this.getTotalLength();

            // Animaion - Cache la ligne au début
            path
                .attr("stroke-dasharray", length + " " + length)
                .attr("stroke-dashoffset", length)
                // Animation d'apparition
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        });

    // Points
    const circles = serie.append("g")
        .selectAll("circle")
        .data(d => d[1])
        .join("circle")
        .attr("cx", d => x(d.decennie))
        .attr("cy", d => y(d.count))
        .attr("r", 0)
        .attr("fill", d => color(d.sexe));

    // Animation d'apparition
    circles.transition()
        .delay((d, i) => i * 200)
        .duration(800)
        .ease(d3.easeBackOut)
        .attr("r", 4);

    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "#333")
        .style("color", "#fff")
        .style("padding", "6px 10px")
        .style("border-radius", "8px")
        .style("font-size", "15px")
        .style("opacity", 0)
        .style("pointer-events", "none");

    // Événements (sur les cercles)
    circles
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget)
                .transition()
                .duration(100)
                .attr("r", 6);

            tooltip
                .style("opacity", 1)
                .html(`<strong>${d.count}</strong>`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mousemove", (event) => {
            tooltip
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", (event, d) => {
            d3.select(event.currentTarget)
                .transition()
                .duration(100)
                .attr("r", 4);

            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

        //Affiche les images des artistes sur le graphique au clique du bouton
    document.getElementById("populaire").addEventListener('click', () => {
        svg.selectAll(".artiste-image")
            .data(artistes)
            .join("image")
            .attr("class", "artiste-image")
            .attr("x", d => x(new Date(d.annee)) - 40)
            .attr("y", d => y(d.count) - 40 - 50)
            .attr("width", 80)
            .attr("height", 80)
            .attr("href", d => d.photo)
            .style("clip-path", "circle(30% at 50% 48%)")
            .style("cursor", "pointer")
            .attr("opacity", 0);

        // Animation d'appiration
        svg.selectAll(".artiste-image").transition()
            .duration(1000)
            .delay((d, i) => i * 200)
            .attr("y", d => y(d.count) - 40)
            .attr("opacity", 1);

        // Effet hover sur les images
        svg.selectAll(".artiste-image")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("width", 90)
                    .attr("height", 90)
                    .attr("x", x(new Date(d.annee)) - 45)
                    .attr("y", y(d.count) - 45)
                    .style("filter", "brightness(1.2)");
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("width", 80)
                    .attr("height", 80)
                    .attr("x", x(new Date(d.annee)) - 40)
                    .attr("y", y(d.count) - 40)
                    .style("filter", "brightness(1)");
            });

        //Ouvre la fenetre de l'artiste
        svg.selectAll(".artiste-image").on("click", (e, d) => {
            const modale = d3.select("#modale");
            modale.style("display", "flex");
            
            // Création de la structure de la carte
            modale.node().innerHTML = `
                <div class="modale-content">
                    <div class="modale-left">
                        <img src="${d.photo}" alt="${d.nom}" class="modale-photo">
                        <div class="modale-quote">${d.citation}</div>
                    </div>
                    <div class="modale-right">
                        <div class="modale-header">
                            <div>
                                <h2 class="modale-nom">${d.nom}</h2>
                                <img src="${d.signature}" alt="signature" class="modale-signature">
                            </div>
                            <div class="modale-category">${d.categorie}</div>
                        </div>
                        <p class="modale-description">${d.description}</p>
                        <div class="modale-footer">
                            <button id="closeModale">Retour au graphique</button>
                        </div>
                    </div>
                </div>
            `;

            //Ferme la fenetre de l'artiste
            d3.select("#closeModale").on("click", () => {
                modale.style("display", "none");
            });
            
            // Fermer en cliquant en dehors de la carte
            modale.on("click", (event) => {
                if (event.target.id === "modale") {
                    modale.style("display", "none");
                }
            });
        });
    });

    //Légende du graph
    svg.append("circle").attr("cx", 1050).attr("cy", 130).attr("r", 5).style("fill", "#ffe8c5");
    svg.append("circle").attr("cx", 1050).attr("cy", 160).attr("r", 5).style("fill", "#da4e55");
    svg.append("text").attr("x", 1070).attr("y", 130).text("Hommes").style("font-size", "1.2rem").style("fill", "#fff").attr("alignment-baseline", "middle");
    svg.append("text").attr("x", 1070).attr("y", 160).text("Femmes").style("font-size", "1.2rem").style("fill", "#fff").attr("alignment-baseline", "middle");

    // Clean avant d'insérer
    container.selectAll("*").remove();
    container.node().appendChild(svg.node());
}

// Charger un graph par défaut au démarrage
const defaultBtn = document.querySelector('#actrices');
defaultBtn.classList.add('active');
graph("data/actrices.json");