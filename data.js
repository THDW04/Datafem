import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
const container = d3.select("#graph-contain");

// mapping boutons et fichiers
const btns = {
    actrice: "data/actrices.json",
    autrice: "data/autrices.json",
    chanteuse: "data/chanteuses.json",
    peintre: "data/peintres.json"
};

// écoute tous les boutons
document.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', async e => {
        document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        await graph(btns[e.target.id]);
    });
});

//Function qui affiche le graph

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
        .domain([data[0].decennie, data[data.length - 1].decennie])
        .range([margin.left, width - margin.right])


    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)]).nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.sexe))])
        .range(d3.schemeCategory10);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
            d3.axisBottom(x)
                .tickValues(d3.range(1800, 2021, 20).map(y => new Date(y, 0, 1))) // ⚡️ force les ticks tous les 20 ans
                .tickFormat(d3.timeFormat("%Y"))
        )
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
        .attr("stroke", d => color(d[0]))
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
    serie.append("g")
        .selectAll("circle")
        .data(d => d[1])
        .join("circle")
        .attr("cx", d => x(d.decennie))
        .attr("cy", d => y(d.count))
        .attr("r", 0)
        .attr("fill", d => color(d.sexe))
        .transition() // Animation
        .delay((d, i) => i * 200)
        .duration(800)
        .ease(d3.easeBackOut)
        .attr("r", 4); // apparition

        

    //Légende du graph
    svg.append("circle").attr("cx", 1050).attr("cy", 130).attr("r", 5).style("fill", "#ff7f0e")
    svg.append("circle").attr("cx", 1050).attr("cy", 160).attr("r", 5).style("fill", "#1f77b4")
    svg.append("text").attr("x", 1070).attr("y", 130).text("Homme").style("font-size", "1.2rem").style("fill", "#fff").attr("alignment-baseline", "middle")
    svg.append("text").attr("x", 1070).attr("y", 160).text("Femme").style("font-size", "1.2rem").style("fill", "#fff").attr("alignment-baseline", "middle")

    // Clean avant d’insérer
    container.selectAll("*").remove();
    container.node().appendChild(svg.node());
}



// Charger un graph par défaut au démarrage
const defaultBtn = document.querySelector('#actrice');
defaultBtn.classList.add('active');
graph("data/actrices.json");