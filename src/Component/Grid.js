import React, { Component } from "react";
import RecordDataService from "../api/RecordDataService";
import JqxGrid, { jqx } from "../assets/jqwidgets-react/react_jqxgrid";

// Import Highcharts
import Highcharts from "highcharts";
import drilldown from "highcharts/modules/drilldown.js";
import HighchartsReact from "highcharts-react-official";

drilldown(Highcharts);

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "No filter for now",
      columns: [
        { text: "Passenger", datafield: "Passenger", width: "6%" },
        { text: "Survived", datafield: "Survived", width: "6%" },
        { text: "Pclass", datafield: "Pclass", width: "6%" },
        { text: "Name", datafield: "Name", width: "24%" },
        { text: "Sex", datafield: "Sex", width: "5%%" },
        { text: "Age", datafield: "Age", width: "3%" },
        { text: "Sibsp", datafield: "Sibsp", width: "3%" },
        { text: "Parch", datafield: "Parch", width: "3%" },
        { text: "Ticket", datafield: "Ticket", width: "12%" },
        { text: "Fare", datafield: "Fare", width: "15%" },
        { text: "Cabin", datafield: "Cabin", width: "10%" },
        { text: "Embarked", datafield: "Embarked", width: "6%" }
      ],
      records: [],
      source: new jqx.dataAdapter({
        localdata: [
          [
            "1",
            "0",
            "3",
            "Braund, Mr. Owen Harris",
            "male",
            "22",
            "1",
            "0",
            "A/5 21171",
            "7.25",
            "",
            "S"
          ],
          [
            "1",
            "0",
            "3",
            "Braund, Mr. Owen Harris",
            "male",
            "22",
            "1",
            "0",
            "A/5 21171",
            "7.25",
            "",
            "S"
          ]
        ],
        datafields: [
          { name: "Passenger", type: "string", map: "0" },
          { name: "Survived", type: "string", map: "1" },
          { name: "Pclass", type: "string", map: "2" },
          { name: "Name", type: "string", map: "3" },
          { name: "Sex", type: "string", map: "4" },
          { name: "Age", type: "string", map: "5" },
          { name: "Sibsp", type: "string", map: "6" },
          { name: "Parch", type: "string", map: "7" },
          { name: "Ticket", type: "string", map: "8" },
          { name: "Fare", type: "string", map: "9" },
          { name: "Cabin", type: "string", map: "10" },
          { name: "Embarked", type: "string", map: "11" }
        ],
        datatype: "array"
      })
    };

    this.loadRecords = this.loadRecords.bind(this);
    this.loadCharts = this.loadCharts.bind(this);
    this.state.source.dataBind();
  }

  loadRecords() {
    return RecordDataService.retrieveAllRecords().then(response => {
      let array = [];
      let survived = {};
      let survivedPclass = {};
      let notSurvivedPclass = {};
      for (let i = 0; i < response.data.length; i++) {
        array.push(Object.values(response.data[i]));
      }
      for (let i = 0; i < array.length; i++) {
        if (array[i][1] === "1") {
          if (!survived[1]) {
            survived[1] = [];
          }
          survived[1].push(array[i]);

          for (let j = 1; j <= 3; j++) {
            if (array[i][2] === j.toString()) {
              if (!survivedPclass[j]) {
                survivedPclass[j] = [];
              }
              survivedPclass[j].push(array[i]);
            }
          }
        }
        if (array[i][1] === "0") {
          if (!survived[0]) {
            survived[0] = [];
          }
          survived[0].push(array[i]);
          for (let j = 1; j <= 3; j++) {
            if (array[i][2] === j.toString()) {
              if (!notSurvivedPclass[j]) {
                notSurvivedPclass[j] = [];
              }
              notSurvivedPclass[j].push(array[i]);
            }
          }
        }
      }

      this.state.source._source.localdata = array;
      this.state.source.dataBind();

      this.setState({
        records: array,
        survived: survived,
        survivedPclass: survivedPclass,
        notSurvivedPclass
      });

      console.log("After All");
      console.log(this.state);
    });
  }
  componentDidMount() {
    this.loadRecords().then(res => {
      this.loadCharts();
    });

    /* this.loadRecords().then(res => {}); */
  }
  loadCharts() {
    if (this.state.survived[0] && this.state.survived[1]) {
      let notSurvived = this.state.survived[0].length;
      let survived = this.state.survived[1].length;

      this.setState({
        pieChartOption: {
          title: {
            text: "Filter by Survived"
          },
          chart: {
            type: "pie"
          },
          series: [
            {
              data: [
                { name: "Survived", y: survived },
                { name: "Not Survived", y: notSurvived }
              ]
            }
          ],
          plotOptions: {
            pie: {
              datalabels: {
                fomrat: "{point.name}"
              }
            }
          }
        },
        barChartOption: {
          title: {
            text: "Filter by Survived"
          },
          chart: {
            type: "bar"
          },
          xAxis: {
            categories: ["Survived", "Not Survived"]
          },
          series: [
            {
              data: [
                { name: "Survived", y: survived },
                { name: "Not Survived", y: notSurvived }
              ]
            }
          ]
        }
      });
    }
  }
  updateSurvivedSeries() {
    // The chart is updated only with new options.
    if (
      this.state.survivedPclass[1] &&
      this.state.survivedPclass[2] &&
      this.state.survivedPclass[3]
    ) {
      let sPClassOne = this.state.survivedPclass[1].length;
      let sPClassTwo = this.state.survivedPclass[2].length;
      let sPClassThree = this.state.survivedPclass[3].length;
      let records = this.state.survivedPclass[1].concat(
        this.state.survivedPclass[2],
        this.state.survivedPclass[3]
      );
      this.state.source._source.localdata = records;
      this.state.source.dataBind();
      this.setState({
        message: "Now filter by Survived",
        pieChartOption: {
          title: {
            text: "Survived & Filter by PClass"
          },
          chart: {
            type: "pie"
          },
          series: [
            {
              data: [
                { name: "Class 1", y: sPClassOne },
                { name: "Class 2", y: sPClassTwo },
                {
                  name: "Class 3",
                  y: sPClassThree
                }
              ]
            }
          ]
        },
        barChartOption: {
          title: {
            text: "Survived & Filter by PClass"
          },
          chart: {
            type: "bar"
          },
          xAxis: {
            categories: ["Class 1", "Class 2", "Class 3"]
          },
          series: [{ data: [sPClassOne, sPClassTwo, sPClassThree] }]
        }
      });
    }
  }
  updateNotSurvivedSeries() {
    // The chart is updated only with new options.
    if (
      this.state.notSurvivedPclass[1] &&
      this.state.notSurvivedPclass[2] &&
      this.state.notSurvivedPclass[3]
    ) {
      let sPClassOne = this.state.notSurvivedPclass[1].length;
      let sPClassTwo = this.state.notSurvivedPclass[2].length;
      let sPClassThree = this.state.notSurvivedPclass[3].length;
      let records = this.state.notSurvivedPclass[1].concat(
        this.state.notSurvivedPclass[2],
        this.state.notSurvivedPclass[3]
      );
      this.state.source._source.localdata = records;
      this.state.source.dataBind();

      this.setState({
        message: "Now filter by Not Survived",
        pieChartOption: {
          title: {
            text: "Not Survived & Filter by PClass"
          },
          chart: {
            type: "pie"
          },
          series: [
            {
              data: [
                { name: "Class 1", y: sPClassOne },
                { name: "Class 2", y: sPClassTwo },
                {
                  name: "Class 3",
                  y: sPClassThree
                }
              ]
            }
          ]
        },
        barChartOption: {
          title: {
            text: "Not Survived & Filter by PClass"
          },
          chart: {
            type: "bar"
          },
          xAxis: {
            categories: ["Class 1", "Class 2", "Class 3"]
          },
          series: [{ data: [sPClassOne, sPClassTwo, sPClassThree] }]
        }
      });
    }
  }
  render() {
    const { pieChartOption, barChartOption, message } = this.state;

    return (
      <div className={"jqxgrid"} style={{ width: "100%" }}>
        <div className="jumbotron text-center">
          <h2>{message}</h2>
        </div>
        <JqxGrid
          width={"100%"}
          source={this.state.source}
          columns={this.state.columns}
          pageable={true}
          autoheight={true}
          sortable={true}
          altrows={true}
          enabletooltips={true}
          editable={true}
          selectionmode={"multiplecellsadvanced"}
        />

        <HighchartsReact highcharts={Highcharts} options={pieChartOption} />
        <HighchartsReact highcharts={Highcharts} options={barChartOption} />

        <button onClick={this.updateSurvivedSeries.bind(this)}>Survived</button>
        <button onClick={this.updateNotSurvivedSeries.bind(this)}>
          Not Survived
        </button>
      </div>
    );
  }
}

export default Grid;
