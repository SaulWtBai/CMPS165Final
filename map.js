d3.select("body").append("div").attr("id", "middle");

//--button--
d3.select("#middle").append("div").attr("id", "buttonBar").style("float","left");
d3.select("#buttonBar").append("button").attr("id", "hasCity").text("HasCity");
d3.select("#buttonBar").append("button").attr("id", "noCity").text("NoCity");

d3.select("#buttonBar").append("div").attr("id","totalGDP_div").text("Total GDP");
d3.select("#totalGDP_div").append("button").attr("id", "totalGDP_famousCities");
d3.select("#totalGDP_div").append("button").attr("id", "totalGDP_province");

d3.select("#buttonBar").append("div").attr("id","population_div").text("Population");
d3.select("#population_div").append("button").attr("id", "population_famousCities");
d3.select("#population_div").append("button").attr("id", "population_province");

d3.select("#buttonBar").append("div").attr("id","PGDP_div").text("GDP Per Capita");
d3.select("#PGDP_div").append("button").attr("id", "PGDP_famousCities");
d3.select("#PGDP_div").append("button").attr("id", "PGDP_province");

document.getElementById("totalGDP_famousCities").innerHTML = "Ten famous cities";
document.getElementById("population_famousCities").innerHTML = "Ten famous cities";
document.getElementById("PGDP_famousCities").innerHTML = "Ten famous cities";
document.getElementById("totalGDP_province").innerHTML = "Province and  municipality";
document.getElementById("population_province").innerHTML = "Province and municipality";
document.getElementById("PGDP_province").innerHTML = "Province and municipality";




var IsCity = true;//是否是city状态
var IsGDP = false;//是否是gdp状态
var mod = {IsCity:true, IsGDP:false, IsPOP:true, IsPGDP:false};

var width  = 1000;
var height = 700;
var svg = d3.select("#middle").append("div").attr("id", "divsvg").attr("class","divsvg")
    .append("svg").attr("id","svg").attr("class","svg")
    .attr("width", width+20)
    .attr("height", height-50);

var g = svg.append("g").attr("id", "map");





//define the value of center of projection
var center_y=31, center_x=107;
//set projection
var projection = d3.geo.mercator()
//    .center([107, 31])
    .center([100, 35])
    .scale(650)
    .translate([800/2, 800/2]);

//告诉用户现在是什么模式
svg.append("g")
    .attr("id", "infor")
    .attr("transform", "translate(400,50)")
    .append("text")
    .attr("id", "infortext")
    .text("Population : Province and Municipalities (million)")
    .style("text-anchor", "middle")
    .attr("font-size", "30px")
    .style("fill","red")
;


//create 2D path
var path = d3.geo.path().projection(projection);


//-------------------------Define Tooltip---------------------------------------------------
d3.select("body").append("div").attr("id", "tooltip").attr("class","hidden");
d3.select("#tooltip").append("p").attr("id", "tooltip_name");
d3.select("#tooltip").append("p").attr("id", "tooltip_GDP");
d3.select("#tooltip").append("p").attr("id", "tooltip_population");
d3.select("#tooltip").append("p").attr("id", "tooltip_PGDP");



//set Province color domain
var colorProvincePopulation = d3.scale.threshold()
//    .domain([200,1760,3320,4880,6440,8000])//万人,间隔 1560
    .domain([0,2500,5000,7500,10000,12500])//万人,2500
    .range(["#ccff80","#b7ff4a","#9aff02","#8cea00","#73bf00","#548c00","#548c00"]);//绿色

var colorProvinceGDP = d3.scale.threshold()
//    .domain([1000,13800,26600,39400,52200,65000])//亿元,间隔 12800
    .domain([0,15000,30000,45000,60000,75000])//亿元,15000
    .range(["#Caffff","#a6ffff","#4dffff","#00e3e3","#00aeae","#007979","#007979"]);//蓝色

var colorProvincePGDP = d3.scale.threshold()
//    .domain([25000,40833,56666,72499,88332,104165])//元,间隔 15833,上限120000
    .domain([25000,40000,55000,70000,85000,100000])//元,间隔 15000
    .range(["#ffd2d2","#ff5151", "#ff5151", "#ff2d2d", "#ff0000", "#b30000", "#b30000"]);//红色
	
//set City color domain
var colorCityPopulation = d3.scale.threshold()
//    .domain([50,340,630,920,1210,1500])//万人,间隔 290
    .domain([0,2500,5000,7500,10000,12500])//万人,2500
    .range(["#ccff80","#b7ff4a","#9aff02","#8cea00","#73bf00","#548c00","#548c00"]);//绿色

var colorCityGDP = d3.scale.threshold()
//    .domain([1000,3800,6600,9400,12200,15000])//亿元,间隔 2800
    .domain([0,15000,30000,45000,60000,75000])//亿元,15000
    .range(["#Caffff","#a6ffff","#4dffff","#00e3e3","#00aeae","#007979","#007979"]);//蓝色

var colorCityPGDP = d3.scale.threshold()
//    .domain([20000,36666,53332,69998,86664,103330])//元,间隔 16666,上限120000
    .domain([25000,40000,55000,70000,85000,100000])//元,间隔 15000
    .range(["#ffd2d2","#ff5151", "#ff5151", "#ff2d2d", "#ff0000", "#b30000", "#b30000"]);//红色


//-----------------定义尺度条的区域------------------------
var rectArea = svg.append("g")
    .attr("class", "rectArea")
    .attr("id", "rectArea")
    .attr("transform", "translate(100,120)");
	
//----------------begin draw map-------------------------------------------
d3.json("aChina.json",function(error, root) {
    
    if (error){return console.error(error);}    
    
    var mapPath = g.selectAll("path")
        .data(root.features)
        .enter()
        .append("path")
        .attr("id", "drawPath");
    
    mapPath
        .attr("class",startShow)
        .attr("stroke","#000")
//        .attr("stroke-width",1)
        .attr("stroke-width", linkFunction)
        .attr("d", path)
        .attr("fill", mapShowScale)
        .style("opacity", 1)
        .on("click",clickfunction)
        .on("mouseover",mouseoverFunction)
        .on("mouseout",mouseoutFunction);
              

  
//------button part-------------------------------------------------------------
    d3.select("#buttonBar").select("#hasCity").on("click", hasCityFunction);
    d3.select("#buttonBar").select("#noCity").on("click", noCityFunction);

    d3.select("#buttonBar").select("#totalGDP_famousCities").on("click",clickGDPFamousCities);
    d3.select("#buttonBar").select("#totalGDP_province").on("click", clickGDPProvince);
    
    d3.select("#buttonBar").select("#population_famousCities").on("click", clickPopulationFamousCities);
    d3.select("#buttonBar").select("#population_province").on("click", clickPopulationProvince);
    
    d3.select("#buttonBar").select("#PGDP_famousCities").on("click", clickPGDPFamousCities);
    d3.select("#buttonBar").select("#PGDP_province").on("click", clickPGDPProvince);
    

    
// -----------------------------keyboard--------------------  
    document.onkeydown=function(event){
        var keydown = event || window.event || arguments.callee.caller.arguments[0];  
        
        if(keydown && keydown.keyCode==77){
            console.log("m");
        }
        
        
        //city or province button
        if(keydown && keydown.keyCode==13){ // enter
            var buttonName = d3.select("#buttonBar").select("#showCity").text();
            
            
            if(buttonName == "only Provinces"){
                onelyProvinces() 
            }else if(buttonName == "showCity"){
                showCity();
            }
        }
    }; 
    
    
//-----------------------------------------function part------------------------------------    
    
    //--------------- click function part --------------------------------------
    function clickfunction(){
        var yPosition = event.clientY;
        var xPosition = event.clientX;
        console.log("x: "+xPosition)
        console.log("y: "+yPosition)
    }
    
    function startShow(d,i){
        if(i<34){
            return false;
        }else{
            return "hidden";   

        }
    }
    
    function linkFunction(d,i){
        rectProvincePopulation();
        if(i<34){
            return 1;
        }else{
            return 2;   

        }
    }
    
    function hasCityFunction(d,i){
        d3.selectAll("path").attr("class",false);
    }
    
    function noCityFunction(d,i){
        d3.selectAll("path").attr("class",function(d1,i1){
            if(i1<34){
                return false;
            }else{
                return "hidden";   
            }    
        });
    }
    
    function clickGDPFamousCities(d, i){
        hasCityFunction();
        colorGDP();
        rectCityGDP();
        svg.select("#infortext").text("GDP: Ten Famouse Cities (billion)")
    }
    
    function clickGDPProvince(d, i){
        noCityFunction();
        colorGDP();
        rectProvinceGDP();
        svg.select("#infortext").text("GDP: Provinces and Municipalities (billion)")
    }
    
    function clickPopulationFamousCities(d, i){
        hasCityFunction();
        colorPopulation();
        rectCityPopulation();
        svg.select("#infortext").text("Population: Ten Famouse Cities (million)")
    }
    
    function clickPopulationProvince(d, i){
        noCityFunction();
        colorPopulation();
        rectProvincePopulation();
        svg.select("#infortext").text("Population: Provinces and Municipalities (million)")
    }
    
    function clickPGDPFamousCities(d, i){
        hasCityFunction();
        colorPGDP();
        rectCityPGDP();
        svg.select("#infortext").text("GDP Per Capita: Ten Famouse Cities")
    }
    
    function clickPGDPProvince(d, i){
        noCityFunction();
        colorPGDP();
        rectProvincePGDP();
        svg.select("#infortext").text("GDP Per Capita: Provinces and Municipalities")
    }
    
    
    //------------------------- 鼠标接触 function -----------------------------------------
    
    function mouseoverFunction(d,i){
        d3.select(this).attr("fill","yellow");
        
        // define the position of tooltip
        var yPosition = event.clientY;
        var xPosition = event.clientX;
//        console.log(xPosition)
        
        
        //Update the tooltip position and value
        d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#tooltip_name")
            .text(function(){
                if(i<34){
                    return d.properties.name;
                }else{
                    return d.properties.ename;   
                }
            }).attr("align","center").style("font-size","15px");
        var x = Math.round(d.properties.gdp2014/10);
        var y = Math.sqrt((d.properties.gdp2014/10 - x)*(d.properties.gdp2014/10 - x));
        y = Math.round(y*100);
        var gdp = x+"."+y;        
        var population = Math.round(d.properties.population2014/10)/10;
        
        document.getElementById("tooltip_GDP").innerHTML = 
            "GDP (billion ￥) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : &nbsp;&nbsp;"+gdp;
        document.getElementById("tooltip_population").innerHTML = "Population ( million) : &nbsp;&nbsp;"+population;
        document.getElementById("tooltip_PGDP").innerHTML = "GDP Per Capita (￥) : &nbsp;&nbsp;"+d.properties.pgdp;
//        document.getElementById("tooltip_PGDP").innerHTML = 
//            "<span>GDP Per Capita (￥) :<span> <em>"+d.properties.pgdp+"</em>";
            
        d3.select("#tooltip_population").style("font-size","12px");
        d3.select("#tooltip_GDP").style("font-size","12px");
        d3.select("#tooltip_PGDP").style("font-size","12px");
        
        //change the tooltip to be visible
        d3.select("#tooltip").classed("hidden", false);
                
        }
    
    function mouseoutFunction(d,i){
         var inforcontext = svg.select("#infortext").text();
        
        d3.select(this).attr("fill", function(d,i){
                if( inforcontext == "Population : Province and Municipalities (million)" ){
                    return colorProvincePopulation(d.properties.population2014);
                }else if( inforcontext =="Population: Ten Famouse Cities (million)" ){
                    return colorCityPopulation(d.properties.population2014);
                }else if( inforcontext == "GDP: Ten Famouse Cities (billion)" ){
                    return colorCityGDP(d.properties.gdp2014);
                }else if( inforcontext =="GDP: Provinces and Municipalities (billion)" ){
                    return colorProvinceGDP(d.properties.gdp2014);
                }else if( inforcontext =="GDP Per Capita: Ten Famouse Cities"){
                    return colorCityPGDP(d.properties.pgdp);
                }else{
                    return colorProvincePGDP(d.properties.pgdp);
                }
            
        });
        d3.select("#tooltip").classed("hidden", true);
    }
    
    function mapShowScale(d,i){
        var scaleValue = projection.scale();
        if(i<=33){
            var popul = (d.properties.population2014);
            return colorProvincePopulation(popul);
                
        }else{
            var popul = (d.properties.population2014);    
            return colorCityPopulation(popul);  
        }
    }

    
    //---------------------- 颜色填充 fucntion-----------------------
    
    function colorPopulation(d,i){
        mapPath.attr("fill", function(d,i){
            if(d.properties.id<1000){
                return colorProvincePopulation(d.properties.population2014);
            }else{
                return colorCityPopulation(d.properties.population2014);
            }
        });
    }
    
    function colorGDP(d,i){
        mapPath.attr("fill", function(d,i){
            if(d.properties.id<1000){
                return colorProvinceGDP(d.properties.gdp2014);
            }else{
                return colorCityGDP(d.properties.gdp2014);
            }
        });
    }
    
    function colorPGDP(d,i){
        mapPath.attr("fill", function(d,i){
            if(d.properties.id<1000){
                return colorProvincePGDP(d.properties.pgdp);
            }else{
                return colorCityPGDP(d.properties.pgdp);
            }
        });
    }
    
    //--------------------------改变刻度条-----------------------------
    
     //这个是画城市人口
    function rectCityPopulation(d,i){
    
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        var x0 = -50;
        
        //-----------方块-----------
        rectArea.selectAll("rect")
        .data(colorCityPopulation.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("rect")
        .attr("id", "rectPopulation")
        .attr("width", 20)
        .attr("x",760)
        .attr("y", function(d) {
            x0+=50;
            return x0;
        })
        .attr("height",20)
        .style("fill", function(d) { return colorCityPopulation(d.z-1); })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover",function(d,i){
            var minRange = d.z;
             mapPath.attr("fill", function(d,i){
                var  colorArg = d.properties.population2014;
                 if( colorArg >= minRange && colorArg < (minRange+2500) ){
                     return "yellow";
                 }else{
                     return colorCityPopulation(colorArg);
                 }
             });
        })
        .on("mouseout",function(d,i){
            mapPath.attr("fill", function(d,i){
                colorArg = d.properties.population2014;
                return colorCityPopulation(colorArg);
            });
        });
        
        //----------刻度-------------
        var x1 = -10;
        var pop = 0;
        rectArea.selectAll("text")
        .data(colorCityPopulation.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            x1+=50;
            return x1;
        })
        .attr("x", 760)
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text(function(d){
            return pop/100+"-"+(pop+=2500)/100;
        })
        .style("fill","blue")
        .style("text-anchor","start");
    }
    
    //这个是省人口
    function rectProvincePopulation(d,i){
    
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        var x0 = -50;
        
        //-----------方块-----------
        rectArea.selectAll("rect")
        .data(colorProvincePopulation.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("rect")
        .attr("id", "rectPopulation")
        .attr("width", 20)
        .attr("x",760)
        .attr("y", function(d) {
            x0+=50;
            return x0;
        })
        .attr("height",20)
        .style("fill", function(d) { return colorProvincePopulation(d.z-1); })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover",function(d,i){
            var minRange = d.z;
             mapPath.attr("fill", function(d,i){
                var  colorArg = d.properties.population2014;
                 if( colorArg >= minRange && colorArg < (minRange+2500) ){
                     return "yellow";
                 }else{
                     return colorProvincePopulation(colorArg);
                 }
             });
        })
        .on("mouseout",function(d,i){
            mapPath.attr("fill", function(d,i){
                colorArg = d.properties.population2014;
                return colorProvincePopulation(colorArg);
            });
        });
        
        //----------刻度-------------
        var x1 = -10;
        var pop=0;
        rectArea.selectAll("text")
        .data(colorProvincePopulation.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            x1+=50;
            return x1;
        })
        .attr("x", 760)
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text(function(d){
            return pop/100+"-"+(pop+=2500)/100;
        })
        .style("fill","blue")
        .style("text-anchor","start");
    }
    
    //这个是城市GDP
    function rectCityGDP(d,i){
    
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        var x0 = -50;
        
        //-----------方块-----------
        rectArea.selectAll("rect")
        .data(colorCityGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("rect")
        .attr("id", "rectPopulation")
        .attr("width", 20)
        .attr("x",760)
        .attr("y", function(d) {
            x0+=50;
            return x0;
        })
        .attr("height",20)
        .style("fill", function(d) { return colorCityGDP(d.z-1); })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover",function(d,i){
            var minRange = d.z;
             mapPath.attr("fill", function(d,i){
                var  colorArg = d.properties.gdp2014;
                 if( colorArg >= minRange && colorArg < (minRange+15000) ){
                     return "yellow";
                 }else{
                     return colorCityGDP(colorArg);
                 }
             });
        })
        .on("mouseout",function(d,i){
            mapPath.attr("fill", function(d,i){
                colorArg = d.properties.gdp2014;
                return colorCityGDP(colorArg);
            });
        });
        
        //----------刻度-------------
        var x1 = -10;
        var gdp = 0;
        rectArea.selectAll("text")
        .data(colorCityGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            x1+=50;
            return x1;
        })
        .attr("x", 760)
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text(function(d){
            return gdp/10+"-"+(gdp+=15000)/10;
        })
        .style("fill","blue")
        .style("text-anchor","start");
    }
    
    //这个是省GDP
    function rectProvinceGDP(d,i){
    
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        var x0 = -50;
        
        //-----------方块-----------
        rectArea.selectAll("rect")
        .data(colorProvinceGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("rect")
        .attr("id", "rectPopulation")
        .attr("width", 20)
        .attr("x",760)
        .attr("y", function(d) {
            x0+=50;
            return x0;
        })
        .attr("height",20)
        .style("fill", function(d) { return colorProvinceGDP(d.z-1); })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover",function(d,i){
            var minRange = d.z;
             mapPath.attr("fill", function(d,i){
                var  colorArg = d.properties.gdp2014;
                 if( colorArg >= minRange && colorArg < (minRange+15000) ){
                     return "yellow";
                 }else{
                     return colorProvinceGDP(colorArg);
                 }
             });
        })
        .on("mouseout",function(d,i){
            mapPath.attr("fill", function(d,i){
                colorArg = d.properties.gdp2014;
                return colorProvinceGDP(colorArg);
            });
        });
        
        //----------刻度-------------
        var x1 = -10;
        var gdp = 0;
        rectArea.selectAll("text")
        .data(colorProvinceGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            x1+=50;
            return x1;
        })
        .attr("x", 760)
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text(function(d){
            return gdp/10+"-"+(gdp+=15000)/10;
        })
        .style("fill","blue")
        .style("text-anchor","start");
    }
    
    //省人均GDP
    function rectProvincePGDP(d,i){
    
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        var x0 = -50;
        
        //-----------方块-----------
        rectArea.selectAll("rect")
        .data(colorProvincePGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("rect")
        .attr("id", "rectPopulation")
        .attr("width", 20)
        .attr("x",760)
        .attr("y", function(d) {
            x0+=50;
            return x0;
        })
        .attr("height",20)
        .style("fill", function(d) { return colorProvincePGDP(d.z-1); })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover",function(d,i){
            var minRange = d.z;
             mapPath.attr("fill", function(d,i){
                var  colorArg = d.properties.pgdp;
                 if( colorArg >= minRange && colorArg < (minRange+15000) ){
                     return "yellow";
                 }else{
                     return colorProvincePGDP(colorArg);
                 }
             });
        })
        .on("mouseout",function(d,i){
            mapPath.attr("fill", function(d,i){
                colorArg = d.properties.pgdp;
                return colorProvincePGDP(colorArg);
            });
        });
        
        //----------刻度-------------
        var x1 = -10;
        var gdp=25000;
        rectArea.selectAll("text")
        .data(colorProvincePGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            x1+=50;
            return x1;
        })
        .attr("x", 760)
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text(function(d){
            return gdp+"-"+(gdp+=15000);
        })
        .style("fill","blue")
        .style("text-anchor","start");
    }
    
    //市人均GDP
    function rectCityPGDP(d,i){
    
        rectArea
        .selectAll("rect")
        .remove()
        ;
        
        rectArea
        .selectAll("text")
        .remove()
        ;
        
        var x0 = -50;
        
        //-----------方块-----------
        rectArea.selectAll("rect")
        .data(colorCityPGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("rect")
        .attr("id", "rectPopulation")
        .attr("width", 20)
        .attr("x",760)
        .attr("y", function(d) {
            x0+=50;
            return x0;
        })
        .attr("height",20)
        .style("fill", function(d) { return colorCityPGDP(d.z-1); })
        .style("stroke-width","1")
        .style("stroke","#000000")
        .on("mouseover",function(d,i){
            var minRange = d.z;
             mapPath.attr("fill", function(d,i){
                var  colorArg = d.properties.pgdp;
                 if( colorArg >= minRange && colorArg < (minRange+15000) ){
                     return "yellow";
                 }else{
                     return colorCityPGDP(colorArg);
                 }
             });
        })
        .on("mouseout",function(d,i){
            mapPath.attr("fill", function(d,i){
                colorArg = d.properties.pgdp;
                return colorCityPGDP(colorArg);
            });
        });
        
        //----------刻度-------------
        var x1 = -10;
        var gdp=0;
        rectArea.selectAll("text")
        .data(colorCityPGDP.domain().map(function(d, i) {
            return {
                z: d
            };
        }))
        .enter().append("text")
        .attr("class", "rectNum")
        .attr("y", function(d) {
            x1+=50;
            return x1;
        })
        .attr("x", 760)
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text(function(d){
            return gdp+"-"+(gdp+=15000);
        })
        .style("fill","blue")
        .style("text-anchor","start");
    }
    
    
   

    
});


 









