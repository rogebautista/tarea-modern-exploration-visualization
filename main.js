// CHART START

const width = 900;
const height = 500;
const margin = { top: 20, right: 20, bottom: 20, left: 80 };

const svg = d3.select("#my-chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)
const axisGroup = svg.append("g")
const xAxisGroup = axisGroup.append("g").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)


let data_read
const years =[]

let elements
let data_nest

// Funciones de escala
let x = d3.scaleLinear().range([0, width - margin.left - margin.right])
let y = d3.scaleBand().range([height - margin.top - margin.bottom, 0]).padding(0.1)

// definir ejes:
const xAxis = d3.axisBottom().scale(x)
const yAxis = d3.axisLeft().scale(y)


// Función de alimentación de datos
function getData(yearFilter) {
    //console.log('Cargando datos...')
    d3.csv('data.csv').then(data => {
        data_read = data
        data_read.map(d => {
            d.year = +d.year;
        });
        data_read = data_read.filter((d, i) => d.winner !== '') // Se retiran los datos sin ganador WW2
        
        data_nest = d3.nest()
            .key(d => d.winner)   
            .entries(data_read.filter((d, i) => d.year <= yearFilter))
        //console.log(data_nest.map(d => d.key))
        
        data_read.map(d => years.push(d.year))
        data_read.map(d => d.winner);

        x.domain([0, d3.max(data_nest.map( d => d.values.length))]);
        y.domain(data_nest.map(d => d.key));
            
        // dibujo los ejes: 
        xAxisGroup
            .transition()
            .duration(300)
            .call(xAxis)
        yAxisGroup
            .transition()
            .duration(300)
            .call(yAxis)
        //console.log(data_nest)
        elements = elementGroup.selectAll('rect').data(data_nest)
        
        elements.exit()
        .remove()

        elements
            .enter()
            .append('rect')
            .attr('class', 'enter')
            .attr('x', 0)
            .attr('y', (d, i) => y(d.key))
            .attr('height', y.bandwidth())
            .attr('fill', function(d) {
                if (d.values.length > 2) {
                    return '#1d9666';
                    } else {
                        return '#1d6996';
                        }
                        })
            .transition()
            .duration(300)
            .attr('width', d => x(d.values.length)) 
            //.text(function(d) { return d.key; })
        
        elements
            .attr('class', 'update')
            .attr('x', 0)
            .attr('y', (d, i) => y(d.key))
            .attr('height', y.bandwidth())
            .transition()
            .duration(300)
            .attr('fill', function(d) {
                if (d.values.length > 2) {
                    return '#1d9666';
                    } else {
                        return '#1d6996';
                        }
                        })
            .attr('width', d => x(d.values.length))
        elements.exit()
            .attr('class', 'exit')
            .transition()
            .duration(100)
            .attr('width', 0)
            .remove()
    });
    
}


d3.csv('data.csv').then(data => {
    
    data_read = data
    // cast to interger
    data_read.map(d => {
        d.year = +d.year;
    });
    data_read = data_read.filter((d, i) => d.winner !== '') // Se retiran los datos sin ganador WW2
    data_nest = d3.nest()
        .key(d => d.winner)   
        .entries(data_read)
        //console.log('Data Nest', data_nest)
    
    data_read.map(d => years.push(d.year))
        //console.log('Data read', data_read);
        //console.log('Years ',years)
    // get titles
    data_read.map(d => d.winner);
    // set domain of xScale
        //console.log(d3.max(data_nest.map(d => d.values.length)))
        //console.log(data_nest.map(d => d.values.length))
        //console.log('Agrupando',groupBy(data_read, d => d.winner))
    
        //x.domain([d3.min(data_read.map(d => d.year)), d3.max(data_read.map(d => d.year))]);
    x.domain([0, d3.max(data_nest.map( d => d.values.length))]);
    // set domain of yScale
    y.domain(data_nest.map(d => d.key));
        //console.log(' domain y',data_nest.map(d => d.key))
        //console.log(' domain y',data_read.map(d => d.winner))
    // dibujo los ejes: 
    xAxisGroup
            .transition()
            .duration(300)
            .call(xAxis)
    yAxisGroup
            .transition()
            .duration(300)
            .call(yAxis)


        /*console.log(data_nest.map(d => {
            return {
                key: d.key,
                values: d.values.length
            }
        }))*/
    
    elements = elementGroup.selectAll('rect').data(data_nest)
        
    elements
        .enter()
        .append('rect')
        .attr('class', 'enter')
        .attr('x', 0)
        .attr('y', (d, i) => y(d.key))
        .attr('height', y.bandwidth())
        .attr('fill', function(d) {
            if (d.values.length > 2) {
                return '#1d9666';
                } else {
                    return '#1d6996';
                    }
                    })
        .transition()
        .duration(300)
        .attr('width', d => x(d.values.length)) 
        //.text(function(d) { return d.key; })
    
    elements
        .attr('class', 'update')
        .attr('x', 0)
        .attr('y', (d, i) => y(d.key))
        .attr('height', y.bandwidth())
        .transition()
        .duration(300)
        .attr('fill', function(d) {
            if (d.values.length > 2) {
                return '#1d9666';
                } else {
                    return '#1d6996';
                    }
                    })
        .attr('width', d => x(d.values.length))
    elements.exit()
        .attr('class', 'exit')
        .transition()
        .duration(100)
        .attr('width', 0)
        .remove()
    console.log('Aqui se ha ejecutado inicialmente')
    slider()
});




// CHART END

// slider:
function slider() {    
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // rango años
        .max(d3.max(years))
        .step(4)  // cada cuánto aumenta el slider
        .width(580)  // ancho de nuestro slider
        .ticks(years.length)  
        .default(years[years.length -1])  // punto inicio de la marca
        .on('onchange', val => {
            // console.log("La función aún no está conectada con la gráfica")
            // conectar con la gráfica aquí
            d3.select('p#value-time').text(val);
            /*console.log('Slider proceso')
            console.log(data_nest)
            console.log('Data nest level one',d3.values(data_nest).map((d,i) => d.values))
            console.log('Data nest level two', 
            
            data_nest.find((d) => {
                return d.values.some( (item) => {
                    return item.year <= 1950
                })
            })
            )
            console.log('Data nest level two-2', 
            
            data_nest.filter((d) => {
                d.values.some( (item) => item.year <= 1950)
            })
            )

            console.log('Data nest level two-3',
            data_nest.filter(d => d.values.some(y => y.year<= 1950))
            )



            console.log(d3.values(data_nest).map((d, i) => {
                d3.values(d).map((item, j) => item[0])
            }))*/
            //console.log('Valores filtrados', data_read.filter((d, i) => d.year <= val));
            /*console.log('Valores filtrados', 
                        d3.nest()
                        .key(d => d.winner)   
                        .entries(data_read.filter((d, i) => d.year <= val)) );*/

            /*elements.data(d3.nest()
                            .key(d => d.winner)   
                            .entries(data_read.filter((d, i) => d.year <= val)))
                    .attr('class', 'update')
                    .attr('x', 0)
                    .attr('y', (d, i) => y(i))
                    .attr('height', y.bandwidth())
                    .transition()
                    .duration(300)
                    .attr('fill', function(d) {
                        if (d.values.length > 2) {
                            return '#ff0000';
                            } else {
                                return '#0000ff';
                                }
                                })
                    .attr('width', d => x(d.values.length))

            elements.exit()
                    .attr('class', 'exit')
                    .transition()
                    .duration(100)
                    .attr('width', 0)
                    .remove()*/
            /*x.domain([0, d3.max(data_nest.map( d => d.values.length))]);
            y.domain(data_nest.map(d => d.key));
            xAxisGroup.call(xAxis)
            yAxisGroup.call(yAxis)
            elements = elementGroup.selectAll('rect').data(d3.nest().key(d => d.winner).entries(data_read.filter((d, i) => d.year <= val)))
            elements
                .enter()
                .append('rect')
                .attr('class', 'enter')
                .attr('x', 0)
                .attr('y', (d, i) => y(d.key))
                .attr('height', y.bandwidth())
                .attr('fill', function(d) {
                    if (d.values.length > 2) {
                        return '#ff0000';
                        } else {
                            return '#0000ff';
                            }
                            })
                .transition()
                .duration(300)
                .attr('width', d => x(d.values.length)) 
                .text(function(d) { return d.key; })
                
            elements
                    .attr('class', 'update')
                    .attr('x', 0)
                    .attr('y', (d, i) => y(i))
                    .attr('height', y.bandwidth())
                    .transition()
                    .duration(300)
                    .attr('fill', function(d) {
                        if (d.values.length > 2) {
                            return '#ff0000';
                            } else {
                                return '#0000ff';
                                }
                                })
                    .attr('width', d => x(d.values.length))
            elements.exit()
                    .attr('class', 'exit')
                    .transition()
                    .duration(100)
                    .attr('width', 0)
                    .remove()
                    */
            getData(val)
        
        });

        var gTime = d3
        .select('div#slider-time')  // div donde lo insertamos
        .append('svg')
        .attr('width', width * 0.8)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);

        d3.select('p#value-time').text(sliderTime.value());
}


function groupBy(a, keyFunction) {
    const groups = {};
    let values =[]
    a.forEach(function(el) {
        //console.log(el)
      const key = keyFunction(el);
      if (key in groups === false) {
        groups[key] = [];
      }
      groups[key].push(el);
    });
    return groups;
  }


