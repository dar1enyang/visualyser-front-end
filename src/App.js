import React, { Component } from "react";

import JqxGrid, { jqx } from "./assets/jqwidgets-react/react_jqxgrid";
import ReactSvgPieChart from "react-svg-piechart";
import BarChart from "react-svg-bar-chart";
import axios from "axios";
import ReactD3 from "react-d3-components";
import RecordDataService from "./api/RecordDataService";
//import { BarChart, Grid } from 'react-native-svg-charts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_list: [],
      pie_data: [],
      bar_data: [],
      m_flag: false,
      m_index: 0
    };

    //this.handleClick = this.handleClick.bind();
  }
  loadRecords() {
    console.log("load records");

    // get persons list
    RecordDataService.retrieveAllRecords()
      .then(data => this.setState({ all_list: data.data }))
      .catch(err => console.log("error", err));

    console.log("updated state");
    console.log(this.state.all_list);
  }
  callFirstAPI() {
    console.log("callAPI");

    // get persons list
    axios
      .get("http://localhost:5000/list")
      //.then(data => console.log(data.data))
      .then(data => this.setState({ all_list: data.data }))
      .catch(err => console.log("error", err));

    // persons count
    axios
      .get("http://localhost:5000/males")
      .then(data =>
        this.setState({
          pie_data: [
            { title: "Male", value: data.data.males, color: "#22594e" },
            { title: "Female", value: data.data.females, color: "#a1d9ce" }
          ],
          bar_data: [
            { x: 10, y: data.data.males },
            { x: 30, y: data.data.females },
            { x: 50, y: 1 },
            { x: 60, y: 0 }
          ]
        })
      )
      //.then(data=>console.log(data.data))
      .catch(err => console.log("error", err));

    console.log("updated state");
    console.log(this.state.all_list);
  }

  callSecondAPI(male) {
    console.log("callSecondAPI");

    // persons count
    axios
      .get("http://localhost:5000/pclass?male=" + male)
      .then(data =>
        this.setState({
          pie_data: data.data.pie_pclass,
          bar_data: data.data.bar_pclass
        })
      )
      //.then(data=>console.log(data.data))
      .catch(err => console.log("error", err));

    console.log("updated state");
    //console.log(this.state.all_list);
  }

  componentDidMount() {
    this.loadRecords();
  }

  handleClick(e) {
    e.preventDefault();
    console.log("The link was clicked.", this.state.index);

    if (this.state.m_flag) {
      if (this.state.m_index === 1)
        // female
        this.callSecondAPI("F");
      else this.callSecondAPI("M");
    }
  }

  render() {
    const source = {
      datatype: "json",
      datafields: [
        { name: "id", type: "int" },
        { name: "survived", type: "int" },
        { name: "pclass", type: "int" },
        { name: "name", type: "string" },
        { name: "sex", type: "string" },
        { name: "age", type: "int" }
      ],
      //root: 'Products',
      //record: 'Product',
      //id: 'ProductID',
      //url: './assets/products.xml'
      localdata: this.state.all_list
    };

    const dataAdapter = new jqx.dataAdapter(source);

    const cellsrenderer = (
      row,
      columnfield,
      value,
      defaulthtml,
      columnproperties,
      rowdata
    ) => {
      if (value < 30) {
        return `<span style='margin: 4px; float:${
          columnproperties.cellsalign
        }; color: #ff0000;'>${value}</span>`;
      } else {
        return `<span style='margin: 4px; float:${
          columnproperties.cellsalign
        }; color: #008000;'>${value}</span>`;
      }
    };

    const columns = [
      { text: "ID", datafield: "id", width: 50 },
      {
        text: "Survived",
        datafield: "survived",
        cellsalign: "right",
        align: "right",
        width: 100
      },
      {
        text: "Pclass",
        datafield: "pclass",
        align: "right",
        cellsalign: "right",
        width: 100
      },
      {
        text: "Name",
        datafield: "name",
        cellsalign: "left",
        cellsrenderer: cellsrenderer
      },
      { text: "Sex", datafield: "sex", align: "center", width: 100 },
      { text: "Age", datafield: "age", cellsalign: "right", width: 100 }
    ];

    // const pie_male_data = [
    //     {title: "Male", value: 100, color: "#22594e"},
    //     {title: "Female", value: 100, color: "#a1d9ce"},
    // ];

    const fill = "rgb(134, 65, 244)";
    //const bar_data   = [ 50, 10, 40, 95 ];

    const bar_data = {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43]
        }
      ]
    };

    // const bar_data = [];
    //
    // for (let x = 1; x <= 30; x++) {
    //     bar_data.push({x: x, y: Math.floor(Math.random() * 100)})
    // }

    if (
      this.state.all_list.length === 0 ||
      this.state.pie_data.length === 0 ||
      this.state.bar_data.length === 0
    ) {
      return null;
    }

    console.log("males:", this.state.pie_data);

    return [
      <div className={"jqxgrid"}>
        <JqxGrid
          width={850}
          source={dataAdapter}
          columns={columns}
          pageable={true}
          autoheight={true}
          sortable={true}
          altrows={true}
          enabletooltips={true}
          editable={true}
          selectionmode={"multiplecellsadvanced"}
        />
      </div>,
      <div className={"piechart"} onClick={this.handleClick.bind(this)}>
        <ReactSvgPieChart
          data={this.state.pie_data}
          expandSize={3}
          // If you need expand on hover (or touch) effect
          expandOnHover
          // If you need custom behavior when sector is hovered (or touched)
          onSectorHover={(d, i, e) => {
            if (d) {
              this.setState({ m_flag: true });
              this.setState({ m_index: i });
              console.log("Mouse enter - Index:", i, "Data:", d, "Event:", e);
            } else {
              this.setState({ m_flag: false });
              console.log("Mouse leave - Index:", i, "Event:", e);
            }
          }}
        />
      </div>,
      <div className="barchart">
        <BarChart data={this.state.bar_data} onHover={this.handlePointHover} />
      </div>
    ];
  }
}

export default App;
