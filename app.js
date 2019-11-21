
  
//    <script> 
      $.post('https://cracrr.mybluemix.net/consume-category', {user:'public'}).done(function(response){


        const dataSet = response.data;
        const keys_ = Object.keys(dataSet);
        var data=[];
        var dataChart=[];

        console.log(dataSet);

        for(var i in keys_){
          var key_ = keys_[i];
          var js =  dataSet[key_];
          js['SERVICIO'] = key_;
          dataChart.push(js['CRA/CRR']);
          data.push(js);

        }

        console.log(dataSet);  
        console.log(data);        


        $( "#loader" ).hide();
        $( "#loader2" ).hide();

                 //create Tabulator on DOM element with id "example-table"
        var table = new Tabulator("#example-table", {
          //height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
          data:data, //assign data to table
          layout:"fitColumns", //fit columns to width of table (optional)
          dataTree:true,
          columns:[
            {title:"SERVICIO" , field:"SERVICIO"},
            {title:"LINEA BASE" , field:"LB"},
            {title:"CONSUMO" , field:"CONSUMO"},
            {title:"CRA/CRR" , field:"CRA/CRR", 
              formatter:function(cell, formatterParams){
                 var value = cell.getValue();

                  if(value > 0){
                      return "<span style='color:green; font-weight:bold;'>" + value + "</span>";
                  }else if(value < 0){
                      return "<span style='color:red; font-weight:bold;'>" + value + "</span>";
                  }else{
                    return value;
                  }
                }
            }
            ],
          rowClick:function(e, row){ //trigger an alert message when the row is clicked
            if(!(row.getData()["CATEGORIA"] && true)){
              return;
            }
            if(!(row.getData()["CATEGORIA"] == "Sistema Operativo")){
              return;
            }

            const id = row.getData()['SERVICIO'].replace(/ /g, "-");

            $(".subTable" + id).toggle();    
          },
          rowFormatter: function(row) {


            if(!(row.getData()["CATEGORIA"] && true)){
              return;
            }

            if(!(row.getData()["CATEGORIA"] == "Sistema Operativo")){
              return;
            }

            //create and style holder elements
              var holderEl = document.createElement("div");
              var tableEl = document.createElement("div");

              const id = row.getData()['SERVICIO'].replace(/ /g, "-");
              var data = row.getData();

              data['CRA/CRR CPU'] = data['CONSUMO_CPU'] - data['CPU_DEFINIDA'];
              data['CRA/CRR MEM'] = data['CONSUMO_MEMORIA'] - data['MEMORIA_DEFINIDA'];

              holderEl.style.boxSizing = "border-box";
              holderEl.style.padding = "10px 10px 10px 10px";
              holderEl.style.borderTop = "1px solid #333";
              holderEl.style.borderBotom = "1px solid #333";
              holderEl.style.background = "#ddd";

              holderEl.setAttribute('class', "subTable" + id + "");


              tableEl.style.border = "1px solid #333";
              tableEl.setAttribute('class', "subTable" + id + "");

              holderEl.appendChild(tableEl);

              row.getElement().appendChild(holderEl);

              var subTable = new Tabulator(tableEl, {
                layout: "fitColumns",
                data: [data],
                columns:[
                  {//create column group
                      title:"Linea Base",
                      columns:[
                        {title:"CPU", field:"CPU_DEFINIDA"},
                        {title:"Memoria", field:"MEMORIA_DEFINIDA"}
                      ],
                  },
                  {//create column group
                      title:"Consumos",
                      columns:[
                        {title:"CPU", field:"CONSUMO_CPU"},
                        {title:"Memoria", field:"CONSUMO_MEMORIA"}
                      ]
                  },
                  {//create column group
                      title:"CRA/CRR",
                      columns:[
                        {title:"CPU", field:"CRA/CRR CPU",
                          formatter:function(cell, formatterParams){
                             var value2 = cell.getValue();

                              if(value2 > 0){
                                  return "<span style='color:green; font-weight:bold;'>" + value2 + "</span>";
                              }else if(value2 < 0){
                                  return "<span style='color:red; font-weight:bold;'>" + value2 + "</span>";
                              }else{
                                return value2;
                              }
                            }
                        },
                        {title:"Memoria", field:"CRA/CRR MEM",
                          formatter:function(cell, formatterParams){
                             var value2 = cell.getValue();

                              if(value2 > 0){
                                  return "<span style='color:green; font-weight:bold;'>" + value2 + "</span>";
                              }else if(value2 < 0){
                                  return "<span style='color:red; font-weight:bold;'>" + value2 + "</span>";
                              }else{
                                return value2;
                              }
                            }
                        }
                      ]
                  }
                  ]

              })

               $(".subTable" + id).toggle();    
          }
        });

        $("#Download").click(function(){
            
            var wb = XLSX.utils.book_new();

            for(var i in keys_){
              var key_ = keys_[i];
              var js =  dataSet[key_];

              var services = XLSX.utils.json_to_sheet(js['_children']);
              XLSX.utils.book_append_sheet(wb, services, key_); 

            }

           XLSX.writeFile(wb, 'Tata CRA/CRR.xlsx'); 
        });

         $("#Download_png").click(function(){
            console.log("for here");
            /*html2canvas(document.querySelector("#capture")).then(canvas => {
                document.body.appendChild(canvas)
            }); */

            var divHeight = $('#capture').height();
            var divWidth = $('#capture').width();
            var d=divWidth/divHeight

            var divHeight2 = $('#myChart').height();
            var divWidth2 = $('#myChart').width();
            var d2=divWidth2/divHeight2

            html2canvas($("#capture"), {
                onrendered: function(canvas) {


                      var myImage = canvas.toDataURL("image/png");
                      var doc = new jsPDF("p", "mm", "a4");

                      var width = doc.internal.pageSize.getWidth();
                      var height = doc.internal.pageSize.getHeight();
                      doc.addImage(myImage, 'PNG', 0, 0, width, width/d);


                    // canvas is the final rendered <canvas> element
                     html2canvas($("#myChart"), {
                      onrendered: function(canvas) {

                        doc.addPage();
                        var myImage = canvas.toDataURL("image/png");
                        var width = doc.internal.pageSize.getWidth();
                        var height = doc.internal.pageSize.getHeight();
                        doc.addImage(myImage, 'PNG', 0, 0, width, width/d2);


                        doc.save('Reporte.pdf');
                        //window.open(myImage); 

                      }
                    });
                }
            });

            console.log("for here 2");

         });

        var color = 'rgba(255, 99, 132, 0.2)';
        var horizontalBarChartData = {
            labels: keys_,
            datasets: [{
                label: 'CRA/CRR',
                backgroundColor: '#ef9a9a',
                borderColor: '#880e4f',
                borderWidth: 1,
                data: dataChart
            }]
        };


        var ctx = document.getElementById('myChart').getContext('2d');
        window.myHorizontalBar = new Chart(ctx, {
            type: 'bar',
            data: horizontalBarChartData,
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'CRA/CRR Categorias'
                }
            }
        });



      }); 
   {/* </script> */}

